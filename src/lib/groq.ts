import { Idea, Sector, Step } from './ideaflow';

export const GROQ_STORAGE_KEY = 'ideaflow-groq-key';

export function cleanGroqKey(key: string): string {
  if (!key) return '';
  return key.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
}

export function getActiveGroqKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(GROQ_STORAGE_KEY);
    if (stored && stored.trim()) return cleanGroqKey(stored);
  }
  const envKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
  if (typeof envKey === 'string' && envKey.trim()) {
    return cleanGroqKey(envKey);
  }
  return '';
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
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
        max_tokens: 5,
      }),
    });

    if (res.ok) {
      return { success: true, model: 'llama-3.3-70b-versatile' };
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
 * Chamada genérica à Groq com suporte a JSON mode e failover de modelos.
 */
export async function callGroqChat({
  messages,
  json = false,
  temperature = 0.7,
  maxTokens = 1200,
}: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const key = getActiveGroqKey();
  if (!key) throw new Error('Chave da Groq não configurada.');

  const candidateModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
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

      // Se erro de autenticação, para
      if (res.status === 401) break;
    } catch (err: any) {
      lastError = err?.message || 'Erro de rede com a Groq';
    }
  }

  throw new Error(lastError || 'Não foi possível obter resposta da Groq.');
}

/**
 * Planeja uma Ideia completa via Groq (LLaMA 3.3).
 * Entende QUALQUER intenção humana: culinária, reformas, casa, negócios, tecnologia, estudos.
 */
export async function planIdeaWithGroq(
  rawText: string,
  sectors: Sector[]
): Promise<{ idea: Idea; usedGroq: boolean; error?: string }> {
  const sectorsList = sectors.map(s => `"${s.id}" (${s.name})`).join(', ');

  const systemPrompt = `Você é o Ideaflow AI, um mentor prático de realização pessoal e de projetos.
Sua missão é entender a intenção humana por trás do desejo do usuário (pode ser culinária, reforma, artesanato, família, viagens, negócios ou apps).
Gere um plano de ação concreto, realista, humano e executável.
Responda EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown nem explicações) seguindo exatamente este formato:
{
  "title": "Título claro, acolhedor e cativante (máx 60 caracteres)",
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

  try {
    const responseText = await callGroqChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Ideia do usuário: "${rawText}"` },
      ],
      json: true,
      temperature: 0.6,
    });

    const parsed = JSON.parse(responseText);
    const matchedSector =
      sectors.find(s => s.id === parsed.sectorId) ??
      sectors.find(s => s.id === 'personal') ??
      sectors[0];

    const steps: Step[] = (parsed.steps || []).map((s: any, idx: number) => ({
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
      priority: parsed.priority || 'Normal',
      scope: parsed.scope || 'Foco em execução simples e consistente.',
      immediate: parsed.immediate || steps[0]?.text || 'Definir o primeiro passo.',
      clarity: parsed.clarity || 'Pequenos passos constantes constroem grandes projetos.',
      steps,
      pivots: [],
      notes: [
        {
          id: crypto.randomUUID(),
          createdAt:
            new Date().toLocaleDateString('pt-BR') +
            ' ' +
            new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          text: 'Ideia planejada com inteligência artificial Groq (LLaMA 3.3) ✨',
        },
      ],
    };

    return { idea, usedGroq: true };
  } catch (err: any) {
    return {
      idea: null as any,
      usedGroq: false,
      error: err?.message || 'Falha ao processar com a Groq.',
    };
  }
}

/**
 * Decompõe um Projeto Macro em módulos via Groq.
 */
export async function generateProjectModulesWithGroq(
  projectTitle: string,
  projectSummary: string,
  sector: string
): Promise<{ modules: { title: string; summary: string; minutes: number }[]; usedGroq: boolean; error?: string }> {
  const prompt = `Você é o arquiteto de projetos do Ideaflow.
Analise este PROJETO MACRO e divida-o em 3 ou 4 frentes ou módulos de desenvolvimento lógicos e acionáveis.
O projeto pode ser de QUALQUER setor: culinária, marcenaria, reforma da casa, negócio, tecnologia ou vida pessoal.
Projeto: "${projectTitle}"
Resumo/Objetivo: "${projectSummary}"
Setor: "${sector}"

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

