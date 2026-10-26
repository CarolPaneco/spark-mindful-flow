import { Idea, Sector, Step, planIdea, generateAiSteps, generateSubModulesAi } from './ideaflow';
import {
  callGroqChat,
  planIdeaWithGroq,
  generateProjectModulesWithGroq,
  isGroqActive,
  DEFAULT_GROQ_KEY,
} from './groq';
import { callIntegratedAiChat } from './integrated-ai';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: 'gemini' | 'groq' | 'local' | 'chatgpt' | undefined;
  model?: string | undefined;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | undefined;
  suggestedActions?: string[] | undefined;
}

export const GEMINI_STORAGE_KEY = 'ideaflow_gemini_key';
export const GROQ_STORAGE_KEY = 'ideaflow_groq_key';
export const PREFERRED_AI_KEY = 'ideaflow_preferred_ai';

export function cleanApiKey(key: string): string {
  if (!key) return '';
  return key.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
}

export function cleanGeminiKey(key: string): string {
  return cleanApiKey(key);
}

export function getActiveGeminiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(GEMINI_STORAGE_KEY) || localStorage.getItem('ideaflow-gemini-key');
    if (stored && stored.trim()) return cleanApiKey(stored);
  }
  const envKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.['VITE_GEMINI_API_KEY'] || process.env?.['GEMINI_API_KEY'] : '');
  if (typeof envKey === 'string' && envKey.trim()) {
    return cleanApiKey(envKey);
  }
  return '';
}

export function getStoredGeminiKey(): string {
  return getActiveGeminiKey();
}

export function setStoredGeminiKey(key: string) {
  if (typeof window === 'undefined') return;
  const cleaned = cleanApiKey(key);
  if (!cleaned) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
    localStorage.removeItem('ideaflow-gemini-key');
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, cleaned);
  }
}

export function getActiveGroqKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(GROQ_STORAGE_KEY) || localStorage.getItem('ideaflow-groq-key');
    if (stored && stored.trim()) return cleanApiKey(stored);
  }
  const envKey =
    (import.meta as any).env?.VITE_GROQ_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.['VITE_GROQ_API_KEY'] || process.env?.['GROQ_API_KEY'] : '');
  if (typeof envKey === 'string' && envKey.trim()) {
    return cleanApiKey(envKey);
  }
  return '';
}

export function setStoredGroqKey(key: string) {
  if (typeof window === 'undefined') return;
  const cleaned = cleanApiKey(key);
  if (!cleaned) {
    localStorage.removeItem(GROQ_STORAGE_KEY);
    localStorage.removeItem('ideaflow-groq-key');
  } else {
    localStorage.setItem(GROQ_STORAGE_KEY, cleaned);
  }
}

export function getPreferredAiProvider(): 'gemini' | 'groq' {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(PREFERRED_AI_KEY);
    if (stored === 'groq' || stored === 'gemini') return stored;
  }
  if (getActiveGeminiKey()) return 'gemini';
  if (getActiveGroqKey()) return 'groq';
  return 'gemini';
}

export function setPreferredAiProvider(provider: 'gemini' | 'groq') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFERRED_AI_KEY, provider);
}

/**
 * Dispara uma chamada centralizada ao endpoint de IA no backend (/api/ai ou /api/gemini).
 */
export async function callAiServer(payload: {
  action: 'test' | 'plan' | 'mentor' | 'project';
  provider?: 'gemini' | 'groq' | undefined;
  apiKey?: string | undefined;
  rawText?: string | undefined;
  sectors?: Sector[] | undefined;
  fiveWhys?: string[] | undefined;
  message?: string | undefined;
  contextText?: string | undefined;
  history?: any[] | undefined;
  projectTitle?: string | undefined;
  projectSummary?: string | undefined;
  sector?: string | undefined;
}): Promise<any> {
  const provider = payload.provider || getPreferredAiProvider();
  const apiKey =
    payload.apiKey || (provider === 'gemini' ? getActiveGeminiKey() : getActiveGroqKey());

  const endpoints = ['/api/ai', '/api/gemini'];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, provider, apiKey }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.success || data.reply || data.parsed || data.modules)) {
          return data;
        }
      }
    } catch {
      // Ignora erro e tenta próximo endpoint
    }
  }

  // Fallback se estiver offline ou servidor sem middleware
  return { success: false, error: 'Servidor de IA indisponível.' };
}

export async function testAiConnection(
  provider: 'gemini' | 'groq',
  apiKey?: string
): Promise<{
  success: boolean;
  model?: string;
  provider?: 'gemini' | 'groq';
  tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
  latencyMs?: number;
  reply?: string;
  error?: string;
}> {
  return callAiServer({
    action: 'test',
    provider,
    apiKey,
  });
}

/**
 * Testa ativamente a chave do Google Gemini fazendo uma chamada mínima.
 * Utiliza o backend seguro (/api/gemini) para evitar bloqueios de CORS no navegador.
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; error?: string; model?: string }> {
  const key = cleanGeminiKey(apiKey);
  if (!key) {
    return { success: false, error: 'Chave não informada.' };
  }

  // 1. Tenta via backend seguro (elimina qualquer problema de CORS no navegador)
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test', apiKey: key }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/gemini indisponível, tentando fallback:', err);
  }

  // 2. Fallback direto caso o endpoint local não esteja acessível
  const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
  let lastError = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Responda apenas: OK' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      });

      if (res.ok) {
        return { success: true, model };
      }

      const errData = await res.json().catch(() => ({}));
      lastError = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;

      if (res.status === 400 && lastError.toLowerCase().includes('api_key')) {
        return { success: false, error: lastError };
      }
      if (res.status === 403 || res.status === 401) {
        return { success: false, error: lastError };
      }
    } catch (err: any) {
      lastError = err?.message || 'Falha de conexão com a API da Google.';
    }
  }

  if (
    !lastError ||
    lastError.toLowerCase().includes('failed to fetch') ||
    lastError.toLowerCase().includes('falha de conexão')
  ) {
    return {
      success: false,
      error:
        'Falha de rede (Failed to fetch). Sua rede atual (firewall corporativo/institucional FortiGate) bloqueou o acesso aos servidores do Google Gemini. Conecte-se em uma rede pessoal (como o 4G do celular ou Wi-Fi de casa) para ativar o Gemini, ou continue utilizando o Motor Local gratuito que funciona 100% offline!',
    };
  }

  return { success: false, error: lastError };
}

/**
 * Constrói um dossiê analítico aprofundado dos funis atuais do criador.
 * Utilizado por Groq, Gemini e pelo Motor Cognitivo Local.
 */
export function generateFunnelDossier(
  allIdeas: Idea[] = [],
  sectors: Sector[] = [],
  contextIdea?: Idea
): string {
  const active = allIdeas.filter(i => !i.archived);
  const stages = ['Faísca', 'Estrutura', 'Em Fluxo', 'Ajustes', 'Realidade'];

  const byStage = {
    0: active.filter(i => i.stage === 0),
    1: active.filter(i => i.stage === 1),
    2: active.filter(i => i.stage === 2),
    3: active.filter(i => i.stage === 3),
    4: active.filter(i => i.stage === 4),
  };

  const urgent = active.filter(i => i.priority === 'Urgente' && i.stage < 4);
  const totalMinutes = active.reduce((s, i) => s + i.minutes, 0);
  const dedicatedMinutes = active.reduce((s, i) => s + i.dedicated, 0);

  let out = `### ESTUDO DO FUNIL EM TEMPO REAL DO CRIADOR:\n`;
  out += `- Total de ideias ativas: ${active.length}\n`;
  out += `- Distribuição por estágios do funil:\n`;
  out += `  • Faísca (ideias brutas/iniciais): ${byStage[0].length} [${byStage[0].map(i => `"${i.title}"`).join(', ') || 'nenhuma'}]\n`;
  out += `  • Estrutura (em planejamento): ${byStage[1].length} [${byStage[1].map(i => `"${i.title}"`).join(', ') || 'nenhuma'}]\n`;
  out += `  • Em Fluxo (em execução ativa): ${byStage[2].length} [${byStage[2].map(i => `"${i.title}"`).join(', ') || 'nenhuma'}]\n`;
  out += `  • Ajustes (refinamento/testes): ${byStage[3].length} [${byStage[3].map(i => `"${i.title}"`).join(', ') || 'nenhuma'}]\n`;
  out += `  • Realidade (concluídas com sucesso): ${byStage[4].length} [${byStage[4].map(i => `"${i.title}"`).join(', ') || 'nenhuma'}]\n`;

  if (urgent.length > 0) {
    out += `- Ideias Urgentes que demandam foco imediato: ${urgent.map(i => `"${i.title}" (Próximo: ${i.immediate})`).join('; ')}\n`;
  }
  out += `- Foco investido: ${dedicatedMinutes} min de ${totalMinutes} min planejados.\n`;

  if (contextIdea) {
    out += `\n### IDEIA SELECIONADA EM DESTAQUE NO CHAT:\n`;
    out += `- Título: "${contextIdea.title}" (Setor: ${contextIdea.sector}, Prioridade: ${contextIdea.priority}, Estágio: ${stages[contextIdea.stage]})\n`;
    out += `- Resumo: "${contextIdea.summary}"\n`;
    out += `- Escopo: "${contextIdea.scope || 'Não informado'}"\n`;
    out += `- Próxima ação imediata: "${contextIdea.immediate}"\n`;
    out += `- Passos:\n${contextIdea.steps.map((st, i) => `  ${i + 1}. [${st.done ? 'FEITO' : 'PENDENTE'}] ${st.text} (${st.minutes} min)`).join('\n')}\n`;
  } else if (active.length > 0) {
    out += `\n### DOSSIÊ DETALHADO DAS IDEIAS ATIVAS:\n`;
    active.slice(0, 10).forEach(i => {
      const pending = i.steps.filter(s => !s.done);
      const done = i.steps.filter(s => s.done);
      out += `• "${i.title}" | Estágio: ${stages[i.stage]} | Setor: ${i.sector} | Prioridade: ${i.priority}\n`;
      out += `  Resumo: ${i.summary}\n`;
      out += `  Passos: ${done.length}/${i.steps.length} concluídos. Próximo passo: "${i.immediate || pending[0]?.text || 'Nenhum'}"\n`;
    });
  }

  return out;
}

