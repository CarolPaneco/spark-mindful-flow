import { useState } from 'react';
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
import { formatMinutes, palettes, stageNames, type FlowData, type Idea } from '@/lib/ideaflow';
import avatar from '@/assets/ideaflow-avatar.png';
import { toast } from 'sonner';

interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenIdea: (id: string) => void;
}

export function ProfileSidebar({ open, onClose, onOpenIdea }: ProfileSidebarProps) {
  const { data, setData, user, signOut, isSyncing, syncWithCloud } = useFlow();
  const [editing, setEditing] = useState(false);

  const profile = data.profile ?? {
    name: 'Explorador Ideaflow',
    role: 'Criador & Desenvolvedor',
    bio: 'Transformando ideias em realidade, um passo consciente de cada vez.',
    streak: 5,
  };

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio ?? '');

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
    setEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const activeIdeas = data.ideas.filter(i => !i.archived);
  const archivedIdeas = data.ideas.filter(i => i.archived);
  const realizedCount = activeIdeas.filter(i => i.stage === 4).length;
  const complexProjectsCount = activeIdeas.filter(
    i => i.isProject || data.ideas.some(sub => sub.parentId === i.id)
  ).length;
  const totalDedicatedMinutes = data.ideas.reduce((sum, i) => sum + i.dedicated, 0);

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
              Perfil & Espaço Pessoal
            </div>
          </div>
          <SheetTitle className="text-xl font-display font-semibold mt-1">
            Meu Perfil Ideaflow
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Suas estatísticas de realização, ideias arquivadas e preferências locais.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-6 flex-1">
          {/* Cartão de Identidade do Usuário */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/80 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Avatar do Usuário"
                  className="w-14 h-14 rounded-full border-2 border-primary/40 bg-secondary object-cover"
                />
                <span className="absolute -bottom-1 -right-1 bg-green text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-card shadow-xs">
                  Ativo
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {!editing ? (
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

              {!editing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary gap-1 px-2.5"
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={12} />
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => {
                      setName(profile.name);
                      setRole(profile.role);
                      setBio(profile.bio ?? '');
                      setEditing(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs gap-1 px-3"
                    onClick={handleSaveProfile}
                  >
                    <Check size={12} />
                    Salvar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Métricas Globais de Realização */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3">
              Métricas de Realização
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
                <span className="text-[10px] text-muted-foreground">horas de ação direta</span>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs">Realizadas</span>
                  <CheckCircle2 size={14} className="text-green" />
                </div>
                <strong className="text-xl font-display font-medium text-green mt-2">
                  {realizedCount}
                </strong>
                <span className="text-[10px] text-muted-foreground">projetos concluídos</span>
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
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs">Projetos Macro</span>
                  <FolderTree size={14} className="text-violet" />
                </div>
                <strong className="text-xl font-display font-medium text-violet mt-2">
                  {complexProjectsCount}
                </strong>
                <span className="text-[10px] text-muted-foreground">com sub-módulos</span>
              </div>
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
                          className="h-7 text-xs px-2 text-primary gap-1"
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
                          className="h-7 text-xs px-2 gap-1 border-amber/40 text-amber hover:bg-amber/10"
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
                className="h-7 text-xs gap-1.5"
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
                className="flex-1 text-xs gap-1.5"
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
                    className="flex-1 text-xs gap-1.5"
                    disabled={isSyncing}
                    onClick={() => syncWithCloud()}
                  >
                    <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : ''} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10 gap-1"
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
                  className="w-full text-xs primary-action gap-1.5"
                  onClick={() => {
                    onClose();
                    // Dispara evento para abrir o modal de login
                    window.dispatchEvent(new CustomEvent('ideaflow:login'));
                  }}
                >
                  <LogIn size={13} />
                  Fazer Login / Criar Conta
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

