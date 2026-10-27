import type { Sector } from './ideaflow';

export function cleanApiKey(key: string): string {
  if (!key) return '';
  return key.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
}

export const DEFAULT_GROQ_KEY =
  (typeof process !== 'undefined' ? process.env?.['VITE_GROQ_API_KEY'] || process.env?.['GROQ_API_KEY'] : '') ||
  (import.meta as any).env?.VITE_GROQ_API_KEY ||
  '';

export const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
];

export const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

export interface AiBackendResult {
  success: boolean;
  model?: string;
  provider?: 'gemini' | 'groq';
  reply?: string;
  parsed?: any;
  modules?: any[];
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs?: number;
  error?: string;
}

export async function handleGeminiBackend(body: any): Promise<AiBackendResult> {
  const {
    action,
    provider: requestedProvider,
    apiKey,
    message,
    contextText,
    history,
    rawText,
    sectors,
    fiveWhys,
  } = body;

  const startTime = Date.now();

  // Determina provedor e chave (Groq integrado por padrão fornecido pelo site)
  const envGemini = process.env['GEMINI_API_KEY'] || process.env['VITE_GEMINI_API_KEY'] || '';
  const envGroq = process.env['GROQ_API_KEY'] || process.env['VITE_GROQ_API_KEY'] || DEFAULT_GROQ_KEY;

  const cleanedInputKey = cleanApiKey(apiKey || '');
  const provider: 'groq' | 'gemini' = requestedProvider === 'gemini' && (cleanedInputKey || envGemini) ? 'gemini' : 'groq';

  const activeKey = provider === 'groq'
    ? (cleanedInputKey || cleanApiKey(envGroq) || DEFAULT_GROQ_KEY)
    : (cleanedInputKey || cleanApiKey(envGemini));

  if (!activeKey) {
    return {
      success: false,
      error: `Chave de API da IA (${provider === 'groq' ? 'Groq' : 'Google Gemini'}) não informada. Configure em Ajustes > Inteligência Artificial.`,
    };
  }

  // 1. AÇÃO: TESTE DE CONEXÃO & GASTO DE TOKENS
  if (action === 'test') {
    if (provider === 'gemini') {
      let lastError = '';
      for (const model of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Responda estritamente com duas palavras: Conexao Ativa' }] }],
              generationConfig: { maxOutputTokens: 15 },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
            const promptTokens = data?.usageMetadata?.promptTokenCount ?? 7;
            const completionTokens = data?.usageMetadata?.candidatesTokenCount ?? 3;
            return {
              success: true,
              model,
              provider: 'gemini',
              reply,
              tokensUsed: {
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
              },
              latencyMs: Date.now() - startTime,
            };
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 400 && lastError.toLowerCase().includes('api_key')) break;
          if (res.status === 401 || res.status === 403) break;
        } catch (err: any) {
          lastError = err?.message || 'Falha ao conectar com o Google Gemini';
        }
      }
      return { success: false, error: lastError || 'Erro ao validar chave com o Gemini.' };
    } else {
      // Groq
      let lastError = '';
      for (const model of GROQ_MODELS) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${activeKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: 'Responda estritamente: Conexao Ativa' }],
              max_tokens: 15,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content?.trim() || 'OK';
            const promptTokens = data?.usage?.prompt_tokens ?? 10;
            const completionTokens = data?.usage?.completion_tokens ?? 3;
            return {
              success: true,
              model,
              provider: 'groq',
              reply,
              tokensUsed: {
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
              },
              latencyMs: Date.now() - startTime,
            };
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 401) break;
        } catch (err: any) {
          lastError = err?.message || 'Falha ao conectar com a API da Groq.';
        }
      }
      return { success: false, error: lastError || 'Erro ao validar chave com a Groq.' };
    }
  }

  // 2. AÇÃO: MENTOR IA (CHAT EM TEMPO REAL)
  if (action === 'mentor') {
    const systemPrompt = `Você é o Mentor Ideaflow, um consultor genial, empático e focado em execução prática, psicologia da ação e Lean Startup.
Seu objetivo é ajudar o usuário a destravar e realizar qualquer ideia (culinária, negócios, tecnologia, rotina pessoal, família, estudos, marcenaria).
Diretrizes:
- Seja caloroso, direto, perspicaz e livre de enrolação corporativa ou teórica.
- Sugira micro-passos de 15 a 30 minutos e ações concretas para o mundo real.
- Responda em Português do Brasil com excelente markdown (tópicos, negrito, emojis acolhedores).
${contextText ? `Contexto atual do usuário no app:\n${contextText}` : ''}`;

    if (provider === 'gemini') {
      const sanitizedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      const validHistory = (history || []).filter((h: any) => h && typeof h.text === 'string' && h.text.trim());

      for (const turn of validHistory) {
        const role: 'user' | 'model' = turn.role === 'model' ? 'model' : 'user';
        const last = sanitizedContents[sanitizedContents.length - 1];
        if (last && last.role === role && last.parts[0]) {
          last.parts[0].text += `\n\n${turn.text.trim()}`;
        } else {
          sanitizedContents.push({ role, parts: [{ text: turn.text.trim() }] });
        }
      }

      const last = sanitizedContents[sanitizedContents.length - 1];
      if (last && last.role === 'user' && last.parts[0]) {
        last.parts[0].text += `\n\n${(message || '').trim()}`;
      } else {
        sanitizedContents.push({
          role: 'user',
          parts: [{ text: (message || '').trim() }],
        });
      }

      let lastError = '';
      for (const model of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: `INSTRUÇÕES DO SISTEMA:\n${systemPrompt}` }] },
                { role: 'model', parts: [{ text: 'Entendido! Estou pronto para orientar com foco prático e humano.' }] },
                ...sanitizedContents,
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
              },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              const promptTokens = data?.usageMetadata?.promptTokenCount ?? 150;
              const completionTokens = data?.usageMetadata?.candidatesTokenCount ?? 120;
              return {
                success: true,
                model,
                provider: 'gemini',
                reply,
                tokensUsed: {
                  promptTokens,
                  completionTokens,
                  totalTokens: promptTokens + completionTokens,
                },
                latencyMs: Date.now() - startTime,
              };
            }
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 400 && lastError.toLowerCase().includes('api_key')) break;
          if (res.status === 401 || res.status === 403) break;
        } catch (err: any) {
          lastError = err?.message || 'Falha de conexão com Gemini';
        }
      }
      return { success: false, error: lastError || 'Erro ao consultar Google Gemini.' };
    } else {
      // Groq Chat
      const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).map((h: any) => ({
          role: (h.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: h.text,
        })),
        { role: 'user', content: message },
      ];

      let lastError = '';
      for (const model of GROQ_MODELS) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${activeKey}`,
            },
            body: JSON.stringify({
              model,
              messages: groqMessages,
              temperature: 0.7,
              max_tokens: 1200,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) {
              const promptTokens = data?.usage?.prompt_tokens ?? 180;
              const completionTokens = data?.usage?.completion_tokens ?? 150;
              return {
                success: true,
                model,
                provider: 'groq',
                reply,
                tokensUsed: {
                  promptTokens,
                  completionTokens,
                  totalTokens: promptTokens + completionTokens,
                },
                latencyMs: Date.now() - startTime,
              };
            }
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 401) break;
        } catch (err: any) {
          lastError = err?.message || 'Erro de rede com a Groq.';
        }
      }
      return { success: false, error: lastError || 'Erro ao consultar Groq.' };
    }
  }

  // 3. AÇÃO: PLANEJAR IDEIA (COM CONTEXTUALIZAÇÃO RIGOROSA DOS 5 PORQUÊS)
  if (action === 'plan') {
    const sectorsList = (sectors as Sector[] || []).map(s => `"${s.id}" (${s.name})`).join(', ');
    const validWhys = (fiveWhys || []).filter((w: any) => typeof w === 'string' && w.trim().length > 0);
    const whysSection = validWhys.length > 0
      ? `\nCONTEXTO CRUCIAL E OBRIGATÓRIO DOS 5 PORQUÊS RESPONDIDOS PELO USUÁRIO:
