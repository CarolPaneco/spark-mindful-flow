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
import avatar from '@/assets/ideaflow-avatar.png';
import { Idea } from '@/lib/ideaflow';

const navigation = [
  { to: '/', name: 'Funil', icon: Layers3 },
  { to: '/hoje', name: 'Hoje', icon: CalendarDays },
  { to: '/setores', name: 'Setores', icon: Grid2X2 },
  { to: '/ajustes', name: 'Ajustes', icon: SlidersHorizontal },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { data, setData } = useFlow();
  const [capture, setCapture] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
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

    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      window.removeEventListener('ideaflow:capture', captureEvent);
      window.removeEventListener('ideaflow:mentor', mentorEvent);
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

            <span className="header-divider" />
            <img src={avatar} alt="Avatar holográfico" className="avatar" width={44} height={44} />
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
    </div>
  );
}