import { useState, useEffect } from 'react';
import {
  User,
  Flame,
  Clock,
  Layers,
  CheckCircle2,
  FolderTree,
  Archive,
  ArchiveRestore,
  ExternalLink,
  Download,
  Upload,
  Sun,
  Moon,
  ShieldCheck,
  Pencil,
  Check,
  Palette,
  Sparkles,
  LogIn,
  LogOut,
  Cloud,
  RefreshCw,
  Building2,
  Users,
  Briefcase,
  Plus,
  Trash2,
  ArrowRightLeft,
  Shield,
  Mail,
  Circle,
  Tag,
  ChevronRight,
  Lock,
  KeyRound,
  Share2,
  Copy,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import {
  formatMinutes,
  palettes,
  stageNames,
  defaultCompanySectors,
  type FlowData,
  type Idea,
  type Sector,
  type TeamMember,
  type Tone,
} from '@/lib/ideaflow';
import { toast } from 'sonner';

interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenIdea: (id: string) => void;
}

export function ProfileSidebar({ open, onClose, onOpenIdea }: ProfileSidebarProps) {
  const {
    data,
    setData,
    user,
    signOut,
    isSyncing,
    syncWithCloud,
    requestSwitchWorkspace,
    joinCompanyByCode,
    openPinModal,
    openCompanyAccessModal,
    pendingRequests,
    approveRequest,
    rejectRequest,
  } = useFlow();
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [showJoinCompany, setShowJoinCompany] = useState(false);

  // Perfil Pessoal
  const profile = data.profile ?? {
    name: 'Explorador Ideaflow',
    role: 'Criador & Desenvolvedor',
    bio: 'Transformando ideias em realidade, um passo consciente de cada vez.',
    streak: 5,
  };

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio ?? '');

  // Workspace da Empresa Real (sem mocks ou Acme genérico)
  const hasCompany = Boolean(
    data.companyWorkspace &&
    data.companyWorkspace.id &&
    data.companyWorkspace.id !== 'company-acme-corp' &&
    data.companyWorkspace.shareCode !== 'ACME-2026'
  );
  const company = hasCompany ? data.companyWorkspace : null;
  const isBusinessMode = data.workspaceMode === 'business';

  const [companyName, setCompanyName] = useState(company?.name ?? '');
  const [companyIndustry, setCompanyIndustry] = useState(company?.industry ?? '');
  const [companyMission, setCompanyMission] = useState(company?.mission ?? '');

  // Novo setor da empresa
  const [showAddSector, setShowAddSector] = useState(false);
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorTone, setNewSectorTone] = useState<Tone>('cyan');

  // Novo membro da equipe
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberDept, setNewMemberDept] = useState(company?.sectors?.[0]?.name ?? 'Tecnologia & Dev');

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
      setCompanyIndustry(company.industry ?? '');
      setCompanyMission(company.mission ?? '');
      setNewMemberDept(company.sectors?.[0]?.name ?? 'Tecnologia & Dev');
    }
  }, [company]);

  const handleSaveProfile = () => {
    setData(prev => ({
      ...prev,
      profile: {
        ...profile,
        name: name.trim() || 'Criador',
        role: role.trim() || 'Executor',
        bio: bio.trim(),
      },
    }));
    setEditingPersonal(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSaveCompany = () => {
    if (!company) return;
    setData(prev => {
      if (!prev.companyWorkspace) return prev;
      return {
        ...prev,
        companyWorkspace: {
          ...prev.companyWorkspace,
          name: companyName.trim() || 'Empresa Inovadora',
          industry: companyIndustry.trim(),
          mission: companyMission.trim(),
        },
      };
    });
    setEditingCompany(false);
    toast.success('Dados da empresa atualizados com sucesso!');
  };

  const handleToggleWorkspace = (targetMode: 'personal' | 'business') => {
    if (targetMode === 'business') {
      if (!hasCompany) {
        onClose();
        openCompanyAccessModal('create');
        return;
      }
      requestSwitchWorkspace('business');
    } else {
      requestSwitchWorkspace('personal');
    }
  };

  const handleAddCompanySector = () => {
    if (!company) return;
    if (!newSectorName.trim()) {
      toast.error('Informe o nome do setor ou departamento.');
      return;
    }
    const newSec: Sector = {
      id: `sec-${Date.now()}`,
      name: newSectorName.trim(),
      tone: newSectorTone,
    };
    setData(prev => {
      if (!prev.companyWorkspace) return prev;
      return {
        ...prev,
        companyWorkspace: {
          ...prev.companyWorkspace,
          sectors: [...prev.companyWorkspace.sectors, newSec],
        },
      };
    });
    setNewSectorName('');
    setShowAddSector(false);
    toast.success(`Setor “${newSec.name}” adicionado à empresa! 🏢`);
  };

  const handleRemoveCompanySector = (sectorId: string) => {
    if (!company) return;
    setData(prev => {
      if (!prev.companyWorkspace) return prev;
      if (prev.companyWorkspace.sectors.length <= 1) {
        toast.error('A empresa precisa de pelo menos 1 setor.');
        return prev;
      }
      return {
        ...prev,
        companyWorkspace: {
          ...prev.companyWorkspace,
          sectors: prev.companyWorkspace.sectors.filter(s => s.id !== sectorId),
        },
      };
    });
    toast.info('Setor removido.');
  };

  const handleAddMember = () => {
    if (!company) return;
    if (!newMemberName.trim()) {
      toast.error('Informe o nome do colaborador.');
      return;
    }
    const newMem: TeamMember = {
      id: `mem-${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Colaborador',
      email: newMemberEmail.trim() || undefined,
      department: newMemberDept,
    };
    setData(prev => {
      if (!prev.companyWorkspace) return prev;
      return {
        ...prev,
        companyWorkspace: {
          ...prev.companyWorkspace,
          members: [...prev.companyWorkspace.members, newMem],
        },
      };
    });
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberEmail('');
    setShowAddMember(false);
    toast.success(`Membro ${newMem.name} adicionado à equipe! 👥`);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!company) return;
    setData(prev => {
      if (!prev.companyWorkspace) return prev;
      return {
        ...prev,
        companyWorkspace: {
          ...prev.companyWorkspace,
          members: prev.companyWorkspace.members.filter(m => m.id !== memberId),
        },
      };
    });
    toast.info('Colaborador removido da equipe.');
  };

  // Ideias pessoais vs empresariais
  const personalIdeas = data.ideas.filter(i => i.workspace !== 'business');
  const businessIdeas = data.ideas.filter(i => i.workspace === 'business');

  const activeIdeas = personalIdeas.filter(i => !i.archived);
  const archivedIdeas = personalIdeas.filter(i => i.archived);
  const realizedCount = activeIdeas.filter(i => i.stage === 4).length;
  const complexProjectsCount = activeIdeas.filter(
    i => i.isProject || data.ideas.some(sub => sub.parentId === i.id)
  ).length;
  const totalDedicatedMinutes = personalIdeas.reduce((sum, i) => sum + i.dedicated, 0);

  // Métricas empresariais
  const businessRealizedCount = businessIdeas.filter(i => i.stage === 4).length;
  const businessActiveCount = businessIdeas.filter(i => !i.archived).length;
  const businessDedicatedMinutes = businessIdeas.reduce((sum, i) => sum + i.dedicated, 0);

  const handleUnarchive = (ideaId: string) => {
    setData(prev => ({
      ...prev,
      ideas: prev.ideas.map(i => (i.id === ideaId ? { ...i, archived: false, archivedAt: undefined } : i)),
    }));
    toast.success('Ideia restaurada para o funil ativo! ✨');
  };

  const handleExportBackup = () => {
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideaflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exportado com sucesso!');
    } catch {
      toast.error('Não foi possível gerar o arquivo de backup.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.ideas) && Array.isArray(parsed.sectors)) {
          setData(parsed as FlowData);
          toast.success('Backup restaurado com êxito!');
          onClose();
        } else {
          toast.error('O arquivo JSON não é um backup compatível do Ideaflow.');
        }
      } catch {
        toast.error('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Sheet open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 overflow-y-auto bg-card border-border/80 flex flex-col h-full"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/70 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={14} />
              {activeTab === 'personal' ? 'Perfil Pessoal' : 'Área & Workspace Empresarial'}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  isBusinessMode
                    ? 'bg-violet/15 text-violet border-violet/30'
                    : 'bg-primary/15 text-primary border-primary/30'
                }`}
              >
                Modo: {isBusinessMode ? '🏢 Empresa' : '👤 Pessoal'}
              </span>

              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-[11px] text-destructive hover:bg-destructive/10 border-destructive/30 gap-1 px-2 cursor-pointer"
                  onClick={async () => {
                    onClose();
                    await signOut();
                    window.dispatchEvent(new CustomEvent('ideaflow:login'));
                  }}
                  title="Sair da conta e ver tela de entrada"
                >
                  <LogOut size={11} />
                  <span>Sair</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-[11px] text-primary hover:bg-primary/10 border-primary/30 gap-1 px-2 cursor-pointer"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('ideaflow:login'));
                  }}
                  title="Abrir tela de entrada / Login"
                >
                  <LogIn size={11} />
                  <span>Entrar</span>
                </Button>
              )}
            </div>
          </div>
          <SheetTitle className="text-xl font-display font-semibold mt-1">
            {activeTab === 'personal' ? 'Meu Perfil Ideaflow' : (company?.name || 'Workspace Empresarial')}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {activeTab === 'personal'
              ? 'Suas estatísticas de realização, ideias arquivadas e preferências locais.'
              : 'Gerencie os setores (Tech, Mkt, QA, Qualidade), equipe e iniciativas da sua empresa.'}
          </SheetDescription>
        </SheetHeader>

        {/* NAVEGAÇÃO ENTRE AS DUAS TELAS (PESSOAL vs EMPRESA) */}
        <div className="px-6 pt-4 pb-1">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-secondary/80 border border-border/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                if (data.workspaceMode === 'business') {
                  requestSwitchWorkspace('personal');
                }
                setActiveTab('personal');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-card text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User size={14} className={activeTab === 'personal' ? 'text-primary' : ''} />
              <span>Meu Perfil</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('business');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'business'
                  ? 'bg-card text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 size={14} className={activeTab === 'business' ? 'text-violet' : ''} />
              <span>Empresa & Setores</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* ======================================================== */}
          {/* TELA 1: MEU PERFIL PESSOAL                               */}
          {/* ======================================================== */}
          {activeTab === 'personal' && (
            <>
              {/* Seletor Rápido de Workspace */}
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <User size={15} />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-foreground truncate">Workspace Pessoal</p>
                    <p className="text-[11px] text-muted-foreground">Seu funil individual de projetos</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-violet/40 text-violet hover:bg-violet/10 gap-1 shrink-0 cursor-pointer"
                  onClick={() => {
                    requestSwitchWorkspace('business');
                    setActiveTab('business');
                  }}
                  title="Mudar para o Workspace da Empresa"
                >
                  <ArrowRightLeft size={12} />
                  Ir p/ Empresa
                </Button>
              </div>

              {/* Cartão de Identidade do Usuário */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/80 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-2xl border-2 border-primary/40 shadow-sm select-none">
                      {(profile.name?.trim()?.[0] || user?.email?.trim()?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-green text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-card shadow-xs">
                      Ativo
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {!editingPersonal ? (
                      <>
                        <h3 className="font-semibold text-base text-foreground truncate">{profile.name}</h3>
                        <p className="text-xs text-primary font-medium mt-0.5">{profile.role}</p>
                        {profile.bio && (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            “{profile.bio}”
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2.5 w-full">
                        <div>
                          <label className="text-[11px] text-muted-foreground block mb-1">Seu Nome</label>
                          <input
                            className="text-field text-xs py-1.5"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Como deseja ser chamado..."
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground block mb-1">Papel / Foco</label>
                          <input
                            className="text-field text-xs py-1.5"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            placeholder="Ex: Empreendedor, Arquiteto..."
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground block mb-1">Bio / Lema Pessoal</label>
                          <textarea
                            rows={2}
                            className="text-field text-xs py-1.5 resize-none"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Seu lema ou propósito..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Flame size={15} className="text-amber animate-pulse" />
                    <span>Streak de Foco:</span>
                    <strong className="text-foreground">{profile.streak} dias</strong>
                  </div>

                  {!editingPersonal ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary gap-1 px-2.5 cursor-pointer"
                      onClick={() => setEditingPersonal(true)}
                    >
                      <Pencil size={12} />
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 cursor-pointer"
                        onClick={() => {
                          setName(profile.name);
                          setRole(profile.role);
                          setBio(profile.bio ?? '');
                          setEditingPersonal(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1 px-3 cursor-pointer"
                        onClick={handleSaveProfile}
                      >
                        <Check size={12} />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Métricas Globais de Realização Pessoal */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3">
                  Métricas de Realização Pessoal
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs">Tempo Dedicado</span>
                      <Clock size={14} className="text-primary" />
                    </div>
                    <strong className="text-xl font-display font-medium text-foreground mt-2">
                      {(totalDedicatedMinutes / 60).toFixed(1)}h
                    </strong>
                    <span className="text-[10px] text-muted-foreground">horas de foco pessoal</span>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs">Realizadas</span>
                      <CheckCircle2 size={14} className="text-green" />
                    </div>
                    <strong className="text-xl font-display font-medium text-green mt-2">
                      {realizedCount}
                    </strong>
                    <span className="text-[10px] text-muted-foreground">ideias concluídas</span>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs">No Funil Ativo</span>
                      <Layers size={14} className="text-cyan" />
                    </div>
                    <strong className="text-xl font-display font-medium text-foreground mt-2">
                      {activeIdeas.length}
                    </strong>
                    <span className="text-[10px] text-muted-foreground">ideias em andamento</span>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                    <span className="text-xs">Projetos Macro</span>
                    <FolderTree size={14} className="text-violet" />
                  </div>
                    <strong className="text-xl font-display font-medium text-violet mt-2">
                    {complexProjectsCount}
                  </strong>
                  <span className="text-[10px] text-muted-foreground">com sub-módulos</span>
                </div>
              </div>

              {/* Seção de Ideias Arquivadas */}
              <div className="border-t border-border/70 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Archive size={15} className="text-amber" />
                    <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                      Ideias Arquivadas ({archivedIdeas.length})
                    </h4>
                  </div>
                </div>

                {archivedIdeas.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground space-y-1">
                    <p>Nenhuma ideia arquivada no momento.</p>
                    <p className="text-[11px] opacity-80">
                      Ao arquivar ideias do funil, elas ficam guardadas aqui com segurança.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {archivedIdeas.map(idea => {
                      const sector = data.sectors.find(s => s.id === idea.sector);
                      return (
                        <div
                          key={idea.id}
                          className="p-3 rounded-lg border border-border/70 bg-secondary/30 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <h5 className="font-medium text-foreground truncate">{idea.title}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground">
                                {sector?.name ?? 'Geral'} · {stageNames[idea.stage]}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2 text-primary gap-1 cursor-pointer"
                              onClick={() => {
                                onClose();
                                onOpenIdea(idea.id);
                              }}
                              title="Ver detalhes da ideia arquivada"
                            >
                              <ExternalLink size={12} />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2 gap-1 border-amber/40 text-amber hover:bg-amber/10 cursor-pointer"
                              onClick={() => handleUnarchive(idea.id)}
                              title="Restaurar para o funil ativo"
                            >
                              <ArchiveRestore size={12} />
                              Restaurar
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>



              {/* Preferências Rápidas & Cores */}
              <div className="border-t border-border/70 pt-5 space-y-3">
                <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <Palette size={14} />
                  Aparência & Paleta
                </h4>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/60">
                  <span className="text-xs font-medium text-foreground">Modo do Tema</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5 cursor-pointer"
                    onClick={() => setData(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
                  >
                    {data.theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
                    {data.theme === 'dark' ? 'Mudar para Claro' : 'Mudar para Escuro'}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {palettes.map(pal => (
                    <button
                      key={pal}
                      onClick={() => setData(p => ({ ...p, palette: pal }))}
                      className={`text-xs py-1.5 px-2 rounded-md border text-center transition-all cursor-pointer ${
                        data.palette === pal
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border/60 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {pal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backup e Dados Locais */}
              <div className="border-t border-border/70 pt-5 space-y-3">
                <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  Segurança & Backup Local
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  O Ideaflow funciona 100% offline. Todos os seus dados ficam salvos exclusivamente no
                  armazenamento do seu navegador.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs gap-1.5 cursor-pointer"
                    onClick={handleExportBackup}
                  >
                    <Download size={13} />
                    Exportar JSON
                  </Button>

                  <label className="flex-1">
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportBackup}
                    />
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5 cursor-pointer"
                    >
                      <span>
                        <Upload size={13} />
                        Restaurar JSON
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Segurança do Espaço Pessoal: PIN de 4 dígitos */}
              <div className="border-t border-border/70 pt-5 space-y-3">
                <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock size={14} className="text-primary" />
                    Segurança do Espaço Pessoal (PIN)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-primary/10 text-primary border border-primary/25 font-bold">
                    4 dígitos ativo
                  </span>
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Ao alternar do Workspace da Empresa para o Pessoal, sua senha de 4 dígitos é exigida para proteger sua privacidade contra acessos indevidos.
                </p>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/60 text-xs">
                  <div className="flex items-center gap-2">
                    <KeyRound size={15} className="text-primary" />
                    <span className="text-muted-foreground">Senha pessoal:</span>
                    <span className="font-mono font-bold tracking-widest text-foreground">••••</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5 cursor-pointer ml-auto"
                    onClick={() => openPinModal()}
                  >
                    <span>Alterar PIN</span>
                  </Button>
                </div>
              </div>

              {/* Seção Conta na Nuvem / Supabase */}
              <div className="border-t border-border/70 pt-5 space-y-3">
                <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cloud size={14} className="text-primary" />
                    Sincronização na Nuvem
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      user ? 'bg-green/15 text-green border border-green/30' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {user ? 'Conectado' : 'Modo Offline'}
                  </span>
                </h4>

                {user ? (
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">E-mail:</span>
                      <span className="font-mono text-foreground font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs gap-1.5 cursor-pointer"
                        disabled={isSyncing}
                        onClick={() => syncWithCloud()}
                      >
                        <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : ''} />
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive hover:bg-destructive/10 gap-1 cursor-pointer"
                        onClick={async () => {
                          await signOut();
                          onClose();
                        }}
                      >
                        <LogOut size={13} />
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2 text-xs">
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Conecte sua conta gratuita para acessar suas ideias e projetos em qualquer celular ou computador.
                    </p>
                    <Button
                      size="sm"
                      className="w-full text-xs primary-action gap-1.5 cursor-pointer"
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('ideaflow:login'));
                      }}
                    >
                      <LogIn size={13} />
                      Fazer Login / Criar Conta
                    </Button>
                  </div>
                )}
              </div>


            </>
          )}

          {/* ======================================================== */}
          {/* TELA 2: ÁREA EMPRESARIAL & WORKSPACE CORPORATIVO         */}
          {/* ======================================================== */}
          {activeTab === 'business' && (
            <>
              {!hasCompany || !company ? (
                /* ESTADO VAZIO: NENHUMA EMPRESA VINCULADA */
                <div className="p-6 rounded-2xl border border-dashed border-violet/40 bg-violet/5 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet/15 text-violet border border-violet/30 flex items-center justify-center mx-auto shadow-xs">
                    <Building2 size={24} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-base text-foreground">
                      Nenhuma Empresa Vinculada
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Você ainda não possui uma empresa conectada. Crie a sua organização para se tornar o <strong>Key User</strong> ou entre com o código compartilhado fornecido pela sua equipe.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
                    <Button
                      size="sm"
                      className="h-9 text-xs bg-gradient-to-r from-violet-600 to-primary text-white font-semibold cursor-pointer shadow-xs gap-1.5"
                      onClick={() => {
                        onClose();
                        openCompanyAccessModal('create');
                      }}
                    >
                      <Sparkles size={14} />
                      Criar Minha Empresa (Key User)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs border-violet/40 text-violet hover:bg-violet/10 font-semibold cursor-pointer gap-1.5"
                      onClick={() => {
                        onClose();
                        openCompanyAccessModal('join');
                      }}
                    >
                      <Share2 size={14} />
                      Entrar com Código
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Card Destaque: Alternador de Modo de Workspace */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isBusinessMode
                        ? 'bg-gradient-to-br from-violet/15 via-primary/10 to-transparent border-violet/40 shadow-xs'
                        : 'bg-secondary/40 border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-violet/20 border border-violet/30 flex items-center justify-center text-violet">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            {isBusinessMode ? 'Workspace Empresarial Ativo' : 'Workspace Empresarial Disponível'}
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            {isBusinessMode
                              ? 'O funil principal está exibindo os setores e metas da empresa.'
                              : 'Alterne para focar nos projetos corporativos e setores.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status Atual:</span>
                      {isBusinessMode ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1.5 cursor-pointer"
                          onClick={() => requestSwitchWorkspace('personal')}
                        >
                          <Lock size={12} />
                          <span>Voltar ao Pessoal (PIN)</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-gradient-to-r from-violet-600 to-primary text-white font-semibold shadow-xs hover:shadow-violet-500/25 gap-1.5 cursor-pointer"
                          onClick={() => requestSwitchWorkspace('business')}
                        >
                          <Building2 size={13} />
                          <span>Ativar Modo Empresa</span>
                        </Button>
                      )}
                    </div>
                  </div>

              {/* Card: Compartilhamento com Equipe via Supabase */}
              <div className="p-4 rounded-xl border border-violet/35 bg-violet/5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Share2 size={14} className="text-violet" />
                    Compartilhamento & Nuvem da Empresa
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-green/15 text-green border border-green/30 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                    Supabase Nuvem
                  </span>
                </div>

                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Compartilhe este código com outros membros da equipe para que todos trabalhem no mesmo funil, adicionem ideias e acompanhem etapas em tempo real.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 p-2.5 rounded-lg bg-card border border-border/80 flex items-center justify-between font-mono font-bold text-sm text-foreground shadow-xs">
                    <span className="tracking-wider">{company.shareCode || 'ACME-2026'}</span>
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/80 font-sans cursor-pointer flex items-center gap-1 font-semibold"
                      onClick={() => {
                        navigator.clipboard.writeText(company.shareCode || 'ACME-2026');
                        toast.success('Código de convite copiado para a área de transferência! 📋');
                      }}
                    >
                      <Copy size={12} />
                      Copiar Código
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-1 cursor-pointer"
                    onClick={() => setShowJoinCompany(!showJoinCompany)}
                  >
                    <span>Entrar em outra empresa</span>
                    <ChevronRight size={12} className={`transition-transform ${showJoinCompany ? 'rotate-90' : ''}`} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-violet/40 text-violet hover:bg-violet/10 gap-1 cursor-pointer"
                    onClick={() => syncWithCloud()}
                    disabled={isSyncing}
                  >
                    <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
                    Sincronizar Nuvem
                  </Button>
                </div>

                {showJoinCompany && (
                  <div className="p-3 rounded-lg bg-background border border-border/80 space-y-2 mt-2 animate-in fade-in-50">
                    <label className="text-[11px] font-medium text-foreground block">
                      Código de Convite da Empresa Compartilhada:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="text-field text-xs py-1.5 font-mono uppercase"
                        placeholder="Ex: ACME-2026"
                        value={joinCodeInput}
                        onChange={e => setJoinCodeInput(e.target.value)}
                      />
                      <Button
                        size="sm"
                        className="h-8 text-xs cursor-pointer shrink-0"
                        onClick={async () => {
                          if (joinCodeInput.trim()) {
                            await joinCompanyByCode(joinCodeInput.trim());
                            setJoinCodeInput('');
                            setShowJoinCompany(false);
                          }
                        }}
                      >
                        Conectar
                      </Button>
                    </div>
                  </div>
                )}
              </div>



              {/* Informações da Empresa (Nome, Segmento, Missão) */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Briefcase size={14} className="text-violet" />
                    <span>Dados da Organização</span>
                  </div>
                  {!editingCompany ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-primary gap-1 px-2 cursor-pointer"
                      onClick={() => setEditingCompany(true)}
                    >
                      <Pencil size={11} />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs px-2 cursor-pointer"
                        onClick={() => {
                          setCompanyName(company.name);
                          setCompanyIndustry(company.industry ?? '');
                          setCompanyMission(company.mission ?? '');
                          setEditingCompany(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="h-6 text-xs px-2.5 gap-1 cursor-pointer"
                        onClick={handleSaveCompany}
                      >
                        <Check size={11} />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>

                {!editingCompany ? (
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-base text-foreground">{company.name}</h3>
                    {company.industry && (
                      <p className="text-xs text-primary font-medium">{company.industry}</p>
                    )}
                    {company.mission && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed pt-1">
                        “{company.mission}”
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Nome da Empresa</label>
                      <input
                        className="text-field text-xs py-1.5"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ex: Acme Inovações S.A."
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Setor / Indústria</label>
                      <input
                        className="text-field text-xs py-1.5"
                        value={companyIndustry}
                        onChange={e => setCompanyIndustry(e.target.value)}
                        placeholder="Ex: Tecnologia & Produtos Digitais"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Missão / Propósito</label>
                      <textarea
                        rows={2}
                        className="text-field text-xs py-1.5 resize-none"
                        value={companyMission}
                        onChange={e => setCompanyMission(e.target.value)}
                        placeholder="Ex: Entregar tecnologia com máxima estabilidade e foco no cliente..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Atalho: Abrir Portal Corporativo (Entrar com Código ou Criar Empresa) */}
              <div className="p-3.5 rounded-xl border border-dashed border-violet/50 bg-violet/5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">Precisa trocar ou fundar outra empresa?</p>
                  <p className="text-[11px] text-muted-foreground">Abra o portal para gerar novo código ou conectar outro time.</p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold shrink-0 cursor-pointer"
                  onClick={() => openCompanyAccessModal()}
                >
                  <Sparkles size={13} className="mr-1" />
                  Portal Corporativo
                </Button>
              </div>

              {/* Painel do Key User: Pedidos de Entrada da Equipe */}
              <div className="p-4 rounded-xl border border-violet/30 bg-secondary/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-violet" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Painel do Key User & Aprovações
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {company.keyUserName ? `Key User: ${company.keyUserName}` : 'Gestão de acessos à corporação'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-violet/15 text-violet border border-violet/30 font-bold">
                    {pendingRequests.length} pendente(s)
                  </span>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="p-3 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground">
                    <p className="font-medium">Nenhum pedido de entrada aguardando aprovação.</p>
                    <p className="text-[10px] mt-0.5 opacity-80">
                      Quando colaboradores usarem o código <code className="text-primary font-mono">{company.shareCode || 'ACME-2026'}</code>, suas solicitações aparecerão aqui para sua validação.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pendingRequests.map(req => (
                      <div
                        key={req.id}
                        className="p-2.5 rounded-lg border border-violet/30 bg-card flex flex-col gap-2 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-foreground">{req.userName}</p>
                            <p className="text-[11px] text-muted-foreground">{req.userEmail}</p>
                            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-primary font-medium">
                              Setor: {req.department} · {req.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px] text-destructive hover:bg-destructive/10 px-2 cursor-pointer"
                            onClick={() => rejectRequest(req.id)}
                          >
                            Recusar
                          </Button>
                          <Button
                            size="sm"
                            className="h-6 text-[11px] bg-green hover:bg-green/90 text-white font-semibold px-2.5 cursor-pointer"
                            onClick={() => approveRequest(req)}
                          >
                            <Check size={12} className="mr-1" />
                            Aprovar Acesso
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-border/70 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    <Tag size={14} className="text-cyan" />
                    <span>Setores da Empresa ({company.sectors.length})</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1 px-2 cursor-pointer"
                    onClick={() => setShowAddSector(!showAddSector)}
                  >
                    <Plus size={12} />
                    <span>Novo Setor</span>
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Estruture a empresa por áreas de atuação. O funil e as ideias serão agrupados por estes setores.
                </p>

                {showAddSector && (
                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2.5 text-xs">
                    <p className="font-semibold text-foreground text-xs">Adicionar Novo Setor / Departamento</p>
                    <input
                      className="text-field text-xs py-1.5"
                      value={newSectorName}
                      onChange={e => setNewSectorName(e.target.value)}
                      placeholder="Nome do setor (ex: Sucesso do Cliente, Design, Vendas...)"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">Tom:</span>
                      {(['cyan', 'pink', 'amber', 'green', 'violet'] as Tone[]).map(tone => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setNewSectorTone(tone)}
                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                            tone === 'cyan'
                              ? 'bg-cyan-500'
                              : tone === 'pink'
                              ? 'bg-pink-500'
                              : tone === 'amber'
                              ? 'bg-amber-500'
                              : tone === 'green'
                              ? 'bg-emerald-500'
                              : 'bg-violet-500'
                          } ${newSectorTone === tone ? 'scale-110 ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 cursor-pointer"
                        onClick={() => setShowAddSector(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs px-3 cursor-pointer"
                        onClick={handleAddCompanySector}
                      >
                        Adicionar Setor
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  {company.sectors.map(sec => {
                    const count = businessIdeas.filter(i => i.sector === sec.id).length;
                    return (
                      <div
                        key={sec.id}
                        className="p-2.5 rounded-lg border border-border/70 bg-card/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              sec.tone === 'cyan'
                                ? 'bg-cyan-500'
                                : sec.tone === 'pink'
                                ? 'bg-pink-500'
                                : sec.tone === 'amber'
                                ? 'bg-amber-500'
                                : sec.tone === 'green'
                                ? 'bg-emerald-500'
                                : 'bg-violet-500'
                            }`}
                          />
                          <span className="font-medium text-foreground truncate">{sec.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {count} {count === 1 ? 'iniciativa' : 'iniciativas'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCompanySector(sec.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                            title="Remover setor"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Equipe / Colaboradores da Empresa */}
              <div className="border-t border-border/70 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    <Users size={14} className="text-primary" />
                    <span>Equipe & Colaboradores ({company.members.length})</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1 px-2 cursor-pointer"
                    onClick={() => setShowAddMember(!showAddMember)}
                  >
                    <Plus size={12} />
                    <span>Adicionar</span>
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Membros alocados aos projetos e responsáveis pelas iniciativas da empresa.
                </p>

                {showAddMember && (
                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2.5 text-xs">
                    <p className="font-semibold text-foreground text-xs">Novo Membro da Equipe</p>
                    <input
                      className="text-field text-xs py-1.5"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Nome completo (ex: Carlos Mendes)"
                    />
                    <input
                      className="text-field text-xs py-1.5"
                      value={newMemberRole}
                      onChange={e => setNewMemberRole(e.target.value)}
                      placeholder="Cargo (ex: Arquiteto de Software, Especialista em Growth)"
                    />
                    <input
                      className="text-field text-xs py-1.5"
                      type="email"
                      value={newMemberEmail}
                      onChange={e => setNewMemberEmail(e.target.value)}
                      placeholder="E-mail corporativo (opcional)"
                    />
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Setor Principal:</label>
                      <select
                        className="text-field text-xs py-1.5"
                        value={newMemberDept}
                        onChange={e => setNewMemberDept(e.target.value)}
                      >
                        {company.sectors.map(s => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 cursor-pointer"
                        onClick={() => setShowAddMember(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs px-3 cursor-pointer"
                        onClick={handleAddMember}
                      >
                        Salvar Membro
                      </Button>
                    </div>
                  </div>
                )}

                {company.members.length === 0 ? (
                  <div className="p-3.5 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground">
                    Nenhum colaborador adicionado ainda. Compartilhe o código da empresa para a equipe ingressar ou adicione acima.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {company.members.map(member => {
                    const initials = member.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(p => p[0]?.toUpperCase())
                      .join('');

                    return (
                      <div
                        key={member.id}
                        className="p-2.5 rounded-lg border border-border/70 bg-card/60 flex items-center justify-between gap-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary border border-primary/25 font-bold flex items-center justify-center shrink-0 text-xs">
                            {initials || 'U'}
                          </div>
                          <div className="truncate">
                            <h5 className="font-semibold text-foreground truncate">{member.name}</h5>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {member.role} {member.department ? `· ${member.department}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {member.email && (
                            <span className="text-[10px] text-muted-foreground hidden sm:inline" title={member.email}>
                              <Mail size={12} className="inline mr-1" />
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                            title="Remover membro"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Métricas Corporativas Rápidas */}
            <div className="border-t border-border/70 pt-5 space-y-3">
              <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green" />
                Métricas do Workspace Corporativo
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground">Iniciativas da Empresa</span>
                  <strong className="text-xl font-display font-medium text-foreground mt-2">
                    {businessActiveCount}
                  </strong>
                  <span className="text-[10px] text-muted-foreground">ativas no funil</span>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground">Entregas Realizadas</span>
                  <strong className="text-xl font-display font-medium text-green mt-2">
                    {businessRealizedCount}
                  </strong>
                  <span className="text-[10px] text-muted-foreground">concluídas com êxito</span>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