/**
 * Normaliza o texto em português brasileiro:
 * 1. Remove acentuação gráfica
 * 2. Limpa pontuações
 * 3. Mapeia gírias e abreviações da internet (vc -> você, oq -> o que, pq -> porque, qm -> quem, blz -> beleza...)
 */
function normalizeQuery(text: string): {
  normalized: string;
  tokens: string[];
  raw: string;
} {
  const raw = text.trim();
  const noAccents = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const cleanPunct = noAccents.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ');

  const slangMap: Record<string, string> = {
    'vc': 'voce',
    'vce': 'voce',
    'oce': 'voce',
    'vcs': 'voces',
    'qm': 'quem',
    'eh': 'e',
    'pq': 'porque',
    'pque': 'porque',
    'pk': 'porque',
    'oq': 'o que',
    'oque': 'o que',
    'kd': 'onde',
    'tb': 'tambem',
    'tbm': 'tambem',
    'blz': 'beleza',
    'flw': 'falou',
    'vlw': 'valeu',
    'obg': 'obrigado',
    'obgd': 'obrigado',
    'obgda': 'obrigada',
    'td': 'tudo',
    'tdo': 'tudo',
    'hj': 'hoje',
    'q': 'que',
    'ia': 'ia',
    'ai': 'ia',
    'gpt': 'chatgpt',
    'app': 'aplicativo',
    'dps': 'depois',
    'msg': 'mensagem',
  };

  const rawTokens = cleanPunct.split(/\s+/).filter(Boolean);
  const mappedTokens: string[] = [];

  for (const t of rawTokens) {
    if (slangMap[t]) {
      mappedTokens.push(...slangMap[t]!.split(' '));
    } else {
      mappedTokens.push(t);
    }
  }

  const normalized = mappedTokens.join(' ');
  return { normalized, tokens: mappedTokens, raw };
}

/**
 * Motor de IA Heurística e Cognitiva Oficial do Ideaflow.
 * Analisa a fundo o funil real do usuário, cruza os estágios e responde
 * diretamente à pergunta feita de forma conversacional, empática e humana (estilo ChatGPT).
 */
