import { Idea, Sector, Step } from './ideaflow';

export const GROQ_STORAGE_KEY = 'ideaflow-groq-key';

export function cleanGroqKey(key: string): string {
  if (!key) return '';
  return key.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
}

export const DEFAULT_GROQ_KEY =
  (import.meta as any).env?.VITE_GROQ_API_KEY ||
  (typeof process !== 'undefined' ? process.env?.['VITE_GROQ_API_KEY'] : '') ||
  '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';

export const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
];

export function getActiveGroqKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(GROQ_STORAGE_KEY);
    if (stored && stored.trim()) return cleanGroqKey(stored);
  }
  const envKey =
    (import.meta as any).env?.VITE_GROQ_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.['VITE_GROQ_API_KEY'] : '');
  if (typeof envKey === 'string' && envKey.trim()) {
    return cleanGroqKey(envKey);
  }
  return DEFAULT_GROQ_KEY;
}

export function setStoredGroqKey(key: string) {
  if (typeof window === 'undefined') return;
  const cleaned = cleanGroqKey(key);
  if (!cleaned) {
    localStorage.removeItem(GROQ_STORAGE_KEY);
  } else {
    localStorage.setItem(GROQ_STORAGE_KEY, cleaned);
  }
}

export function isGroqActive(): boolean {
  return Boolean(getActiveGroqKey());
}

/**
 * Valida a chave da Groq fazendo uma chamada ultra-rápida.
 */
