import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Play,
  Trash2,
  CalendarPlus,
  Sparkles,
  BarChart2,
  ListTodo,
  GitFork,
  BookOpen,
  CalendarDays,
  Plus,
  Compass,
  ExternalLink,
  Download,
  AlertCircle,
  Lightbulb,
  History,
  Pencil,
  CheckSquare,
  FolderTree,
  Archive,
  ArchiveRestore,
  Layers,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Building2,
  Users,
  Tag,
  User,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useFlow } from '@/components/flow-provider';
import {
  formatMinutes,
  localDate,
  stageNames,
  stageTones,
  generateAiSteps,
  getAiCoachingInsights,
  createGoogleCalendarUrl,
  downloadIcsFile,
  getSubIdeas,
  getParentIdea,
  getProjectStats,
  generateSubModulesAi,
  FIVE_WHYS_QUESTIONS,
  suggestFiveWhysOffline,
  defaultCompanySectors,
  defaultTeamMembers,
  type Idea,
  type Stage,
  type Step,
  type PivotRecord,
  type IdeaNote,
  type DayBlock,
} from '@/lib/ideaflow';
import { generateProjectModulesWithGemini } from '@/lib/ai-assistant';
import { suggestFiveWhysWithAi } from '@/lib/integrated-ai';
import { toast } from 'sonner';

type Tab = 'overview' | 'steps' | 'subideas' | 'pivots' | 'notes' | 'calendar' | 'coach';