function localAiResponse(
  userMessage: string,
  contextIdea?: Idea | undefined,
  allIdeas?: Idea[] | undefined,
  sectors?: Sector[] | undefined
): string {
  const { normalized, raw } = normalizeQuery(userMessage);
  const query = userMessage.toLowerCase().trim();
  const activeIdeas: Idea[] = (allIdeas || []).filter(i => !i.archived);
  const stages = ['Faísca', 'Estrutura', 'Em Fluxo', 'Ajustes', 'Realidade'];

  // 0. INTELIGÊNCIA EMOCIONAL & SAÚDE MENTAL (DEPRESSÃO, ANSIEDADE, EXAUSTÃO, TRISTEZA, BURNOUT)
  const isVulnerable =
    normalized.includes('depress') ||
    normalized.includes('deprimid') ||
    normalized.includes('triste') ||
    normalized.includes('chorar') ||
    normalized.includes('choro') ||
    normalized.includes('angusti') ||
    normalized.includes('desesper') ||
    normalized.includes('ansiedad') ||
    normalized.includes('crise') ||
    normalized.includes('panico') ||
    normalized.includes('exausto') ||
    normalized.includes('exausta') ||
    normalized.includes('burnout') ||
    normalized.includes('sem forca') ||
    normalized.includes('sem energia') ||
    normalized.includes('nao aguento') ||
    normalized.includes('vazio') ||
    normalized.includes('sozinho') ||
    normalized.includes('solidao') ||
    normalized.includes('desanimad') ||
    normalized.includes('desistir') ||
    normalized.includes('cansado da vida');

  if (isVulnerable) {
    return `Eu sinto muito que você esteja passando por esse momento tão difícil, e quero que saiba que eu te ouço com todo o respeito, carinho e acolhimento do mundo. ❤️‍🩹\n\n` +
      `Antes de pensar em qualquer plano, processo ou ideia: **você não precisa ser produtivo hoje. Você não precisa dar conta de nada agora.**\n\n` +
      `A sua vida, o seu bem-estar e o seu coração são infinitamente mais valiosos do que qualquer projeto ou meta no aplicativo. A depressão e o cansaço extremo fazem parecer que estamos sozinhos e que o peso é insuportável — mas esse momento difícil não define quem você é, e **você não precisa carregar isso em silêncio**.\n\n` +
      `🌿 **O que você pode fazer com gentileza por você agora:**\n` +
      `• **Respire sem pressa:** Solte os ombros, beba um copo de água fresca e procure um cantinho silencioso e confortável para deitar ou sentar.\n` +
      `• **Tire todo o peso das cobranças:** Diga para si mesmo(a): *"Hoje eu só preciso descansar e cuidar de mim"*. Não se culpe por parar.\n` +
      `• **Converse com quem te ama:** Mande uma mensagem sincera para um amigo querido, familiar ou parceiro. Falar sobre o que dói alivia a alma.\n` +
      `• **Apoio profissional e gratuito:** No Brasil, o **CVV (Centro de Valorização da Vida)** oferece escuta amiga, gratuita e 24h por dia. Basta ligar para o número **188** ou acessar [cvv.org.br](https://www.cvv.org.br).\n\n` +
      `Suas ideias no Ideaflow vão ficar aqui guardadas com carinho, esperando pelo momento em que você estiver bem e descansado(a).\n\n` +
      `Se você quiser desabafar mais sobre o que está sentindo, estou aqui para te ouvir sem nenhum julgamento. Você quer me contar o que aconteceu?`;
  }

  // 1. IDENTIDADE E PROPÓSITO: QUEM É VOCÊ / QUEM É VC / O QUE VOCÊ FAZ / QUAL SEU NOME
  const isIdentity =
    normalized.includes('quem e voce') ||
    normalized.includes('quem e vc') ||
    normalized.includes('qm e vc') ||
    normalized.includes('quem e tu') ||
    normalized.includes('quem e o mentor') ||
    normalized.includes('qual o seu nome') ||
    normalized.includes('qual e seu nome') ||
    normalized.includes('qual seu nome') ||
    normalized.includes('o que voce e') ||
    normalized.includes('oque voce e') ||
    normalized.includes('o que e voce') ||
    normalized.includes('o que voce faz') ||
    normalized.includes('oque voce faz') ||
    normalized.includes('como voce funciona') ||
    normalized.includes('como funciona voce') ||
    normalized.includes('como voce me ajuda') ||
    normalized.includes('como me ajuda') ||
    normalized.includes('voce e um robo') ||
    normalized.includes('voce e robo') ||
    normalized.includes('voce e uma ia') ||
    normalized.includes('voce e ia') ||
    normalized.includes('voce e chatgpt') ||
    normalized.includes('voce e o chatgpt') ||
    normalized.includes('quem te criou') ||
    normalized.includes('quem criou voce') ||
    normalized.includes('quem te inventou') ||
    normalized.includes('quem te fez') ||
    normalized.includes('quem fez voce') ||
    normalized.includes('apresente se') ||
    normalized.includes('se apresente') ||
    normalized === 'quem e' ||
    normalized === 'quem e voce';

  if (isIdentity) {
    return `Olá! Eu sou o **Mentor Ideaflow** — sua inteligência artificial oficial e copiloto inteligente integrado aqui no app! 🧠✨\n\n` +
      `Eu funciono exatamente como o seu ChatGPT pessoal para ideias, rotina e projetos:\n\n` +
      `• **Conversa Aberta e Humana:** Pode me perguntar qualquer coisa, tirar dúvidas de tecnologia, negócios, vida pessoal, pedir conselhos ou apenas trocar uma ideia descontraída.\n` +
      `• **Estrategista de Funis em Tempo Real:** Acompanho suas ideias nos 5 estágios (*Faísca ➔ Estrutura ➔ Em Fluxo ➔ Ajustes ➔ Realidade*) e te ajudo a priorizar a próxima ação sem se perder.\n` +
      `• **Destravador de Procrastinação:** Se você estiver com preguiça ou travado, eu quebro seus objetivos em micro-passos leves de 15 minutos para fazer a engrenagem girar.\n` +
      `• **Acolhimento Real:** Respeito sua energia. Se você estiver cansado(a) ou em um dia difícil, estou aqui para acolher com empatia, sem cobrança de produtividade tóxica.\n\n` +
      `Pode conversar comigo com total naturalidade! Como posso te ajudar ou sobre o que você quer conversar agora?`;
  }

  // 2. SAUDAÇÕES, CUMPRIMENTOS E CONVERSA CASUAL (OI, TUDO BEM, BOM DIA...)
  const isGreeting =
    /^(oi|oie|ola|opa|e ai|fala ai|salve|hey|hello|bom dia|boa tarde|boa noite|tudo bem|tudo bom|como vai|como voce esta|como voce ta|td bem|blz)[\s!?.]*$/i.test(
      normalized
    ) ||
    normalized === 'oi tudo bem' ||
    normalized === 'oi tudo bom' ||
    normalized === 'ola tudo bem' ||
    normalized === 'ola tudo bom' ||
    (normalized.startsWith('oi ') && normalized.length < 30) ||
    (normalized.startsWith('ola ') && normalized.length < 30) ||
    (normalized.startsWith('opa ') && normalized.length < 25) ||
    (normalized.startsWith('bom dia') && normalized.length < 25) ||
    (normalized.startsWith('boa tarde') && normalized.length < 25) ||
    (normalized.startsWith('boa noite') && normalized.length < 25);

  if (isGreeting) {
    const greetingHour = new Date().getHours();
    const timeGreeting = greetingHour < 12 ? 'Bom dia' : greetingHour < 18 ? 'Boa tarde' : 'Boa noite';
    const activeCount = activeIdeas.length;

    return `Olá! ${timeGreeting}! Tudo ótimo por aqui, e com você? Como está seu dia hoje? 😊\n\n` +
      `Estou aqui com você como seu mentor e parceiro de conversa. Podemos bater um papo aberto, organizar ideias que estão soltas na sua cabeça, destravar alguma dúvida ou analisar o seu funil${
        activeCount > 0 ? ` (já estou acompanhando suas **${activeCount} ideia(s)** ativas)` : ''
      }.\n\n` +
      `O que está passando pela sua mente agora? Pode falar à vontade! ✨`;
  }

  // 3. AGRADECIMENTOS E CORDIALIDADE
  const isGratitude =
    /^(obrigad[oa]|valeu|show|perfeito|maravilha|otimo|top|muito bom|tmj|sensacional|agradeco|boa|legal)[\s!?.]*$/i.test(normalized) ||
    normalized.includes('muito obrigado') ||
    normalized.includes('muito obrigada') ||
    normalized.includes('valeu mesmo') ||
    normalized.includes('valeu amigo');

  if (isGratitude) {
    return `Por nada! Fico muito feliz em caminhar junto com você nessa jornada. Conte sempre comigo! 🌟\n\n` +
      `Sempre que surgir uma nova ideia, um desafio para destravar ou se só quiser pensar junto, é só me chamar aqui no chat. Vamos em frente! 🚀`;
  }

  // 4. PIADAS, HUMOR E DESCONTRAÇÃO
  const isJoke =
    normalized.includes('piada') ||
    normalized.includes('me faz rir') ||
    normalized.includes('conta uma piada') ||
    normalized.includes('algo engracado');

  if (isJoke) {
    return `Aqui vai uma para descontrair: 😂\n\n` +
      `*Por que os programadores preferem o modo escuro?*\n` +
      `*Porque a luz atrai bugs!* 🐛💡\n\n` +
      `E mais uma:\n` +
      `*O que o café disse para o açúcar na segunda-feira de manhã?*\n` +
      `*"Sem você, a vida é amarga demais!"* ☕\n\n` +
      `Bora dar risada e seguir em frente! O que mais manda por aí?`;
  }

  // 5. FILOSOFIA & SENTIDO DA VIDA
  const isPhilosophy =
    normalized.includes('sentido da vida') ||
    normalized.includes('o que e a vida') ||
    normalized.includes('por que existimos') ||
    normalized.includes('porque existimos') ||
    normalized.includes('qual o proposito') ||
    normalized.includes('qual o sentido');

  if (isPhilosophy) {
    return `Essa é uma das perguntas mais bonitas e profundas da humanidade! 🌌✨\n\n` +
      `Para mim, o sentido da vida não é algo estático que a gente "encontra" pronto jogado pelo caminho, mas sim algo que a gente **constrói ativamente** todos os dias:\n\n` +
      `1. **Estar presente:** Viver de verdade os momentos com quem amamos e nas coisas simples do cotidiano.\n` +
      `2. **Criar e materializar:** Tirar ideias da mente e trazer para o mundo real — seja uma conversa sincera, um projeto criativo, uma melhoria na sua casa ou um ato de carinho.\n` +
      `3. **Evoluir com gentileza:** Aceitar nossas falhas, cuidar da nossa mente e nos tornarmos 1% mais sábios e compreensivos a cada ciclo.\n\n` +
      `Como dizia Viktor Frankl: *"Aquele que tem um 'porquê' para viver pode suportar quase qualquer 'como'"*.\n\n` +
      `E para você, o que mais traz brilho nos olhos e significado aos seus dias hoje?`;
  }

  // 6. SOBRE O IDEAFLOW / COMO FUNCIONA O APLICATIVO
  const isAboutIdeaflow =
    normalized.includes('o que e o ideaflow') ||
    normalized.includes('o que e ideaflow') ||
    normalized.includes('como funciona o ideaflow') ||
    normalized.includes('como funciona o app') ||
    normalized.includes('como funciona o aplicativo') ||
    normalized.includes('como usar o ideaflow') ||
    normalized.includes('como usar o app') ||
    normalized.includes('me explica o ideaflow') ||
    normalized.includes('me explica o app') ||
    normalized.includes('tutorial');

  if (isAboutIdeaflow) {
    return `O **Ideaflow** é o seu fluxo consciente para transformar ideias soltas em realizações práticas, com leveza e sem ansiedade! 🌊💡\n\n` +
      `Aqui está como o app funciona de forma simples:\n\n` +
      `1. **Setores (Seus Universos):** Suas ideias são organizadas por áreas de vida (ex: Tecnologia, Negócios, Saúde, Pessoal, Casa). Você pode criar, editar ou excluir setores quando quiser.\n` +
      `2. **Os 5 Estágios do Funil:**\n` +
      `   • 🌟 **Faísca:** O lampejo inicial que acabou de surgir na mente.\n` +
      `   • 📐 **Estrutura:** Quando você define 3 passos concretos de até 25 minutos.\n` +
      `   • ⚡ **Em Fluxo:** A ideia em execução física ativa.\n` +
      `   • 🔧 **Ajustes:** Testes finais, acabamento e polimento.\n` +
      `   • 🏆 **Realidade:** A ideia concluída e entregue com sucesso!\n` +
      `3. **Aba Hoje & Bloco de Foco (25 min):** Um temporizador Pomodoro integrado para você sentar, focar em uma única ação física sem distrações e avançar.\n` +
      `4. **Mentor IA Integrado:** Eu mesmo! Seu parceiro para pensar junto, tirar dúvidas e analisar seus funis a qualquer momento.\n\n` +
      `Você pode tocar no botão **+** na barra inferior para capturar sua primeira ideia agora mesmo!`;
  }

  // 7. O QUE É FUNIL DE IDEIAS
  const isAboutFunnel =
    normalized.includes('o que e funil') ||
    normalized.includes('o que e um funil') ||
    normalized.includes('como funciona o funil') ||
    normalized.includes('estagios do funil') ||
    normalized.includes('etapas do funil');

  if (isAboutFunnel) {
    return `Um **Funil de Ideias** é o caminho visual que separa um simples pensamento de uma realização concluída no mundo real! 🎯\n\n` +
      `Geralmente temos dezenas de pensamentos por dia, mas tentar fazer tudo de uma vez gera paralisia por análise. O funil resolve isso filtrando sua energia em 5 fases sequenciais:\n\n` +
      `1. **Faísca (Entrada do Funil):** Onde você despeja ideias brutas sem se preocupar com perfeição.\n` +
      `2. **Estrutura (Filtro & Plano):** Onde você escolhe quais ideias valem a pena e divide em passos curtos.\n` +
      `3. **Em Fluxo (Gargalo de Ação):** Onde você limita o trabalho em progresso (WIP). O ideal é ter no máximo 1 ou 2 ideias aqui ao mesmo tempo!\n` +
      `4. **Ajustes (Refinamento):** Onde você lapida detalhes e revisa o resultado.\n` +
      `5. **Realidade (Saída Realizada):** Ideia entregue e celebrada!\n\n` +
      `Quer que eu analise como as suas ideias estão distribuídas no seu funil agora?`;
  }

  // 8. DICAS DE PRODUTIVIDADE, ROTINA E FOCO
  const isProductivityTips =
    normalized.includes('como focar') ||
    normalized.includes('como ter foco') ||
    normalized.includes('como ter disciplina') ||
    normalized.includes('como ser produtivo') ||
    normalized.includes('rotina produtiva') ||
    normalized.includes('como estudar') ||
    normalized.includes('metodo pomodoro') ||
    normalized.includes('dicas de foco');

  if (isProductivityTips) {
    return `Para ter um foco real e sustentável, o segredo não é força de vontade bruta, mas sim **reduzir o atrito e as distrações**: 🧠⚡\n\n` +
      `Aqui estão 3 técnicas comprovadas pela neurociência:\n\n` +
      `1. **A Regra da Aba Única:** Feche todas as abas e notificações do celular. Nosso cérebro perde até 23 minutos para voltar ao foco profundo após uma única interrupção.\n` +
      `2. **Blocos de 25 Minutos (Pomodoro):** Trabalhe intensamente por 25 minutos e descanse 5 minutos longe da tela. O Ideaflow tem esse temporizador na aba **'Hoje'**!\n` +
      `3. **Micro-passos ridiculamente fáceis:** Quando uma tarefa parece pesada, seu cérebro procrastina para poupar energia. Quebre a tarefa até que o primeiro passo leve apenas 2 minutos para começar.\n\n` +
      `Topa abrir a aba **'Hoje'** agora e rodar um bloco de 25 minutos focado?`;
  }

  // 9. DÚVIDA / DECISÃO: NÃO SEI O QUE ESCOLHER
  const isDecisionDoubt =
    normalized.includes('estou em duvida') ||
    normalized.includes('nao sei o que escolher') ||
    normalized.includes('nao sei oque escolher') ||
    normalized.includes('o que e melhor') ||
    normalized.includes('qual escolher') ||
    normalized.includes('me ajuda a decidir') ||
    normalized.includes('o que voce escolheria');

  if (isDecisionDoubt) {
    return `Tomar decisões pode ser exaustivo, mas aqui está um método rápido para clarear a mente: 🤔💡\n\n` +
      `Faça essas 3 perguntas para as suas opções:\n\n` +
      `1. **Qual delas tem o menor custo de reversão?** Se você escolher a Opção A e não der certo, é fácil voltar atrás? Escolha sempre decisões reversíveis primeiro para testar rápido.\n` +
      `2. **O Teste das 48 Horas:** Imagine que você escolheu uma das opções com 100% de certeza. Como seu estômago e sua respiração reagem nas próximas horas? Alívio ou peso?\n` +
      `3. **A Regra do Arrependimento de 80 Anos:** Quando você tiver 80 anos olhando para trás, de qual caminho você mais se arrependeria de NÃO ter tentado?\n\n` +
      `Me conte aqui: quais são as opções que estão disputando espaço na sua mente? Vamos analisar os prós e contras juntos!`;
  }

  // 4. BRAINSTORMING, CRIAÇÃO DE NOVAS IDEIAS E PROJETOS
  const isBrainstorm =
    query.includes('estou pensando em') ||
    query.includes('quero criar') ||
    query.includes('quero fazer') ||
    query.includes('tive uma ideia') ||
    query.includes('ideia de') ||
    query.includes('sugestão de projeto') ||
    query.includes('sugestao de projeto') ||
    query.includes('como montar') ||
    query.includes('como criar');

  if (isBrainstorm) {
    return `Essa ideia parece excelente! Adorei a iniciativa de dar o primeiro passo. 💡✨\n\n` +
      `Para te ajudar a tirar isso da cabeça e transformar em realidade prática, aqui estão 3 reflexões rápidas:\n\n` +
      `1. **Quem é o público ou quem mais vai se beneficiar disso?** (Você mesmo, seus clientes, sua família ou sua equipe?)\n` +
      `2. **Qual é a menor versão possível (o MVP)?** O que você conseguiria colocar no ar ou testar em poucos dias, sem precisar de ferramentas complexas?\n` +
      `3. **Primeiro micro-passo de 15 minutos:** Qual é a primeira coisa concreta que você pode escrever, pesquisar ou rascunhar ainda hoje?\n\n` +
      `Se quiser, toque no botão **+** na barra inferior para capturar essa faísca agora no Ideaflow, ou me conte mais detalhes aqui no chat para irmos refinando juntos!`;
  }

  // 5. VERIFICA SE O USUÁRIO CITOU OU SE REFERIU A UMA IDEIA ESPECÍFICA DO FUNIL
  const matchedIdea =
    contextIdea ||
    activeIdeas.find(i => {
      const titleLower = i.title.toLowerCase();
      if (query.includes(titleLower)) return true;
      // Quebra o título em palavras significativas (>= 4 letras)
      const words = titleLower.split(/\s+/).filter(w => w.length >= 4);
      return words.some(w => query.includes(w));
    });

  if (matchedIdea && (query.includes('passo') || query.includes('etapa') || query.includes('fazer') || query.includes('como') || query.includes('ajud') || query.includes('status') || query.includes('oque') || query.includes('o que') || query.includes('próximo') || query.includes('proximo'))) {
    const doneSteps = matchedIdea.steps.filter(s => s.done);
    const pendingSteps = matchedIdea.steps.filter(s => !s.done);
    const nextStep = pendingSteps[0]?.text || matchedIdea.immediate || 'Definir o próximo marco de 15 minutos.';

    return `Analisando sua ideia **"${matchedIdea.title}"**:\n\n` +
      `• **Estágio Atual:** ${stages[matchedIdea.stage]} (Setor: ${matchedIdea.sector} | Prioridade: ${matchedIdea.priority})\n` +
      `• **Progresso:** ${doneSteps.length} de ${matchedIdea.steps.length} passos concluídos (${matchedIdea.dedicated} min de foco investidos de ${matchedIdea.minutes} min totais).\n` +
      (matchedIdea.scope ? `• **Escopo Definido:** *"${matchedIdea.scope}"*\n\n` : '\n') +
      `🎯 **Sua Próxima Ação de Maior Alavancagem:**\n` +
      `> **"${nextStep}"**\n\n` +
      `💡 **Diagnóstico do Mentor para essa ideia:**\n` +
      (matchedIdea.stage === 0
        ? `Ela ainda está no estágio de **Faísca**. Para destravar, o segredo não é tentar fazer tudo, mas transformar esse rascunho em 3 passos concretos de até 25 minutos na aba 'Estrutura'.`
        : matchedIdea.stage === 1
        ? `Ela já tem estrutura! O momento agora é puxar essa ideia para a aba **'Hoje'** e abrir um bloco de foco de 15 minutos para fazer a primeira ação física.`
        : matchedIdea.stage === 2
        ? `Esta ideia já está **Em Fluxo**! Faltam apenas ${pendingSteps.length} passo(s) pendentes. Foque em concluir um passo de cada vez para que ela alcance a etapa de Ajustes.`
        : matchedIdea.stage === 3
        ? `Quase lá! Esta ideia está em **Ajustes**. Faça o teste final e mova para **Realidade**!`
        : `Esta ideia já é uma **Realidade Concluída**! Parabéns pela entrega! 🏆`);
  }

  // 6. DIAGNÓSTICO PROFUNDO DO FUNIL DO CRIADOR (QUANDO PERGUNTADO SOBRE FUNIL, STATUS OU GARGALOS)
  if (
    query.includes('funil') ||
    query.includes('status') ||
    query.includes('gargalo') ||
    query.includes('analis') ||
    query.includes('como estão') ||
    query.includes('como estao') ||
    query.includes('visão geral') ||
    query.includes('visao geral') ||
    query.includes('diagnost')
  ) {
    if (activeIdeas.length === 0) {
      return `📊 **Diagnóstico do seu Funil de Ideias:**\n\n` +
        `Seu funil está atualmente **zerado e limpo**! Isso é perfeito para começar sem ruídos ou dados antigos acumulados.\n\n` +
        `🎯 **Sua Primeira Missão:**\n` +
        `1. Vá até a aba **Setores** e crie ou escolha seu primeiro Universo (como Tecnologia, Relacionamento ou Saúde).\n` +
        `2. Capture sua primeira faísca no botão **+**!\n\n` +
        `Assim que cadastrar, eu analisarei os estágios e te mostrarei onde colocar sua energia! ✨`;
    }

    const stage0 = activeIdeas.filter(i => i.stage === 0);
    const stage1 = activeIdeas.filter(i => i.stage === 1);
    const stage2 = activeIdeas.filter(i => i.stage === 2);
    const stage3 = activeIdeas.filter(i => i.stage === 3);
    const stage4 = activeIdeas.filter(i => i.stage === 4);

    const urgentPending = activeIdeas.filter(i => i.priority === 'Urgente' && i.stage < 4);
    const inFlowCount = stage2.length;

    let diagnosis = `📊 **Diagnóstico Aprofundado do seu Funil de Ideias:**\n\n`;
    diagnosis += `Você tem **${activeIdeas.length} ideia(s) ativas** mapeadas no sistema. Veja exatamente como elas estão distribuídas pelas 5 etapas de realização:\n\n`;

    diagnosis += `1. 🌟 **Faísca (${stage0.length}):** ${stage0.length > 0 ? stage0.map(i => `*${i.title}*`).join(', ') : 'Nenhuma ideia acumulada aqui (excelente!).'}\n`;
    diagnosis += `2. 📐 **Estrutura (${stage1.length}):** ${stage1.length > 0 ? stage1.map(i => `*${i.title}*`).join(', ') : 'Nenhuma ideia em planejamento preliminar.'}\n`;
    diagnosis += `3. ⚡ **Em Fluxo (${stage2.length}):** ${stage2.length > 0 ? stage2.map(i => `*${i.title}*`).join(', ') : 'Nenhuma em execução ativa no momento.'}\n`;
    diagnosis += `4. 🔧 **Ajustes (${stage3.length}):** ${stage3.length > 0 ? stage3.map(i => `*${i.title}*`).join(', ') : 'Nenhuma em fase de testes.'}\n`;
    diagnosis += `5. 🏆 **Realidade (${stage4.length}):** ${stage4.length > 0 ? stage4.map(i => `*${i.title}*`).join(', ') : 'Ainda buscando a primeira realização completa!'}\n\n`;

    diagnosis += `🔍 **Análise Crítica de Gargalos & Tração:**\n`;
    if (inFlowCount > 2) {
      diagnosis += `⚠️ **Atenção ao Foco Disperso:** Você tem ${inFlowCount} ideias no estágio 'Em Fluxo' ao mesmo tempo (${stage2.map(i => `"${i.title}"`).join(', ')}). Quem tenta avançar 3 frentes ao mesmo tempo avança 3x mais devagar. Escolha apenas **1** para levar até 'Realidade' antes de destravar as outras.\n\n`;
    } else if (stage0.length > 3) {
      diagnosis += `⚠️ **Excesso de Faíscas Sem Estrutura:** Há ${stage0.length} ideias no rascunho inicial. Escolha a mais empolgante e defina 3 passos práticos para puxá-la para a 'Estrutura'.\n\n`;
    } else {
      diagnosis += `✅ **Fluxo Equilibrado:** Seu funil está fluindo de maneira harmoniosa, sem grandes acúmulos.\n\n`;
    }

    if (urgentPending.length > 0) {
      const topUrgent = urgentPending[0]!;
      diagnosis += `🔥 **Ideia Prioritária Recomendada Hoje:** **"${topUrgent.title}"** (Marcada como Urgente). Próxima ação: *"${topUrgent.immediate}"*.`;
    } else if (stage2.length > 0) {
      const topFlow = stage2[0]!;
      diagnosis += `🎯 **Ideia Prioritária Recomendada Hoje:** **"${topFlow.title}"** (Já está Em Fluxo). Próxima ação: *"${topFlow.immediate}"*.`;
    } else if (activeIdeas.length > 0) {
      const topIdea = activeIdeas[0]!;
      diagnosis += `🎯 **Próximo Passo Recomendado:** Avance na ideia **"${topIdea.title}"** executando a ação: *"${topIdea.immediate}"*.`;
    }

    return diagnosis;
  }

  // 7. PRIORIZAÇÃO & FOCO: O QUE DEVO FAZER HOJE / POR ONDE COMEÇAR?
  if (
    query.includes('prioridade') ||
    query.includes('o que fazer hoje') ||
    query.includes('oque fazer hoje') ||
    query.includes('por onde começo') ||
    query.includes('por onde comeco') ||
    query.includes('qual focar') ||
    query.includes('qual escolher') ||
    query.includes('qual comeco')
  ) {
    if (activeIdeas.length === 0) {
      return `Como seu **Mentor Ideaflow**, notei que você ainda não tem ideias cadastradas no funil!\n\n` +
        `Para começar com o pé direito:\n` +
        `1. Crie seu primeiro Setor (ex: Tecnologia, Saúde, Vida Pessoal).\n` +
        `2. Cadastre uma faísca simples que você quer ver realizada esta semana.\n` +
        `Depois volte aqui que eu te guiarei passo a passo! 🚀`;
    }

    const urgent = activeIdeas.find(i => i.priority === 'Urgente' && i.stage < 4);
    const inFlow = activeIdeas.find(i => i.stage === 2);
    const structured = activeIdeas.find(i => i.stage === 1);
    const chosen = urgent || inFlow || structured || activeIdeas[0]!;

    return `🎯 **Sua Prioridade Absoluta Hoje: "${chosen.title}"**\n\n` +
      `Estudei suas ideias ativas e selecionei esta por um motivo claro:\n` +
      `• **Critério de Escolha:** ${
        chosen.priority === 'Urgente'
          ? 'Ela possui a etiqueta **Urgente** e precisa de atenção para não virar gargalo.'
          : chosen.stage === 2
          ? 'Ela já está na fase **Em Fluxo**! Concluir o que já foi iniciado traz 10x mais alívio mental do que começar algo novo.'
          : 'Ela está bem estruturada e pronta para o primeiro bloco de execução.'
      }\n` +
      `• **Setor:** ${chosen.sector} | **Estágio:** ${stages[chosen.stage]}\n` +
      `• **Ação Imediata de 15 Minutos:**\n` +
      `  > **"${chosen.immediate}"**\n\n` +
      `⏱️ **Roteiro de 25 minutos:**\n` +
      `1. Abra o card de **"${chosen.title}"** no Ideaflow.\n` +
      `2. Toque em **"Começar foco"** (temporizador de 25 min).\n` +
      `3. Faça unicamente este passo e marque como concluído.\n\n` +
      `Topa fazer esse bloco de foco agora?`;
  }

  // 8. DESTRAVANDO PROCRASTINAÇÃO E PARALISIA
  if (
    query.includes('procrastin') ||
    query.includes('destrav') ||
    query.includes('bloquei') ||
    query.includes('preguiça') ||
    query.includes('desanim') ||
    query.includes('difícil') ||
    query.includes('dificil')
  ) {
    const focusIdea = matchedIdea || activeIdeas.find(i => i.stage < 4);
    const ideaMention = focusIdea ? ` especialmente em **"${focusIdea.title}"**` : '';

    return `Vamos destravar esse nó agora mesmo${ideaMention}! ⚡🧠\n\n` +
      `A procrastinação quase nunca é preguiça. Ela é uma resposta de defesa do cérebro quando o passo está **vago demais** ou quando temos medo inconsciente de não ficar perfeito.\n\n` +
      `🔥 **A Regra dos 5 Minutos (Quebra de Atrito Estático):**\n` +
      `1. **Não tente terminar o projeto hoje.** Comprometa-se apenas a mexer nele por **5 minutos cronometrados**.\n` +
      `2. **Reduza o passo até ficar ridículo de fácil:** Em vez de "escrever o texto todo" ou "programar a funcionalidade", seu único objetivo é "abrir o arquivo e escrever 2 linhas".\n` +
      `3. Se após 5 minutos você quiser parar, tem permissão total. Em 85% dos casos, o atrito se quebra e você continua focado com satisfação.\n\n` +
      (focusIdea
        ? `🎯 **Sua micro-ação em "${focusIdea.title}":**\n` +
          `> Execute apenas: *"${focusIdea.immediate}"* durante 10 minutos!\n\n`
        : '') +
      `💡 *Lembrete:* Um passo pequeno e feito hoje vale infinitamente mais que um plano genial que só existe na imaginação.`;
  }

  // 10. RECOMENDAÇÕES (LIVROS, FILMES, SÉRIES, PODCASTS, MÚSICAS)
  const isRecommendation =
    normalized.includes('indica um filme') ||
    normalized.includes('indica filme') ||
    normalized.includes('dica de filme') ||
    normalized.includes('indica um livro') ||
    normalized.includes('indica livro') ||
    normalized.includes('dica de livro') ||
    normalized.includes('indica uma serie') ||
    normalized.includes('indica serie') ||
    normalized.includes('dica de serie') ||
    normalized.includes('indica podcast') ||
    normalized.includes('dica de podcast') ||
    normalized.includes('musica para focar') ||
    normalized.includes('musica para estudar');

  if (isRecommendation) {
    if (normalized.includes('livro')) {
      return `Aqui estão 3 livros extraordinários que transformam a maneira como pensamos e agimos: 📚✨\n\n` +
        `1. **Hábitos Atômicos (James Clear):** O melhor guia do mundo sobre como mudanças de 1% diárias constroem resultados inacreditáveis a longo prazo.\n` +
        `2. **Essencialismo (Greg McKeown):** A arte de dizer não para o trivial e dedicar toda a sua energia unicamente ao que é vital.\n` +
        `3. **A Coragem de Não Agradar (Ichiro Kishimi):** Uma lição libertadora sobre psicologia adleriana, autoestima e foco no seu próprio círculo de controle.\n\n` +
        `Algum desses temas te chama mais a atenção agora?`;
    }

    if (normalized.includes('serie') || normalized.includes('filme')) {
      return `Aqui estão excelentes indicações para inspirar e entreter: 🎬🍿\n\n` +
        `• **Interestelar:** Obra-prima sobre ciência, amor, tempo e a perseverança humana.\n` +
        `• **A Rede Social:** Um mergulho dinâmico e brilhante na faísca inicial de construção de um projeto global.\n` +
        `• **Halt and Catch Fire (Série):** Um retrato profundo e apaixonante sobre criadores, tecnologia e a coragem de arriscar.\n\n` +
        `Quer algo mais leve para relaxar ou algo instigante para pensar?`;
    }

    return `Para foco profundo e concentração, recomendo ouvir **Lo-Fi Beats**, **Synthwave Instrumental** ou playlists de **Brown Noise (Ruído Marrom)** no fone de ouvido! 🎧⚡\n\n` +
      `Eles acalmam o sistema límbico e criam uma barreira acústica contra distrações externas. Topa colocar um som e abrir um bloco de foco?`;
  }

  // 11. BATE-PAPO CASUAL E COTIDIANO (FOME, SONO, PREGUIÇA, CANSAÇO LEVE)
  const isCasualLife =
    normalized.includes('com fome') ||
    normalized.includes('com sono') ||
    normalized.includes('com preguica') ||
    normalized.includes('com frio') ||
    normalized.includes('com calor') ||
    normalized.includes('como foi seu dia');

  if (isCasualLife) {
    if (normalized.includes('fome')) {
      return `Hora de reabastecer o combustível! 🥪🍎\n\n` +
        `Não dá para ter clareza mental com o estômago vazio. Faça uma pausa agora, prepare um lanche gostoso, tome uma água fresca e depois volte com a energia renovada. O que você vai comer de bom?`;
    }
    if (normalized.includes('sono') || normalized.includes('preguica')) {
      return `O corpo e a mente dão sinais claros quando precisam de uma pausa. 🥱🛋️\n\n` +
        `Se for sono acumulado, um cochilo de 20 minutos (power nap) ou uma boa noite de descanso faz milagres pela criatividade. Se for apenas preguiça momentânea, lave o rosto com água gelada e dê uma caminhada rápida de 5 minutos para oxigenar o cérebro!\n\n` +
        `O que acha de dar esse intervalo para você agora?`;
    }
    return `Por aqui tudo ótimo, funcionando a todo vapor no processamento para te apoiar! 🚀 E o seu dia, como está sendo até agora?`;
  }

  // 12. TECNOLOGIA, PROGRAMAÇÃO E IA
  const isTechTopic =
    normalized.includes('programacao') ||
    normalized.includes('linguagem') ||
    normalized.includes('python') ||
    normalized.includes('javascript') ||
    normalized.includes('react') ||
    normalized.includes('frontend') ||
    normalized.includes('backend') ||
    normalized.includes('inteligencia artificial') ||
    normalized.includes('chatgpt') ||
    normalized.includes('algoritmo');

  if (isTechTopic) {
    return `Esse é um dos meus assuntos favoritos no mundo da tecnologia! 💻🤖\n\n` +
      `O ecossistema moderno está evoluindo a passos largos. Seja na construção de interfaces com React e TypeScript, na automação com Python, ou na orquestração de modelos de inteligência artificial, o mais importante não é tentar saber todas as bibliotecas de cor, mas sim **dominar os fundamentos e a lógica de resolução de problemas**.\n\n` +
      `Você está estudando ou trabalhando em algum projeto técnico agora? Se quiser, pode colar o código ou a dúvida técnica aqui que a gente resolve juntos!`;
  }

  // 13. RESPOSTA CONVERSACIONAL INTELIGENTE PARA DEMAIS DÚVIDAS E PERGUNTAS (ESTILO CHATGPT)
  const isQuestion = raw.includes('?') ||
    normalized.startsWith('como ') ||
    normalized.startsWith('qual ') ||
    normalized.startsWith('o que ') ||
    normalized.startsWith('por que ') ||
    normalized.startsWith('porque ') ||
    normalized.startsWith('quando ') ||
    normalized.startsWith('onde ') ||
    normalized.startsWith('quem ');

  if (isQuestion) {
    return `Essa é uma ótima questão para refletirmos! 💡\n\n` +
      `Analisando sobre **"${raw.replace(/[?]/g, '').trim()}"**, aqui estão os pontos mais importantes para se levar em consideração:\n\n` +
      `1. **Clareza de Objetivo:** Antes de qualquer ação, tenha muito nítido qual é o resultado que você quer alcançar e o que pode ser deixado de lado.\n` +
      `2. **Passo Prático e Realista:** A melhor solução costuma ser a mais simples e viável de colocar em prática hoje, sem inventar complexidades desnecessárias.\n` +
      `3. **Iteração Rápida:** Em vez de buscar uma resposta 100% perfeita de primeira, teste em pequena escala e ajuste com base no aprendizado.\n\n` +
      `O que você acha dessa abordagem? Me dê mais detalhes do que você está planejando ou pensando sobre isso para aprofundarmos!`;
  }

  // 14. BATE-PAPO LIVRE E ABERTO
  return `Concordo com a reflexão que você trouxe! 💭✨\n\n` +
    `Trocar ideias sobre esses temas ajuda muito a clarear o pensamento e enxergar novas perspectivas.\n\n` +
    `Quer aprofundar mais esse ponto de vista, tirar alguma dúvida específica ou prefere direcionar a conversa para alguma ideia ou projeto prático? Estou à sua disposição!`;
}

