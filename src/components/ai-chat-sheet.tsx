import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Wand2,
  Trash2,
  Lightbulb,
  Compass,
  Zap,
  Target,
  Scissors,
  DollarSign,
  HelpCircle,
  Key,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import {
  askMentorAi,
  cleanGeminiKey,
  getActiveGeminiKey,
  setStoredGeminiKey,
  testGeminiApiKey,
  type ChatMessage,
} from '@/lib/ai-assistant';
import { type Idea } from '@/lib/ideaflow';

export function AiChatSheet({
  open,
  onClose,
  initialIdea,
}: {
  open: boolean;
  onClose: () => void;
  initialIdea?: Idea | null;
}) {
  const { data } = useFlow();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('all');
  const [providerTag, setProviderTag] = useState<'local' | 'gemini'>('local');
  const [hasGemini, setHasGemini] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [testingKey, setTestingKey] = useState(false);
  const [keyTestError, setKeyTestError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialIdea) {
      setSelectedIdeaId(initialIdea.id);
    }
  }, [initialIdea]);

  useEffect(() => {
    if (open) {
      const key = getActiveGeminiKey();
      const active = Boolean(key);
      setHasGemini(active);
      setGeminiKeyInput(key);
      setProviderTag(active ? 'gemini' : 'local');
    }
  }, [open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const isGemini = Boolean(getActiveGeminiKey());
      const welcome: ChatMessage = {
        id: 'welcome',
        sender: 'assistant',
        text: initialIdea
          ? `Olá! Estou focado na sua ideia **"${initialIdea.title}"**. Como posso te ajudar a avançar com ela hoje?`
          : `Olá! Sou seu **Mentor Ideaflow**. Estou aqui para analisar suas ideias, sugerir passos práticos e te ajudar a transformar pensamentos em projetos reais. O que gostaria de explorar?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        provider: isGemini ? 'gemini' : 'local',
      };
      setMessages([welcome]);
    }
  }, [open, initialIdea]);

  useEffect(() => {
    setMessages(prev =>
      prev.map(m => (m.id === 'welcome' ? { ...m, provider: hasGemini ? 'gemini' : 'local' } : m))
    );
  }, [hasGemini]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const activeIdea = selectedIdeaId === 'all' ? undefined : data.ideas.find(i => i.id === selectedIdeaId);

  const handleSaveAndTestKey = async () => {
    const clean = cleanGeminiKey(geminiKeyInput);
    if (!clean) {
      setStoredGeminiKey('');
      setHasGemini(false);
      setProviderTag('local');
      setKeyTestError(null);
      setShowKeyConfig(false);
      toast.info('Chave removida. O Mentor agora usa o Motor Cognitivo Local.');
      return;
    }

    setTestingKey(true);
    setKeyTestError(null);
    try {
      const res = await testGeminiApiKey(clean);
      if (res.success) {
        setStoredGeminiKey(clean);
        setHasGemini(true);
        setProviderTag('gemini');
        setShowKeyConfig(false);
        setKeyTestError(null);
        toast.success(`✨ Gemini 1.5 Flash conectado e verificado com sucesso!`);
      } else {
        setKeyTestError(res.error || 'A API da Google rejeitou a chave.');
        toast.error(`Erro ao validar chave: ${res.error || 'Verifique se a chave está ativa'}`);
      }
    } catch (err: any) {
      setKeyTestError(err?.message || 'Erro de conexão.');
      toast.error(`Falha: ${err?.message}`);
    } finally {
      setTestingKey(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend ?? inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Constrói o histórico da conversa recente para dar memória contextual ao Gemini
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      const { reply, provider, error } = await askMentorAi({
        message: text.trim(),
        contextIdea: activeIdea,
        allIdeas: data.ideas,
        history,
      });

      setProviderTag(provider);

      if (error) {
        toast.error(`Aviso Gemini: ${error}. Respondido com o motor local.`);
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        provider,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: 'Desculpe, ocorreu um erro ao processar sua resposta. Tente novamente em instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = activeIdea
    ? [
        { label: 'Destravar esta ideia', icon: Zap, prompt: `Como posso destravar a ideia "${activeIdea.title}" agora mesmo?` },
        { label: 'Sugerir passos de MVP', icon: Target, prompt: `Sugira um plano de 4 passos no estilo MVP para a ideia "${activeIdea.title}".` },
        { label: 'Reduzir escopo', icon: Scissors, prompt: `Como posso simplificar o escopo de "${activeIdea.title}" para lançar mais rápido?` },
        { label: 'Estratégia de monetização', icon: DollarSign, prompt: `Quais as melhores formas de monetizar a ideia "${activeIdea.title}"?` },
      ]
    : [
        { label: 'Qual focar hoje?', icon: Target, prompt: 'Com base no meu funil de ideias, qual projeto devo priorizar hoje?' },
        { label: 'Diagnóstico do funil', icon: Lightbulb, prompt: 'Analise o status geral das minhas ideias e me diga onde está o maior gargalo.' },
        { label: 'Técnica anti-procrastinação', icon: Zap, prompt: 'Estou com dificuldade de começar a executar. Qual exercício prático de 5 minutos você me recomenda?' },
        { label: 'Como validar rápido?', icon: Compass, prompt: 'Qual o método mais rápido para validar uma ideia antes de gastar semanas construindo?' },
      ];

  return (
    <Drawer open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DrawerContent className="max-h-[92vh]">
        <div className="sheet-body max-w-2xl mx-auto w-full flex flex-col h-[85vh]">
          {/* Cabeçalho do Chat */}
          <div className="pb-3 border-b border-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <DrawerTitle className="sheet-title text-xl m-0">Mentor Ideaflow</DrawerTitle>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${hasGemini ? 'bg-primary animate-pulse' : 'bg-green'}`} />
                      {hasGemini ? (
                        <span className="text-primary font-semibold">Gemini 1.5 Flash Conectado</span>
                      ) : (
                        <span className="text-green font-medium">Motor Cognitivo Local (100% Gratuito)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowKeyConfig(prev => !prev)}
                      className="text-[10px] text-primary underline hover:opacity-80 cursor-pointer"
                    >
                      {hasGemini ? 'Alterar Chave' : 'Conectar Gemini Grátis'}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Limpar conversa"
                onClick={() => setMessages([])}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            {/* Painel Expansível de Configuração do Gemini */}
            {showKeyConfig && (
              <div className="p-3 rounded-lg bg-card border border-primary/30 space-y-2 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Key size={13} className="text-primary" />
                    Chave do Google Gemini (100% Gratuita)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowKeyConfig(false)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Gere sua chave gratuita em segundos no{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline inline-flex items-center gap-0.5 font-medium"
                  >
                    Google AI Studio <ExternalLink size={10} />
                  </a>
                  . Sem taxas, sem cartão de crédito.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={geminiKeyInput}
                    onChange={e => {
                      setGeminiKeyInput(e.target.value);
                      if (keyTestError) setKeyTestError(null);
                    }}
                    placeholder="Cole sua chave AIzaSy..."
                    className="flex-1 bg-background border border-border rounded px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                  <Button
                    size="sm"
                    className="h-7 text-xs px-3 primary-action gap-1"
                    disabled={testingKey}
                    onClick={handleSaveAndTestKey}
                  >
                    {testingKey ? (
                      <>
                        <Wand2 size={12} className="animate-spin" />
                        Testando...
                      </>
                    ) : (
                      'Salvar & Testar'
                    )}
                  </Button>
                  {hasGemini && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 text-destructive hover:bg-destructive/10"
                      disabled={testingKey}
                      onClick={() => {
                        setStoredGeminiKey('');
                        setGeminiKeyInput('');
                        setHasGemini(false);
                        setProviderTag('local');
                        setKeyTestError(null);
                        setShowKeyConfig(false);
                        toast.info('Chave removida. O Mentor agora usa o Motor Cognitivo Local.');
                      }}
                    >
                      Remover
                    </Button>
                  )}
                </div>

                {keyTestError && (
                  <div className="p-2 rounded bg-destructive/10 border border-destructive/30 text-destructive text-[11px] leading-relaxed">
                    <strong>Erro da Google:</strong> {keyTestError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seletor de Contexto: Ideia Específica ou Funil Geral */}
          <div className="py-2.5 flex items-center gap-2 border-b border-border/60 text-xs">
            <span className="text-muted-foreground shrink-0 font-medium">Foco da IA:</span>
            <select
              className="bg-secondary/40 border border-border/80 rounded px-2.5 py-1 text-xs text-foreground cursor-pointer flex-1"
              value={selectedIdeaId}
              onChange={e => setSelectedIdeaId(e.target.value)}
            >
              <option value="all">Visão Geral de Todo o Funil ({data.ideas.length} ideias)</option>
              {data.ideas.map(i => (
                <option key={i.id} value={i.id}>
                  Ideia: {i.title}
                </option>
              ))}
            </select>
          </div>

          {/* Área de Mensagens com Rolagem */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                      : 'bg-card border border-border text-foreground rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`flex items-center gap-1.5 mt-1.5 text-[9px] ${
                      msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <span className={msg.provider === 'gemini' ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                        {msg.provider === 'gemini' ? '✨ Gemini 1.5 Flash' : '⚡ Motor Local'}
                      </span>
                    )}
                    {msg.sender === 'assistant' && <span>·</span>}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 italic">
                <Wand2 size={14} className="animate-spin text-primary" />
                O Mentor está formulando a melhor estratégia para você...
              </div>
            )}
          </div>

          {/* Atalhos Rápidos com 1 Toque */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-border/50">
            {quickPrompts.map((q, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="h-7 text-[11px] gap-1 shrink-0 bg-card/60 hover:bg-secondary border-border/70"
                onClick={() => handleSendMessage(q.prompt)}
              >
                <q.icon size={11} className="text-primary" />
                {q.label}
              </Button>
            ))}
          </div>

          {/* Campo de Entrada de Mensagem */}
          <div className="pt-2">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                placeholder={
                  activeIdea
                    ? `Pergunte algo sobre "${activeIdea.title.slice(0, 30)}..."`
                    : 'Pergunte qualquer coisa ao Mentor Ideaflow...'
                }
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 px-3 text-xs gap-1 primary-action shrink-0"
                disabled={!inputText.trim() || loading}
              >
                <Send size={13} />
                Enviar
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

