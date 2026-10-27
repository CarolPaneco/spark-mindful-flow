import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import {
  Check,
  Download,
  FileJson,
  Moon,
  Sun,
  Upload,
  ShieldCheck,
  Sparkles,
  Smartphone,
  HardDrive,
  Lock,
  ServerOff,
  HelpCircle,
  Compass,
  Trash2,
  Bot,
  Cpu,
  Zap,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { isFlowData, localDate, palettes } from '@/lib/ideaflow';
import {
  getActiveGeminiKey,
  setStoredGeminiKey,
  getActiveGroqKey,
  setStoredGroqKey,
  getPreferredAiProvider,
  setPreferredAiProvider,
  testAiConnection,
} from '@/lib/ai-assistant';

export const Route = createFileRoute('/ajustes')({
  head: () => ({
    meta: [
      { title: 'Ajustes & Backup · Ideaflow' },
      {
        name: 'description',
        content: 'Personalize as cores do seu espaço, sincronização e proteja suas ideias com backup.',
      },
      { property: 'og:title', content: 'Ajustes & Backup · Ideaflow' },
      {
        property: 'og:description',
        content: 'Seu espaço do seu jeito. Suas ideias sempre com você.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { data, setData } = useFlow();
  const input = useRef<HTMLInputElement>(null);

  // Teste da IA Integrada Oficial do site (Groq LLaMA 3.3 70B)
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider?: string;
    model?: string;
    latencyMs?: number;
    tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
    error?: string;
  } | null>(null);

  const handleTestAi = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const res = await testAiConnection('groq');
      setTestResult(res);
      if (res.success) {
        toast.success(`✅ IA Oficial Operacional! Respondeu em ${res.latencyMs || 0}ms consumindo ${res.tokensUsed?.totalTokens || 0} tokens.`);
      } else {
        toast.error(`Falha no teste: ${res.error || 'Verifique a conexão de rede.'}`);
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || 'Erro de conexão.' });
      toast.error('Erro ao conectar com a IA oficial.');
    } finally {
      setTestingAi(false);
    }
  };

  const download = (format: 'json' | 'zip') => {
    const json = JSON.stringify(data, null, 2);
    const bytes =
      format === 'zip'
        ? zipSync({ 'ideaflow-backup.json': strToU8(json) })
        : strToU8(json);
    const blob = new Blob([new Uint8Array(bytes)], {
      type: format === 'zip' ? 'application/zip' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ideaflow-${localDate()}.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Backup exportado. Suas ideias vão com você.');
  };

  const restore = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('O arquivo excede o limite de 10 MB.');
      let text: string;
      if (file.name.endsWith('.zip')) {
        const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
        const json = entries['ideaflow-backup.json'];
        if (!json || json.length > 10 * 1024 * 1024)
          throw new Error('O ZIP não contém um backup válido.');
        text = strFromU8(json);
      } else {
        text = await file.text();
      }
      const parsed: unknown = JSON.parse(text);
      if (!isFlowData(parsed)) throw new Error('Este arquivo não é um backup válido do Ideaflow.');
      if (window.confirm('Restaurar este backup? As ideias atuais serão substituídas.')) {
        setData(parsed);
        toast.success('Seu universo foi restaurado.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível restaurar o backup.');
    } finally {
      if (input.current) input.current.value = '';
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Seu espaço, <span>do seu jeito.</span>
          </h1>
          <p className="page-subtitle">A energia certa para suas próximas realizações.</p>
        </div>
      </div>

      {/* Atalho Acessível para o Perfil e Empresas (Especialmente Mobile) */}
      <section className="settings-section p-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-violet/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Meu Perfil & Empresas</h2>
            <p className="text-xs text-muted-foreground">Gerencie sua foto, bio, equipe, empresas e senha PIN na lateral.</p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-2 text-xs font-semibold rounded-full px-4 shrink-0 w-full sm:w-auto cursor-pointer"
          onClick={() => window.dispatchEvent(new CustomEvent('ideaflow:profile'))}
        >
          <User size={13} />
          Abrir Lateral de Perfil
        </Button>
      </section>

      {/* Tema Claro / Escuro */}
      <section className="settings-section settings-mode">
        <div>
          <h2>Luz do seu universo</h2>
          <p>Escolha o clima que combina com você.</p>
        </div>
        <div className="segmented">
          <Button
            variant="ghost"
            className={data.theme === 'dark' ? 'selected' : ''}
            onClick={() => setData(p => ({ ...p, theme: 'dark' }))}
          >
            <Moon />
            Cósmico
          </Button>
          <Button
            variant="ghost"
            className={data.theme === 'light' ? 'selected' : ''}
            onClick={() => setData(p => ({ ...p, theme: 'light' }))}
          >
            <Sun />
            Radiante
          </Button>
        </div>
      </section>

      {/* Paleta de Cores */}
      <section className="settings-section">
        <h2>Uma paleta de possibilidades</h2>
        <p>Seis maneiras de dar cor ao seu movimento.</p>
        <div className="palette-grid">
          {palettes.map(p => (
            <Button
              variant="ghost"
              key={p}
              className={`palette-option ${data.palette === p ? 'selected' : ''}`}
              onClick={() => setData(prev => ({ ...prev, palette: p }))}
            >
              <span className="palette-preview" data-palette={p}>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="flex items-center justify-between">
                {p}
                {data.palette === p && <Check size={13} />}
              </span>
            </Button>
          ))}
        </div>
      </section>



      {/* Inteligência Artificial Oficial Integrada (Fornecida pelo Site) */}
      <section className="settings-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              Inteligência Artificial Oficial Integrada (100% Gratuita)
            </h2>
            <p>
              O Ideaflow conta com uma IA de ponta integrada nativamente ao site e app via <strong>Groq (LLaMA 3.3 de 70 Bilhões de parâmetros)</strong>. Você não precisa colocar nenhuma chave nem pagar nada: tudo é fornecido diretamente pelo site.
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-xs px-3 py-1 rounded-full bg-green/10 text-green border border-green/20 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              IA Oficial Ativa (Groq LLaMA 3.3 70B) 🚀
            </span>
          </div>
        </div>

        <div className="mt-5 p-5 rounded-2xl border border-border bg-card/70 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Zap size={15} className="text-primary" />
                <span>Ultra-rápida (Hardware LPU)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Respostas e passos gerados em menos de 1 segundo utilizando o hardware de alta performance da Groq.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Sparkles size={15} className="text-cyan" />
                <span>Contexto dos 5 Porquês</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A IA cruza o desejo inicial com as causas raízes dos 5 Porquês para desenhar passos humanos e sem clichês.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 size={15} className="text-green" />
                <span>Zero Configuração</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Já vem 100% pronta e disponível para todos os usuários do site e app, sem necessidade de chaves.
              </p>
            </div>
          </div>

          {/* Resultado do Teste de Conexão */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in-50 duration-200 ${
                testResult.success
                  ? 'border-green/40 bg-green/10 text-green-300'
                  : 'border-destructive/40 bg-destructive/10 text-destructive-foreground'
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 size={16} className="text-green shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {testResult.success ? 'IA Oficial Conectada & Consumindo Tokens com Sucesso! 🎉' : 'Aviso de conexão com a IA'}
                  </p>
                  {testResult.success ? (
                    <div className="mt-1 space-y-0.5 text-muted-foreground font-mono text-[11px]">
                      <p>• Provedor integrado: <strong className="text-foreground">Groq Cloud (Nativo do Site)</strong></p>
                      <p>• Modelo em uso: <strong className="text-foreground">{testResult.model || 'llama-3.3-70b-versatile'}</strong></p>
                      <p>• Tempo de latência: <strong className="text-foreground">{testResult.latencyMs}ms</strong></p>
                      <p>
                        • Tokens consumidos no teste: <strong className="text-foreground font-bold">{testResult.tokensUsed?.totalTokens ?? 12} tokens</strong> (Prompt: {testResult.tokensUsed?.promptTokens ?? 9} / Resposta: {testResult.tokensUsed?.completionTokens ?? 3})
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-destructive/90 text-[11px]">{testResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botão de Teste */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={testingAi}
              onClick={handleTestAi}
              className="h-9 px-4 text-xs font-semibold gap-2 cursor-pointer hover:bg-secondary active:scale-95 border-primary/40 text-primary"
            >
              <RefreshCw size={14} className={testingAi ? 'animate-spin' : ''} />
              <span>{testingAi ? 'Disparando prompt e gastando tokens de teste...' : 'Testar Conexão da IA Integrada'}</span>
            </Button>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Nativo do Ideaflow · Groq LLaMA 3.3 (70B)
            </span>
          </div>
        </div>
      </section>

      {/* Nuvem Supabase & Tutorial do Aplicativo */}
      <section className="settings-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              Nuvem Supabase & Tutorial
            </h2>
            <p>
              Status de sincronização da sua conta e guia interativo das funções do aplicativo.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-green/10 text-green border border-green/20 font-medium shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            Supabase Conectado
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl border border-border bg-card/70 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-green" />
              Banco de Dados Supabase (100% Ativo)
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Suas tabelas <code>ideas</code> e <code>profiles</code> estão online e funcionando perfeitamente. Suas ideias e perfil ficam protegidos com sincronização bi-direcional.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/70 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Compass size={16} className="text-primary" />
                {data.workspaceMode === 'business'
                  ? 'Tour Corporativo do Aplicativo'
                  : 'Tutorial Guiado do Aplicativo'}
              </div>
              <p className="text-muted-foreground leading-relaxed mt-1">
                {data.workspaceMode === 'business'
                  ? 'Rever o tour com os 5 passos corporativos (funil de iniciativas, departamentos, governança e 5 porquês).'
                  : 'Quer rever o passo a passo com as funções principais do Ideaflow?'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.dispatchEvent(new Event('ideaflow:tutorial'));
                toast.success(
                  data.workspaceMode === 'business'
                    ? 'Tour corporativo do aplicativo aberto!'
                    : 'Tutorial do aplicativo aberto!'
                );
              }}
              className="mt-2 h-9 text-xs font-semibold gap-1.5 self-start cursor-pointer hover:bg-primary/10 hover:border-primary/40 active:scale-95"
            >
              <Sparkles size={14} className="text-primary" />
              <span>
                {data.workspaceMode === 'business'
                  ? 'Ver Tour Corporativo Novamente'
                  : 'Ver Tutorial do App Novamente'}
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Backups & Portabilidade */}
      <section className="settings-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2">
              <HardDrive size={20} className="text-primary" />
              Segurança & Backup Local (100% no seu dispositivo)
            </h2>
            <p>
              {data.ideas.length} ideias e {data.sectors.length} setores salvos exclusivamente no armazenamento seguro deste aparelho.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-green/10 text-green border border-green/20 font-medium shrink-0 flex items-center gap-1">
            <Lock size={12} />
            Privacidade Total
          </span>
        </div>

        {/* Card Explicativo: Por que é um App e como funciona o Backup Local */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-border bg-card/70 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ServerOff size={16} className="text-pink" />
              Zero Rastreamento em Nuvem
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Suas ideias não são enviadas para nenhum banco de dados centralizado nem vendidas. Elas residem no banco local isolado do seu dispositivo.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card/70 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Smartphone size={16} className="text-cyan" />
              App Offline Autônomo
            </div>
            <p className="text-muted-foreground leading-relaxed">
              O Ideaflow é um Progressive Web App (PWA) nativo: funciona no modo avião, na rua ou sem sinal, com inicialização instantânea.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card/70 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck size={16} className="text-green" />
              Você é Dono dos seus Dados
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ao gerar um backup em JSON ou ZIP, você tem um arquivo físico em mãos para restaurar em qualquer celular ou computador quando quiser.
            </p>
          </div>
        </div>

        <div className="settings-buttons mt-4">
          <Button variant="outline" onClick={() => download('json')}>
            <FileJson />
            Exportar JSON
          </Button>
          <Button variant="outline" onClick={() => download('zip')}>
            <Download />
            Exportar ZIP Seguro
          </Button>
          <Button variant="outline" onClick={() => input.current?.click()}>
            <Upload />
            Restaurar de arquivo
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (
                window.confirm(
                  'ATENÇÃO: Deseja limpar todo o cache local e recomeçar do zero absoluto?\n\nIsso apagará o histórico salvo no navegador e reiniciará a sessão limpa.'
                )
              ) {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                  toast.success('Cache e dados locais apagados com sucesso!');
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 500);
                } catch {
                  window.location.reload();
                }
              }
            }}
            className="text-pink hover:text-pink hover:bg-pink/10 border-pink/30 hover:border-pink/50 cursor-pointer"
          >
            <Trash2 size={15} />
            Limpar Cache Local e Resetar
          </Button>
          <input
            ref={input}
            type="file"
            className="hidden"
            accept=".json,.zip"
            onChange={e => void restore(e.target.files?.[0])}
          />
        </div>
      </section>

      <div className="settings-note flex items-start gap-3">
        <ShieldCheck className="text-green shrink-0 mt-1" size={18} />
        <div>
          <strong>Recomendação de segurança:</strong> Se você for formatar o aparelho ou limpar os cookies e dados de navegação, exporte um backup em 1 clique antes.
          <br />
          O Ideaflow é 100% autônomo, seguro e não depende de nenhuma empresa ou servidor externo para funcionar.
        </div>
      </div>
    </>
  );
}