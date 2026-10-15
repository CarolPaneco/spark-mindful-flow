import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { seedData, isFlowData, type FlowData, type Idea } from '@/lib/ideaflow';
import {
  supabase,
  loadUserIdeasFromSupabase,
  syncIdeasToSupabase,
  loadUserProfile,
  deleteIdeaFromSupabase,
  type AuthProfile,
} from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
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
}

const FlowContext = createContext<FlowStore | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FlowData>(seedData);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Inicializa dados locais (sempre limpo de ideias mockadas demo-*)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ideaflow-v1');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isFlowData(parsed)) {
          // Remove completamente qualquer resquício de ideias mockadas (demo-*) e setor de marcenaria antigo
          const cleanIdeas = (parsed.ideas || []).filter(i => !i.id.startsWith('demo-'));
          const cleanSectors = (parsed.sectors || []).filter(s => s.id !== 'wood');
          setData({
            ...parsed,
            ideas: cleanIdeas,
            sectors: cleanSectors,
          });
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

  // Carrega perfil e ideias da nuvem quando o usuário está conectado
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
          },
        }));
      }

      // Carrega ideias da nuvem
      const cloudIdeas = await loadUserIdeasFromSupabase(currentUser.id);
      if (cloudIdeas.length > 0) {
        setData(prev => ({
          ...prev,
          ideas: cloudIdeas,
        }));
      } else {
        // Se a nuvem estiver vazia, o usuário é novo e suas ideias e setores começam 100% zerados
        setData(prev => ({
          ...prev,
          ideas: [],
          sectors: [],
        }));
      }
    } catch (err) {
      console.warn('Erro ao sincronizar na inicialização do usuário:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sincroniza ativamente com o Supabase
  const syncWithCloud = async () => {
    if (!user) return;
    try {
      setIsSyncing(true);
      await syncIdeasToSupabase(data.ideas, user.id);
      toast.success('Ideias sincronizadas com o banco seguro!');
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
          void syncIdeasToSupabase([target], user.id);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    // Zera as ideias, setores e limpa cache para o próximo usuário
    setData(prev => ({
      ...prev,
      ideas: [],
      sectors: [],
      profile: {
        name: 'Criador(a)',
        role: 'Criador(a)',
        streak: 1,
      },
    }));
    try {
      localStorage.removeItem('ideaflow-v1');
    } catch {
      // Ignora erro de storage
    }
    toast.info('Você saiu da sua conta.');
    // Dispara evento para reabrir imediatamente o modal de login/cadastro
    window.dispatchEvent(new Event('ideaflow:login'));
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
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) throw new Error('FlowProvider is required');
  return context;
}