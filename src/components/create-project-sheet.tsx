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
} from 'lucide-react';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import {
  generateSubModulesAi,
  detectSectorFromTitle,
  formatMinutes,
  type Idea,
} from '@/lib/ideaflow';
import { generateProjectModulesWithAi, getActiveGeminiKey } from '@/lib/ai-assistant';
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

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [sector, setSector] = useState(data.sectors[0]?.id ?? 'personal');
  const [sectorManuallyChanged, setSectorManuallyChanged] = useState(false);
  const [priority, setPriority] = useState<Idea['priority']>('Importante');
  const [scope, setScope] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const hasGeminiKey = Boolean(getActiveGeminiKey());

  // Auto-detecta setor a partir do título se o usuário ainda não escolheu manualmente
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!sectorManuallyChanged && newTitle.trim().length > 3) {
      const detected = detectSectorFromTitle(newTitle, data.sectors);
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

  const handleGenerateAiModules = async () => {
    if (!title.trim()) {
      toast.info('Dê um título ao projeto primeiro para a IA sugerir as melhores ideias/frentes.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const result = await generateProjectModulesWithAi(title, summary, sector);
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
      const fallback = generateSubModulesAi(title, summary, sector);
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

  return (
    <Drawer
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onClose();
      }}
    >
      <DrawerContent className="max-h-[94vh]">
        <div className="sheet-body max-w-3xl mx-auto w-full">
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

          <DrawerTitle className="sheet-title mt-2">Criar Novo Projeto</DrawerTitle>
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
                    {data.sectors.map(s => (
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
                    className="p-3.5 rounded-lg border border-border/80 bg-card space-y-2 shadow-xs text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-primary font-bold text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[10px]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        Ideia / Frente
                      </span>

                      <div className="flex items-center gap-2">
                        <select
                          className="bg-secondary/40 border border-border/60 rounded px-2 py-0.5 text-[11px] text-foreground"
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
      </DrawerContent>
    </Drawer>
  );
}