export async function testGroqApiKey(apiKey: string): Promise<{ success: boolean; model?: string; error?: string }> {
  const key = cleanGroqKey(apiKey);
  if (!key) {
    return { success: false, error: 'Chave Groq não informada.' };
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
        max_tokens: 5,
      }),
    });

    if (res.ok) {
      return { success: true, model: 'openai/gpt-oss-120b' };
    }

    const err = await res.json().catch(() => ({}));
    return {
      success: false,
      error: err?.error?.message || `Erro ${res.status}: ${res.statusText}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Falha ao conectar com a API da Groq.',
    };
  }
}

/**
 * Utilitário resiliente para extrair JSON válido de respostas da IA
 */
export function extractCleanJson(raw: string): any {
  if (!raw) return null;
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {}
  }

  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(trimmed.slice(firstBracket, lastBracket + 1));
    } catch {}
  }

  return null;
}

/**
 * Chamada genérica à Groq com suporte a JSON mode e failover de modelos.
 */
export async function callGroqChat({
  messages,
  json = false,
  temperature = 0.6,
  maxTokens = 1500,
}: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const key = getActiveGroqKey() || DEFAULT_GROQ_KEY;
  if (!key) throw new Error('Chave da Groq não configurada.');

  const candidateModels = GROQ_MODELS;
  let lastError = '';

  for (const model of candidateModels) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(json ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }

      const errData = await res.json().catch(() => ({}));
      lastError = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;

      // Se erro for de autenticação com a chave, não adianta tentar outro modelo
      if (res.status === 401) break;
    } catch (err: any) {
      lastError = err?.message || 'Erro de rede com a Groq';
    }
  }

  throw new Error(lastError || 'Não foi possível obter resposta da Groq.');
}

/**
 * Planeja uma Ideia completa via Groq com alta inteligência contextual.
 * Entende com precisão o tema real: culinária, viagens, eventos, negócios, software, saúde, rotina.
 */
export async function planIdeaWithGroq(
  rawText: string,
  sectors: Sector[],
  fiveWhys?: string[]
): Promise<{ idea: Idea; usedGroq: boolean; model?: string; error?: string }> {
  const sectorsList = sectors.map(s => `"${s.id}" (${s.name})`).join(', ');

  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const whysSection = validWhys.length > 0
    ? `\nCONTEXTO DOS 5 PORQUÊS RESPONDIDOS PELO USUÁRIO:
${validWhys.map((w, idx) => `${idx + 1}º Por quê: "${w}"`).join('\n')}

DIRETRIZES ESSENCIAIS:
1. Os 5 Porquês revelam o objetivo de verdade, as ferramentas já pensadas e as barreiras a serem superadas.
2. Cada passo DEVE dialogar diretamente com essas respostas e com os detalhes do texto.`
    : '';

  const systemPrompt = `Você é o Ideaflow AI — um estrategista sênior de execução, hiper-prático, humano e inteligente.

SUA REGRA DE OURO:
PROIBIDO respostas genéricas ou clichês vazios como "pesquisar na internet", "definir escopo", "fazer planejamento", "avaliar métricas".
Você DEVE absorver o CONCEITO EXATO do que o usuário escreveu e criar passos concretos, sob medida para a situação real dele!

Exemplos de como você pensa:
- Se for uma receita/comida/evento em família: mencione ingredientes específicos, preparo, lista de compras, convidar pessoas ou reservar mesa.
- Se for um projeto técnico/software: mencione as tecnologias, telas, banco de dados ou integração real.
- Se for academia/saúde: mencione divisão de treinos, preparação prévia de refeições, horário na agenda e meta real.
- Se for marketing/negócios: mencione o canal de venda, headline de atração, oferta e primeiro contato com cliente.

Responda EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown nem explicações extras):
{
  "title": "Título conciso, atraente e específico (máx 55 caracteres)",
  "summary": "Resumo em 1 a 2 frases conectando o desejo à realização prática",
  "sectorId": "Escolha o melhor ID entre: [${sectorsList}] ou 'none'",
  "priority": "Urgente" | "Importante" | "Normal",
  "scope": "O que exatamente será entregue/realizado na primeira versão prática",
  "immediate": "A PRIMEIRA ação prática de 10 a 15 minutos que quebra a inércia imediatamente",
  "clarity": "Uma lição prática e motivadora em 1 frase para vencer o obstáculo",
  "steps": [
    { "text": "Passo 1 ultra específico com ação direta inicial (15 a 20 min)", "minutes": 15 },
    { "text": "Passo 2 de execução prática dos materiais/ferramentas necessárias (20 a 35 min)", "minutes": 25 },
    { "text": "Passo 3 de construção e entrega central do resultado (30 a 50 min)", "minutes": 40 },
    { "text": "Passo 4 de finalização, validação real ou compartilhamento (15 a 30 min)", "minutes": 20 }
  ]
}`;

  try {
    const responseText = await callGroqChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Ideia do usuário: "${rawText}"${whysSection}` },
      ],
      json: true,
      temperature: 0.6,
    });

    const parsed = extractCleanJson(responseText);
    if (!parsed || !parsed.title || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
      throw new Error('Formato JSON inválido retornado pelo modelo.');
    }

    const matchedSector =
      sectors.find(s => s.id === parsed.sectorId) ??
      sectors.find(s => s.name?.toLowerCase() === parsed.sectorId?.toLowerCase()) ??
      sectors[0] ?? { id: 'none', name: 'Sem setor', tone: 'cyan' as const };

    const steps: Step[] = parsed.steps.map((s: any, idx: number) => ({
      id: crypto.randomUUID(),
      text: s.text || `Passo ${idx + 1}`,
      minutes: Number(s.minutes) || 20,
      done: false,
    }));

    const totalMinutes = steps.reduce((acc, curr) => acc + curr.minutes, 0);

    const idea: Idea = {
      id: crypto.randomUUID(),
      title: parsed.title || rawText.slice(0, 50),
      summary: parsed.summary || rawText,
      sector: matchedSector.id,
      stage: 0,
      minutes: totalMinutes,
      dedicated: 0,
      priority: ['Urgente', 'Importante', 'Normal'].includes(parsed.priority) ? parsed.priority : 'Normal',
      scope: parsed.scope || 'Foco em execução simples e consistente.',
      immediate: parsed.immediate || steps[0]?.text || 'Definir o primeiro passo.',
      clarity: parsed.clarity || 'Pequenos passos constantes constroem grandes projetos.',
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
          text: 'Planejado com Inteligência Artificial Real (Groq / GPT-OSS 120B) ⚡',
        },
      ],
    };

    return { idea, usedGroq: true, model: 'openai/gpt-oss-120b' };
  } catch (err: any) {
    return {
      idea: null as any,
      usedGroq: false,
      error: err?.message || 'Falha ao processar com a Groq.',
    };
  }
}

