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
import { OnboardingTutorial } from '@/components/onboarding-tutorial';
import avatar from '@/assets/ideaflow-avatar.png';
import { Idea, createStarterBusinessIdeas, defaultCompanyWorkspace } from '@/lib/ideaflow';
import { User, LogIn, LogOut, Cloud, CloudCheck, RefreshCw, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function AppShell({ children }: { children: ReactNode }) {
  const {
    data,
    setData,
    user,
    profile,
    isSyncing,
    syncWithCloud,
    requestSwitchWorkspace,
    signOut,
    pendingRequests,
    companies,
    switchCompany,
  } = useFlow();
  const [capture, setCapture] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Verificação de sessão desbloqueada ao iniciar:
  // "ao iniciar quero ir direto pra tela de login, mesmo que ja tenha salvo um login"
  const [sessionUnlocked, setSessionUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('ideaflow_session_unlocked') === 'true';
  });

  const [authOpen, setAuthOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('ideaflow_session_unlocked') !== 'true';
  });

  const [profileIdeaId, setProfileIdeaId] = useState<string | null>(null);
  const [mentorIdea, setMentorIdea] = useState<Idea | null>(null);
  const [greeting, setGreeting] = useState('Que bom ter você aqui');
  const [online, setOnline] = useState(true);
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

  const handleAuthSuccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ideaflow_session_unlocked', 'true');
    }
    setSessionUnlocked(true);
    setGuestMode(true);
    setAuthOpen(false);
  };

  const handleAuthClose = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ideaflow_session_unlocked', 'true');
    }
    setSessionUnlocked(true);
    setGuestMode(true);
    setAuthOpen(false);
  };

  const isBusiness = data.workspaceMode === 'business';
  const company = data.companyWorkspace;
  const validCompanies = (companies && companies.length > 0)
    ? companies.filter(c => c.id && c.id !== 'company-acme-corp' && c.shareCode !== 'ACME-2026')
    : (data.companyWorkspace && data.companyWorkspace.id && data.companyWorkspace.id !== 'company-acme-corp' && data.companyWorkspace.shareCode !== 'ACME-2026')
      ? [data.companyWorkspace]
      : [];

  const navigation = [
    { to: '/', name: isBusiness ? 'Iniciativas' : 'Funil', icon: Layers3 },
    { to: '/hoje', name: 'Hoje', icon: CalendarDays },
    { to: '/setores', name: isBusiness ? 'Departamentos' : 'Setores', icon: isBusiness ? Building2 : Grid2X2 },
    { to: '/ajustes', name: 'Ajustes', icon: SlidersHorizontal },
  ] as const;

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

  // Garante que a primeira tela ao entrar no app seja sempre o login caso não tenha feito login
  useEffect(() => {
    if (!user && sessionStorage.getItem('ideaflow_session_unlocked') !== 'true') {
      setAuthOpen(true);
    }
  }, [user]);

  const dedicated = data.ideas.reduce((sum, i) => sum + i.dedicated, 0);
  const isAuthorized = Boolean(user || guestMode);
  const userDisplayName =
    (user?.user_metadata as any)?.name ||
    (user?.user_metadata as any)?.full_name ||
    data.profile?.name ||
    user?.email?.split('@')[0] ||
    'Usuário';
  const userInitial = (userDisplayName.trim()[0] || 'U').toUpperCase();

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

          {/* Seletor Rápido de Workspace no Menu Lateral */}
          {!sidebarCollapsed ? (
            <>
              <div className="p-1 rounded-xl bg-secondary/50 border border-border/80 flex items-center justify-between gap-1 text-xs">
              <button
                type="button"
                onClick={() => requestSwitchWorkspace('personal')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
                  (data.workspaceMode ?? 'personal') === 'personal'
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Ir para o Espaço Pessoal (exige PIN se estiver na Empresa)"
              >
                <User size={13} className={(data.workspaceMode ?? 'personal') === 'personal' ? 'text-primary' : ''} />
                <span>Pessoal</span>
              </button>
              <button
                type="button"
                onClick={() => requestSwitchWorkspace('business')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs relative ${
                  data.workspaceMode === 'business'
                    ? 'bg-violet-600 text-white shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Ir para o Workspace da Empresa"
              >
                <Building2 size={13} />
                <span>Empresa</span>
                {data.companyWorkspace?.isKeyUser && pendingRequests.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold animate-pulse" title={`${pendingRequests.length} pedido(s) pendente(s)`}>
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>
            {data.workspaceMode === 'business' && validCompanies.length > 1 && (
              <div className="mt-2 px-1">
                <select
                  value={data.companyWorkspace?.id ?? ''}
                  onChange={async e => {
                    const targetId = e.target.value;
                    if (targetId && targetId !== data.companyWorkspace?.id) {
                      await switchCompany(targetId);
                    }
                  }}
                  aria-label="Selecionar organização ativa"
                  className="w-full bg-secondary/80 text-foreground border border-violet/40 rounded-lg text-[11px] font-semibold py-1.5 px-2 outline-none cursor-pointer hover:border-violet focus:ring-1 focus:ring-violet truncate"
                >
                  {validCompanies.map(c => (
                    <option key={c.id} value={c.id}>
                      🏢 {c.name} {c.isKeyUser ? '(Key User)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => requestSwitchWorkspace(data.workspaceMode === 'business' ? 'personal' : 'business')}
              className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                data.workspaceMode === 'business'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-secondary/70 text-muted-foreground hover:text-foreground'
              }`}
              title={data.workspaceMode === 'business' ? 'Empresa (Clique para Pessoal)' : 'Pessoal (Clique para Empresa)'}
            >
              {data.workspaceMode === 'business' ? <Building2 size={18} /> : <User size={18} />}
              {data.companyWorkspace?.isKeyUser && pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          )}

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
              <div className="flex items-center flex-1 mr-1 min-w-0">
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className={`flex items-center rounded-xl hover:bg-secondary/70 transition-colors text-left text-xs text-foreground cursor-pointer group ${
                    sidebarCollapsed ? 'p-1' : 'gap-2.5 p-1.5 flex-1 min-w-0 truncate'
                  }`}
                  title="Meu Perfil"
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs ring-1 ring-border group-hover:ring-primary/50 transition-all select-none">
                      {userInitial}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green border-2 border-background" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="truncate min-w-0">
                      <p className="font-semibold truncate">{(user.user_metadata as any)?.name || user.email?.split('@')[0]}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer ${
                    sidebarCollapsed ? 'h-7 w-7 mt-1' : 'h-8 w-8'
                  }`}
                  title="Sair da conta e ver tela de entrada"
                  onClick={async () => {
                    await signOut();
                    setAuthOpen(true);
                  }}
                >
                  <LogOut size={sidebarCollapsed ? 14 : 15} />
                </Button>
              </div>
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
            {/* Botão rápido para expandir menu lateral no Desktop quando estiver recolhido */}
            {sidebarCollapsed && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer mr-1"
                title="Expandir menu lateral"
                aria-label="Expandir menu lateral"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}

            {/* Logo visível no Mobile */}
            <Link to="/" className="wordmark md:hidden active:scale-95 transition-transform" aria-label="Ideaflow início">
              <span className="brand-icon">
                <AudioLines />
              </span>
              idea<span>flow</span>
              <span className="brand-dot">.</span>
            </Link>

            {/* Breadcrumb / Status discreto no Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Painel de Realização</span>
            </div>

            {/* Alternador Global de Espaço: Pessoal vs Empresarial */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-secondary/80 border border-border/80 text-xs shadow-xs">
              <button
                type="button"
                onClick={() => requestSwitchWorkspace('personal')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                  (data.workspaceMode ?? 'personal') === 'personal'
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Alternar para Espaço Pessoal (exige PIN de 4 dígitos)"
              >
                <User size={12} className={(data.workspaceMode ?? 'personal') === 'personal' ? 'text-primary' : ''} />
                <span className="hidden sm:inline">Pessoal</span>
              </button>

              <button
                type="button"
                onClick={() => requestSwitchWorkspace('business')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs relative ${
                  data.workspaceMode === 'business'
                    ? 'bg-violet-600 text-white shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Alternar para Espaço da Empresa"
              >
                <Building2 size={12} />
                <span className="truncate max-w-[120px] hidden sm:inline">
                  {data.companyWorkspace?.name ? data.companyWorkspace.name.split(' ')[0] : 'Empresa'}
                </span>
                <span className="sm:hidden">Empresa</span>
                {data.companyWorkspace?.isKeyUser && pendingRequests.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold animate-pulse" title={`${pendingRequests.length} solicitações de adesão`}>
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Dropdown de Troca Rápida de Empresa quando houver mais de uma */}
            {data.workspaceMode === 'business' && validCompanies.length > 1 && (
              <select
                value={data.companyWorkspace?.id ?? ''}
                onChange={async e => {
                  const targetId = e.target.value;
                  if (targetId && targetId !== data.companyWorkspace?.id) {
                    await switchCompany(targetId);
                  }
                }}
                aria-label="Selecionar organização ativa"
                className="bg-secondary/90 text-foreground border border-violet/40 rounded-full text-[11px] font-semibold py-1 px-2.5 outline-none cursor-pointer hover:border-violet focus:ring-1 focus:ring-violet shrink-0 max-w-[130px] sm:max-w-[160px] truncate"
              >
                {validCompanies.map(c => (
                  <option key={c.id} value={c.id}>
                    🏢 {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="header-right flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Botão de Destaque: Mentor IA (compacto no mobile para não espremer o perfil) */}
            <Button
              variant="outline"
              size="sm"
              data-tour="mentor"
              className="h-8 sm:h-9 text-xs sm:text-sm gap-1 sm:gap-1.5 border-primary/50 bg-gradient-to-r from-primary/20 via-primary/10 to-violet/20 text-primary hover:bg-primary/25 active:scale-95 transition-all shadow-xs hover:shadow-primary/25 px-2 sm:px-3.5 rounded-full font-semibold shrink-0 cursor-pointer relative overflow-hidden group"
              onClick={() => {
                setMentorIdea(null);
                setAiChatOpen(true);
              }}
              title="Abrir Mentor IA"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="hidden sm:inline">Mentor IA</span>
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
                className="h-8 sm:h-9 text-xs sm:text-sm gap-1 border-primary/40 bg-card hover:bg-primary/10 text-foreground active:scale-95 transition-all px-2 sm:px-3 rounded-full font-semibold shadow-xs shrink-0 cursor-pointer"
                onClick={() => setAuthOpen(true)}
                title="Entrar ou criar conta gratuita para sincronizar ideias"
              >
                <LogIn size={13} className="text-primary" />
                <span className="text-[11px] sm:text-xs">Entrar</span>
              </Button>
            ) : (
              /* Indicador de Sincronização na Nuvem (se logado) */
              <Button
                variant="ghost"
                size="sm"
                className="h-8 sm:h-9 px-1.5 sm:px-2 rounded-full text-xs gap-1 text-muted-foreground hover:text-foreground active:scale-95 shrink-0 cursor-pointer"
                onClick={() => syncWithCloud()}
                disabled={isSyncing}
                title="Sincronizar ideias com Supabase"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : 'text-green'} />
                <span className="text-[11px] font-mono hidden md:inline">{user.email?.split('@')[0]}</span>
              </Button>
            )}

            {/* Avatar / Trigger do Perfil: SEMPRE visível em mobile e desktop */}
            {user ? (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="avatar-trigger relative rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none shrink-0"
                title="Abrir Meu Perfil e Empresas"
                aria-label="Perfil do Usuário"
              >
                <div className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs ring-2 ring-primary/40 hover:ring-primary/80 transition-all select-none">
                  {userInitial}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green border-2 border-background shadow-xs shadow-green animate-pulse" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="avatar-trigger relative rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none shrink-0"
                title="Abrir Perfil"
                aria-label="Perfil do Usuário"
              >
                <div className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full bg-gradient-to-br from-primary/70 to-secondary text-foreground font-bold flex items-center justify-center text-xs sm:text-sm border border-border/80 hover:ring-2 hover:ring-primary/60 transition-all select-none">
                  {userInitial}
                </div>
              </button>
            )}

            {/* Botão Explícito de Sair (se logado) */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs gap-1 border-destructive/35 text-destructive hover:bg-destructive/10 active:scale-95 transition-all px-2 sm:px-3 rounded-full font-semibold shadow-xs shrink-0 cursor-pointer"
                onClick={async () => {
                  await signOut();
                  setAuthOpen(true);
                }}
                title="Sair da conta e ver tela de entrada"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sair</span>
              </Button>
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
      <OnboardingTutorial
        open={showTutorial}
        isBusiness={isBusiness}
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