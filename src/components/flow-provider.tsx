import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  seedData,
  isFlowData,
  defaultCompanyWorkspace,
  defaultCompanySectors,
  createStarterBusinessIdeas,
  type FlowData,
  type Idea,
  type CompanyWorkspace,
  type CompanyJoinRequest,
  type TeamMember,
} from '@/lib/ideaflow';
import {
  supabase,
  loadUserIdeasFromSupabase,
  loadCompanyIdeasFromSupabase,
  syncIdeasToSupabase,
  subscribeToCompanyIdeas,
  loadUserProfile,
  deleteIdeaFromSupabase,
  loadCompanyJoinRequests,
  approveCompanyJoinRequest,
  rejectCompanyJoinRequest,
  loadUserCompany,
  loadCompanyByCode,
  createCompanyJoinRequest,
  type AuthProfile,
} from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { PersonalPinModal } from '@/components/personal-pin-modal';
import { CompanyAccessModal } from '@/components/company-access-modal';
import { toast } from 'sonner';

interface FlowStore {
  data: FlowData;
  setData: React.Dispatch<React.SetStateAction<FlowData>>;
  updateIdea: (id: string, patch: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  ready: boolean;
  user: User | null;
  profile: AuthProfile | null;
  signOut: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
  isSyncing: boolean;
  personalPin: string;
  setPersonalPin: (newPin: string) => void;
  requestSwitchWorkspace: (target: 'personal' | 'business') => void;
  joinCompanyByCode: (code: string) => Promise<boolean>;
  openPinModal: () => void;
  openCompanyAccessModal: (initialTab?: 'join' | 'create') => void;
  pendingRequests: CompanyJoinRequest[];
  approveRequest: (request: CompanyJoinRequest) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
}

const FlowContext = createContext<FlowStore | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FlowData>(seedData);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Senha de 4 dígitos para proteger o Espaço Pessoal (Padrão: 1234)
  const [personalPin, setPersonalPinState] = useState<string>(() => {
    if (typeof window === 'undefined') return '1234';
    return localStorage.getItem('ideaflow_personal_pin') || '1234';
  });

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [companyAccessModalOpen, setCompanyAccessModalOpen] = useState(false);
  const [companyAccessInitialTab, setCompanyAccessInitialTab] = useState<'join' | 'create'>('join');
  const [onPinSuccessCallback, setOnPinSuccessCallback] = useState<(() => void) | null>(null);
  const [pendingRequests, setPendingRequests] = useState<CompanyJoinRequest[]>([]);

  // Carrega pedidos pendentes da empresa se for Key User
  const refreshPendingRequests = async () => {
    const compId = data.companyWorkspace?.id;
    if (!compId) return;
    try {
      const requests = await loadCompanyJoinRequests(compId);
      setPendingRequests(requests);
    } catch {
      // Ignora erro
    }
  };

  useEffect(() => {
    if (data.workspaceMode === 'business' && data.companyWorkspace?.isKeyUser) {
      void refreshPendingRequests();
    }
  }, [data.workspaceMode, data.companyWorkspace?.id, data.companyWorkspace?.isKeyUser]);

  const approveRequest = async (request: CompanyJoinRequest) => {
    const compId = data.companyWorkspace?.id;
    if (!compId) return;
    const newMember: TeamMember = {
      id: request.userId || `mem-${Date.now()}`,
      name: request.userName,
      email: request.userEmail,
      role: request.role,
      department: request.department,
      isKeyUser: false,
      status: 'active',
    };

    try {
      await approveCompanyJoinRequest(request.id, newMember, compId);
      setData(prev => {
        if (!prev.companyWorkspace) return prev;
        return {
          ...prev,
          companyWorkspace: {
            ...prev.companyWorkspace,
            members: [...(prev.companyWorkspace.members || []), newMember],
            pendingRequests: (prev.companyWorkspace.pendingRequests || []).filter(r => r.id !== request.id),
          },
        };
      });
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      toast.success(`${request.userName} foi aprovado(a) como membro oficial da empresa! 👥`);
    } catch (err: any) {
      toast.error('Erro ao aprovar solicitação.');
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await rejectCompanyJoinRequest(requestId);
      setData(prev => {
        if (!prev.companyWorkspace) return prev;
        return {
          ...prev,
          companyWorkspace: {
            ...prev.companyWorkspace,
            pendingRequests: (prev.companyWorkspace.pendingRequests || []).filter(r => r.id !== requestId),
          },
        };
      });
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast.info('Solicitação de entrada recusada.');
    } catch (err: any) {
      toast.error('Erro ao rejeitar solicitação.');
    }
  };

