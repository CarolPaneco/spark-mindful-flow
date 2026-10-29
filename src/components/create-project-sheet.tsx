import { useState, useEffect } from 'react';
import {
  FolderPlus,
  FolderTree,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Check,
  Layers,
  Compass,
  Calendar,
  Zap,
  ArrowRight,
  Loader2,
  Bot,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import {
  generateSubModulesAi,
  detectSectorFromTitle,
  formatMinutes,
  FIVE_WHYS_QUESTIONS,
  getFiveWhysQuestions,
  suggestFiveWhysOffline,
  defaultCompanySectors,
  defaultTeamMembers,
  initialSectors,
  type Idea,
} from '@/lib/ideaflow';
import { generateProjectModulesWithAi, getActiveGeminiKey } from '@/lib/ai-assistant';
import { suggestFiveWhysWithAi } from '@/lib/integrated-ai';
import { toast } from 'sonner';

interface DraftSubIdea {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  priority: Idea['priority'];
}

interface CreateProjectSheetProps {
  open: boolean;
  onClose: () => void;
  onOpenProject?: (projectId: string) => void;
}

export function CreateProjectSheet({ open, onClose, onOpenProject }: CreateProjectSheetProps) {
  const { data, setData } = useFlow();

  const isBusiness = data.workspaceMode === 'business';
  const currentWhysQuestions = getFiveWhysQuestions(isBusiness);
  const activeSectors = isBusiness
    ? (data.companyWorkspace?.sectors || [])
    : (data.sectors || []);
  const companyMembers = data.companyWorkspace?.members ?? [];

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [sector, setSector] = useState(activeSectors[0]?.id ?? 'none');
  const [sectorManuallyChanged, setSectorManuallyChanged] = useState(false);
  const [priority, setPriority] = useState<Idea['priority']>('Importante');
  const [scope, setScope] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [fiveWhys, setFiveWhys] = useState<string[]>(['', '', '', '', '']);
  const [showFiveWhys, setShowFiveWhys] = useState(false);
  const [suggestingWhys, setSuggestingWhys] = useState(false);

  // Detecção de Desktop (>= 769px) para abrir modal imersivo e amplo no Web
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 769;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 769);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasGeminiKey = Boolean(getActiveGeminiKey());

  // Auto-detecta setor a partir do título se o usuário ainda não escolheu manualmente
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!sectorManuallyChanged && newTitle.trim().length > 3) {
      const detected = detectSectorFromTitle(newTitle, activeSectors);
      if (detected && detected !== sector) {
        setSector(detected);
      }
    }
  };

  // Lista interativa de ideias/frentes dentro do projeto
  const [subIdeas, setSubIdeas] = useState<DraftSubIdea[]>([
    {
      id: 'sub-1',
      title: 'Frente 1: Planejamento & Orçamento',
      summary: 'Levantar referências, materiais e estimar recursos necessários',
      minutes: 60,
      priority: 'Importante',
    },
    {
      id: 'sub-2',
      title: 'Frente 2: Execução do Núcleo Principal',
      summary: 'Mão na massa na entrega essencial do projeto',
      minutes: 120,
      priority: 'Normal',
    },
  ]);

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setSector(data.sectors[0]?.id ?? 'personal');
    setSectorManuallyChanged(false);
    setPriority('Importante');
    setScope('');
    setTargetDate('');
    setIsGeneratingAi(false);
    setFiveWhys(['', '', '', '', '']);
    setShowFiveWhys(false);
    setSubIdeas([
      {
        id: 'sub-1',
        title: 'Frente 1: Planejamento & Orçamento',
        summary: 'Levantar referências, materiais e estimar recursos necessários',
        minutes: 60,
        priority: 'Importante',
      },
      {
        id: 'sub-2',
        title: 'Frente 2: Execução do Núcleo Principal',
        summary: 'Mão na massa na entrega essencial do projeto',
        minutes: 120,
        priority: 'Normal',
      },
    ]);
  };

  const handleAddSubIdea = () => {
    const nextNum = subIdeas.length + 1;
    setSubIdeas(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: `Frente ${nextNum}: Nova ideia do projeto`,
        summary: 'Descreva o objetivo desta frente dentro do projeto',
        minutes: 60,
        priority: 'Normal',
      },
    ]);
  };

  const handleUpdateSubIdea = (id: string, patch: Partial<DraftSubIdea>) => {
    setSubIdeas(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleDeleteSubIdea = (id: string) => {
    setSubIdeas(prev => prev.filter(s => s.id !== id));
  };

  const handleMoveSubIdea = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= subIdeas.length) return;
    const reordered = [...subIdeas];
    const [moved] = reordered.splice(fromIndex, 1);
    if (!moved) return;
    reordered.splice(toIndex, 0, moved);
    setSubIdeas(reordered);
  };

  const handleSuggestWhys = async () => {
    if (!title.trim() && !summary.trim()) {
      toast.info('Dê um título ao projeto primeiro para sugerirmos os 5 porquês.');
      return;
    }
    setSuggestingWhys(true);
    try {
      const suggestions = await suggestFiveWhysWithAi(`${title}. ${summary}`);
      if (suggestions && suggestions.length > 0) {
        setFiveWhys(suggestions);
        setShowFiveWhys(true);
        toast.success('5 Porquês gerados com IA! Você pode editar as respostas.');
      }
    } catch {
      const offline = suggestFiveWhysOffline(`${title}. ${summary}`, isBusiness);
      setFiveWhys(offline);
      setShowFiveWhys(true);
      toast.success(
        isBusiness
          ? 'Perguntas estratégicas do projeto preenchidas pela IA! 🏢'
          : '5 Porquês sugeridos com sucesso!'
      );
    } finally {
      setSuggestingWhys(false);
    }
  };

  const handleGenerateAiModules = async () => {
    if (!title.trim()) {
      toast.info('Dê um título ao projeto primeiro para a IA sugerir as melhores ideias/frentes.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const result = await generateProjectModulesWithAi(title, summary, sector, fiveWhys);
      const formatted: DraftSubIdea[] = result.modules.map(m => ({
        id: crypto.randomUUID(),
        title: m.title,
        summary: m.summary,
        minutes: m.minutes,
        priority: 'Normal',
      }));

      setSubIdeas(formatted);

      if (result.provider === 'groq') {
        toast.success(`Groq LLaMA 3.3 gerou ${formatted.length} frentes personalizadas para “${title}”! ⚡`);
      } else if (result.provider === 'gemini') {
        toast.success(`Google Gemini gerou ${formatted.length} frentes personalizadas para “${title}”! ✨`);
      } else {
        toast.success(`Motor Local Inteligente gerou ${formatted.length} frentes para seu projeto! ✨`);
      }
    } catch (err: any) {
      // Fallback direto
      const fallback = generateSubModulesAi(title, summary, sector, fiveWhys);
      setSubIdeas(fallback.map(m => ({
        id: crypto.randomUUID(),
        title: m.title,
        summary: m.summary,
        minutes: m.minutes,
        priority: 'Normal',
      })));
      toast.info('Ideias geradas pelo motor cognitivo local.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreateProject = () => {
    if (!title.trim()) {
      toast.error('Informe o nome do projeto.');
      return;
    }

    const projectId = crypto.randomUUID();
    const validSubIdeas = subIdeas.filter(s => s.title.trim().length > 0);

    const childIdeas: Idea[] = validSubIdeas.map((sub, index) => {
      const duration = Number(sub.minutes) || 60;
      return {
        id: crypto.randomUUID(),
        title: sub.title.trim(),
        summary: sub.summary.trim() || `Frente de desenvolvimento do projeto ${title.trim()}`,
        sector,
        priority: sub.priority,
        stage: 0,
        parentId: projectId,
        workspace: isBusiness ? 'business' : 'personal',
        companyId: isBusiness && data.companyWorkspace?.id ? data.companyWorkspace.id : undefined,
        department: isBusiness
          ? (activeSectors.find(s => s.id === sector)?.name ?? sector)
          : undefined,
        minutes: duration,
        dedicated: 0,
        scope: `Escopo específico da frente: ${sub.title.trim()}`,
        steps: [
          {
            id: crypto.randomUUID(),
            text: `Definir entrega principal de “${sub.title.trim()}”`,
            minutes: 15,
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: `Construir primeira versão funcional da frente`,
            minutes: Math.max(15, duration - 30),
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: `Validar e integrar ao projeto macro ${title.trim()}`,
            minutes: 15,
            done: false,
          },
        ],
        immediate: `Definir entrega principal de “${sub.title.trim()}”`,
        clarity: `Frente ${index + 1} estruturada dentro do projeto.`,
        pivots: [],
        notes: [],
      };
    });

    const projectDuration = childIdeas.reduce((sum, c) => sum + c.minutes, 60);

    const projectIdea: Idea = {
      id: projectId,
      title: title.trim(),
      summary:
        summary.trim() ||
        `Projeto macro contendo ${childIdeas.length} frentes de desenvolvimento integradas.`,
      sector,
      priority,
      stage: 0,
      isProject: true,
      workspace: isBusiness ? 'business' : 'personal',
      companyId: isBusiness && data.companyWorkspace?.id ? data.companyWorkspace.id : undefined,
      department: isBusiness
        ? (activeSectors.find(s => s.id === sector)?.name ?? sector)
        : undefined,
      fiveWhys: fiveWhys.filter(w => w.trim()).length > 0 ? fiveWhys : undefined,
      scope:
        scope.trim() ||
        'Projeto estruturado com frentes modulares para execução clara e sem sobrecarga.',
      targetDate: targetDate || undefined,
      minutes: projectDuration,
      dedicated: 0,
      steps: [
        {
          id: crypto.randomUUID(),
          text: `Revisar o escopo e prioridades das ${childIdeas.length} frentes do projeto`,
          minutes: 15,
          done: false,
        },
        {
          id: crypto.randomUUID(),
          text: `Avançar o primeiro módulo prioritário no funil`,
          minutes: 30,
          done: false,
        },
        {
          id: crypto.randomUUID(),
          text: `Alinhar entregas e verificar integração entre os módulos`,
          minutes: 15,
          done: false,
        },
      ],
      immediate: `Revisar o escopo e prioridades das ${childIdeas.length} frentes do projeto`,
      clarity: 'Projetos organizados em frentes tornam o grande objetivo palpável e leve.',
      pivots: [],
      notes: [],
    };

    setData(prev => ({
      ...prev,
      ideas: [projectIdea, ...childIdeas, ...prev.ideas],
    }));

    toast.success(
      `Projeto “${title.trim()}” criado com ${childIdeas.length} ideias dentro! 🚀`
    );

    resetForm();
    onClose();

    if (onOpenProject) {
      setTimeout(() => onOpenProject(projectId), 100);
    }
  };

  const totalEstimatedMinutes = subIdeas.reduce(
    (acc, curr) => acc + (Number(curr.minutes) || 0),
    0
  );

  const content = (
    <div className="sheet-body max-w-4xl mx-auto w-full p-2 sm:p-4">
      {/* Eyebrow & Título */}
      <div className="flex items-center justify-between gap-3">
        <div className="sheet-eyebrow text-violet">
          <FolderPlus size={15} />
          NOVO PROJETO MACRO · ESTRUTURA ORGANIZADA
        </div>
        <span className="text-xs bg-violet/15 text-violet border border-violet/30 px-2 py-0.5 rounded font-medium">
          Multi-Ideias
        </span>
      </div>

      <h2 className="sheet-title text-2xl sm:text-3xl font-display font-bold text-foreground mt-2">
        Criar Novo Projeto
      </h2>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
            <DrawerDescription className="text-sm text-muted-foreground leading-relaxed flex-1">
              Projetos permitem organizar um escopo maior contendo várias ideias ou módulos dentro (ex:
              Reforma da Cozinha, Site de Vendas, Encontro de Família).
            </DrawerDescription>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${
                hasGeminiKey
                  ? 'bg-green/10 border-green/30 text-green'
                  : 'bg-primary/10 border-primary/30 text-primary'
              }`}
            >
              <Bot size={12} />
              {hasGeminiKey ? 'Gemini AI Conectado ✨' : 'Motor Cognitivo Local (100% Offline)'}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {/* 1. Informações Básicas do Projeto */}
            <div className="space-y-4 p-4 rounded-xl border border-border/80 bg-card/70">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Nome do Projeto *
                </label>
                <input
                  className="text-field text-sm font-display font-medium"
                  placeholder="Ex.: Reformar minha cozinha / Fazer um bolo de cenoura..."
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Objetivo / Resumo Geral
                </label>
                <textarea
                  rows={2}
                  className="text-field text-xs resize-none"
                  placeholder="Ex.: Trocar piso e armários sob medida, instalar iluminação em LED e criar espaço acolhedor..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-xs text-muted-foreground">
                  Setor
                  <select
                    className="mt-1"
                    value={sector}
                    onChange={e => {
                      setSector(e.target.value);
                      setSectorManuallyChanged(true);
                    }}
                  >
                    <option value="none">Sem setor</option>
                    {activeSectors.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs text-muted-foreground">
                  Prioridade
                  <select
                    className="mt-1"
                    value={priority}
                    onChange={e => setPriority(e.target.value as Idea['priority'])}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Importante">Importante</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </label>

                <label className="text-xs text-muted-foreground">
                  Prazo Alvo (Opcional)
                  <input
                    type="date"
                    className="text-field mt-1 text-xs"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Definição de Escopo (O que está incluído neste projeto?)
                </label>
                <textarea
                  rows={2}
                  className="text-field text-xs resize-none"
                  placeholder="Ex.: Inclui planejamento financeiro, alvenaria, armários e pintura. Não inclui eletros novos na primeira fase."
                  value={scope}
                  onChange={e => setScope(e.target.value)}
                />
              </div>

              {/* Seção Interativa dos 5 Porquês do Projeto */}
              <div className="rounded-xl border border-border/80 bg-secondary/35 p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-amber/15 text-amber border border-amber/30 text-xs font-bold flex items-center justify-center shrink-0">
                      5P
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {isBusiness ? '5 Porquês Corporativos do Projeto' : 'Técnica dos 5 Porquês do Projeto'}
                        <span className="text-[10.5px] font-medium px-1.5 py-0.2 rounded-full bg-secondary text-primary border border-primary/25">
                          {fiveWhys.filter(w => w.trim()).length}/5 preenchidos
                        </span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {isBusiness
                          ? 'Alinhe a meta estratégica, ROI e recursos para a IA sugerir frentes de trabalho da equipe.'
                          : 'Defina o propósito raiz para a IA sugerir frentes de trabalho cirúrgicas.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {title.trim().length > 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={suggestingWhys}
                        className="h-7 text-[11px] px-2.5 gap-1 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer shadow-xs active:scale-95"
                        onClick={handleSuggestWhys}
                        title="Usar IA para sugerir os 5 porquês do projeto"
                      >
                        <Sparkles size={11} className={suggestingWhys ? 'animate-spin' : ''} />
                        <span>{suggestingWhys ? 'Pensando...' : 'Sugerir com IA'}</span>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setShowFiveWhys(!showFiveWhys)}
                    >
                      {showFiveWhys ? (
                        <>
                          <span>Ocultar</span>
                          <ChevronUp size={14} className="ml-1" />
                        </>
                      ) : (
                        <>
                          <span>Abrir Perguntas ({fiveWhys.filter(w => w.trim()).length}/5)</span>
                          <ChevronDown size={14} className="ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {showFiveWhys && (
                  <div className="mt-3.5 space-y-3 pt-3 border-t border-border/60 animate-in fade-in-50 duration-200">
                    {currentWhysQuestions.map((q, idx) => (
                      <div key={q.step} className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground flex items-center justify-between">
                          <span>
                            <strong className="text-primary mr-1">{q.step}º Por quê:</strong>
                            {q.question}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={fiveWhys[idx] || ''}
                          onChange={e => {
                            const updated = [...fiveWhys];
                            updated[idx] = e.target.value;
                            setFiveWhys(updated);
                          }}
                          placeholder={q.placeholder}
                          className="w-full text-xs bg-background/80 border border-border rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1">
                      <span>💡 Dica: Ao responder os 5 porquês, a geração das frentes do projeto abaixo fica super alinhada.</span>
                      {fiveWhys.some(w => w.trim()) && (
                        <button
                          type="button"
                          onClick={() => setFiveWhys(['', '', '', '', ''])}
                          className="text-muted-foreground hover:text-pink transition-colors cursor-pointer"
                        >
                          Limpar respostas
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Construtor de Ideias dentro do Projeto */}
            <div className="space-y-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                    <FolderTree size={16} className="text-primary" />
                    Ideias & Frentes dentro deste Projeto ({subIdeas.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Estas são as ideias modulares que compõem o escopo do seu projeto.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isGeneratingAi}
                    className="h-8 text-xs gap-1.5 border-primary/40 bg-card hover:bg-primary/10"
                    onClick={handleGenerateAiModules}
                    title="A IA analisa o nome do projeto e sugere frentes coerentes com o contexto real"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 size={13} className="text-primary animate-spin" />
                        Planejando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} className="text-primary" />
                        Sugerir com IA ✨
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={handleAddSubIdea}
                  >
                    <Plus size={13} />
                    + Adicionar Ideia
                  </Button>
                </div>
              </div>

              {/* Lista de Frentes / Ideias em rascunho */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {subIdeas.map((sub, index) => (
                  <div
                    key={sub.id}
                    draggable
                    onDragStart={() => setDraggedIndex(index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIndex !== null && draggedIndex !== index) {
                        handleMoveSubIdea(draggedIndex, index);
                        setDraggedIndex(null);
                      }
                    }}
                    className={`p-3.5 rounded-lg border bg-card space-y-2 shadow-xs text-xs transition-all ${
                      draggedIndex === index ? 'opacity-50 border-primary border-dashed scale-[0.98]' : 'border-border/80 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {/* Alça e botões de subir/descer */}
                        <div className="flex items-center gap-0.5 select-none">
                          <div
                            className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground"
                            title="Arraste para cima ou para baixo para reordenar"
                          >
                            <GripVertical size={14} />
                          </div>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveSubIdea(index, index - 1)}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer"
                            title="Mover frente para cima"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={index === subIdeas.length - 1}
                            onClick={() => handleMoveSubIdea(index, index + 1)}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer"
                            title="Mover frente para baixo"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>

                        <span className="font-mono text-primary font-bold text-xs flex items-center gap-1.5 ml-1">
                          <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[10px]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          Ideia / Frente
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          className="bg-secondary/40 border border-border/60 rounded px-2 py-0.5 text-[11px] text-foreground cursor-pointer"
                          value={sub.minutes}
                          onChange={e => handleUpdateSubIdea(sub.id, { minutes: Number(e.target.value) })}
                        >
                          <option value={30}>30 min</option>
                          <option value={60}>1h</option>
                          <option value={90}>1h 30m</option>
                          <option value={120}>2h</option>
                          <option value={180}>3h</option>
                        </select>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteSubIdea(sub.id)}
                          title="Remover esta ideia do projeto"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>

                    <input
                      className="text-field text-xs py-1.5 font-medium"
                      placeholder="Título da ideia (ex: Front-end da loja)..."
                      value={sub.title}
                      onChange={e => handleUpdateSubIdea(sub.id, { title: e.target.value })}
                    />

                    <input
                      className="text-field text-xs py-1 text-muted-foreground"
                      placeholder="O que esta ideia entrega (ex: Catálogo visual e carrinho de compras)..."
                      value={sub.summary}
                      onChange={e => handleUpdateSubIdea(sub.id, { summary: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
                <span>Total de ideias no projeto: <strong>{subIdeas.length}</strong></span>
                <span>Tempo total previsto: <strong>{formatMinutes(totalEstimatedMinutes)}</strong></span>
              </div>
            </div>

            {/* 3. Ações Finais */}
            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="outline"
                className="w-1/3 h-11 text-xs"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                className="primary-action flex-1 gap-2 text-xs font-medium"
                disabled={!title.trim()}
                onClick={handleCreateProject}
              >
                <Check size={16} />
                Criar Projeto com {subIdeas.length} {subIdeas.length === 1 ? 'ideia' : 'ideias'}
              </Button>
            </div>
          </div>
    </div>
  );

  // No Desktop / Web: Modal centralizado amplo cobrindo quase toda a tela
  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={isOpen => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className="max-w-5xl w-[94vw] max-h-[92vh] overflow-y-auto p-6 sm:p-10 rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl">
          <DialogTitle className="sr-only">Criar Novo Projeto</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para estruturação e criação de projeto macro com múltiplas ideias.
          </DialogDescription>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // No Mobile: Gaveta inferior fluida (Drawer)
  return (
    <Drawer
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onClose();
      }}
    >
      <DrawerContent className="max-h-[94vh]">
        <DrawerTitle className="sr-only">Criar Novo Projeto</DrawerTitle>
        <DrawerDescription className="sr-only">
          Formulário para estruturação e criação de projeto macro com múltiplas ideias.
        </DrawerDescription>
        {content}
      </DrawerContent>
    </Drawer>
  );
}

