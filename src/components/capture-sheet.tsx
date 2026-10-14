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
} from 'lucide-react';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { planIdea, formatMinutes, generateAiSteps, type Idea, type Step } from '@/lib/ideaflow';
import { planIdeaWithGemini, getActiveGeminiKey } from '@/lib/ai-assistant';
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
  const recognition = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    if (!open) {
      recognition.current?.abort();
      setRecording(false);
      setDraft(null);
      setText('');
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

  const handleRegenerateWithAi = (style: 'mvp' | 'rapido' | 'estruturado' | 'expansao') => {
    if (!draft) return;
    const newSteps = generateAiSteps(draft.title, draft.summary, draft.sector, style);
    const totalMinutes = newSteps.reduce((acc, curr) => acc + curr.minutes, 0);
    const styleLabels = {
      mvp: 'Plano MVP enxuto gerado pela IA ✨',
      rapido: 'Passos rápidos de 10 min gerados ✨',
      estruturado: 'Plano estruturado gerado pela IA ✨',
      expansao: 'Plano de expansão gerado pela IA ✨',
    };
    setDraft({
      ...draft,
      steps: newSteps,
      minutes: totalMinutes,
      immediate: newSteps[0]?.text ?? draft.immediate,
    });
    toast.success(styleLabels[style]);
  };

  const handleGenerateDraft = async () => {
    if (!text.trim() || recording || generating) return;
    setGenerating(true);
    try {
      const { idea, usedGemini, error } = await planIdeaWithGemini(text, data.sectors);
      setDraft(idea);
      if (usedGemini) {
        toast.success('Plano desenhado pelo Google Gemini! ✨');
      } else if (error) {
        toast.error(`Aviso Gemini: ${error}. Plano criado com o motor local de contingência.`);
      } else {
        toast.success('Plano desenhado com inteligência offline! ✨');
      }
    } catch {
      setDraft(planIdea(text, data.sectors));
    } finally {
      setGenerating(false);
    }
  };

  const save = () => {
    if (!draft) return;
    setData(p => ({ ...p, ideas: [draft, ...p.ideas] }));
    toast.success('Uma nova faísca no seu funil ✨');
    onClose();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={v => {
        if (!v) onClose();
      }}
    >
      <DrawerContent className="max-h-[92vh]">
        <div className="sheet-body max-w-2xl mx-auto w-full">
          <div className="sheet-eyebrow">
            <Sparkles size={15} />
            TODA REALIZAÇÃO COMEÇA AQUI
          </div>
          <DrawerTitle className="sheet-title">
            {draft ? 'Personalize o plano da sua ideia.' : 'O que está na sua cabeça?'}
          </DrawerTitle>
          <DrawerDescription className="mt-2 text-sm text-muted-foreground">
            {draft
              ? 'A IA gerou estes passos iniciais. Você pode editar, apagar ou adicionar novos como preferir.'
              : 'Solte a ideia livremente. Nosso assistente encontra o primeiro passo executável.'}
          </DrawerDescription>

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
                rows={tab === 'voice' ? 3 : 6}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${getActiveGeminiKey() ? 'bg-primary animate-pulse' : 'status-dot'}`} />
                  {getActiveGeminiKey() ? (
                    <span className="text-primary font-medium">Google Gemini Flash ativo ✨</span>
                  ) : (
                    'Inteligência heurística offline & privada'
                  )}
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
                    A IA está entendendo sua ideia e desenhando os passos...
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
                  className="text-field resize-none text-xs leading-relaxed break-words"
                  rows={2}
                  value={draft.summary}
                  onChange={e => setDraft({ ...draft, summary: e.target.value })}
                  placeholder="Resumo da intenção e do valor dessa realização..."
                />
              </div>

              <div className="detail-fields">
                <label>
                  Setor
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
                  className="text-field resize-none text-xs leading-relaxed break-words"
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
                  className="w-full bg-transparent border-0 border-b border-amber/30 focus:border-amber text-xs text-foreground mt-2 resize-none outline-none leading-relaxed break-words"
                  value={draft.immediate}
                  onChange={e => setDraft({ ...draft, immediate: e.target.value })}
                  placeholder="Qual a primeira micro-ação de 15 minutos?"
                />
              </div>

              {/* Seção do Plano Inicial Customizável */}
              <div className="rounded-lg border border-border/70 p-4 bg-card/60">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-1.5">
                      <SlidersHorizontal size={15} className="text-primary" />
                      Seu plano inicial (Personalizável)
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {draft.steps.length} passos · {formatMinutes(draft.minutes)} totais
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">IA:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1"
                      title="Gerar passos enxutos para validação rápida"
                      onClick={() => handleRegenerateWithAi('mvp')}
                    >
                      <Wand2 size={12} className="text-primary" />
                      MVP
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1"
                      title="Gerar plano completo estruturado"
                      onClick={() => handleRegenerateWithAi('estruturado')}
                    >
                      Completo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1"
                      title="Gerar micro-passos rápidos"
                      onClick={() => handleRegenerateWithAi('rapido')}
                    >
                      10min
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {draft.steps.map((s, i) => (
                    <div
                      key={s.id ?? i}
                      className="flex items-start gap-2.5 p-2.5 rounded-md bg-background/80 border border-border/50 text-xs"
                    >
                      <span className="font-mono text-primary font-semibold text-xs min-w-5 pt-1 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <textarea
                        rows={2}
                        className="flex-1 bg-transparent border-0 border-b border-transparent focus:border-primary/60 px-1 py-1 text-xs text-foreground outline-none resize-none leading-relaxed break-words"
                        value={s.text}
                        onChange={e => handleUpdateStepText(i, e.target.value)}
                        placeholder="Descreva o passo..."
                      />
                      <div className="flex items-center gap-1 shrink-0 pt-1">
                        <Clock size={12} className="text-muted-foreground" />
                        <select
                          className="bg-transparent border border-border/60 rounded px-1.5 py-0.5 text-[11px] text-foreground cursor-pointer"
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
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 h-8 text-xs border-dashed gap-1 text-muted-foreground hover:text-foreground"
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
      </DrawerContent>
    </Drawer>
  );
}