${validWhys.map((w: string, idx: number) => `${idx + 1}º Por quê: "${w}"`).join('\n')}

DIRETRIZES FUNDAMENTAIS DE INTERPRETAÇÃO DOS 5 PORQUÊS:
1. Mesmo que o texto inicial da ideia seja sucinto (ex: "fazer app", "organizar casa"), os 5 Porquês revelam a dor real, as ferramentas mencionadas, as pessoas envolvidas e o bloqueio que travou o usuário até hoje.
2. É PROIBIDO criar passos genéricos como "planejar projeto", "pesquisar na internet" ou "definir escopo".
3. Cada passo de 'steps' DEVE atacar os pontos citados nos 5 Porquês de forma acionável e tangível no mundo real.
4. O Passo 1 precisa ser uma micro-ação de 15 minutos que destrava o início imediato.
5. O Passo 2 e 3 constroem a solução contornando o gargalo citado no 3º ou 4º Por quê.
6. O Passo 4 deve entregar ou validar o benefício prometido no 5º Por quê.`
      : '';

    const prompt = `Você é o Ideaflow AI, um estrategista prático de execução e projetos humanos.
Desejo inicial registrado:
"${rawText}"
${whysSection}

Responda ESTRITAMENTE um objeto JSON válido (sem tags markdown de código, apenas o JSON bruto):
{
  "title": "Título conciso, caloroso e cativante (máx 60 caracteres)",
  "summary": "Resumo em 1 ou 2 frases conectando o desejo à transformação raiz revelada nos 5 Porquês",
  "sectorId": "Escolha o ID mais adequado entre: [${sectorsList}]",
  "priority": "Urgente" | "Importante" | "Normal",
  "scope": "O que será executado e entregue na 1ª versão considerando os 5 Porquês",
  "immediate": "A PRIMEIRA micro-ação física de 15 minutos para tirar a ideia da cabeça sem desculpas",
  "clarity": "Uma lição prática e motivadora em 1 frase para superar a barreira dos 5 Porquês",
  "steps": [
    { "text": "Passo 1 ultra específico atacando o 1º obstáculo prático (15 a 20 min)", "minutes": 15 },
    { "text": "Passo 2 de execução contornando o gargalo do 3º/4º Por quê (20 a 35 min)", "minutes": 25 },
    { "text": "Passo 3 de construção e consolidação do projeto (30 a 45 min)", "minutes": 35 },
    { "text": "Passo 4 de entrega tangível, validação ou celebração (15 a 30 min)", "minutes": 20 }
  ]
}`;

    if (provider === 'gemini') {
      let lastError = '';
      for (const model of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
          const res = await fetch(url, {
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

          if (res.ok) {
            const json = await res.json();
            const contentStr = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (contentStr) {
              const parsed = JSON.parse(contentStr);
              const promptTokens = json?.usageMetadata?.promptTokenCount ?? 320;
              const completionTokens = json?.usageMetadata?.candidatesTokenCount ?? 190;
              return {
                success: true,
                parsed,
                model,
                provider: 'gemini',
                tokensUsed: {
                  promptTokens,
                  completionTokens,
                  totalTokens: promptTokens + completionTokens,
                },
                latencyMs: Date.now() - startTime,
              };
            }
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 400 && lastError.toLowerCase().includes('api_key')) break;
          if (res.status === 401 || res.status === 403) break;
        } catch (err: any) {
          lastError = err?.message || 'Falha de conexão com Gemini';
        }
      }
      return { success: false, error: lastError || 'Erro ao planejar ideia no Gemini.' };
    } else {
      // Groq Plan
      let lastError = '';
      for (const model of GROQ_MODELS) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${activeKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: 'Você é um planejador de projetos prático. Responda estritamente em JSON válido.' },
                { role: 'user', content: prompt },
              ],
              temperature: 0.6,
              response_format: { type: 'json_object' },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) {
              const parsed = JSON.parse(text);
              const promptTokens = data?.usage?.prompt_tokens ?? 350;
              const completionTokens = data?.usage?.completion_tokens ?? 210;
              return {
                success: true,
                parsed,
                model,
                provider: 'groq',
                tokensUsed: {
                  promptTokens,
                  completionTokens,
                  totalTokens: promptTokens + completionTokens,
                },
                latencyMs: Date.now() - startTime,
              };
            }
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 401) break;
        } catch (err: any) {
          lastError = err?.message || 'Erro de rede com Groq';
        }
      }
      return {
        success: false,
        error: lastError.includes('fetch') || lastError.includes('ENOTFOUND') || lastError.includes('network')
          ? 'Rede corporativa ou firewall bloqueou a conexão com a Groq.'
          : lastError || 'Erro ao planejar ideia na Groq.',
      };
    }
  }

  // 4. AÇÃO: DECOMPOSIÇÃO DE PROJETO EM MÓDULOS
  if (action === 'project') {
    const { projectTitle, projectSummary, sector } = body;
    const validWhys = (fiveWhys || []).filter((w: any) => typeof w === 'string' && w.trim().length > 0);
    const whysSection = validWhys.length > 0
      ? `\nContexto dos 5 Porquês do projeto:\n${validWhys.map((w: string, idx: number) => `${idx + 1}º Por quê: "${w}"`).join('\n')}`
      : '';

    const prompt = `Você é o Ideaflow AI, um estrategista experiente em decompor projetos em módulos acionáveis.
