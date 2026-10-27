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
  loadUserCompanies,
  loadCompanyByCode,
  createCompanyJoinRequest,
  saveUserWorkspacePin,
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
  companies: CompanyWorkspace[];
  activeCompany: CompanyWorkspace | undefined;
  switchCompany: (companyId: string) => Promise<void>;
}

const FlowContext = createContext<FlowStore | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FlowData>(seedData);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Senha/PIN para proteção da transição de Workspace (Pessoal <-> Empresa)
  const [personalPin, setPersonalPinState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('ideaflow_personal_pin') || '';
  });

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [targetWorkspace, setTargetWorkspace] = useState<'personal' | 'business'>('personal');
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
        const updatedCompany: CompanyWorkspace = {
          ...prev.companyWorkspace,
          members: [...(prev.companyWorkspace.members || []), newMember],
          pendingRequests: (prev.companyWorkspace.pendingRequests || []).filter(r => r.id !== request.id),
        };
        const updatedCompanies = (prev.companies || []).map(c => c.id === updatedCompany.id ? updatedCompany : c);
        return {
          ...prev,
          companies: updatedCompanies,
          companyWorkspace: updatedCompany,
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
        const updatedCompany: CompanyWorkspace = {
          ...prev.companyWorkspace,
          pendingRequests: (prev.companyWorkspace.pendingRequests || []).filter(r => r.id !== requestId),
        };
        const updatedCompanies = (prev.companies || []).map(c => c.id === updatedCompany.id ? updatedCompany : c);
        return {
          ...prev,
          companies: updatedCompanies,
          companyWorkspace: updatedCompany,
        };
      });
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast.info('Solicitação de entrada recusada.');
    } catch (err: any) {
      toast.error('Erro ao rejeitar solicitação.');
    }
  };

  const setPersonalPin = (newPin: string) => {
    const cleanPin = newPin ? newPin.trim() : '';
    setPersonalPinState(cleanPin);
    if (typeof window !== 'undefined') {
      if (cleanPin) {
        localStorage.setItem('ideaflow_personal_pin', cleanPin);
        if (user?.email) {
          localStorage.setItem(`ideaflow_pin_${user.email.toLowerCase()}`, cleanPin);
        }
      } else {
        localStorage.removeItem('ideaflow_personal_pin');
        if (user?.email) {
          localStorage.removeItem(`ideaflow_pin_${user.email.toLowerCase()}`);
        }
      }
    }
    setData(prev => ({
      ...prev,
      profile: {
        ...(prev.profile ?? { name: 'Criador', role: 'Criador', streak: 1 }),
        personalPin: cleanPin || undefined,
      },
    }));

    if (user?.id) {
      void saveUserWorkspacePin(user.id, cleanPin);
    }
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
          const rawCompanies = Array.isArray(parsed.companies) ? parsed.companies : [];
          const validCompanies = rawCompanies.filter(
            c => c && c.id && c.id !== 'company-acme-corp' && c.shareCode !== 'ACME-2026'
          );
          if (validCompany && !validCompanies.some(c => c.id === validCompany.id)) {
            validCompanies.unshift(validCompany);
          }
          const activeId = parsed.activeCompanyId || validCompany?.id || validCompanies[0]?.id;
          const activeCompany = validCompanies.find(c => c.id === activeId) || validCompanies[0] || validCompany;

          const cleanIdeas = (parsed.ideas || []).filter(
            i => !i.id.startsWith('demo-') && !i.id.startsWith('biz-') && i.companyId !== 'company-acme-corp'
          );
          const cleanSectors = (parsed.sectors || []).filter(s => s.id !== 'wood');
          setData({
            ...parsed,
            ideas: cleanIdeas,
            sectors: cleanSectors,
            companies: validCompanies,
            companyWorkspace: activeCompany,
            activeCompanyId: activeCompany?.id,
            workspaceMode: activeCompany ? (parsed.workspaceMode ?? 'personal') : 'personal',
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

      // Proteção de isolamento entre contas: se trocou de usuário, limpa resíduos em memória
      const previousUserId = typeof window !== 'undefined' ? localStorage.getItem('ideaflow_active_user_id') : null;
      if (previousUserId && previousUserId !== currentUser.id) {
        setData(prev => ({
          ...prev,
          ideas: [],
          companies: [],
          companyWorkspace: undefined,
          activeCompanyId: undefined,
        }));
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('ideaflow_active_user_id', currentUser.id);
      }

      // Carrega perfil
      const userProfile = await loadUserProfile(currentUser.id);
      const authPin = (currentUser.user_metadata as Record<string, any> | undefined)?.['workspace_pin'];
      const profilePin = userProfile?.workspace_pin;
      const emailBackupPin = currentUser.email
        ? localStorage.getItem(`ideaflow_pin_${currentUser.email.toLowerCase()}`)
        : null;

      const remotePin = authPin || profilePin || emailBackupPin || '';
      if (remotePin) {
        setPersonalPinState(remotePin);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ideaflow_personal_pin', remotePin);
          if (currentUser.email) {
            localStorage.setItem(`ideaflow_pin_${currentUser.email.toLowerCase()}`, remotePin);
          }
        }
      }

      if (userProfile) {
        setProfile(userProfile);
        setData(prev => ({
          ...prev,
          profile: {
            name: userProfile.name || currentUser.email?.split('@')[0] || 'Criador(a)',
            role: userProfile.role || 'Criador(a)',
            bio: prev.profile?.bio,
            streak: prev.profile?.streak ?? 1,
            personalPin: remotePin || prev.profile?.personalPin,
          },
        }));
      }

      // Consulta se o usuário faz parte de empresas no Supabase (Key User em várias ou membro)
      const userCompanies = await loadUserCompanies(currentUser.id, currentUser.email || undefined);
      if (userCompanies.length > 0) {
        let chosenActive: CompanyWorkspace | undefined;
        setData(prev => {
          const activeId = prev.activeCompanyId || prev.companyWorkspace?.id;
          chosenActive = userCompanies.find(c => c.id === activeId) || userCompanies[0];
          return {
            ...prev,
            companies: userCompanies,
            companyWorkspace: chosenActive,
            activeCompanyId: chosenActive?.id,
          };
        });
        if (chosenActive?.isKeyUser && chosenActive.pendingRequests) {
          setPendingRequests(chosenActive.pendingRequests);
        } else {
          setPendingRequests([]);
        }
      } else {
        // Usuário pessoal / sem vínculo corporativo
        setData(prev => ({
          ...prev,
          companies: [],
          companyWorkspace: undefined,
          activeCompanyId: undefined,
          workspaceMode: prev.workspaceMode === 'business' ? 'personal' : prev.workspaceMode,
        }));
        setPendingRequests([]);
      }

      // Carrega ideias da nuvem (pessoais)
      const cloudIdeas = await loadUserIdeasFromSupabase(currentUser.id);

      // Carrega ideias de todas as empresas do usuário
      const companyIdeasPromises = userCompanies.map(c => c.id ? loadCompanyIdeasFromSupabase(c.id) : Promise.resolve([]));
      const companyIdeasArrays = await Promise.all(companyIdeasPromises);
      const companyCloudIdeas = companyIdeasArrays.flat();

      // Isolamento estrito por conta:
      // Para um usuário autenticado, suas ideias são ESTRITAMENTE as dele e de suas empresas no Supabase!
      // Se for uma conta nova (sem ideias no banco), allLoaded será vazio e o usuário começa com conta limpa,
      // sem herdar ideias de contas anteriores do localStorage.
      const allLoaded = [...cloudIdeas, ...companyCloudIdeas];
      setData(prev => ({
        ...prev,
        ideas: allLoaded,
      }));
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

  // Alternador de Workspace com segurança e definição opcional de senha (Empresa <-> Pessoal)
  const requestSwitchWorkspace = (target: 'personal' | 'business') => {
    if (target === data.workspaceMode) return;

    // Se estiver alternando para a empresa e ainda não tiver empresa vinculada/criada:
    if (target === 'business' && (!data.companyWorkspace || !data.companyWorkspace.id)) {
      setCompanyAccessModalOpen(true);
      return;
    }

    setTargetWorkspace(target);
    setOnPinSuccessCallback(() => () => {
      setData(prev => ({ ...prev, workspaceMode: target }));
      if (target === 'personal') {
        toast.success('Espaço Pessoal desbloqueado! 👤');
      } else {
        toast.success(`Workspace da Empresa (${data.companyWorkspace?.name ?? 'Empresa'}) ativado! 🏢`);
      }
    });
    setPinModalOpen(true);
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

      const newJoinedCompany: CompanyWorkspace = {
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
      };

      setData(prev => {
        const existingCompanies = prev.companies || (prev.companyWorkspace ? [prev.companyWorkspace] : []);
        const updatedCompanies = [
          newJoinedCompany,
          ...existingCompanies.filter(c => c.id !== newJoinedCompany.id),
        ];
        return {
          ...prev,
          workspaceMode: 'business',
          companies: updatedCompanies,
          companyWorkspace: newJoinedCompany,
          activeCompanyId: newJoinedCompany.id,
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

  const switchCompany = async (companyId: string) => {
    const allCompanies = data.companies || (data.companyWorkspace ? [data.companyWorkspace] : []);
    const target = allCompanies.find(c => c.id === companyId);
    if (!target) {
      toast.error('Empresa não encontrada na sua lista.');
      return;
    }

    setData(prev => ({
      ...prev,
      workspaceMode: 'business',
      companyWorkspace: target,
      activeCompanyId: target.id,
    }));

    if (target.isKeyUser && target.pendingRequests) {
      setPendingRequests(target.pendingRequests);
    } else {
      setPendingRequests([]);
    }

    // Carrega ideias da nova empresa selecionada em tempo real
    if (target.id) {
      try {
        const freshCompanyIdeas = await loadCompanyIdeasFromSupabase(target.id);
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
        }
      } catch (err) {
        console.warn('Erro ao carregar ideias da empresa selecionada:', err);
      }
    }

    toast.success(`Alternado para a empresa "${target.name}"! 🏢`);
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
      companies: [],
      companyWorkspace: undefined,
      activeCompanyId: undefined,
    }));
    try {
      sessionStorage.removeItem('ideaflow_session_unlocked');
      localStorage.removeItem('ideaflow-v1');
      localStorage.removeItem('ideaflow_active_user_id');
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

  const userCompanies = data.companies || (data.companyWorkspace ? [data.companyWorkspace] : []);

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
        companies: userCompanies,
        activeCompany: data.companyWorkspace,
        switchCompany,
      }}
    >
      {children}

      {/* Modal Global de Segurança e Senha de Transição (Empresa <-> Pessoal) */}
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
            setData(prev => ({ ...prev, workspaceMode: targetWorkspace }));
          }
        }}
        currentPin={personalPin}
        onUpdatePin={setPersonalPin}
        targetWorkspace={targetWorkspace}
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