/**
 * Sugere respostas para os 5 Porquês com IA de alta profundidade contextual.
 */
export async function suggestFiveWhysWithGroq(titleOrText: string): Promise<string[]> {
  const prompt = `Analise a ideia/intenção a seguir:
"${titleOrText}"

Gere 5 respostas concisas, profundas e contextualizadas (1 frase cada) para a metodologia dos 5 Porquês:
1. 1º Por quê: Qual é o objetivo raiz prático dessa realização?
2. 2º Por quê: Por que isso é importante ou prioridade agora?
3. 3º Por quê: Qual o maior obstáculo ou desafio real que impediu isso antes?
4. 4º Por quê: Qual a transformação pessoal, financeira ou de vida quando der certo?
5. 5º Por quê: Por que começar pequeno e com foco prático é a melhor escolha?

Responda EXCLUSIVAMENTE um array JSON com 5 strings. Exemplo:
["resposta 1", "resposta 2", "resposta 3", "resposta 4", "resposta 5"]`;

  try {
    const raw = await callGroqChat({
      messages: [
        { role: 'system', content: 'Você é um estrategista humano especialista em destrinchar projetos. Responda em JSON estrito.' },
        { role: 'user', content: prompt },
      ],
      json: true,
      temperature: 0.6,
      maxTokens: 800,
    });

    const parsed = extractCleanJson(raw);
    if (Array.isArray(parsed) && parsed.length >= 3) {
      return parsed.slice(0, 5).map(s => String(s).trim());
    }
  } catch (err) {
    console.warn('Erro ao sugerir 5 Porquês com Groq:', err);
  }

  // Fallback heurístico se offline
  const { suggestFiveWhysOffline } = await import('./ideaflow');
  return suggestFiveWhysOffline(titleOrText);
}

/**
 * Decompõe um Projeto Macro em módulos via Groq.
 */
export async function generateProjectModulesWithGroq(
  projectTitle: string,
  projectSummary: string,
  sector: string,
  fiveWhys?: string[]
): Promise<{ modules: { title: string; summary: string; minutes: number }[]; usedGroq: boolean; error?: string }> {
  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const whysSection = validWhys.length > 0
    ? `\nContexto dos 5 Porquês do projeto:\n${validWhys.map((w, idx) => `${idx + 1}º Por quê: "${w}"`).join('\n')}`
    : '';

  const prompt = `Você é o arquiteto de projetos do Ideaflow.
Analise este PROJETO MACRO e divida-o em 3 ou 4 frentes ou módulos de desenvolvimento lógicos e acionáveis.
O projeto pode ser de QUALQUER setor: culinária, marcenaria, reforma da casa, negócio, tecnologia ou vida pessoal.
Projeto: "${projectTitle}"
Resumo/Objetivo: "${projectSummary}"
Setor: "${sector}"${whysSection}

Responda EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "modules": [
    {
      "title": "Nome do módulo/ideia (máx 45 caracteres)",
      "summary": "O que esta frente entrega para o projeto",
      "minutes": 60
    }
  ]
}`;

  try {
    const responseText = await callGroqChat({
      messages: [{ role: 'user', content: prompt }],
      json: true,
      temperature: 0.6,
    });

    const parsed = JSON.parse(responseText);
    if (Array.isArray(parsed.modules) && parsed.modules.length > 0) {
      return { modules: parsed.modules, usedGroq: true };
    }
  } catch (err: any) {
    return { modules: [], usedGroq: false, error: err?.message };
  }

  return { modules: [], usedGroq: false, error: 'Resposta em formato inesperado.' };
}