Projeto Macro: "${projectTitle}"
Descrição: "${projectSummary || 'Sem descrição'}"
Setor: "${sector || 'personal'}"${whysSection}

Divida este projeto macro em 3 a 5 módulos ou frentes de desenvolvimento realistas e complementares.
Responda EXCLUSIVAMENTE um array JSON de objetos:
[
  {
    "title": "Título conciso da frente",
    "summary": "Resumo prático em 1 frase do que será realizado",
    "minutes": 60
  }
]`;

    if (provider === 'gemini') {
      let lastError = '';
      for (const model of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
          const res = await fetch(url, {
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

          if (res.ok) {
            const json = await res.json();
            const contentStr = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (contentStr) {
              const modules = JSON.parse(contentStr);
              if (Array.isArray(modules) && modules.length > 0) {
                const promptTokens = json?.usageMetadata?.promptTokenCount ?? 260;
                const completionTokens = json?.usageMetadata?.candidatesTokenCount ?? 150;
                return {
                  success: true,
                  modules,
                  model,
                  provider: 'gemini',
                  tokensUsed: {
                    promptTokens,
                    completionTokens,
                    totalTokens: promptTokens + completionTokens,
                  },
                  latencyMs: Date.now() - startTime,
                };
              }
            }
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 400 && lastError.toLowerCase().includes('api_key')) break;
          if (res.status === 401 || res.status === 403) break;
        } catch (err: any) {
          lastError = err?.message || 'Falha de conexão com Gemini';
        }
      }
      return { success: false, error: lastError || 'Erro ao gerar módulos no Gemini.' };
    } else {
      // Groq Project
      let lastError = '';
      for (const model of GROQ_MODELS) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${activeKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: 'Você divide projetos em módulos práticos. Responda estritamente em JSON puro com a chave "modules": [...]' },
                { role: 'user', content: prompt + '\nResponda no formato: { "modules": [ { "title": "...", "summary": "...", "minutes": 60 } ] }' },
              ],
              temperature: 0.6,
              response_format: { type: 'json_object' },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) {
              const parsed = JSON.parse(text);
              const modules = Array.isArray(parsed) ? parsed : (parsed.modules || []);
              if (modules.length > 0) {
                const promptTokens = data?.usage?.prompt_tokens ?? 280;
                const completionTokens = data?.usage?.completion_tokens ?? 160;
                return {
                  success: true,
                  modules,
                  model,
                  provider: 'groq',
                  tokensUsed: {
                    promptTokens,
                    completionTokens,
                    totalTokens: promptTokens + completionTokens,
                  },
                  latencyMs: Date.now() - startTime,
                };
              }
            }
          }

          const errData = await res.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${res.status}`;
          if (res.status === 401) break;
        } catch (err: any) {
          lastError = err?.message || 'Erro de rede com Groq';
        }
      }
      return { success: false, error: lastError || 'Erro ao gerar módulos na Groq.' };
    }
  }

  return { success: false, error: 'Ação desconhecida.' };
}