/**
 * Chamada à API oficial do Google Gemini com histórico conversacional completo.
 * Implementa alternância estrita de turnos (user -> model) e suporte a failover de modelos.
 */
async function callGeminiApiWithHistory({
  apiKey,
  message,
  contextText,
  history = [],
}: {
  apiKey: string;
  message: string;
  contextText: string;
  history?: { role: 'user' | 'model'; text: string }[];
}): Promise<string> {
  const cleanKey = cleanGeminiKey(apiKey);
  if (!cleanKey) throw new Error('Chave do Gemini não configurada.');

  const systemInstruction = `Você é o Mentor Ideaflow Oficial, um copiloto humano de alta empatia, sabedoria prática e psicologia da ação.
Seu objetivo é acolher e ajudar o usuário em sua jornada (tecnologia, negócios, saúde, relacionamentos, casa, criatividade, projetos pessoais).

DIRETRIZ MÁXIMA DE INTELIGÊNCIA EMOCIONAL E SAÚDE MENTAL:
Se o usuário expressar tristeza, depressão, ansiedade, cansaço da vida, choro, desespero, burnout ou vulnerabilidade:
- PARE IMEDIATAMENTE QUALQUER resposta de processo, etapas, metas ou cobrança de produtividade.
- Seja um ser humano profundamente acolhedor, carinhoso, empático e protetor.
- Diga com clareza e afeto que ele NÃO precisa ser produtivo hoje, que a vida e o bem-estar dele vêm antes de qualquer projeto, valide seus sentimentos e recomende descanso, água, desabafo e o apoio gratuito do CVV (188 no Brasil).

DIRETRIZES DE REALIZAÇÃO:
- Seja encorajador, afetuoso, direto, prático e sem enrolação teórica.
- Sugira micro-passos de 15 a 25 minutos e ações físicas concretas.
- Fale em português do Brasil com formatação markdown rica (tópicos, negrito, emojis acolhedores).
${contextText ? `Contexto atual do usuário no aplicativo: ${contextText}` : ''}`;

  // Higieniza e garante alternância estrita de turnos para o Gemini (user -> model -> user -> ...)
  const sanitizedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  // Filtra mensagens vazias
  const validHistory = (history || []).filter(h => h && typeof h.text === 'string' && h.text.trim());

  for (const turn of validHistory) {
    const role: 'user' | 'model' = turn.role === 'model' ? 'model' : 'user';
    const last = sanitizedContents[sanitizedContents.length - 1];
    if (last && last.role === role && last.parts[0]) {
      // Se houver dois turnos seguidos do mesmo papel, junta o texto para não quebrar a API Gemini
      last.parts[0].text += `\n\n${turn.text.trim()}`;
    } else {
      sanitizedContents.push({
        role,
        parts: [{ text: turn.text.trim() }],
      });
    }
  }

  // Se o primeiro item do histórico for 'model', insere um turno inicial 'user'
  if (sanitizedContents.length > 0 && sanitizedContents[0]?.role === 'model') {
    sanitizedContents.unshift({
      role: 'user',
      parts: [{ text: 'Olá Mentor, gostaria de orientações sobre minhas ideias.' }],
    });
  }

  // Adiciona a mensagem atual do usuário garantindo papel 'user'
  const lastTurn = sanitizedContents[sanitizedContents.length - 1];
  if (lastTurn && lastTurn.role === 'user' && lastTurn.parts[0]) {
    lastTurn.parts[0].text += `\n\n${message.trim()}`;
  } else {
    sanitizedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });
  }

    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `INSTRUÇÃO DO SISTEMA:\n${systemInstruction}\n\nPor favor, atue de acordo com estas diretrizes.` }] },
            { role: 'model', parts: [{ text: 'Entendido! Sou o Mentor Ideaflow e estou pronto para te ajudar a tornar qualquer projeto realidade com passos claros, práticos e humanos.' }] },
            ...sanitizedContents,
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }

      const errorData = await response.json().catch(() => ({}));
      lastError = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;

      // Se for erro de autenticação ou chave inválida, para imediatamente
      if (response.status === 400 && lastError.toLowerCase().includes('api_key')) break;
      if (response.status === 401 || response.status === 403) break;
    } catch (err: any) {
      lastError = err?.message || 'Erro de rede na chamada ao Gemini';
    }
  }

  throw new Error(lastError || 'Não foi possível obter resposta do Google Gemini.');
}

