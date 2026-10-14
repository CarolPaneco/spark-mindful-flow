import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState, useEffect } from 'react';
import {
  Check,
  Download,
  FileJson,
  Moon,
  Sun,
  Upload,
  ShieldCheck,
  Sparkles,
  Key,
  ExternalLink,
  Bot,
  Smartphone,
  HardDrive,
  Lock,
  ServerOff,
  HelpCircle,
} from 'lucide-react';
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { isFlowData, localDate, palettes } from '@/lib/ideaflow';
import {
  getStoredGeminiKey,
  setStoredGeminiKey,
  testGeminiApiKey,
  cleanGeminiKey,
} from '@/lib/ai-assistant';

export const Route = createFileRoute('/ajustes')({
  head: () => ({
    meta: [
      { title: 'Ajustes, Backup & IA · Ideaflow' },
      {
        name: 'description',
        content: 'Personalize as cores do seu espaço, configure a IA gratuita e proteja suas ideias.',
      },
      { property: 'og:title', content: 'Ajustes, Backup & IA · Ideaflow' },
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
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  useEffect(() => {
    const existing = getStoredGeminiKey();
    setGeminiKeyInput(existing);
    setHasKey(Boolean(existing));
  }, []);

  const handleSaveGeminiKey = async () => {
    const clean = cleanGeminiKey(geminiKeyInput);
    if (!clean) {
      setStoredGeminiKey('');
      setHasKey(false);
      setKeyError(null);
      toast.info('Chave removida. O Mentor agora usará o Motor Cognitivo Local 100% gratuito.');
      return;
    }

    setTestingKey(true);
    setKeyError(null);
    try {
      const res = await testGeminiApiKey(clean);
      if (res.success) {
        setStoredGeminiKey(clean);
        setHasKey(true);
        setKeyError(null);
        toast.success(`Chave do Google Gemini validada e salva! Modelo: ${res.model || 'Flash'}.`);
      } else {
        setKeyError(res.error || 'A Google recusou esta chave.');
        toast.error(`Falha ao validar chave com a Google: ${res.error}`);
      }
    } catch (e: any) {
      setKeyError(e?.message || 'Falha de conexão.');
      toast.error(`Falha: ${e?.message}`);
    } finally {
      setTestingKey(false);
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

      {/* Seção de Inteligência Artificial Integrada */}
      <section className="settings-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              Inteligência Artificial (100% Gratuita)
            </h2>
            <p>
              O Ideaflow inclui o <strong>Mentor IA</strong> embutido nativamente, sem nenhum custo
              ou necessidade de cartão de crédito.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-green/10 text-green border border-green/20 font-medium shrink-0">
            {hasKey ? 'Gemini 1.5/2.0 Conectado' : 'Motor Cognitivo Local Ativo'}
          </span>
        </div>

        <div className="mt-4 p-4 rounded-xl border border-border bg-card/60 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Key size={14} className="text-primary" />
            Conectar Chave Gratuita do Google Gemini (Opcional)
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Se quiser turbinar o Mentor com o modelo Gemini Flash oficial, gere uma chave 100%
            gratuita em 30 segundos no{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline inline-flex items-center gap-0.5"
            >
              Google AI Studio
              <ExternalLink size={10} />
            </a>{' '}
            e cole abaixo. Se não quiser, não precisa: o motor local gratuito continuará funcionando
            para sempre.
          </p>

          <div className="flex gap-2 pt-1">
            <input
              type="password"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              placeholder="Cole sua chave gratuita aqui (AIzaSy...)"
              value={geminiKeyInput}
              onChange={e => {
                setGeminiKeyInput(e.target.value);
                if (keyError) setKeyError(null);
              }}
            />
            <Button
              size="sm"
              className="h-8 text-xs primary-action gap-1"
              disabled={testingKey}
              onClick={handleSaveGeminiKey}
            >
              {testingKey ? 'Validando...' : 'Salvar & Validar'}
            </Button>
            {hasKey && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs text-destructive hover:bg-destructive/10"
                disabled={testingKey}
                onClick={() => {
                  setGeminiKeyInput('');
                  setStoredGeminiKey('');
                  setHasKey(false);
                  setKeyError(null);
                  toast.info('Chave removida. Usando motor gratuito.');
                }}
              >
                Remover
              </Button>
            )}
          </div>

          {keyError && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs leading-relaxed mt-2">
              <strong>Atenção:</strong> A Google retornou um erro ao testar sua chave: <br />
              <span className="font-mono text-[11px]">{keyError}</span>
            </div>
          )}
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