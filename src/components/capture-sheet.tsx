import { useEffect, useRef, useState } from 'react';
import {
  Mic,
  Square,
  PencilLine,
  Sparkles,
  ArrowRight,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Clock,
  SlidersHorizontal,
  Wand2,
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
  planIdea,
  formatMinutes,
  generateAiSteps,
  FIVE_WHYS_QUESTIONS,
  getFiveWhysQuestions,
  suggestFiveWhysOffline,
  defaultCompanySectors,
  defaultTeamMembers,
  type Idea,
  type Step,
} from '@/lib/ideaflow';
import { planIdeaWithAi, callAiServer, getActiveGeminiKey, getActiveGroqKey } from '@/lib/ai-assistant';
import { suggestFiveWhysWithAi } from '@/lib/integrated-ai';
import { isGroqActive } from '@/lib/groq';
import { toast } from 'sonner';

interface SpeechResult {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
}
interface SpeechRecognizer {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResult) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function CaptureSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, setData } = useFlow();
  const [tab, setTab] = useState<'voice' | 'text'>('voice');
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [draft, setDraft] = useState<Idea | null>(null);
  const [generating, setGenerating] = useState(false);
  const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);
  const [fiveWhys, setFiveWhys] = useState<string[]>(['', '', '', '', '']);
  const [showFiveWhys, setShowFiveWhys] = useState(false);
  const [suggestingWhys, setSuggestingWhys] = useState(false);
  const recognition = useRef<SpeechRecognizer | null>(null);

  const isBusinessMode = (data.workspaceMode ?? 'personal') === 'business';
  const currentWhysQuestions = getFiveWhysQuestions(isBusinessMode);

  // Detecção de Desktop (>= 769px) para abrir modal imersivo e espaçoso no Web
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 769;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 769);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!open) {
      recognition.current?.abort();
      setRecording(false);
      setDraft(null);
      setText('');
      setFiveWhys(['', '', '', '', '']);
      setShowFiveWhys(false);
    }
    return () => {
      recognition.current?.abort();
    };
  }, [open]);

  const record = () => {
    if (recording) {
      recognition.current?.stop();
      setRecording(false);
      return;
    }
    const speechWindow = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognizer;
      webkitSpeechRecognition?: new () => SpeechRecognizer;
    };
    const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Constructor) {
      toast.error('Este navegador não oferece transcrição de voz. Use o rascunho rápido.');
      return;
    }
    const instance = new Constructor();
    instance.lang = 'pt-BR';
    instance.continuous = true;
    instance.interimResults = false;
    instance.onresult = event => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) transcript += `${event.results[i]?.[0]?.transcript ?? ''} `;
      setText(transcript.trim());
    };
    instance.onerror = event => {
      setRecording(false);
      toast.error(
        event.error === 'not-allowed'
          ? 'Permita o acesso ao microfone para gravar.'
          : 'Não foi possível transcrever. O reconhecimento de voz pode precisar de internet.'
      );
    };
    instance.onend = () => setRecording(false);
    recognition.current = instance;
    try {
      instance.start();
      setRecording(true);
    } catch {
      toast.error('O microfone não está disponível agora.');
    }
  };

  const handleUpdateStepText = (index: number, newText: string) => {
    if (!draft) return;
    const updated = draft.steps.map((s, i) => (i === index ? { ...s, text: newText } : s));
    const immediate = index === 0 ? newText : draft.immediate;
    setDraft({ ...draft, steps: updated, immediate });
  };

  const handleUpdateStepMinutes = (index: number, newMinutes: number) => {
    if (!draft) return;
    const updated = draft.steps.map((s, i) => (i === index ? { ...s, minutes: newMinutes } : s));
    const totalMinutes = updated.reduce((acc, curr) => acc + curr.minutes, 0);
    setDraft({ ...draft, steps: updated, minutes: totalMinutes });
  };

  const handleDeleteStep = (index: number) => {
    if (!draft || draft.steps.length <= 1) {
      toast.error('Mantenha pelo menos um passo para orientar a ação.');
      return;
    }
    const updated = draft.steps.filter((_, i) => i !== index);
    const totalMinutes = updated.reduce((acc, curr) => acc + curr.minutes, 0);
    const immediate = updated[0]?.text ?? draft.immediate;
    setDraft({ ...draft, steps: updated, minutes: totalMinutes, immediate });
  };

  const handleAddStep = () => {
    if (!draft) return;
    const newStep: Step = {
      id: crypto.randomUUID(),
      text: 'Novo passo para avançar a ideia',
      minutes: 15,
      done: false,
    };
    const updated = [...draft.steps, newStep];
    const totalMinutes = updated.reduce((acc, curr) => acc + curr.minutes, 0);
    setDraft({ ...draft, steps: updated, minutes: totalMinutes });
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    if (!draft || toIndex < 0 || toIndex >= draft.steps.length) return;
    const reordered = [...draft.steps];
    const [moved] = reordered.splice(fromIndex, 1);
    if (!moved) return;
    reordered.splice(toIndex, 0, moved);
    setDraft({
      ...draft,
      steps: reordered,
      immediate: reordered[0]?.text ?? draft.immediate,
    });
  };

  const handleRegenerateWithAi = async (style: 'mvp' | 'rapido' | 'estruturado' | 'expansao') => {
    if (!draft) return;
    setGenerating(true);
    try {
      const promptStyle =
        style === 'mvp'
          ? 'Gere 3 a 4 passos de MVP enxuto para testar a ideia rapidamente no mundo real'
          : style === 'rapido'
          ? 'Gere 3 micro-passos rápidos de 10 a 15 minutos cada'
          : style === 'expansao'
          ? 'Gere passos de expansão, métricas e distribuição'
          : 'Gere um plano estruturado e profissional com 4 a 5 passos encadeados';

      const result = await callAiServer({
        action: 'plan',
        rawText: `Ideia: "${draft.title}". Detalhes: "${draft.summary}". Estilo solicitado: ${promptStyle}.`,
        sectors: activeSectors,
        fiveWhys: draft.fiveWhys || fiveWhys,
      });

      if (result && result.success && result.parsed?.steps?.length > 0) {
        const steps: Step[] = result.parsed.steps.map((s: any, idx: number) => ({
          id: crypto.randomUUID(),
          text: s.text || `Passo ${idx + 1}`,
          minutes: Number(s.minutes) || (style === 'rapido' ? 10 : 20),
          done: false,
        }));
        const totalMinutes = steps.reduce((acc, curr) => acc + curr.minutes, 0);
        setDraft({
          ...draft,
          steps,
          minutes: totalMinutes,
          immediate: steps[0]?.text ?? draft.immediate,
        });
        const tokenMsg = result.tokensUsed?.totalTokens ? ` (${result.tokensUsed.totalTokens} tokens)` : '';
        toast.success(`Passos redesenhados com IA (${result.provider === 'gemini' ? 'Gemini' : 'Groq'})${tokenMsg} 🚀`);
        return;
      }
    } catch {
      // Ignora erro e usa fallback heurístico contextualizado
    } finally {
      setGenerating(false);
    }

    // Fallback inteligente para o motor heurístico local com 5 Porquês e categoria contextual
    const newSteps = generateAiSteps(draft.title, draft.summary, draft.sector, style, draft.fiveWhys || fiveWhys);
    const totalMinutes = newSteps.reduce((acc, curr) => acc + curr.minutes, 0);
    setDraft({
      ...draft,
      steps: newSteps,
      minutes: totalMinutes,
      immediate: newSteps[0]?.text ?? draft.immediate,
    });
    const styleLabels = {
      mvp: 'Plano MVP contextualizado gerado pelo motor local 🛡️',
      rapido: 'Micro-passos rápidos de 10 min gerados 🛡️',
      estruturado: 'Plano estruturado gerado pelo motor local 🛡️',
      expansao: 'Plano de expansão gerado pelo motor local 🛡️',
    };
    toast.info(styleLabels[style]);
  };

  const handleSuggestWhys = async () => {
    if (!text.trim()) {
      toast.info('Escreva algo sobre sua ideia primeiro para sugerirmos os 5 porquês.');
      return;
    }
    setSuggestingWhys(true);
    try {
      const suggestions = await suggestFiveWhysWithAi(text);
      if (suggestions && suggestions.length > 0) {
        setFiveWhys(suggestions);
        setShowFiveWhys(true);
        toast.success('5 Porquês gerados com IA! Você pode editar as respostas.');
      }
    } catch {
      const offline = suggestFiveWhysOffline(text, isBusinessMode);
      setFiveWhys(offline);
      setShowFiveWhys(true);
      toast.success(
        isBusinessMode
          ? 'Perguntas estratégicas preenchidas pelo motor local da empresa! 🏢'
          : '5 Porquês reflexivos gerados pelo motor local!'
      );
    } finally {
      setSuggestingWhys(false);
    }
  };

  const isBusiness = data.workspaceMode === 'business';
  const activeSectors = isBusiness
    ? (data.companyWorkspace?.sectors ?? defaultCompanySectors)
    : data.sectors;
  const companyMembers = data.companyWorkspace?.members ?? [];

  const handleGenerateDraft = async () => {
    if (!text.trim() || recording || generating) return;
    setGenerating(true);
    try {
      const result = await planIdeaWithAi(text, activeSectors, fiveWhys);
      const { idea, provider } = result;
      setDraft({
        ...idea,
        workspace: isBusiness ? 'business' : 'personal',
        assignedTo: isBusiness ? (companyMembers[0]?.name ?? undefined) : undefined,
      });
      if (provider === 'groq') {
        const tokenInfo = result.tokensUsed?.totalTokens ? ` (${result.tokensUsed.totalTokens} tokens gastos)` : '';
        toast.success(`Plano desenhado com Groq (${result.model || 'LLaMA 3.3'})${tokenInfo} 🚀`);
      } else if (provider === 'gemini') {
        const tokenInfo = result.tokensUsed?.totalTokens ? ` (${result.tokensUsed.totalTokens} tokens gastos)` : '';
        toast.success(`Plano desenhado pelo Google Gemini (${result.model || 'Flash'})${tokenInfo} ✨`);
      } else {
        if (result.error && (result.error.toLowerCase().includes('firewall') || result.error.toLowerCase().includes('fetch') || result.error.toLowerCase().includes('bloqueou') || result.error.toLowerCase().includes('indisponível') || result.error.toLowerCase().includes('indisponivel'))) {
          toast.warning('⚠️ Sua rede corporativa bloqueou o acesso à IA na nuvem. Os passos foram desenhados pelo Motor Heurístico com base no seu contexto!', { duration: 6500 });
        } else {
          toast.info('Plano desenhado pelo Motor Heurístico Local contextualizado 🛡️');
        }
      }
    } catch {
      const offline = planIdea(text, activeSectors, fiveWhys);
      setDraft({
        ...offline,
        workspace: isBusiness ? 'business' : 'personal',
        assignedTo: isBusiness ? (companyMembers[0]?.name ?? undefined) : undefined,
      });
      toast.warning('⚠️ Rede corporativa offline para IA externa. Plano contextualizado gerado pelo motor local 🛡️', { duration: 6500 });
    } finally {
      setGenerating(false);
    }
  };

  const save = () => {
    if (!draft) return;
    const finalIdea: Idea = {
      ...draft,
      workspace: isBusiness ? 'business' : 'personal',
      companyId: isBusiness && data.companyWorkspace?.id ? data.companyWorkspace.id : undefined,
      department: isBusiness
        ? (activeSectors.find(s => s.id === draft.sector)?.name ?? draft.sector)
        : undefined,
    };
    setData(p => ({ ...p, ideas: [finalIdea, ...p.ideas] }));
    toast.success(isBusiness ? 'Iniciativa registrada no Workspace da Empresa! 🏢' : 'Uma nova faísca no seu funil ✨');
    onClose();
  };

  const content = (
    <div className="sheet-body max-w-4xl mx-auto w-full p-2 sm:p-4">
      <div className="sheet-eyebrow">
        <Sparkles size={15} />
        TODA REALIZAÇÃO COMEÇA AQUI
      </div>
      <h2 className="sheet-title text-2xl sm:text-3xl font-display font-bold text-foreground">
        {draft ? 'Personalize o plano da sua ideia.' : 'O que está na sua cabeça?'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {draft
          ? 'A IA gerou estes passos iniciais. Você pode editar, apagar ou adicionar novos como preferir.'
          : 'Solte a ideia livremente. Nosso assistente encontra o primeiro passo executável.'}
      </p>

          {!draft ? (
            <>
              <div className="mt-4 p-2.5 rounded-lg border border-violet/30 bg-violet/5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Quer criar um <strong>Projeto com várias ideias dentro</strong>?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-violet font-semibold hover:bg-violet/10 px-2 gap-1 cursor-pointer"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new Event('ideaflow:create-project'));
                  }}
                >
                  <span>Criar Projeto</span>
                  <ArrowRight size={12} />
                </Button>
              </div>

              <div className="segmented mt-4">
                <Button variant="ghost" className={tab === 'voice' ? 'selected' : ''} onClick={() => setTab('voice')}>
                  <Mic size={16} />
                  Gravar áudio
                </Button>
                <Button
                  variant="ghost"
                  className={tab === 'text' ? 'selected' : ''}
                  onClick={() => {
                    recognition.current?.stop();
                    setRecording(false);
                    setTab('text');
                  }}
                >
                  <PencilLine size={16} />
                  Rascunho rápido
                </Button>
              </div>

              {tab === 'voice' && (
                <div className="voice-area">
                  <div className={`waveform ${recording ? 'recording' : ''}`}>
                    {Array.from({ length: 27 }, (_, i) => (
                      <i key={i} className={`wave-${i % 6}`} />
                    ))}
                  </div>
                  <Button
                    className={`record-button ${recording ? 'recording' : ''}`}
                    onClick={record}
                    aria-label={recording ? 'Parar gravação' : 'Começar gravação'}
                  >
                    {recording ? <Square fill="currentColor" /> : <Mic />}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    {recording ? 'Ouvindo sua ideia…' : 'Toque para começar'}
                  </p>
                  <p className="voice-note">A transcrição depende do navegador e pode precisar de internet.</p>
                </div>
              )}

              <textarea
                aria-label="Sua ideia"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Exemplo: E se eu criasse um produto digital para organizar projetos de marcenaria e hobbies..."
                className="idea-input"
                rows={tab === 'voice' ? 3 : 5}
              />

              {/* Seção Interativa dos 5 Porquês */}
              <div className="mb-4 rounded-xl border border-border/80 bg-secondary/35 p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-amber/15 text-amber border border-amber/30 text-xs font-bold flex items-center justify-center shrink-0">
                      5P
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {isBusinessMode ? '5 Porquês Corporativos (Alinhamento Estratégico)' : 'Técnica dos 5 Porquês'}
                        <span className="text-[10.5px] font-medium px-1.5 py-0.2 rounded-full bg-secondary text-primary border border-primary/25">
                          {fiveWhys.filter(w => w.trim()).length}/5 preenchidos
                        </span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {isBusinessMode
                          ? 'Responda para a IA calcular impacto no negócio, ROI, setor responsável e um plano ágil de entrega.'
                          : 'Responda para a IA entender o contexto e a raiz da ideia, gerando passos muito mais precisos.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {text.trim().length > 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={suggestingWhys}
                        className="h-7 text-[11px] px-2.5 gap-1 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer shadow-xs active:scale-95"
                        onClick={handleSuggestWhys}
                        title="Usar IA para sugerir respostas inteligentes para os 5 porquês"
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
                      <span>💡 Dica: Você pode responder quantos quiser. Cada resposta adiciona profundidade ao raciocínio da IA.</span>
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

              <div className="flex justify-between items-center text-xs text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500 dark:text-emerald-400 font-medium">IA Oficial Integrada (Groq LLaMA 3.3 · Gratuita) ⚡</span>
                </span>
                <span>{text.length} caracteres</span>
              </div>
              <Button
                className="primary-action w-full gap-2"
                disabled={!text.trim() || recording || generating}
                onClick={handleGenerateDraft}
              >
                {generating ? (
                  <>
                    <Wand2 size={16} className="animate-spin text-primary" />
                    A IA está cruzando os 5 Porquês e desenhando os passos...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Entender ideia e criar passos com IA
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4 mt-4">
              {draft.fiveWhys && draft.fiveWhys.length > 0 && (
                <div className="p-3 rounded-xl border border-primary/25 bg-primary/5">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} />
                      {isBusinessMode ? 'Alinhamento Estratégico Aplicado (5 Porquês)' : 'Contexto Raiz Aplicado (5 Porquês)'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {draft.fiveWhys.length} respostas registradas
                    </span>
                  </div>
                  <div className="space-y-1 mt-2 text-xs">
                    {draft.fiveWhys.map((why, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-primary font-bold shrink-0">{idx + 1}º</span>
                        <span className="text-muted-foreground leading-relaxed">{why}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">Título da Ideia</label>
                <textarea
                  className="draft-title resize-none w-full leading-snug break-words"
                  rows={2}
                  aria-label="Título da ideia"
                  value={draft.title}
                  onChange={e => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Título claro e cativante..."
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">
                  Resumo / Intenção
                </label>
                <textarea
                  className="text-field resize-none text-[11px] sm:text-xs leading-snug break-words"
                  rows={2}
                  value={draft.summary}
                  onChange={e => setDraft({ ...draft, summary: e.target.value })}
                  placeholder="Resumo da intenção e do valor dessa realização..."
                />
              </div>

              <div className="detail-fields">
                <label>
                  {isBusiness ? 'Departamento / Setor' : 'Setor'}
                  <select
                    value={draft.sector}
                    onChange={e => {
                      const newSector = e.target.value;
                      setDraft({
                        ...draft,
                        sector: newSector,
                        steps: generateAiSteps(draft.title, draft.summary, newSector, 'estruturado'),
                      });
                    }}
                  >
                    {activeSectors.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                {isBusiness && (
                  <label>
                    Responsável na Equipe
                    <select
                      value={draft.assignedTo ?? ''}
                      onChange={e => setDraft({ ...draft, assignedTo: e.target.value || undefined })}
                    >
                      <option value="">Não atribuído</option>
                      {companyMembers.map(m => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label>
                  Prioridade
                  <select
                    value={draft.priority}
                    onChange={e => setDraft({ ...draft, priority: e.target.value as Idea['priority'] })}
                  >
                    {['Urgente', 'Importante', 'Normal'].map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">
                  Vincular a um Projeto Existente (Opcional)
                </label>
                <select
                  className="text-xs"
                  value={draft.parentId ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    setDraft({
                      ...draft,
                      parentId: val || undefined,
                      sector: val ? (data.ideas.find(i => i.id === val)?.sector ?? draft.sector) : draft.sector,
                    });
                  }}
                >
                  <option value="">Nenhum (Ideia independente / avulsa)</option>
                  {data.ideas
                    .filter(i => !i.archived && (i.isProject || data.ideas.some(sub => sub.parentId === i.id)))
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        📁 {p.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">
                  Definição do Escopo (O que está incluído no projeto agora?)
                </label>
                <textarea
                  className="text-field resize-none text-[11px] sm:text-xs leading-snug break-words"
                  rows={2}
                  value={draft.scope ?? ''}
                  onChange={e => setDraft({ ...draft, scope: e.target.value })}
                  placeholder="Ex.: Versão 1.0 focada apenas no cadastro básico e exportação em PDF..."
                />
              </div>

              <div className="immediate-action">
                <span>
                  <Sparkles size={16} />
                  AÇÃO IMEDIATA · 15 MIN
                </span>
                <textarea
                  rows={2}
                  className="w-full bg-transparent border-0 border-b border-amber/30 focus:border-amber text-[11px] sm:text-xs text-foreground mt-2 resize-none outline-none leading-snug break-words"
                  value={draft.immediate}
                  onChange={e => setDraft({ ...draft, immediate: e.target.value })}
                  placeholder="Qual a primeira micro-ação de 15 minutos?"
                />
              </div>

              {/* Seção do Plano Inicial Customizável */}
              <div className="rounded-lg border border-border/70 p-3 sm:p-4 bg-card/60">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                      <SlidersHorizontal size={14} className="text-primary" />
                      Seu plano inicial (Personalizável)
                    </h3>
                    <span className="text-[11px] sm:text-xs text-muted-foreground">
                      {draft.steps.length} passos · {formatMinutes(draft.minutes)} totais
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">IA:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2 gap-1"
                      title="Gerar passos enxutos para validação rápida"
                      onClick={() => handleRegenerateWithAi('mvp')}
                    >
                      <Wand2 size={11} className="text-primary" />
                      MVP
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2 gap-1"
                      title="Gerar plano completo estruturado"
                      onClick={() => handleRegenerateWithAi('estruturado')}
                    >
                      Completo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2 gap-1"
                      title="Gerar micro-passos rápidos"
                      onClick={() => handleRegenerateWithAi('rapido')}
                    >
                      10min
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {draft.steps.map((s, i) => (
                    <div
                      key={s.id ?? i}
                      draggable
                      onDragStart={() => setDraggedStepIndex(i)}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => {
                        if (draggedStepIndex !== null && draggedStepIndex !== i) {
                          handleMoveStep(draggedStepIndex, i);
                          setDraggedStepIndex(null);
                        }
                      }}
                      className={`flex items-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-background/90 border text-xs transition-all ${
                        draggedStepIndex === i ? 'opacity-50 border-primary border-dashed scale-[0.98]' : 'border-border/60 hover:border-border'
                      }`}
                    >
                      {/* Alça de Arraste e Setas para Subir / Descer */}
                      <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 select-none">
                        <div
                          className="hidden sm:block cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground"
                          title="Arraste para cima ou para baixo para reordenar"
                        >
                          <GripVertical size={13} />
                        </div>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={() => handleMoveStep(i, i - 1)}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer"
                            title="Mover para cima"
                          >
                            <ChevronUp size={11} />
                          </button>
                          <button
                            type="button"
                            disabled={i === draft.steps.length - 1}
                            onClick={() => handleMoveStep(i, i + 1)}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ChevronDown size={11} />
                          </button>
                        </div>
                      </div>

                      <span className="font-mono text-primary font-bold text-[10px] sm:text-xs min-w-4 pt-1 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <textarea
                        rows={2}
                        className="flex-1 bg-transparent border-0 border-b border-transparent focus:border-primary/60 px-1 py-0.5 text-[11px] sm:text-xs text-foreground outline-none resize-none leading-snug break-words"
                        value={s.text}
                        onChange={e => handleUpdateStepText(i, e.target.value)}
                        placeholder="Descreva o passo..."
                      />
                      <div className="flex items-center gap-1 shrink-0 pt-1">
                        <Clock size={11} className="text-muted-foreground" />
                        <select
                          className="bg-transparent border border-border/60 rounded px-1 py-0.5 text-[10px] sm:text-[11px] text-foreground cursor-pointer"
                          value={s.minutes}
                          onChange={e => handleUpdateStepMinutes(i, Number(e.target.value))}
                        >
                          <option value={10}>10m</option>
                          <option value={15}>15m</option>
                          <option value={20}>20m</option>
                          <option value={25}>25m</option>
                          <option value={30}>30m</option>
                          <option value={45}>45m</option>
                          <option value={60}>60m</option>
                        </select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                        title="Excluir este passo"
                        onClick={() => handleDeleteStep(i)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2.5 sm:mt-3 h-7 sm:h-8 text-[11px] sm:text-xs border-dashed gap-1 text-muted-foreground hover:text-foreground"
                  onClick={handleAddStep}
                >
                  <Plus size={13} />
                  Adicionar passo personalizado
                </Button>
              </div>

              <p className="clarity-tip">✦ {draft.clarity}</p>

              <div className="pt-2 space-y-2">
                <Button className="primary-action w-full" disabled={!draft.title.trim()} onClick={save}>
                  <Check size={16} />
                  Salvar no meu funil de ideias
                </Button>
                <Button variant="ghost" className="w-full h-9 text-xs" onClick={() => setDraft(null)}>
                  <RefreshCw size={13} className="mr-1.5" />
                  Voltar ao rascunho anterior
                </Button>
              </div>
            </div>
          )}
    </div>
  );

  // No Desktop / Web: Modal centralizado amplo e espaçoso com rolagem própria
  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={v => {
          if (!v) onClose();
        }}
      >
        <DialogContent className="max-w-5xl w-[94vw] max-h-[92vh] overflow-y-auto p-6 sm:p-10 rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl">
          <DialogTitle className="sr-only">
            {draft ? 'Personalize o plano da sua ideia.' : 'O que está na sua cabeça?'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para captura e planejamento de nova ideia ou faísca.
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
      onOpenChange={v => {
        if (!v) onClose();
      }}
    >
      <DrawerContent className="max-h-[92vh]">
        <DrawerTitle className="sr-only">
          {draft ? 'Personalize o plano da sua ideia.' : 'O que está na sua cabeça?'}
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          Formulário para captura e planejamento de nova ideia ou faísca.
        </DrawerDescription>
        {content}
      </DrawerContent>
    </Drawer>
  );
}