  const setPersonalPin = (newPin: string) => {
    setPersonalPinState(newPin);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaflow_personal_pin', newPin);
    }
    setData(prev => ({
      ...prev,
      profile: {
        ...(prev.profile ?? { name: 'Criador', role: 'Criador', streak: 1 }),
        personalPin: newPin,
      },
    }));
  };

  // 1. Inicializa dados locais (sempre limpo de ideias mockadas demo-*)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ideaflow-v1');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isFlowData(parsed)) {
          const isMockCompany =
            parsed.companyWorkspace?.id === 'company-acme-corp' ||
            parsed.companyWorkspace?.shareCode === 'ACME-2026';
          const validCompany = isMockCompany ? undefined : (parsed.companyWorkspace || undefined);
          const cleanIdeas = (parsed.ideas || []).filter(
            i => !i.id.startsWith('demo-') && !i.id.startsWith('biz-') && i.companyId !== 'company-acme-corp'
          );
          const cleanSectors = (parsed.sectors || []).filter(s => s.id !== 'wood');
          setData({
            ...parsed,
            ideas: cleanIdeas,
            sectors: cleanSectors,
            companyWorkspace: validCompany,
            workspaceMode: validCompany ? (parsed.workspaceMode ?? 'personal') : 'personal',
          });

          if (parsed.profile?.personalPin) {
            setPersonalPinState(parsed.profile.personalPin);
            localStorage.setItem('ideaflow_personal_pin', parsed.profile.personalPin);
          }
        }
      }
    } catch {
      // Ignora erro de leitura
    }
    setReady(true);
    void import('@/lib/pwa').then(m => m.registerOffline());
  }, []);

  // 2. Salva localmente sempre que `data` muda
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle('light', data.theme === 'light');
    document.documentElement.classList.toggle('dark', data.theme === 'dark');
    document.documentElement.dataset['palette'] = data.palette;
    try {
      localStorage.setItem('ideaflow-v1', JSON.stringify(data));
    } catch {
      toast.error('Não foi possível salvar. Exporte um backup para proteger suas ideias.');
    }
  }, [data, ready]);

  // 3. Monitora autenticação Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        void handleUserLoggedIn(currentUser);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        void handleUserLoggedIn(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 4. Carrega perfil e sincroniza ideias com Supabase
  const handleUserLoggedIn = async (currentUser: User) => {
    try {
      setIsSyncing(true);
      // Carrega perfil
      const userProfile = await loadUserProfile(currentUser.id);
      if (userProfile) {
        setProfile(userProfile);
        setData(prev => ({
          ...prev,
          profile: {
            name: userProfile.name || currentUser.email?.split('@')[0] || 'Criador(a)',
            role: userProfile.role || 'Criador(a)',
            bio: prev.profile?.bio,
            streak: prev.profile?.streak ?? 1,
            personalPin: prev.profile?.personalPin,
          },
        }));
      }

      // Consulta se o usuário faz parte de uma empresa no Supabase (Key User ou membro)
      const userCompany = await loadUserCompany(currentUser.id);
      if (userCompany) {
        setData(prev => ({
          ...prev,
          companyWorkspace: userCompany,
        }));
        if (userCompany.isKeyUser && userCompany.pendingRequests) {
          setPendingRequests(userCompany.pendingRequests);
        }
      } else {
        // Usuário pessoal / sem vínculo corporativo
        setData(prev => ({
          ...prev,
          companyWorkspace: undefined,
          workspaceMode: prev.workspaceMode === 'business' ? 'personal' : prev.workspaceMode,
        }));
        setPendingRequests([]);
      }

      // Carrega ideias da nuvem (pessoais)
      const cloudIdeas = await loadUserIdeasFromSupabase(currentUser.id);

      // Carrega ideias da empresa se houver workspace corporativo
      const companyId = userCompany?.id || data.companyWorkspace?.id;
      const companyCloudIdeas = companyId ? await loadCompanyIdeasFromSupabase(companyId) : [];

      // Mescla com as ideias locais mantendo as mais recentes
      const allLoaded = [...cloudIdeas, ...companyCloudIdeas];
      if (allLoaded.length > 0) {
        setData(prev => {
          const map = new Map<string, Idea>();
          // Adiciona ideias existentes
          prev.ideas.forEach(i => map.set(i.id, i));
          // Sobrescreve com as da nuvem
          allLoaded.forEach(i => map.set(i.id, i));
          return {
            ...prev,
            ideas: Array.from(map.values()),
          };
        });
      }
    } catch (err) {
      console.warn('Aviso ao sincronizar na inicialização do usuário:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 5. Escuta Realtime do Supabase para o Workspace Compartilhado da Empresa
  useEffect(() => {
    const companyId = data.companyWorkspace?.id;
    if (!companyId) return;

    const unsubscribe = subscribeToCompanyIdeas(companyId, async () => {
      try {
        const freshCompanyIdeas = await loadCompanyIdeasFromSupabase(companyId);
        if (freshCompanyIdeas.length > 0) {
          setData(prev => {
            const map = new Map<string, Idea>();
            prev.ideas.forEach(i => map.set(i.id, i));
            freshCompanyIdeas.forEach(i => map.set(i.id, i));
            return {
              ...prev,
              ideas: Array.from(map.values()),
            };
          });
          toast.info('Iniciativas da empresa atualizadas em tempo real via Supabase! ⚡');
        }
      } catch (e) {
        console.warn('Erro ao atualizar realtime da empresa:', e);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [data.companyWorkspace?.id]);

  // Sincroniza ativamente com o Supabase
  const syncWithCloud = async () => {
    if (!user) {
      toast.info('Conecte ou crie sua conta gratuita para salvar e compartilhar ideias na nuvem.');
      return;
    }
    try {
      setIsSyncing(true);
      const companyId = data.companyWorkspace?.id;
      await syncIdeasToSupabase(data.ideas, user.id, companyId);
      toast.success('Ideias e iniciativas sincronizadas com a nuvem Supabase!');
    } catch (err: any) {
      toast.error(`Falha ao sincronizar: ${err?.message || 'Erro de conexão'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateIdea = (id: string, patch: Partial<Idea>) => {
    setData(prev => {
      const updatedIdeas = prev.ideas.map(i => (i.id === id ? { ...i, ...patch } : i));
      if (user) {
        const target = updatedIdeas.find(i => i.id === id);
        if (target) {
          const companyId = prev.companyWorkspace?.id;
          void syncIdeasToSupabase([target], user.id, companyId);
        }
      }
      return { ...prev, ideas: updatedIdeas };
    });
  };

  const deleteIdea = (id: string) => {
    setData(prev => {
      const updatedIdeas = prev.ideas.filter(i => i.id !== id);
      if (user) {
        void deleteIdeaFromSupabase(id, user.id);
      }
      return { ...prev, ideas: updatedIdeas };
    });
  };

  // Alternador de Workspace com verificação de PIN de 4 dígitos
  const requestSwitchWorkspace = (target: 'personal' | 'business') => {
    // Se o usuário está no modo empresarial e deseja ir para o pessoal: EXIGE O PIN DE 4 DÍGITOS
    if (target === 'personal' && data.workspaceMode === 'business') {
      setOnPinSuccessCallback(() => () => {
        setData(prev => ({ ...prev, workspaceMode: 'personal' }));
        toast.success('Workspace Pessoal desbloqueado! 👤');
      });
      setPinModalOpen(true);
      return;
    }

    // Se estiver alternando para a empresa:
    if (target === 'business') {
      // Se ainda não tiver empresa vinculada/criada, abre o portal para entrar com código ou criar
      if (!data.companyWorkspace || !data.companyWorkspace.id) {
        setCompanyAccessModalOpen(true);
        return;
      }

      setData(prev => ({
        ...prev,
        workspaceMode: 'business',
      }));
      toast.success(`Workspace da Empresa (${data.companyWorkspace.name}) ativado 🏢`);
      return;
    }

    setData(prev => ({ ...prev, workspaceMode: target }));
  };

  // Entrar em uma empresa existente com Código Compartilhado com validação no Supabase
  const joinCompanyByCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) {
      toast.error('Informe o código da empresa.');
      return false;
    }

    try {
      setIsSyncing(true);
      // Valida se o código da empresa existe no Supabase
      const remoteCompany = await loadCompanyByCode(cleanCode);
      if (!remoteCompany && cleanCode !== 'ACME-2026') {
        toast.error(`Código corporativo "${cleanCode}" não foi encontrado. Verifique com o Key User.`);
        return false;
      }

      const companyId = remoteCompany?.id || `comp-${cleanCode.toLowerCase().replace('-', '_')}`;
      const resolvedName = remoteCompany?.name || `Corporação (${cleanCode})`;
      const companyIdeas = await loadCompanyIdeasFromSupabase(cleanCode);

      // Registra a solicitação de entrada no Supabase para o Key User receber com nome e e-mail
      const applicantName = (user?.user_metadata as any)?.name || user?.email?.split('@')[0] || 'Colaborador(a)';
      const applicantEmail = user?.email || 'colaborador@empresa.com';
      await createCompanyJoinRequest({
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        companyId,
        companyCode: cleanCode,
        userId: user?.id,
        userName: applicantName,
        userEmail: applicantEmail,
        department: 'tech',
        role: 'Colaborador(a)',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setData(prev => {
        return {
          ...prev,
          workspaceMode: 'business',
          companyWorkspace: {
            id: companyId,
            shareCode: cleanCode,
            name: resolvedName,
            industry: remoteCompany?.industry || 'Tecnologia & Inovação',
            mission: remoteCompany?.mission || 'Crescimento e foco em entregas.',
            sectors: defaultCompanySectors,
            members: [
              {
                id: user?.id || `user-${Date.now()}`,
                name: applicantName,
                role: 'Colaborador(a)',
                email: applicantEmail,
                department: 'tech',
                isKeyUser: false,
                status: 'pending',
              },
            ],
            keyUserName: remoteCompany?.keyUserName || 'Key User',
            isKeyUser: false,
          },
          ideas: [
            ...companyIdeas,
            ...prev.ideas.filter(i => !companyIdeas.some(ci => ci.id === i.id)),
          ],
        };
      });

      toast.success(`Pedido de adesão enviado ao Key User de ${resolvedName}! 🏢`);
      return true;
    } catch (err: any) {
      toast.error(`Não foi possível conectar à empresa: ${err?.message || 'Código inválido'}`);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setPendingRequests([]);
    setData(prev => ({
      ...prev,
      ideas: [],
      sectors: [],
      profile: {
        name: 'Criador(a)',
        role: 'Criador(a)',
        streak: 1,
      },
      workspaceMode: 'personal',
      companyWorkspace: undefined,
    }));
    try {
      localStorage.removeItem('ideaflow-v1');
      localStorage.removeItem('ideaflow_guest_session');
      localStorage.removeItem('ideaflow_personal_pin');
    } catch {
      // Ignora erro
    }
    toast.info('Sessão encerrada com segurança.');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ideaflow:login'));
    }
  };

  return (
    <FlowContext.Provider
      value={{
        data,
        setData,
        updateIdea,
        deleteIdea,
        ready,
        user,
        profile,
        signOut,
        syncWithCloud,
        isSyncing,
        personalPin,
        setPersonalPin,
        requestSwitchWorkspace,
        joinCompanyByCode,
        openPinModal: () => setPinModalOpen(true),
        openCompanyAccessModal: (tab: 'join' | 'create' = 'join') => {
          setCompanyAccessInitialTab(tab);
          setCompanyAccessModalOpen(true);
        },
        pendingRequests,
        approveRequest,
        rejectRequest,
      }}
    >
      {children}

      {/* Modal Global de PIN de 4 dígitos para proteção do Espaço Pessoal */}
      <PersonalPinModal
        open={pinModalOpen}
        onClose={() => {
          setPinModalOpen(false);
          setOnPinSuccessCallback(null);
        }}
        onSuccess={() => {
          if (onPinSuccessCallback) {
            onPinSuccessCallback();
            setOnPinSuccessCallback(null);
          } else {
            setData(prev => ({ ...prev, workspaceMode: 'personal' }));
          }
        }}
        currentPin={personalPin}
        onUpdatePin={setPersonalPin}
      />

      {/* Modal Global de Acesso Corporativo & Criação de Empresa (Key User) */}
      <CompanyAccessModal
        open={companyAccessModalOpen}
        initialTab={companyAccessInitialTab}
        onOpenChange={setCompanyAccessModalOpen}
        onSuccess={() => {
          setData(prev => ({ ...prev, workspaceMode: 'business' }));
        }}
      />
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error('useFlow deve ser usado dentro de um FlowProvider');
  return ctx;
}
