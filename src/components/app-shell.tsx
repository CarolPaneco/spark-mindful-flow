import { useEffect, useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  AudioLines,
  Sun,
  Moon,
  Flame,
  Mic,
  Layers3,
  CalendarDays,
  Grid2X2,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { CaptureSheet } from '@/components/capture-sheet';
import { AiChatSheet } from '@/components/ai-chat-sheet';
import { ProfileSidebar } from '@/components/profile-sidebar';
import { IdeaDetail } from '@/components/idea-detail';
import { AuthModal } from '@/components/auth-modal';
import { SplashScreen } from '@/components/splash-screen';
import { OnboardingTutorial } from '@/components/onboarding-tutorial';
import avatar from '@/assets/ideaflow-avatar.png';
import { Idea } from '@/lib/ideaflow';
import { User, LogIn, Cloud, CloudCheck, RefreshCw } from 'lucide-react';

const navigation = [
  { to: '/', name: 'Funil', icon: Layers3 },
  { to: '/hoje', name: 'Hoje', icon: CalendarDays },
  { to: '/setores', name: 'Setores', icon: Grid2X2 },
  { to: '/ajustes', name: 'Ajustes', icon: SlidersHorizontal },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { data, setData, user, profile, isSyncing, syncWithCloud } = useFlow();
  const [capture, setCapture] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileIdeaId, setProfileIdeaId] = useState<string | null>(null);
  const [mentorIdea, setMentorIdea] = useState<Idea | null>(null);
  const [greeting, setGreeting] = useState('Que bom ter você aqui');
  const [online, setOnline] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const path = useRouterState({ select: state => state.location.pathname });

  // Modo convidado: gravado localmente para que o usuário não precise logar se escolheu navegar livre
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ideaflow_guest_session') === 'true';
  });

  // Estado do Menu Lateral no Web/Desktop (Aberto ou Fechado com ícones)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ideaflow_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('ideaflow_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Passo 2: Se não estiver logado e não for convidado, abre a tela de autenticação
    if (!user && !guestMode) {
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setGuestMode(true);
    setAuthOpen(false);
  };

  const handleAuthClose = () => {
    setGuestMode(true);
    localStorage.setItem('ideaflow_guest_session', 'true');
    setAuthOpen(false);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite');
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);

    const captureEvent = () => setCapture(true);
    window.addEventListener('ideaflow:capture', captureEvent);

    const mentorEvent = (e: Event) => {
      const custom = e as CustomEvent<{ idea?: Idea }>;
      setMentorIdea(custom.detail?.idea ?? null);
      setAiChatOpen(true);
    };
    window.addEventListener('ideaflow:mentor', mentorEvent);

    const profileEvent = () => setProfileOpen(true);
    window.addEventListener('ideaflow:profile', profileEvent);

    const loginEvent = () => setAuthOpen(true);
    window.addEventListener('ideaflow:login', loginEvent);

    const tutorialEvent = () => setShowTutorial(true);
    window.addEventListener('ideaflow:tutorial', tutorialEvent);

    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      window.removeEventListener('ideaflow:capture', captureEvent);
      window.removeEventListener('ideaflow:mentor', mentorEvent);
      window.removeEventListener('ideaflow:profile', profileEvent);
      window.removeEventListener('ideaflow:login', loginEvent);
      window.removeEventListener('ideaflow:tutorial', tutorialEvent);
    };
  }, []);

  const dedicated = data.ideas.reduce((sum, i) => sum + i.dedicated, 0);
  const isAuthorized = Boolean(user || guestMode);

  return (
    <div
      className="app-root"
      style={{ '--sidebar-width': sidebarCollapsed ? '72px' : '260px' } as React.CSSProperties}
    >
      {/* MENU LATERAL EXCLUSIVO WEB / DESKTOP (>= 768px) - RECOLHÍVEL */}
      <aside
        className={`desktop-sidebar hidden md:flex flex-col fixed left-0 top-0 bottom-0 border-r border-border bg-card/90 backdrop-blur-2xl z-40 transition-all duration-300 ease-in-out select-none ${
          sidebarCollapsed ? 'w-[72px] p-2.5 justify-between items-center' : 'w-[260px] p-4 justify-between'
        }`}
      >
        <div className="space-y-5 w-full">
          {/* Top Header: Logo + Toggle button */}
          <div className={`flex items-center ${sidebarCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between px-2'} pt-1`}>
            {!sidebarCollapsed ? (
              <Link to="/" className="wordmark active:scale-95 transition-transform" aria-label="Ideaflow início">
                <span className="brand-icon">
                  <AudioLines />
                </span>
                idea<span>flow</span>
                <span className="brand-dot">.</span>
              </Link>
            ) : (
              <Link to="/" className="brand-icon mx-auto mr-0" aria-label="Ideaflow início" title="Ideaflow início">
                <AudioLines size={18} />
              </Link>
            )}

            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              aria-label={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          {/* Botão de Captura / Nova Faísca */}
          <button
            type="button"
            onClick={() => setCapture(true)}
            data-tour="capture"
            className={`rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 text-white font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center cursor-pointer group ${
              sidebarCollapsed ? 'w-11 h-11 mx-auto' : 'w-full h-11 px-3 gap-2 text-sm'
            }`}
            title="Nova Faísca (Capturar Ideia)"
          >
            <Plus size={18} className="stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            {!sidebarCollapsed && (
              <>
                <span>Nova Faísca</span>
                <Mic size={14} className="opacity-80 ml-auto mr-1" />
              </>
            )}
          </button>

          {/* Itens de Navegação Verticais */}
          <nav className="space-y-1.5 w-full" aria-label="Navegação Lateral">
            {navigation.map((item) => {
              const isActive = path === item.to;
              const tourId = item.to === '/' ? 'funil' : item.to === '/hoje' ? 'hoje' : item.to === '/setores' ? 'setores' : 'ajustes';
              const activeCount = item.to === '/'
                ? data.ideas.filter(i => !i.archived).length
                : item.to === '/setores'
                ? data.sectors.length
                : null;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-tour={tourId}
                  title={item.name}
                  className={`flex items-center rounded-xl font-semibold transition-all group ${
                    sidebarCollapsed
                      ? 'w-11 h-11 mx-auto justify-center'
                      : 'gap-3 px-3.5 py-2.5 text-sm'
                  } ${
                    isActive
                      ? `bg-primary/12 text-primary font-bold shadow-xs ${!sidebarCollapsed ? 'border-l-2 border-primary' : ''}`
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <item.icon
                    size={19}
                    className={`transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span>{item.name}</span>
                      {activeCount !== null && (
                        <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {activeCount}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Card Destaque: Mentor IA Oficial */}
          <div className="pt-2 w-full">
            <button
              type="button"
              onClick={() => {
                setMentorIdea(null);
                setAiChatOpen(true);
              }}
              data-tour="mentor"
              className={`rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-violet/10 hover:border-primary/50 text-left transition-all active:scale-[0.98] cursor-pointer group ${
                sidebarCollapsed ? 'w-11 h-11 mx-auto flex items-center justify-center p-0' : 'w-full p-3'
              }`}
              title="Mentor IA Oficial"
            >
              <div className="flex items-center gap-2 text-primary font-bold text-xs mb-0.5">
                <Sparkles size={16} className="animate-pulse" />
                {!sidebarCollapsed && <span>Mentor IA Oficial</span>}
              </div>
              {!sidebarCollapsed && (
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Tire dúvidas, converse ou analise seus funis em tempo real.
                </p>
              )}
            </button>
          </div>
        </div>

        {/* Rodapé da Barra Lateral */}
        <div className={`w-full pt-4 border-t border-border/80 ${sidebarCollapsed ? 'flex flex-col items-center gap-3' : 'space-y-3'}`}>
          {/* Horas de Foco / Streak */}
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Flame size={15} className="text-amber" />
                <span>Foco Total:</span>
              </span>
              <strong className="text-foreground font-mono">
                {(dedicated / 60).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h
              </strong>
            </div>
          ) : (
            <div className="flex flex-col items-center" title={`Foco Total: ${(dedicated / 60).toFixed(1)}h`}>
              <Flame size={16} className="text-amber" />
              <span className="text-[10px] font-mono text-muted-foreground mt-0.5">{(dedicated / 60).toFixed(0)}h</span>
            </div>
          )}

          {/* Usuário / Login & Tema */}
          <div className={`flex items-center ${sidebarCollapsed ? 'flex-col gap-2' : 'justify-between pt-1'}`}>
            {user ? (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className={`flex items-center rounded-xl hover:bg-secondary/70 transition-colors text-left text-xs text-foreground cursor-pointer group ${
                  sidebarCollapsed ? 'p-1' : 'gap-2.5 p-1.5 flex-1 mr-2 truncate'
                }`}
                title="Meu Perfil"
              >
                <div className="relative shrink-0">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full ring-1 ring-border group-hover:ring-primary/50 transition-all"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green border-2 border-background" />
                </div>
                {!sidebarCollapsed && (
                  <div className="truncate">
                    <p className="font-semibold truncate">{(user.user_metadata as any)?.name || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className={`flex items-center justify-center rounded-xl bg-secondary/80 hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer ${
                  sidebarCollapsed ? 'w-9 h-9 p-0' : 'gap-2 px-3 py-2 flex-1 mr-2'
                }`}
                title="Entrar ou Cadastrar"
              >
                <LogIn size={15} className="text-primary" />
                {!sidebarCollapsed && <span>Entrar</span>}
              </button>
            )}

            {/* Alternador de Tema */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              title="Trocar tema"
              onClick={() => setData(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
            >
              {data.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </div>
        </div>
      </aside>

      {/* CABEÇALHO SUPERIOR (TOPBAR) */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="flex items-center gap-3">
            {/* Logo visível no Mobile */}
            <Link to="/" className="wordmark md:hidden active:scale-95 transition-transform" aria-label="Ideaflow início">
              <span className="brand-icon">
                <AudioLines />
              </span>
              idea<span>flow</span>
              <span className="brand-dot">.</span>
            </Link>

            {/* Breadcrumb / Status discreto no Desktop */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Painel de Realização</span>
            </div>
          </div>
          <div className="header-right flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Botão de Destaque: Mentor IA */}
            <Button
              variant="outline"
              size="sm"
              data-tour="mentor"
              className="h-8 sm:h-9 text-xs sm:text-sm gap-1.5 border-primary/40 bg-gradient-to-r from-primary/15 via-primary/10 to-violet/15 text-primary hover:bg-primary/25 active:scale-95 transition-all shadow-xs px-2.5 sm:px-3.5 rounded-full font-semibold shrink-0 cursor-pointer"
              onClick={() => {
                setMentorIdea(null);
                setAiChatOpen(true);
              }}
            >
              <Sparkles size={13} className="text-primary animate-pulse" />
              <span>Mentor IA</span>
            </Button>

            {/* Streak de horas dedicadas (desktop) */}
            <span className="header-streak hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame size={15} className="text-amber" />
              <strong className="text-foreground font-medium">
                {(dedicated / 60).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h
              </strong>
            </span>

            {/* Alternador de Tema */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground active:scale-95 shrink-0 cursor-pointer"
              aria-label={data.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title="Trocar tema"
              onClick={() => setData(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
            >
              {data.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </Button>

            {/* Botão de Entrar (se não logado) */}
            {!user ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm gap-1.5 border-primary/40 bg-card hover:bg-primary/10 text-foreground active:scale-95 transition-all px-2.5 sm:px-3.5 rounded-full font-semibold shadow-xs shrink-0 cursor-pointer"
                onClick={() => setAuthOpen(true)}
                title="Entrar ou criar conta gratuita para sincronizar ideias"
              >
                <LogIn size={13} className="text-primary" />
                <span>Entrar</span>
              </Button>
            ) : (
              /* Indicador de Sincronização na Nuvem (se logado) */
              <Button
                variant="ghost"
                size="sm"
                className="h-8 sm:h-9 px-2 rounded-full text-xs gap-1.5 text-muted-foreground hover:text-foreground active:scale-95 shrink-0 cursor-pointer"
                onClick={() => syncWithCloud()}
                disabled={isSyncing}
                title="Sincronizar ideias com Supabase"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : 'text-green'} />
                <span className="text-[11px] font-mono hidden md:inline">{user.email?.split('@')[0]}</span>
              </Button>
            )}

            {/* Avatar / Trigger do Perfil: se logado, mostra avatar com online dot; em desktop quando deslogado também exibe */}
            {user ? (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="avatar-trigger relative rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none ml-0.5 shrink-0"
                title="Abrir Meu Perfil"
                aria-label="Perfil do Usuário"
              >
                <img
                  src={avatar}
                  alt="Avatar holográfico"
                  className="avatar hover:ring-2 hover:ring-primary/60 transition-all"
                  width={34}
                  height={34}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green border-2 border-background" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="avatar-trigger relative rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none ml-0.5 shrink-0 hidden sm:block"
                title="Fazer Login / Cadastrar"
                aria-label="Perfil do Usuário"
              >
                <img
                  src={avatar}
                  alt="Avatar holográfico"
                  className="avatar hover:ring-2 hover:ring-primary/60 transition-all opacity-85"
                  width={34}
                  height={34}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SE O USUÁRIO NÃO ESTIVER AUTORIZADO, A TELA INICIAL NÃO VAZA DE JEITO NENHUM */}
      {isAuthorized ? (
        <>
          <main className="main-content">
            <div className="greeting-row">
              <span className="greeting">
                {greeting}
                <span className="greeting-spark">✦</span>
              </span>
              <span className="local-status">
                <span className="status-dot" />
                {online ? 'Seu espaço, seu ritmo' : 'Você está offline'}
              </span>
            </div>
            {children}
          </main>

          <div className="desktop-bottom-note">
            <span>
              <span className="status-dot" />
              Suas ideias e dados ficam neste dispositivo
            </span>
            <span>
              MENOS RUÍDO. MAIS REALIZAÇÃO.
              <ArrowUpRight size={12} />
            </span>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 z-30 bg-slate-100 dark:bg-[#07090E]" />
      )}

      {isAuthorized && (
        <nav className="bottom-nav md:hidden" aria-label="Navegação principal">
          {navigation.map((item, i) => {
            const tourId = item.to === '/' ? 'funil' : item.to === '/hoje' ? 'hoje' : item.to === '/setores' ? 'setores' : 'ajustes';
            return (
              <div key={item.to} className={`nav-slot slot-${i}`} data-tour={tourId}>
                <Button
                  asChild
                  variant="ghost"
                  className={`nav-item ${path === item.to ? 'active' : ''}`}
                >
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              </div>
            );
          })}
          <Button
            className="capture-fab"
            aria-label="Capturar ideia"
            title="Capturar ideia"
            data-tour="capture"
            onClick={() => setCapture(true)}
          >
            <Mic />
          </Button>
        </nav>
      )}

      <CaptureSheet open={capture} onClose={() => setCapture(false)} />
      <AiChatSheet
        open={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        initialIdea={mentorIdea}
      />
      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenIdea={id => setProfileIdeaId(id)}
      />
      <AuthModal
        open={authOpen}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
      />
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <OnboardingTutorial
        open={showTutorial}
        onClose={() => {
          setShowTutorial(false);
          localStorage.setItem('ideaflow_tutorial_completed', 'true');
        }}
      />
      {profileIdeaId && (
        <IdeaDetail
          ideaId={profileIdeaId}
          onClose={() => setProfileIdeaId(null)}
          onFocus={() => setProfileIdeaId(null)}
        />
      )}
    </div>
  );
}