/**
 * Planeja uma Ideia utilizando a melhor IA disponível:
 * 1. Provedor Remoto Real Ativo (Google Gemini ou Groq) com consumo real de tokens
 * 2. Motor Cognitivo Heurístico Local (100% Offline e livre de erros, rotulado explicitamente)
 */
export async function planIdeaWithAi(
  rawText: string,
  sectors: Sector[],
  fiveWhys?: string[]
): Promise<{
  idea: Idea;
  provider: 'gemini' | 'groq' | 'local' | 'chatgpt';
  model?: string;
  tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
  isLocalFallback?: boolean;
  error?: string;
}> {
  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const preferred = getPreferredAiProvider();
  const hasGemini = Boolean(getActiveGeminiKey());
  const hasGroq = Boolean(getActiveGroqKey());

  if (hasGemini || hasGroq) {
    const providerToTry = preferred === 'groq' && hasGroq ? 'groq' : (hasGemini ? 'gemini' : 'groq');
    try {
      const result = await callAiServer({
        action: 'plan',
        provider: providerToTry,
        rawText,
        sectors,
        fiveWhys: validWhys,
      });

      if (result && result.success && result.parsed) {
        const parsed = result.parsed;
        const matchedSector =
          sectors.find(s => s.id === parsed.sectorId) ??
          sectors.find(s => s.id === 'personal') ??
          sectors[0] ?? { id: 'personal', name: 'Pessoal', tone: 'pink' as const };

        const steps: Step[] = (parsed.steps || []).map((s: any, idx: number) => ({
          id: crypto.randomUUID(),
          text: s.text || `Passo ${idx + 1}`,
          minutes: Number(s.minutes) || 20,
          done: false,
        }));

        const totalMinutes = steps.reduce((acc, curr) => acc + curr.minutes, 0);
        const tokensTotal = result.tokensUsed?.totalTokens ?? 0;
        const providerName = result.provider === 'gemini' ? 'Google Gemini' : 'Groq';

        const idea: Idea = {
          id: crypto.randomUUID(),
          title: parsed.title || rawText.slice(0, 50),
          summary: parsed.summary || rawText,
          sector: matchedSector.id,
          stage: 0,
          minutes: totalMinutes,
          dedicated: 0,
          priority: ['Urgente', 'Importante', 'Normal'].includes(parsed.priority) ? parsed.priority : 'Normal',
          scope: parsed.scope || `Execução da ideia "${parsed.title}".`,
          immediate: parsed.immediate || steps[0]?.text || 'Definir o primeiro resultado em uma frase.',
          clarity: parsed.clarity || 'Um passo pequeno e concreto vale mais que um plano perfeito.',
          steps,
          pivots: [],
          fiveWhys: validWhys.length > 0 ? validWhys : undefined,
          notes: [
            {
              id: crypto.randomUUID(),
              createdAt:
                new Date().toLocaleDateString('pt-BR') +
                ' ' +
                new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              text: `Planejado com IA Real: ${providerName} (${result.model || 'LLM'}) • ${tokensTotal} tokens consumidos ⚡`,
            },
          ],
        };

        return {
          idea,
          provider: result.provider || providerToTry,
          model: result.model,
          tokensUsed: result.tokensUsed,
        };
      }
    } catch (err: any) {
      console.warn('Falha na IA remota ao planejar:', err);
    }
  }

  // Fallback explícito: Motor Cognitivo Heurístico Local (Offline)
  const fallback = planIdea(rawText, sectors, validWhys);
  fallback.notes = [
    {
      id: crypto.randomUUID(),
      createdAt:
        new Date().toLocaleDateString('pt-BR') +
        ' ' +
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: 'Gerado com Motor Local Heurístico (Offline) 🛡️ — configure uma chave de API em Ajustes para gastar tokens com LLMs reais.',
    },
  ];

  return {
    idea: fallback,
    provider: 'local',
    isLocalFallback: true,
  };
}

