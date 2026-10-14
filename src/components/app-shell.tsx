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
  const path = useRouterState({ select: state => state.location.pathname });

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

    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      window.removeEventListener('ideaflow:capture', captureEvent);
      window.removeEventListener('ideaflow:mentor', mentorEvent);
      window.removeEventListener('ideaflow:profile', profileEvent);
      window.removeEventListener('ideaflow:login', loginEvent);
    };
  }, []);

  const dedicated = data.ideas.reduce((sum, i) => sum + i.dedicated, 0);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="wordmark" aria-label="Ideaflow início">
            <span className="brand-icon">
              <AudioLines />
            </span>
            idea<span>flow</span>
            <span className="brand-dot">.</span>
          </Link>
          <div className="header-right">
            {/* Botão de Destaque: Mentor IA */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 shadow-xs"
              onClick={() => {
                setMentorIdea(null);
                setAiChatOpen(true);
              }}
            >
              <Sparkles size={13} className="text-primary animate-pulse" />
              <span className="hidden sm:inline font-medium">Mentor IA</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1 rounded uppercase font-bold">Grátis</span>
            </Button>

            <span className="header-streak">
              <Flame size={16} />
              <strong>
                {(dedicated / 60).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h
              </strong>
              <span>de realização</span>
            </span>

            <Button
              variant="ghost"
              size="icon"
              aria-label={data.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title="Trocar tema"
              onClick={() => setData(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
            >
              {data.theme === 'dark' ? <Sun /> : <Moon />}
            </Button>

            {/* Botão de Login ou Status da Conta */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex"
                  onClick={() => syncWithCloud()}
                  disabled={isSyncing}
                  title="Sincronizar com o banco de dados seguro Supabase"
                >
                  <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : 'text-green'} />
                  <span className="text-[11px] font-mono">{user.email?.split('@')[0]}</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-primary/40 bg-card hover:bg-primary/10 text-foreground"
                onClick={() => setAuthOpen(true)}
                title="Entrar ou criar conta gratuita para sincronizar ideias"
              >
                <LogIn size={13} className="text-primary" />
                <span className="hidden sm:inline font-medium">Entrar / Cadastrar</span>
                <span className="sm:hidden font-medium">Entrar</span>
              </Button>
            )}

            {/* Barra lateral discreta de perfil */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={() => setProfileOpen(true)}
              title="Abrir barra lateral do perfil e ideias arquivadas"
            >
              <User size={13} className="text-primary" />
              <span>Perfil</span>
              {data.ideas.some(i => i.archived) && (
                <span className="text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.2 rounded-full font-mono">
                  {data.ideas.filter(i => i.archived).length}
                </span>
              )}
            </Button>

            <span className="header-divider" />
            <button
              type="button"
              onClick={() => (user ? setProfileOpen(true) : setAuthOpen(true))}
              className="avatar-trigger relative rounded-full cursor-pointer transition-transform hover:scale-105 focus:outline-none"
              title={user ? 'Abrir Meu Perfil' : 'Fazer Login / Cadastrar'}
              aria-label="Perfil do Usuário"
            >
              <img src={avatar} alt="Avatar holográfico" className="avatar hover:ring-2 hover:ring-primary/60 transition-all" width={44} height={44} />
            </button>
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
        onClose={() => setAuthOpen(false)}
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