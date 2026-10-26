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
  Heart,
} from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { FormattedMessage } from '@/components/formatted-message';
import {
  askMentorAi,
  type ChatMessage,
  getActiveGeminiKey,
  getActiveGroqKey,
  getPreferredAiProvider,
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialIdea) {
      setSelectedIdeaId(initialIdea.id);
    }
  }, [initialIdea]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'welcome',
        sender: 'assistant',
        text: initialIdea
          ? `Olá! Estou focado na sua ideia **"${initialIdea.title}"**. Como posso te ajudar a avançar com ela hoje?`
          : `Olá! Sou seu **Mentor Ideaflow** com inteligência integrada estilo ChatGPT. Estou aqui para conversar, analisar seus funis, sugerir passos práticos e planejar projetos com você. O que gostaria de explorar hoje?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        provider: 'chatgpt',
      };
      setMessages([welcome]);
    }
  }, [open, initialIdea]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const activeIdea = selectedIdeaId === 'all' ? undefined : data.ideas.find(i => i.id === selectedIdeaId);

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
      // Constrói o histórico da conversa recente para dar memória contextual ao modelo
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      const result = await askMentorAi({
        message: text.trim(),
        ...(activeIdea ? { contextIdea: activeIdea } : {}),
        allIdeas: data.ideas,
        sectors: data.sectors,
        history,
      });

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        provider: result.provider,
        model: result.model,
        tokensUsed: result.tokensUsed,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: 'Desculpe, ocorreu um erro momentâneo ao processar sua resposta. Pode tentar novamente?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        provider: 'local',
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
        { label: 'Acolhimento & Desabafo', icon: Heart, prompt: 'Estou me sentindo desanimado(a) e sobrecarregado(a) hoje. Pode me ouvir e me ajudar com gentileza?' },
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
                    <span className="text-[11px] font-medium flex items-center gap-1.5 text-green">
                      <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                      <span>IA Oficial Integrada (Groq LLaMA 3.3 70B · Gratuita) ⚡</span>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Limpar conversa"
                onClick={() => setMessages([])}
              >
                <Trash2 size={14} />
              </Button>
            </div>
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
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
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
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-none whitespace-pre-wrap'
                      : 'bg-card border border-border text-foreground rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.sender === 'assistant' ? (
                    <FormattedMessage content={msg.text} />
                  ) : (
                    msg.text
                  )}
                  <div
                    className={`flex items-center gap-1.5 mt-2 text-[9px] ${
                      msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <span
                        className={
                          msg.provider === 'gemini'
                            ? 'text-cyan font-semibold flex items-center gap-1'
                            : msg.provider === 'groq'
                            ? 'text-violet font-semibold flex items-center gap-1'
                            : 'text-amber-500 font-semibold flex items-center gap-1'
                        }
                      >
                        {msg.provider === 'gemini' && (
                          <span>✨ Google Gemini ({msg.model || 'Flash'}){msg.tokensUsed ? ` · ${msg.tokensUsed.totalTokens} tokens` : ''}</span>
                        )}
                        {msg.provider === 'groq' && (
                          <span>🚀 Groq ({msg.model || 'LLaMA 3.3'}){msg.tokensUsed ? ` · ${msg.tokensUsed.totalTokens} tokens` : ''}</span>
                        )}
                        {msg.provider === 'local' && (
                          <span>🛡️ Motor Heurístico Local (Offline)</span>
                        )}
                        {msg.provider === 'chatgpt' && (
                          <span>✨ IA Integrada</span>
                        )}
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 italic animate-pulse">
                <Wand2 size={14} className="animate-spin text-primary" />
                O Mentor está pensando e formulando sua resposta...
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
                className="h-7 text-[11px] gap-1 shrink-0 bg-card/60 hover:bg-secondary border-border/70 cursor-pointer"
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
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Pergunte ao Mentor ou converse sobre suas ideias..."
                className="flex-1 bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !inputText.trim()}
                className="h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer active:scale-95"
              >
                <Send size={14} />
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