/**
 * Função que planeja uma Nova Ideia utilizando o Google Gemini.
 * Entende QUALQUER intenção humana (culinária, família, startups, projetos físicos, estudos).
 */
export async function planIdeaWithGemini(
  rawText: string,
  sectors: Sector[]
): Promise<{ idea: Idea; usedGemini: boolean; error?: string }> {
  const geminiKey = getActiveGeminiKey();

  if (geminiKey) {
    // 1. Tenta via backend seguro para eliminar problemas de CORS no navegador
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'plan',
          apiKey: geminiKey,
          rawText,
          sectors,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.parsed) {
          const parsed = data.parsed;
          const matchedSector =
            sectors.find(s => s.id === parsed.sectorId) ??
            sectors.find(s => s.id === 'personal') ??
            sectors[0] ?? { id: 'personal', name: 'Vida pessoal', tone: 'pink' as const };

          const steps: Step[] = (parsed.steps || []).map((s: any, idx: number) => ({
            id: crypto.randomUUID(),
            text: s.text || `Passo ${idx + 1}`,
            minutes: Number(s.minutes) || 15,
            done: false,
          }));

          const totalMinutes = steps.reduce((sum, s) => sum + s.minutes, 0);

          const idea: Idea = {
            id: crypto.randomUUID(),
            title: parsed.title || rawText.slice(0, 50),
            summary: parsed.summary || rawText,
            sector: matchedSector.id,
            priority: ['Urgente', 'Importante', 'Normal'].includes(parsed.priority)
              ? parsed.priority
              : 'Importante',
            stage: 0,
            minutes: totalMinutes || 90,
            dedicated: 0,
            steps: steps.length > 0 ? steps : generateAiSteps(parsed.title, rawText, matchedSector.id),
            scope: parsed.scope || `Execução da ideia "${parsed.title}".`,
            immediate:
              parsed.immediate || steps[0]?.text || 'Definir o primeiro resultado em uma frase.',
            clarity:
              parsed.clarity || 'Um passo pequeno e concreto vale mais que um plano perfeito.',
            pivots: [],
            notes: [
              {
                id: crypto.randomUUID(),
                createdAt:
                  new Date().toLocaleDateString('pt-BR') +
                  ' ' +
                  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                text: 'Ideia planejada com inteligência artificial Google Gemini Flash ✨',
              },
            ],
          };

          return { idea, usedGemini: true };
        }
      }
    } catch (err) {
      console.warn('Backend /api/gemini indisponível para planejamento, tentando fallback:', err);
    }

    // 2. Fallback direto caso o backend local não esteja acessível
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    const sectorsList = sectors.map(s => `"${s.id}" (${s.name})`).join(', ');
    const prompt = `Você é o Ideaflow AI, um mentor prático de realização de ideias e projetos.
O usuário digitou ou ditou a seguinte ideia/desejo livremente:
"${rawText}"

Entenda a verdadeira intenção humana por trás desse desejo. Pode ser QUALQUER coisa: desde fazer um bolo de cenoura com cobertura para a avó, reformar um móvel, criar um app de livros, organizar uma viagem de família ou abrir uma loja.

Gere os passos concretos, afetuosos e necessários para que essa ideia se torne REALIDADE no mundo real.
Responda EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown nem explicações) seguindo exatamente este modelo:
{
  "title": "Título claro, caloroso e cativante (máx 60 caracteres)",
  "summary": "Resumo em 1 ou 2 frases da intenção e do valor dessa realização",
  "sectorId": "Escolha o melhor ID entre: [${sectorsList}]. Para culinária, família, saúde ou rotina use 'personal'. Para marcenaria/artesanato use 'wood'. Para apps use 'tech'. Para negócios use 'business'",
  "priority": "Urgente" | "Importante" | "Normal",
  "scope": "Definição clara do escopo do projeto (o que será feito)",
  "immediate": "Ação imediata de 15 minutos para começar fisicamente sem desculpas",
  "clarity": "Uma frase curta de inspiração ou clareza sobre este projeto",
  "steps": [
    { "text": "Primeiro passo específico e acionável", "minutes": 15 },
    { "text": "Segundo passo específico e acionável", "minutes": 25 },
    { "text": "Terceiro passo de execução principal", "minutes": 35 },
    { "text": "Passo final de entrega, compartilhamento ou celebração", "minutes": 20 }
  ]
}`;

    let lastError = '';

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const contentStr = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (contentStr) {
            const parsed = JSON.parse(contentStr);
            const matchedSector =
              sectors.find(s => s.id === parsed.sectorId) ??
              sectors.find(s => s.id === 'personal') ??
              sectors[0] ?? { id: 'personal', name: 'Vida pessoal', tone: 'pink' as const };

            const steps: Step[] = (parsed.steps || []).map((s: any, idx: number) => ({
              id: crypto.randomUUID(),
              text: s.text || `Passo ${idx + 1}`,
              minutes: Number(s.minutes) || 15,
              done: false,
            }));

            const totalMinutes = steps.reduce((sum, s) => sum + s.minutes, 0);

            const idea: Idea = {
              id: crypto.randomUUID(),
              title: parsed.title || rawText.slice(0, 50),
              summary: parsed.summary || rawText,
              sector: matchedSector.id,
              priority: ['Urgente', 'Importante', 'Normal'].includes(parsed.priority)
                ? parsed.priority
                : 'Importante',
              stage: 0,
              minutes: totalMinutes || 90,
              dedicated: 0,
              steps: steps.length > 0 ? steps : generateAiSteps(parsed.title, rawText, matchedSector.id),
              scope: parsed.scope || `Execução da ideia "${parsed.title}".`,
              immediate:
                parsed.immediate || steps[0]?.text || 'Definir o primeiro resultado em uma frase.',
              clarity:
                parsed.clarity || 'Um passo pequeno e concreto vale mais que um plano perfeito.',
              pivots: [],
              notes: [
                {
                  id: crypto.randomUUID(),
                  createdAt:
                    new Date().toLocaleDateString('pt-BR') +
                    ' ' +
                    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  text: 'Ideia planejada com inteligência artificial Google Gemini Flash ✨',
                },
              ],
            };

            return { idea, usedGemini: true };
          }
        }

        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${response.status}`;
        if (response.status === 400 && lastError.toLowerCase().includes('api_key')) break;
        if (response.status === 401 || response.status === 403) break;
      } catch (err: any) {
        lastError = err?.message || 'Falha de conexão com Gemini';
      }
    }

    console.warn('Erro ao chamar Gemini no planejamento da ideia, usando motor local inteligente:', lastError);
    const fallback = planIdea(rawText, sectors);
    return { idea: fallback, usedGemini: false, error: lastError };
  }

  // Fallback inteligente offline
  const fallback = planIdea(rawText, sectors);
  return { idea: fallback, usedGemini: false };
}

/**
 * Função principal que consulta a IA para o chat do Mentor:
 * 1. Prioriza a Groq (LLaMA 3.3/3.1 - ultra-rápida, gratuita e sem bloqueios de CORS).
 * 2. Em seguida tenta o Google Gemini.
 * 3. Fallback contínuo e sem falhas para o Motor Cognitivo Oficial do Ideaflow (100% Offline).
 */
export async function askMentorAi({
  message,
  contextIdea,
  allIdeas = [],
  sectors = [],
  history = [],
}: {
  message: string;
  contextIdea?: Idea | undefined;
  allIdeas?: Idea[] | undefined;
  sectors?: Sector[] | undefined;
  history?: { role: 'user' | 'model'; text: string }[] | undefined;
}): Promise<{
  reply: string;
  provider: 'gemini' | 'groq' | 'local' | 'chatgpt';
  model?: string;
  tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
  error?: string | undefined;
  isLocalFallback?: boolean | undefined;
  isNetworkBlocked?: boolean | undefined;
}> {
  const contextText = generateFunnelDossier(allIdeas, sectors, contextIdea);
  const preferred = getPreferredAiProvider();
  const hasGemini = Boolean(getActiveGeminiKey());
  const hasGroq = Boolean(getActiveGroqKey());

  // 1. TENTA PRIMEIRO A IA REMOTA REAL (COM CONSUMO REAL DE TOKENS)
  if (hasGemini || hasGroq) {
    const providerToTry = preferred === 'groq' && hasGroq ? 'groq' : (hasGemini ? 'gemini' : 'groq');
    try {
      const result = await callAiServer({
        action: 'mentor',
        provider: providerToTry,
        message,
        contextText,
        history,
      });

      if (result && result.success && result.reply) {
        return {
          reply: result.reply,
          provider: result.provider || providerToTry,
          model: result.model,
          tokensUsed: result.tokensUsed,
        };
      }
    } catch (err: any) {
      console.warn('Erro ao consultar Mentor IA no servidor:', err?.message);
    }
  }

  // 2. Fallback Infalível para o Motor Cognitivo Local Oficial (100% Offline, Seguro e Conversacional)
  const localReply = localAiResponse(message, contextIdea, allIdeas, sectors);
  return {
    reply: localReply,
    provider: 'local',
    isLocalFallback: true,
  };
}

/**
 * Gera os módulos de um Projeto utilizando a melhor IA disponível:
 * 1. Provedor Remoto Real Ativo (Google Gemini ou Groq) com consumo real de tokens
 * 2. Motor Cognitivo Heurístico Local (100% Offline e livre de erros)
 */
export async function generateProjectModulesWithAi(
  projectTitle: string,
  projectSummary: string,
  sector: string,
  fiveWhys?: string[]
): Promise<{
  modules: { title: string; summary: string; minutes: number }[];
  provider: 'gemini' | 'groq' | 'local';
  model?: string;
  tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
  isLocalFallback?: boolean;
  error?: string;
}> {
  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const preferred = getPreferredAiProvider();
  const hasGemini = Boolean(getActiveGeminiKey());
  const hasGroq = Boolean(getActiveGroqKey());

  if (hasGemini || hasGroq) {
    const providerToTry = preferred === 'groq' && hasGroq ? 'groq' : (hasGemini ? 'gemini' : 'groq');
    try {
      const result = await callAiServer({
        action: 'project',
        provider: providerToTry,
        projectTitle,
        projectSummary,
        sector,
        fiveWhys: validWhys,
      });

      if (result && result.success && Array.isArray(result.modules) && result.modules.length > 0) {
        return {
          modules: result.modules,
          provider: result.provider || providerToTry,
          model: result.model,
          tokensUsed: result.tokensUsed,
        };
      }
    } catch (err: any) {
      console.warn('Falha ao gerar módulos via IA remota:', err?.message);
    }
  }

  // 3. Motor Local Seguro
  const fallback = generateSubModulesAi(projectTitle, projectSummary, sector, validWhys);
  return {
    modules: fallback,
    provider: 'local',
    isLocalFallback: true,
  };
}

/**
 * Decompõe um Projeto Macro em ideias/frentes de desenvolvimento utilizando o Google Gemini AI.
 * Se a API estiver indisponível ou sem chave, utiliza o motor heurístico local sem viés tecnológico.
 */
export async function generateProjectModulesWithGemini(
  projectTitle: string,
  projectSummary: string,
  sector: string
): Promise<{ modules: { title: string; summary: string; minutes: number }[]; usedGemini: boolean; error?: string }> {
  const geminiKey = getActiveGeminiKey();

  if (geminiKey) {
    // 1. Tenta via backend seguro (/api/gemini)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'project',
          apiKey: geminiKey,
          projectTitle,
          projectSummary,
          sector,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.modules) && data.modules.length > 0) {
          return { modules: data.modules, usedGemini: true };
        }
      }
    } catch (err: any) {
      console.warn('Backend /api/gemini indisponível para frentes do projeto, tentando fallback:', err?.message);
    }

    // 2. Fallback direto caso o endpoint proxy não esteja acessível
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    const prompt = `Você é o Ideaflow AI, um arquiteto prático e experiente de projetos humanos e profissionais.
O usuário está criando o seguinte projeto macro:
Título: "${projectTitle}"
Descrição/Resumo: "${projectSummary || 'Sem descrição detalhada'}"
Setor de foco: "${sector || 'personal'}"