export function IdeaDetail({
  ideaId,
  onClose,
  onFocus,
}: {
  ideaId: string | null;
  onClose: () => void;
  onFocus: (idea: Idea) => void;
}) {
  const { data, updateIdea, setData } = useFlow();
  const [tab, setTab] = useState<Tab>('overview');
  const [mounted, setMounted] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState<string | null>(ideaId);

  // Estados para Mudança de Rota (Pivô)
  const [showPivotForm, setShowPivotForm] = useState(false);
  const [pivotType, setPivotType] = useState<PivotRecord['type']>('Redução de Escopo');
  const [newScope, setNewScope] = useState('');
  const [pivotReason, setPivotReason] = useState('');

  // Estados para Anotações
  const [noteText, setNoteText] = useState('');

  // Estados para Passos
  const [newStepText, setNewStepText] = useState('');
  const [newStepMinutes, setNewStepMinutes] = useState(15);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [draggedStepIdx, setDraggedStepIdx] = useState<number | null>(null);

  // Estados para Sub-ideias / Módulos de Projetos Complexos
  const [showSubIdeaForm, setShowSubIdeaForm] = useState(false);
  const [subIdeaTitle, setSubIdeaTitle] = useState('');
  const [subIdeaSummary, setSubIdeaSummary] = useState('');
  const [subIdeaMinutes, setSubIdeaMinutes] = useState(60);
  const [subIdeaPriority, setSubIdeaPriority] = useState<Idea['priority']>('Normal');
  const [isGeneratingSubAi, setIsGeneratingSubAi] = useState(false);

  // Estados para os 5 Porquês
  const [editingFiveWhys, setEditingFiveWhys] = useState(false);
  const [localFiveWhys, setLocalFiveWhys] = useState<string[]>(['', '', '', '', '']);
  const [isSuggestingWhysDetail, setIsSuggestingWhysDetail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentIdeaId(ideaId);
  }, [ideaId]);

  const idea = data.ideas.find(i => i.id === currentIdeaId);

  useEffect(() => {
    if (idea) {
      setNewScope(idea.scope ?? '');
      setShowPivotForm(false);
      setEditingStepIndex(null);
      setShowSubIdeaForm(false);
      setEditingFiveWhys(false);
      setLocalFiveWhys(idea.fiveWhys && idea.fiveWhys.length ? [...idea.fiveWhys] : ['', '', '', '', '']);
    }
  }, [currentIdeaId, idea?.id]);

  const handleSaveFiveWhysInDetail = () => {
    if (!idea) return;
    const cleaned = localFiveWhys.map(w => w.trim());
    const hasAny = cleaned.some(w => w.length > 0);
    updateIdea(idea.id, {
      fiveWhys: hasAny ? cleaned : undefined,
    });
    setEditingFiveWhys(false);
    toast.success('5 Porquês atualizados com sucesso! 🎯');
  };

  const handleSuggestWhysInDetail = async () => {
    if (!idea) return;
    setIsSuggestingWhysDetail(true);
    try {
      const suggestions = await suggestFiveWhysWithAi(`${idea.title}. ${idea.summary}`);
      if (suggestions && suggestions.length > 0) {
        setLocalFiveWhys(suggestions);
        toast.success('5 Porquês sugeridos com IA! Você pode editar as respostas.');
      }
    } catch {
      const offline = suggestFiveWhysOffline(`${idea.title}. ${idea.summary}`);
      setLocalFiveWhys(offline);
      toast.success('5 Porquês sugeridos pelo motor reflexivo!');
    } finally {
      setIsSuggestingWhysDetail(false);
    }
  };

  if (!idea) {
    return (
      <Drawer open={false} onOpenChange={() => onClose()}>
        <DrawerContent />
      </Drawer>
    );
  }

  const completedStepsCount = idea.steps.filter(s => s.done).length;
  const totalStepsCount = idea.steps.length;
  const completionPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;
  const coaching = getAiCoachingInsights(idea);

  // Dados para os gráficos
  const chartStepsData = [
    { name: 'Concluídos', value: completedStepsCount, color: 'var(--green)' },
    { name: 'Pendentes', value: Math.max(0, totalStepsCount - completedStepsCount), color: 'var(--secondary)' },
  ];

  const timeData = [
    { name: 'Dedicado', minutos: idea.dedicated, fill: 'var(--primary)' },
    { name: 'Total Previsto', minutos: idea.minutes, fill: 'var(--violet)' },
  ];

  // Ações de Passos
  const handleToggleStep = (index: number) => {
    const updated = idea.steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s));
    updateIdea(idea.id, { steps: updated });
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    const newStep: Step = {
      id: crypto.randomUUID(),
      text: newStepText.trim(),
      minutes: Number(newStepMinutes),
      done: false,
    };
    const updated = [...idea.steps, newStep];
    const totalMinutes = updated.reduce((sum, s) => sum + s.minutes, 0);
    updateIdea(idea.id, { steps: updated, minutes: totalMinutes });
    setNewStepText('');
    toast.success('Passo adicionado ao checklist!');
  };

  const handleDeleteStep = (index: number) => {
    if (idea.steps.length <= 1) {
      toast.error('Mantenha pelo menos um passo para orientação.');
      return;
    }
    const updated = idea.steps.filter((_, i) => i !== index);
    const totalMinutes = updated.reduce((sum, s) => sum + s.minutes, 0);
    updateIdea(idea.id, { steps: updated, minutes: totalMinutes });
    toast.success('Passo removido.');
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= idea.steps.length) return;
    const reordered = [...idea.steps];
    const [moved] = reordered.splice(fromIndex, 1);
    if (!moved) return;
    reordered.splice(toIndex, 0, moved);
    updateIdea(idea.id, {
      steps: reordered,
      immediate: reordered[0]?.text ?? idea.immediate,
    });
  };

  const handleSuggestStepsAi = () => {
    const aiSteps = generateAiSteps(idea.title, idea.summary, idea.sector, 'estruturado');
    const existingTexts = new Set(idea.steps.map(s => s.text.toLowerCase()));
    const newFiltered = aiSteps.filter(s => !existingTexts.has(s.text.toLowerCase()));
    if (newFiltered.length === 0) {
      toast.info('A IA analisou seus passos e você já tem um plano consistente.');
      return;
    }
    const updated = [...idea.steps, ...newFiltered.slice(0, 2)];
    const totalMinutes = updated.reduce((sum, s) => sum + s.minutes, 0);
    updateIdea(idea.id, { steps: updated, minutes: totalMinutes });
    toast.success('A IA adicionou 2 passos estratégicos ao seu plano ✨');
  };

  // Ações de Mudança de Rota (Pivô)
  const handleSavePivot = () => {
    if (!pivotReason.trim()) {
      toast.error('Informe o motivo da mudança de rota para registrar o aprendizado.');
      return;
    }
    const newPivot: PivotRecord = {
      id: crypto.randomUUID(),
      date: localDate(),
      type: pivotType,
      previousScope: idea.scope || 'Escopo inicial indefinido',
      newScope: newScope.trim() || idea.scope || '',
      reason: pivotReason.trim(),
    };
    const updatedPivots = [newPivot, ...(idea.pivots ?? [])];
    updateIdea(idea.id, {
      scope: newScope.trim(),
      pivots: updatedPivots,
    });
    setPivotReason('');
    setShowPivotForm(false);
    toast.success('Mudança de rota registrada no histórico!');
  };

  // Ações de Anotações
  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote: IdeaNote = {
      id: crypto.randomUUID(),
      createdAt:
        new Date().toLocaleDateString('pt-BR') +
        ' ' +
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: noteText.trim(),
    };
    const updatedNotes = [newNote, ...(idea.notes ?? [])];
    updateIdea(idea.id, { notes: updatedNotes });
    setNoteText('');
    toast.success('Anotação registrada no diário de bordo!');
  };

  const handleDeleteNote = (id: string) => {
    const updated = (idea.notes ?? []).filter(n => n.id !== id);
    updateIdea(idea.id, { notes: updated });
    toast.success('Anotação removida.');
  };

  // Sub-ideias e Projetos Complexos
  const subIdeas = idea ? getSubIdeas(data.ideas, idea.id, true) : [];
  const activeSubIdeas = subIdeas.filter(s => !s.archived);
  const projectStats = idea ? getProjectStats(idea, data.ideas) : { totalSub: 0, completedSub: 0, percent: 0, totalMinutes: 0, dedicatedMinutes: 0 };
  const parentIdea = idea ? getParentIdea(data.ideas, idea) : undefined;

  const handleCreateSubIdea = () => {
    if (!subIdeaTitle.trim()) {
      toast.error('Informe o título do módulo ou sub-ideia.');
      return;
    }
    const newSubIdea: Idea = {
      id: crypto.randomUUID(),
      title: subIdeaTitle.trim(),
      summary: subIdeaSummary.trim() || `Módulo especializado do projeto ${idea.title}`,
      sector: idea.sector,
      stage: 0,
      minutes: Number(subIdeaMinutes) || 60,
      dedicated: 0,
      priority: subIdeaPriority,
      parentId: idea.id,
      steps: [
        {
          id: crypto.randomUUID(),
          text: `Definir resultado e escopo de “${subIdeaTitle.trim()}”`,
          minutes: 15,
          done: false,
        },
        {
          id: crypto.randomUUID(),
          text: `Implementar a entrega principal do módulo`,
          minutes: Math.max(15, (Number(subIdeaMinutes) || 60) - 30),
          done: false,
        },
        {
          id: crypto.randomUUID(),
          text: `Testar e validar no projeto geral`,
          minutes: 15,
          done: false,
        },
      ],
      immediate: `Definir resultado e escopo de “${subIdeaTitle.trim()}”`,
      clarity: 'Módulo de projeto estruturado com foco em entrega incremental.',
      pivots: [],
      notes: [],
    };

    setData(prev => ({
      ...prev,
      ideas: [newSubIdea, ...prev.ideas.map(i => (i.id === idea.id ? { ...i, isProject: true } : i))],
    }));

    setSubIdeaTitle('');
    setSubIdeaSummary('');
    setShowSubIdeaForm(false);
    toast.success('Módulo adicionado ao projeto! 🚀');
  };

  const handleGenerateAiSubModules = async () => {
    setIsGeneratingSubAi(true);
    try {
      const res = await generateProjectModulesWithGemini(idea.title, idea.summary, idea.sector);
      const modules = res.modules;
      const newSubIdeas: Idea[] = modules.map(m => ({
        id: crypto.randomUUID(),
        title: m.title,
        summary: m.summary,
        sector: idea.sector,
        stage: 0,
        minutes: m.minutes,
        dedicated: 0,
        priority: 'Normal',
        parentId: idea.id,
        steps: [
          {
            id: crypto.randomUUID(),
            text: `Planejar estrutura de ${m.title}`,
            minutes: 15,
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: `Construir implementação prática`,
            minutes: Math.max(15, m.minutes - 30),
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: `Revisar e integrar ao projeto macro`,
            minutes: 15,
            done: false,
          },
        ],
        immediate: `Planejar estrutura de ${m.title}`,
        clarity: 'Módulo inteligente desenhado para decompor a complexidade da ideia.',
        pivots: [],
        notes: [],
      }));

      setData(prev => ({
        ...prev,
        ideas: [...newSubIdeas, ...prev.ideas.map(i => (i.id === idea.id ? { ...i, isProject: true } : i))],
      }));

      if (res.usedGemini) {
        toast.success(`Google Gemini gerou ${newSubIdeas.length} módulos personalizados para seu projeto! ✨`);
      } else {
        toast.success(`Motor Local gerou ${newSubIdeas.length} módulos para seu projeto! ✨`);
      }
    } catch {
      const fallback = generateSubModulesAi(idea.title, idea.summary, idea.sector);
      const newSubIdeas: Idea[] = fallback.map(m => ({
        id: crypto.randomUUID(),
        title: m.title,
        summary: m.summary,
        sector: idea.sector,
        stage: 0,
        minutes: m.minutes,
        dedicated: 0,
        priority: 'Normal',
        parentId: idea.id,
        steps: [
          {
            id: crypto.randomUUID(),
            text: `Planejar estrutura de ${m.title}`,
            minutes: 15,
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: `Construir implementação prática`,
            minutes: Math.max(15, m.minutes - 30),
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: `Revisar e integrar ao projeto macro`,
            minutes: 15,
            done: false,
          },
        ],
        immediate: `Planejar estrutura de ${m.title}`,
        clarity: 'Módulo inteligente desenhado para decompor a complexidade da ideia.',
        pivots: [],
        notes: [],
      }));

      setData(prev => ({
        ...prev,
        ideas: [...newSubIdeas, ...prev.ideas.map(i => (i.id === idea.id ? { ...i, isProject: true } : i))],
      }));
      toast.info('Módulos gerados pelo motor cognitivo local.');
    } finally {
      setIsGeneratingSubAi(false);
    }
  };

  const handleUnlinkSubIdea = (subId: string) => {
    setData(prev => ({
      ...prev,
      ideas: prev.ideas.map(i => (i.id === subId ? { ...i, parentId: undefined } : i)),
    }));
    toast.success('Módulo desvinculado. Agora é uma ideia individual.');
  };

  return (
    <Drawer
      open={Boolean(ideaId)}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DrawerContent className="max-h-[94vh]">
        <div className="sheet-body max-w-4xl mx-auto w-full">
          {/* Breadcrumb de Projeto Pai (se esta ideia for um módulo filho) */}
          {parentIdea && (
            <div className="mb-3 flex items-center justify-between p-2.5 rounded-lg bg-primary/10 border border-primary/25 text-xs text-primary">
              <div className="flex items-center gap-2 truncate">
                <FolderTree size={14} className="shrink-0" />
                <span className="text-muted-foreground shrink-0">Módulo pertencente ao projeto:</span>
                <strong className="truncate font-semibold">{parentIdea.title}</strong>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-primary hover:text-primary-foreground px-2 gap-1 shrink-0"
                onClick={() => {
                  setCurrentIdeaId(parentIdea.id);
                  setTab('overview');
                }}
              >
                <span>Ver Projeto</span>
                <ArrowRight size={12} />
              </Button>
            </div>
          )}

          {/* Banner de Ideia Arquivada */}
          {idea.archived && (
            <div className="mb-3 p-3 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-between text-xs text-amber">
              <span className="flex items-center gap-2">
                <Archive size={14} />
                Esta ideia está arquivada. Ela fica guardada no seu histórico sem poluir o funil ativo.
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-amber/40 text-amber hover:bg-amber/20 gap-1"
                onClick={() => {
                  updateIdea(idea.id, { archived: false, archivedAt: undefined });
                  toast.success('Ideia restaurada para o funil ativo! ✨');
                }}
              >
                <ArchiveRestore size={12} />
                Restaurar Ideia
              </Button>
            </div>
          )}

          {/* Cabeçalho */}
          <div className="flex items-center justify-between gap-3">
            <div className="sheet-eyebrow">
              <Sparkles size={15} />
              {idea.isProject || activeSubIdeas.length > 0 ? 'PROJETO MACRO & MÓDULOS' : 'DASHBOARD DE REALIZAÇÃO'}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={idea.isProject ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => {
                  const newIsProj = !idea.isProject;
                  updateIdea(idea.id, { isProject: newIsProj });
                  toast.success(newIsProj ? 'Ideia configurada como Projeto Macro (com suporte a módulos) 📁' : 'Projeto Macro desativado.');
                }}
                title="Projetos Macro permitem decompor ideias complexas em múltiplos módulos (ex: Front-end, Back-end)"
              >
                <FolderTree size={13} className={idea.isProject ? 'text-primary' : ''} />
                <span>{idea.isProject ? 'Projeto Macro' : 'Tornar Projeto'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-xs gap-1.5 ${idea.archived ? 'text-amber' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => {
                  const newArchived = !idea.archived;
                  updateIdea(idea.id, {
                    archived: newArchived,
                    archivedAt: newArchived ? localDate() : undefined,
                  });
                  toast.success(newArchived ? 'Ideia arquivada com sucesso.' : 'Ideia restaurada com sucesso.');
                }}
                title={idea.archived ? 'Restaurar para o funil ativo' : 'Arquivar esta ideia'}
              >
                {idea.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                <span className="hidden sm:inline">{idea.archived ? 'Desarquivar' : 'Arquivar'}</span>
              </Button>

              <span className={`sector-tag tone-${stageTones[idea.stage]}`}>
                {stageNames[idea.stage]} ({completionPercent}%)
              </span>
            </div>
          </div>

          {/* Badges de Workspace, Setor e Responsável */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {idea.workspace === 'business' ? (
              <span className="text-[11px] bg-violet/15 text-violet border border-violet/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Building2 size={11} />
                Workspace Empresarial
              </span>
            ) : (
              <span className="text-[11px] bg-secondary/80 text-muted-foreground border border-border/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <User size={11} />
                Workspace Pessoal
              </span>
            )}

            {idea.department && (
              <span className="text-[11px] bg-cyan/15 text-cyan border border-cyan/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <Tag size={11} />
                {idea.department}
              </span>
            )}

            {idea.assignedTo && (
              <span className="text-[11px] bg-primary/15 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <Users size={11} />
                Responsável: {idea.assignedTo}
              </span>
            )}
          </div>

          <DrawerTitle className="sheet-title mt-2">{idea.title}</DrawerTitle>
          <DrawerDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {idea.summary}
          </DrawerDescription>

          {/* Abas de Navegação */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 my-4 border-b border-border/70 scrollbar-none">
            <Button
              variant={tab === 'overview' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('overview')}
            >
              <BarChart2 size={13} />
              Visão Geral
            </Button>
            <Button
              variant={tab === 'steps' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('steps')}
            >
              <ListTodo size={13} />
              Passos ({completedStepsCount}/{totalStepsCount})
            </Button>
            <Button
              variant={tab === 'subideas' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('subideas')}
            >
              <FolderTree size={13} className={activeSubIdeas.length > 0 ? 'text-primary' : ''} />
              Ideias do Projeto ({activeSubIdeas.length})
            </Button>
            <Button
              variant={tab === 'pivots' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('pivots')}
            >
              <GitFork size={13} />
              Mudança de Rota ({idea.pivots?.length ?? 0})
            </Button>
            <Button
              variant={tab === 'notes' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('notes')}
            >
              <BookOpen size={13} />
              Diário & Notas ({idea.notes?.length ?? 0})
            </Button>
            <Button
              variant={tab === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('calendar')}
            >
              <CalendarDays size={13} />
              Calendário & Agenda
            </Button>
            <Button
              variant={tab === 'coach' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => setTab('coach')}
            >
              <Compass size={13} />
              IA Coach
            </Button>
          </div>

          {/* Conteúdo das Abas */}

          {/* ABA 1: VISÃO GERAL & MÉTRICAS */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Gráficos e Métricas Chave */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-card/80 border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      Progresso das Etapas
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <strong className="text-3xl font-display font-medium text-foreground">
                        {completionPercent}%
                      </strong>
                      <span className="text-xs text-muted-foreground">
                        ({completedStepsCount} de {totalStepsCount} passos)
                      </span>
                    </div>
                  </div>
                  <progress value={completedStepsCount} max={Math.max(1, totalStepsCount)} className="mt-4" />
                </div>

                <div className="p-4 rounded-lg bg-card/80 border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      Tempo de Foco
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <strong className="text-3xl font-display font-medium text-primary">
                        {formatMinutes(idea.dedicated)}
                      </strong>
                      <span className="text-xs text-muted-foreground">de {formatMinutes(idea.minutes)} estimados</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5">
                    <Clock3 size={13} className="text-primary" />
                    {idea.dedicated >= idea.minutes
                      ? 'Meta de tempo atingida!'
                      : `Faltam cerca de ${formatMinutes(Math.max(0, idea.minutes - idea.dedicated))}`}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card/80 border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      Estágio Atual
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xl font-display font-semibold text-foreground">
                        {stageNames[idea.stage]}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    {stageNames.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i <= idea.stage ? 'bg-primary' : 'bg-secondary'
                        } transition-colors`}
                        title={`Estágio ${i + 1}: ${stageNames[i]}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Gráfico Visual Recharts */}
              {mounted && (
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <span className="text-xs font-semibold text-muted-foreground block mb-3">
                    Comparativo de Minutos (Dedicado vs Previsto)
                  </span>
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <XAxis type="number" unit="m" stroke="var(--muted-foreground)" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            fontSize: '12px',
                          }}
                          formatter={(value: any) => [`${value} minutos`, 'Duração']}
                        />
                        <Bar dataKey="minutos" radius={[0, 4, 4, 0]}>
                          {timeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Card de Contexto & Atribuição de Equipe */}
              <div className="p-4 rounded-xl border border-border/70 bg-card/70 space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={14} className="text-violet" />
                  Contexto de Workspace & Atribuição
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Espaço / Workspace</label>
                    <select
                      className="text-field text-xs py-1.5 w-full"
                      value={idea.workspace ?? 'personal'}
                      onChange={e => {
                        const newWs = e.target.value as 'personal' | 'business';
                        updateIdea(idea.id, { workspace: newWs });
                        toast.success(newWs === 'business' ? 'Movido para o Workspace da Empresa! 🏢' : 'Movido para o Espaço Pessoal 👤');
                      }}
                    >
                      <option value="personal">👤 Espaço Pessoal</option>
                      <option value="business">🏢 Workspace Empresarial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Setor / Departamento</label>
                    <select
                      className="text-field text-xs py-1.5 w-full"
                      value={idea.sector}
                      onChange={e => {
                        const newSecId = e.target.value;
                        const allSectors = [
                          ...data.sectors,
                          ...(data.companyWorkspace?.sectors ?? defaultCompanySectors),
                        ];
                        const secObj = allSectors.find(s => s.id === newSecId);
                        updateIdea(idea.id, {
                          sector: newSecId,
                          department: secObj ? secObj.name : undefined,
                        });
                        toast.success('Setor atualizado!');
                      }}
                    >
                      <optgroup label="Setores Pessoais">
                        {data.sectors.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Departamentos da Empresa">
                        {(data.companyWorkspace?.sectors ?? defaultCompanySectors).map(s => (
                          <option key={`biz-${s.id}`} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Responsável na Equipe</label>
                    <select
                      className="text-field text-xs py-1.5 w-full"
                      value={idea.assignedTo ?? ''}
                      onChange={e => {
                        const newResp = e.target.value || undefined;
                        updateIdea(idea.id, { assignedTo: newResp });
                        toast.success(newResp ? `Atribuído a ${newResp}` : 'Atribuição removida');
                      }}
                    >
                      <option value="">Nenhum (Livre)</option>
                      {(data.companyWorkspace?.members ?? []).map(m => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Card de Módulos para Projetos Macro */}
              {(idea.isProject || activeSubIdeas.length > 0) && (
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <FolderTree size={14} />
                      Estrutura do Projeto Macro ({projectStats.totalSub} módulos)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-primary px-2 gap-1"
                      onClick={() => setTab('subideas')}
                    >
                      <span>Gerenciar Módulos</span>
                      <ArrowRight size={12} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{projectStats.completedSub} de {projectStats.totalSub} módulos realizados</span>
                    <strong className="text-foreground font-semibold">{projectStats.percent}%</strong>
                  </div>
                  <progress value={projectStats.percent} max={100} />

                  {activeSubIdeas.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {activeSubIdeas.slice(0, 4).map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setCurrentIdeaId(sub.id)}
                          className="p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/50 text-left transition-all cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-medium text-foreground truncate block">{sub.title}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {stageNames[sub.stage]} · {formatMinutes(sub.minutes)}
                            </span>
                          </div>
                          <ArrowRight size={12} className="text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Card dos 5 Porquês (Propósito Raiz) */}
              <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber/15 text-amber border border-amber/30 text-xs font-bold flex items-center justify-center shrink-0">
                      5P
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        Propósito Raiz: Técnica dos 5 Porquês
                        <span className="text-[10px] text-muted-foreground font-normal">
                          ({(idea.fiveWhys || []).filter(w => w.trim()).length}/5 respondidos)
                        </span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        A motivação profunda e os obstáculos que guiam o plano de ação desta realização.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10 cursor-pointer"
                      onClick={() => setEditingFiveWhys(!editingFiveWhys)}
                    >
                      <Pencil size={12} />
                      <span>{editingFiveWhys ? 'Fechar Edição' : (idea.fiveWhys?.length ? 'Editar Porquês' : 'Definir 5 Porquês')}</span>
                    </Button>
                  </div>
                </div>

                {editingFiveWhys ? (
                  <div className="space-y-3 pt-2 border-t border-border/60 animate-in fade-in-50 duration-200">
                    {FIVE_WHYS_QUESTIONS.map((q, idx) => (
                      <div key={q.step} className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground block">
                          <strong className="text-primary mr-1">{q.step}º Por quê:</strong>
                          {q.question}
                        </label>
                        <input
                          type="text"
                          value={localFiveWhys[idx] || ''}
                          onChange={e => {
                            const updated = [...localFiveWhys];
                            updated[idx] = e.target.value;
                            setLocalFiveWhys(updated);
                          }}
                          placeholder={q.placeholder}
                          className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSuggestingWhysDetail}
                        className="h-7 text-[11px] gap-1 text-primary border-primary/30 cursor-pointer"
                        onClick={handleSuggestWhysInDetail}
                      >
                        <Sparkles size={11} className={isSuggestingWhysDetail ? 'animate-spin' : ''} />
                        <span>{isSuggestingWhysDetail ? 'Sugerindo...' : 'Sugerir com IA'}</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        className="h-7 text-xs px-3 cursor-pointer"
                        onClick={handleSaveFiveWhysInDetail}
                      >
                        <Check size={12} className="mr-1" />
                        Salvar 5 Porquês
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {idea.fiveWhys && idea.fiveWhys.some(w => w.trim()) ? (
                      <div className="grid grid-cols-1 gap-2">
                        {idea.fiveWhys.map((why, idx) => {
                          const q = FIVE_WHYS_QUESTIONS[idx];
                          if (!why.trim()) return null;
                          return (
                            <div key={idx} className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-xs">
                              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block mb-0.5">
                                {idx + 1}º Por quê: {q?.question}
                              </span>
                              <p className="text-foreground/90 text-xs leading-relaxed">{why}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 text-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
                        Nenhum porquê registrado ainda. Clique em &ldquo;Definir 5 Porquês&rdquo; para registrar a raiz da ideia!
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Informações de Configuração da Ideia */}
              <div className="detail-fields">
                <label>
                  Setor
                  <select value={idea.sector} onChange={e => updateIdea(idea.id, { sector: e.target.value })}>
                    {data.sectors.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Prioridade
                  <select
                    value={idea.priority}
                    onChange={e => updateIdea(idea.id, { priority: e.target.value as Idea['priority'] })}
                  >
                    {['Urgente', 'Importante', 'Normal'].map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Próximo Passo Imediato */}
              <div className="immediate-action">
                <span>
                  <Sparkles size={16} />
                  PRÓXIMA AÇÃO RECOMENDADA · 15 MIN
                </span>
                <p>{idea.immediate}</p>
              </div>

              {/* Escopo Resumido */}
              <div className="p-3.5 rounded-lg border border-border/70 bg-card/60 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <GitFork size={13} className="text-primary" />
                    Escopo Atual Definido
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary px-2"
                    onClick={() => setTab('pivots')}
                  >
                    Editar / Mudar Rota
                  </Button>
                </div>
                <p className="text-foreground leading-relaxed">
                  {idea.scope || 'Nenhum escopo formal delimitado ainda. Defina os limites na aba Mudança de Rota.'}
                </p>
              </div>

              {/* Ações Primárias */}
              <div className="sheet-actions">
                <Button
                  className="primary-action gap-2"
                  onClick={() => {
                    onClose();
                    onFocus(idea);
                  }}
                >
                  <Play size={16} />
                  Começar sessão de foco agora
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    updateIdea(idea.id, { day: localDate(), block: 'Manhã' });
                    toast.success('Ideia adicionada ao seu dia (Manhã)');
                  }}
                >
                  <CalendarPlus size={16} />
                  Planejar para hoje
                </Button>
              </div>

              {/* Mudança de Estágio no Funil */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                {idea.stage < 4 ? (
                  <Button
                    variant="ghost"
                    className="text-primary gap-1.5"
                    onClick={() => {
                      const next = (idea.stage + 1) as Stage;
                      updateIdea(idea.id, { stage: next });
                      toast.success(`Avançado para ${stageNames[next]}! 🚀`);
                    }}
                  >
                    Avançar para {stageNames[idea.stage + 1]}
                    <ArrowRight size={15} />
                  </Button>
                ) : (
                  <span className="text-green flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 size={18} />
                    Esta ideia é uma Realidade concluída!
                  </span>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  aria-label="Excluir ideia"
                  onClick={() => {
                    if (window.confirm('Excluir esta ideia definitivamente?')) {
                      setData(p => ({ ...p, ideas: p.ideas.filter(i => i.id !== idea.id) }));
                      onClose();
                      toast.success('Ideia removida.');
                    }
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* ABA 2: PASSOS & CHECKLIST */}
          {tab === 'steps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Checklist de Realização</h3>
                  <p className="text-xs text-muted-foreground">
                    Marque os passos à medida que executa ou adicione novos passos.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleSuggestStepsAi}>
                  <Sparkles size={13} className="text-primary" />
                  Sugerir passos com IA
                </Button>
              </div>

              {/* Lista Interativa de Passos */}
              <div className="space-y-2">
                {idea.steps.map((step, index) => (
                  <div
                    key={step.id ?? index}
                    draggable
                    onDragStart={() => setDraggedStepIdx(index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      if (draggedStepIdx !== null && draggedStepIdx !== index) {
                        handleMoveStep(draggedStepIdx, index);
                        setDraggedStepIdx(null);
                      }
                    }}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all ${
                      draggedStepIdx === index
                        ? 'opacity-50 border-primary border-dashed scale-[0.99]'
                        : step.done
                        ? 'bg-secondary/40 border-border/50 text-muted-foreground'
                        : 'bg-card border-border hover:border-border-highlight'
                    }`}
                  >
                    {/* Alça de Arraste e Controles Subir/Descer */}
                    <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 select-none">
                      <div
                        className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground"
                        title="Arraste para cima ou para baixo para reordenar"
                      >
                        <GripVertical size={13} />
                      </div>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveStep(index, index - 1)}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer"
                          title="Mover passo para cima"
                        >
                          <ChevronUp size={11} />
                        </button>
                        <button
                          type="button"
                          disabled={index === idea.steps.length - 1}
                          onClick={() => handleMoveStep(index, index + 1)}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer"
                          title="Mover passo para baixo"
                        >
                          <ChevronDown size={11} />
                        </button>
                      </div>
                    </div>

                    <button
                      className="check-box cursor-pointer shrink-0 mt-0.5"
                      onClick={() => handleToggleStep(index)}
                      title={step.done ? 'Marcar como não feito' : 'Marcar como concluído'}
                    >
                      {step.done && <Check size={14} className="text-primary" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {editingStepIndex === index ? (
                        <div className="flex items-center gap-2">
                          <textarea
                            rows={2}
                            className="text-xs bg-background border border-primary px-2 py-1.5 rounded w-full text-foreground resize-none leading-relaxed break-words"
                            defaultValue={step.text}
                            autoFocus
                            onBlur={e => {
                              const updated = idea.steps.map((s, i) => (i === index ? { ...s, text: e.target.value } : s));
                              updateIdea(idea.id, { steps: updated });
                              setEditingStepIndex(null);
                            }}
                          />
                        </div>
                      ) : (
                        <span
                          className={`text-xs block cursor-pointer select-none leading-relaxed break-words ${
                            step.done ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                          onClick={() => handleToggleStep(index)}
                        >
                          {step.text}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-muted-foreground font-mono shrink-0 pt-0.5">{step.minutes}m</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                      title="Editar texto"
                      onClick={() => setEditingStepIndex(editingStepIndex === index ? null : index)}
                    >
                      <Pencil size={12} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      title="Excluir passo"
                      onClick={() => handleDeleteStep(index)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Formulário para Adicionar Novo Passo */}
              <div className="p-3.5 rounded-lg border border-dashed border-border bg-card/40 mt-4">
                <span className="text-xs font-semibold text-muted-foreground block mb-2">
                  Adicionar Novo Passo
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    rows={2}
                    className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground resize-none leading-relaxed break-words"
                    placeholder="Ex: Agendar reunião de alinhamento com 2 pessoas..."
                    value={newStepText}
                    onChange={e => setNewStepText(e.target.value)}
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      className="w-24 bg-background border border-border rounded px-2 h-8 text-xs"
                      value={newStepMinutes}
                      onChange={e => setNewStepMinutes(Number(e.target.value))}
                    >
                      <option value={10}>10 min</option>
                      <option value={15}>15 min</option>
                      <option value={25}>25 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1h</option>
                    </select>
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={handleAddStep} disabled={!newStepText.trim()}>
                      <Plus size={14} />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA SUB-IDEIAS & MÓDULOS DE PROJETOS COMPLEXOS */}
          {tab === 'subideas' && (
            <div className="space-y-6">
              {/* Painel de Métricas do Projeto */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                      <FolderTree size={16} className="text-primary" />
                      Estrutura de Módulos do Projeto
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Projetos complexos podem conter várias ideias e frentes de desenvolvimento (ex: front-end, back-end, marketing).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isGeneratingSubAi}
                      className="h-8 text-xs gap-1.5"
                      onClick={handleGenerateAiSubModules}
                      title="Sugerir ideias e frentes com IA para este projeto"
                    >
                      {isGeneratingSubAi ? (
                        <>
                          <Clock3 size={13} className="text-primary animate-spin" />
                          Planejando com IA...
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} className="text-primary" />
                          Sugerir Ideias com IA ✨
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => setShowSubIdeaForm(!showSubIdeaForm)}
                    >
                      <Plus size={14} />
                      {showSubIdeaForm ? 'Cancelar' : '+ Nova Ideia no Projeto'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-card/80 border border-border/70">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total de Ideias</span>
                    <strong className="block text-2xl font-display font-medium text-foreground mt-1">
                      {projectStats.totalSub}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-card/80 border border-border/70">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Realizadas</span>
                    <strong className="block text-2xl font-display font-medium text-green mt-1">
                      {projectStats.completedSub}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-card/80 border border-border/70">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Progresso Geral</span>
                    <strong className="block text-2xl font-display font-medium text-primary mt-1">
                      {projectStats.percent}%
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-card/80 border border-border/70">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Tempo Total</span>
                    <strong className="block text-2xl font-display font-medium text-foreground mt-1">
                      {formatMinutes(projectStats.totalMinutes)}
                    </strong>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Taxa de conclusão agregada</span>
                    <span>{projectStats.percent}%</span>
                  </div>
                  <progress value={projectStats.percent} max={100} className="w-full h-2" />
                </div>
              </div>

              {/* Formulário para Adicionar Nova Ideia ao Projeto */}
              {showSubIdeaForm && (
                <div className="p-4 rounded-xl border border-primary/40 bg-card space-y-3.5 shadow-sm">
                  <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <Plus size={14} />
                    Adicionar Nova Ideia a este Projeto
                  </span>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Título da Ideia *</label>
                    <input
                      className="text-field text-xs"
                      placeholder="Ex.: Front-end da loja, API de pagamentos, Campanha de marketing..."
                      value={subIdeaTitle}
                      onChange={e => setSubIdeaTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Objetivo / O que essa ideia resolve</label>
                    <textarea
                      rows={2}
                      className="text-field text-xs resize-none"
                      placeholder="Ex.: Desenvolver os layouts, vitrine e carrinho de compras responsivo..."
                      value={subIdeaSummary}
                      onChange={e => setSubIdeaSummary(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs text-muted-foreground">
                      Prioridade
                      <select
                        className="mt-1"
                        value={subIdeaPriority}
                        onChange={e => setSubIdeaPriority(e.target.value as Idea['priority'])}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Importante">Importante</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </label>

                    <label className="text-xs text-muted-foreground">
                      Tempo Estimado
                      <select
                        className="mt-1"
                        value={subIdeaMinutes}
                        onChange={e => setSubIdeaMinutes(Number(e.target.value))}
                      >
                        <option value={30}>30 min</option>
                        <option value={60}>1h</option>
                        <option value={90}>1h 30min</option>
                        <option value={120}>2h</option>
                        <option value={180}>3h</option>
                      </select>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowSubIdeaForm(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={handleCreateSubIdea}>
                      <Check size={13} />
                      Criar Ideia no Projeto
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de Ideias Vinculadas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    Ideias deste Projeto ({subIdeas.length})
                  </h4>
                  {subIdeas.length > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                      Clique em uma ideia para abrir e executar seus passos no funil
                    </span>
                  )}
                </div>

                {subIdeas.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-border/80 text-center space-y-3">
                    <FolderTree size={32} className="mx-auto text-muted-foreground/60" />
                    <div className="max-w-md mx-auto">
                      <h4 className="font-semibold text-sm text-foreground">Nenhuma ideia adicionada ainda neste projeto</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Quebre o escopo deste projeto em ideias menores e focadas (como Front-end, Back-end, Marketing, etc.) para acelerar a execução.
                      </p>
                    </div>
                    <div className="flex justify-center gap-2 pt-2">
                      <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowSubIdeaForm(true)}>
                        <Plus size={13} />
                        Criar Primeira Ideia
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleGenerateAiSubModules}>
                        <Sparkles size={13} className="text-primary" />
                        Sugerir Ideias com IA
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {subIdeas.map(sub => {
                      const subCompleted = sub.steps.filter(s => s.done).length;
                      const subTotal = sub.steps.length;
                      const subPercent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;

                      return (
                        <div
                          key={sub.id}
                          className={`p-4 rounded-xl border transition-all ${
                            sub.archived
                              ? 'bg-secondary/30 border-border/50 opacity-70'
                              : 'bg-card border-border hover:border-primary/40'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`sector-tag tone-${stageTones[sub.stage]}`}>
                                {stageNames[sub.stage]} ({subPercent}%)
                              </span>
                              {sub.archived && (
                                <span className="text-[10px] bg-amber/20 text-amber px-1.5 py-0.5 rounded font-medium">
                                  Arquivado
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock3 size={12} />
                                {formatMinutes(sub.minutes)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs gap-1 text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setCurrentIdeaId(sub.id);
                                  setTab('overview');
                                }}
                                title="Abrir painel e checklist desta ideia"
                              >
                                <span>Abrir Ideia</span>
                                <ArrowRight size={12} />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => handleUnlinkSubIdea(sub.id)}
                                title="Desvincular ideia do projeto (tornar ideia avulsa)"
                              >
                                Desvincular
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-amber"
                                onClick={() => {
                                  updateIdea(sub.id, { archived: !sub.archived });
                                  toast.success(sub.archived ? 'Ideia restaurada!' : 'Ideia arquivada!');
                                }}
                                title={sub.archived ? 'Restaurar ideia' : 'Arquivar ideia'}
                              >
                                {sub.archived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                              </Button>
                            </div>
                          </div>

                          <h4 className="font-semibold text-sm text-foreground">{sub.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{sub.summary}</p>

                          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Checklist: {subCompleted} de {subTotal} passos</span>
                            <span>{subPercent}%</span>
                          </div>
                          <progress value={subCompleted} max={Math.max(1, subTotal)} className="mt-1" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 4: MUDANÇA DE ROTA & ESCOPO (PIVÔ) */}
          {tab === 'pivots' && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Compass size={16} className="text-primary" />
                    Definição Atual de Escopo
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1"
                    onClick={() => setShowPivotForm(!showPivotForm)}
                  >
                    <GitFork size={13} />
                    {showPivotForm ? 'Fechar Formulário' : '+ Registrar Mudança de Rota'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {idea.scope || 'Nenhum escopo delimitado ainda. Defina os limites abaixo.'}
                </p>
              </div>

              {/* Formulário de Mudança de Rota */}
              {showPivotForm && (
                <div className="p-4 rounded-lg border border-primary/40 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <Sparkles size={14} />
                      Novo Registro de Mudança de Rota / Pivô
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs text-muted-foreground">
                      Tipo de Mudança
                      <select
                        className="mt-1"
                        value={pivotType}
                        onChange={e => setPivotType(e.target.value as PivotRecord['type'])}
                      >
                        <option value="Redução de Escopo">Redução de Escopo (Simplificar para entregar rápido)</option>
                        <option value="Expansão de Escopo">Expansão de Escopo (Novas ambições e escala)</option>
                        <option value="Mudança de Rota">Mudança de Rota (Pivô de público, canal ou produto)</option>
                        <option value="Pausa Estratégica">Pausa Estratégica (Congelar temporariamente)</option>
                      </select>
                    </label>

                    <label className="text-xs text-muted-foreground">
                      Novo Escopo do Projeto
                      <input
                        className="text-field mt-1 text-xs"
                        placeholder="Ex.: Focar apenas na versão web inicial..."
                        value={newScope}
                        onChange={e => setNewScope(e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="text-xs text-muted-foreground block">
                    Motivo da Mudança (Por que decidimos mudar de rumo?) *
                    <textarea
                      className="text-field mt-1 text-xs resize-none"
                      rows={2}
                      placeholder="Ex: Percebemos que 80% do valor estava na funcionalidade de busca e o restante estava gerando atrito..."
                      value={pivotReason}
                      onChange={e => setPivotReason(e.target.value)}
                    />
                  </label>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowPivotForm(false)}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs gap-1.5 primary-action"
                      onClick={handleSavePivot}
                      disabled={!pivotReason.trim()}
                    >
                      <Check size={14} />
                      Salvar Mudança de Rota
                    </Button>
                  </div>
                </div>
              )}

              {/* Histórico de Mudanças de Rota */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <History size={13} />
                  Histórico de Pivôs e Ajustes de Escopo ({idea.pivots?.length ?? 0})
                </h4>

                {(!idea.pivots || idea.pivots.length === 0) && (
                  <p className="text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                    Nenhuma mudança de rota registrada ainda. Se precisar adaptar o projeto, registre aqui para manter
                    a clareza do porquê o rumo mudou.
                  </p>
                )}

                {idea.pivots?.map(pivot => (
                  <div key={pivot.id} className="p-3.5 rounded-lg border border-border bg-card/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {pivot.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{pivot.date}</span>
                    </div>

                    <div>
                      <strong className="text-foreground block text-xs">Motivo:</strong>
                      <p className="text-muted-foreground mt-0.5">{pivot.reason}</p>
                    </div>

                    <div className="pt-2 border-t border-border/50 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Escopo Anterior:</span>
                        <p className="text-foreground/80 line-clamp-2">{pivot.previousScope}</p>
                      </div>
                      <div>
                        <span className="text-primary font-medium">Novo Escopo:</span>
                        <p className="text-foreground line-clamp-2">{pivot.newScope}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 4: DIÁRIO DE BORDO & NOTAS */}
          {tab === 'notes' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Diário de Bordo & Insights</h3>
                <p className="text-xs text-muted-foreground">
                  Registre aprendizados, conversas, links de referência e anotações do dia a dia.
                </p>
              </div>

              {/* Criar Nova Nota */}
              <div className="p-3 rounded-lg border border-border bg-card">
                <textarea
                  className="w-full bg-transparent border-0 resize-none text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  rows={3}
                  placeholder="Escreva um aprendizado, link ou nota rápida..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <div className="flex justify-end mt-2 pt-2 border-t border-border/50">
                  <Button size="sm" className="h-7 text-xs gap-1" onClick={handleAddNote} disabled={!noteText.trim()}>
                    <Plus size={13} />
                    Adicionar Nota
                  </Button>
                </div>
              </div>

              {/* Lista de Notas */}
              <div className="space-y-2.5">
                {(!idea.notes || idea.notes.length === 0) && (
                  <p className="text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                    Nenhuma anotação registrada ainda.
                  </p>
                )}

                {idea.notes?.map(note => (
                  <div key={note.id} className="p-3 rounded-lg border border-border/70 bg-card/60 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">{note.createdAt}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 5: CALENDÁRIO & AGENDA */}
          {tab === 'calendar' && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-card border border-border space-y-4">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <CalendarDays size={16} className="text-primary" />
                    Agendamento e Prazos
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Conecte esta ideia ao seu calendário pessoal para garantir espaço na sua rotina.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="text-xs text-muted-foreground">
                    Data Planejada de Execução
                    <input
                      type="date"
                      className="text-field mt-1 text-xs"
                      value={idea.day ?? ''}
                      onChange={e => updateIdea(idea.id, { day: e.target.value || undefined })}
                    />
                  </label>

                  <label className="text-xs text-muted-foreground">
                    Bloco do Dia
                    <select
                      className="mt-1"
                      value={idea.block ?? 'Manhã'}
                      onChange={e => updateIdea(idea.id, { block: e.target.value as DayBlock })}
                    >
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                  </label>
                </div>

                <label className="text-xs text-muted-foreground block">
                  Prazo Limite / Meta de Conclusão (Opcional)
                  <input
                    type="date"
                    className="text-field mt-1 text-xs"
                    value={idea.targetDate ?? ''}
                    onChange={e => updateIdea(idea.id, { targetDate: e.target.value || undefined })}
                  />
                </label>
              </div>

              {/* Botões de Integração com Google Agenda e ICS */}
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                <span className="text-xs font-semibold text-primary block">
                  Sincronizar com seu Calendário Externo
                </span>
                <p className="text-xs text-muted-foreground">
                  Crie um evento na sua agenda com os passos e o resumo desta ideia já preenchidos.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => {
                      const url = createGoogleCalendarUrl(idea);
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink size={13} />
                    Abrir no Google Agenda
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => {
                      downloadIcsFile(idea);
                      toast.success('Arquivo .ics gerado com sucesso!');
                    }}
                  >
                    <Download size={13} />
                    Baixar arquivo de agenda (.ics)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ABA 6: IA COACH & DESBLOQUEIO */}
          {tab === 'coach' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-primary/30 bg-card space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Lightbulb size={16} />
                  Diagnóstico de Fricção Mental
                </div>
                <p className="text-xs text-foreground leading-relaxed">{coaching.frictionDiagnosis}</p>
              </div>

              <div className="p-4 rounded-lg border border-amber/30 bg-amber/5 space-y-2">
                <div className="flex items-center gap-2 text-amber font-semibold text-xs">
                  <Sparkles size={15} />
                  Próxima Ação de Alto Impacto
                </div>
                <p className="text-xs text-foreground leading-relaxed">{coaching.recommendedAction}</p>
              </div>

              <div className="p-4 rounded-lg border border-violet/30 bg-violet/5 space-y-2">
                <div className="flex items-center gap-2 text-violet font-semibold text-xs">
                  <AlertCircle size={15} />
                  Pergunta Provocativa para Clareza
                </div>
                <p className="text-xs text-foreground font-medium italic">"{coaching.coachingQuestion}"</p>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full primary-action gap-2"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('ideaflow:mentor', { detail: { idea } }));
                  }}
                >
                  <Sparkles size={16} />
                  Conversar com o Mentor IA sobre esta ideia (100% Gratuito)
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}