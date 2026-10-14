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

  const checkTutorial = () => {
    if (typeof window === 'undefined') return;
    const completed = localStorage.getItem('ideaflow_tutorial_completed');
    if (!completed) {
      setShowTutorial(true);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Passo 2 do plano cronológico: Se não estiver logado, abre login/cadastro
    if (!user) {
      setAuthOpen(true);
    } else {
      // Passo 3 do plano cronológico: Se logado, checa tutorial
      checkTutorial();
    }
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

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="wordmark active:scale-95 transition-transform" aria-label="Ideaflow início">
            <span className="brand-icon">
              <AudioLines />
            </span>
            idea<span>flow</span>
            <span className="brand-dot">.</span>
          </Link>
          <div className="header-right flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Botão de Destaque: Mentor IA */}
            <Button
              variant="outline"
              size="sm"
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

      <nav className="bottom-nav" aria-label="Navegação principal">
        {navigation.map((item, i) => (
          <div key={item.to} className={`nav-slot slot-${i}`}>
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
        ))}
        <Button
          className="capture-fab"
          aria-label="Capturar ideia"
          title="Capturar ideia"
          onClick={() => setCapture(true)}
        >
          <Mic />
        </Button>
      </nav>

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
        onClose={() => {
          setAuthOpen(false);
          checkTutorial();
        }}
        onSuccess={() => {
          setAuthOpen(false);
          checkTutorial();
        }}
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