Sua tarefa: Decomponha esse projeto macro em 3 a 5 ideias/frentes/módulos menores, complementares e altamente realistas para que o projeto saia do papel com ordem e clareza.
ATENÇÃO IMPORTANTE:
- NUNCA invente jargões de tecnologia ou programação (como API, front-end, back-end, deploy) a menos que o projeto seja EXPLICITAMENTE de tecnologia/software!
- Se o projeto for uma reforma de cozinha/casa, as frentes devem ser: Planejamento & Orçamento, Alvenaria/Demolição/Hidráulica, Marcenaria & Bancadas, Pintura & Decoração/Iluminação.
- Se o projeto for culinária/visita à família, as frentes devem ser sobre ingredientes, preparo, transporte e momento do encontro.
- Se for marcenaria, as frentes devem ser projeto/medidas, aparelhamento da madeira, usinagem/encaixes, lixamento/acabamento.
- Se for saúde/exercício, foque em rotina, equipamentos/ambiente, prática inicial e evolução.

Responda EXCLUSIVAMENTE um array JSON de objetos (sem markdown ao redor, apenas o JSON puro):
[
  {
    "title": "Título conciso da frente (ex: Planejamento & Orçamento)",
    "summary": "Resumo prático em 1 frase do que será realizado nesta frente",
    "minutes": 60
  }
]`;

    let lastError = '';
    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const contentStr = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (contentStr) {
            const modules = JSON.parse(contentStr);
            if (Array.isArray(modules) && modules.length > 0) {
              return { modules, usedGemini: true };
            }
          }
        }

        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${response.status}`;
        if (response.status === 400 && lastError.toLowerCase().includes('api_key')) break;
        if (response.status === 401 || response.status === 403) break;
      } catch (err: any) {
        lastError = err?.message || 'Falha de conexão com Gemini';
      }
    }

    console.warn('Erro ao chamar Gemini para frentes de projeto, usando motor local inteligente:', lastError);
    const fallback = generateSubModulesAi(projectTitle, projectSummary, sector);
    return { modules: fallback, usedGemini: false, error: lastError };
  }

  // Fallback inteligente offline
  const fallback = generateSubModulesAi(projectTitle, projectSummary, sector);
  return { modules: fallback, usedGemini: false };
}

