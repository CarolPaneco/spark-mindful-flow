export function cleanGeminiKey(key: string): string {
  if (!key) return '';
  return key.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
}

export const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

export async function handleGeminiBackend(body: any): Promise<any> {
  const { action, apiKey, message, contextText, history, rawText, sectors } = body;
  const key = cleanGeminiKey(apiKey || process.env.VITE_GEMINI_API_KEY || '');

  if (!key) {
    return { success: false, error: 'Chave do Google Gemini não fornecida.' };
  }

  if (action === 'test') {
    let lastError = '';
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Diga apenas: OK' }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          const html = await res.text().catch(() => '');
          if (html.includes('FortiGate') || html.includes('Application Blocked') || html.includes('GenAI')) {
            return {
              success: false,
              error: 'O Firewall da sua rede atual (FortiGate) bloqueou o acesso à categoria GenAI (Google.Gemini). Conecte-se a uma rede pessoal (como 4G do celular ou Wi-Fi residencial) para usar o Gemini, ou continue utilizando o Motor Cognitivo Local que funciona 100% offline!',
            };
          }
        }

        if (res.ok) {
          return { success: true, model };
        }

        const errData = await res.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${res.status}`;
        lastError = msg;
        if (res.status === 400 && msg.toLowerCase().includes('api_key')) {
          return { success: false, error: msg };
        }
        if (res.status === 401 || res.status === 403) {
          return { success: false, error: msg };
        }
      } catch (err: any) {
        lastError = err?.message || 'Falha de conexão com a API da Google';
      }
    }
    return { success: false, error: lastError || 'Não foi possível validar a chave nos modelos Gemini ativos.' };
  }

  if (action === 'mentor') {
    const systemPrompt = `Você é o Mentor Ideaflow, um consultor e copiloto de alta performance, Lean Startup e psicologia da ação.
Seu objetivo é ajudar o usuário a transformar ideias (de qualquer natureza: tecnologia, negócios, culinária, família, projetos pessoais, marcenaria) em projetos reais, práticos e executáveis.
Diretrizes:
- Seja encorajador, afetuoso, direto, prático e sem enrolação teórica.
- Sugira micro-passos de 15 a 30 minutos e ações físicas concretas.
- Fale em português do Brasil com formatação markdown rica (tópicos, negrito, emojis).
${contextText ? `Contexto atual do usuário no aplicativo:\n${contextText}` : ''}`;

    const sanitizedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    const validHistory = (history || []).filter((h: any) => h && typeof h.text === 'string' && h.text.trim());

    for (const turn of validHistory) {
      const role: 'user' | 'model' = turn.role === 'model' ? 'model' : 'user';
      const last = sanitizedContents[sanitizedContents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += `\n\n${turn.text.trim()}`;
      } else {
        sanitizedContents.push({ role, parts: [{ text: turn.text.trim() }] });
      }
    }

    if (sanitizedContents.length > 0 && sanitizedContents[0].role === 'model') {
      sanitizedContents.unshift({
        role: 'user',
        parts: [{ text: 'Olá Mentor, gostaria de orientações sobre minhas ideias.' }],
      });
    }

    const last = sanitizedContents[sanitizedContents.length - 1];
    if (last && last.role === 'user') {
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
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `INSTRUÇÕES DO SISTEMA:\n${systemPrompt}\n\nPor favor, atue de acordo com estas diretrizes.` }] },
              { role: 'model', parts: [{ text: 'Entendido! Sou o Mentor Ideaflow e estou pronto para te ajudar.' }] },
              ...sanitizedContents,
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200,
            },
          }),
        });

        if (res.ok) {
          const result = await res.json();
          const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return { success: true, reply: text, model };
        }

        const errData = await res.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${res.status}`;
        if (res.status === 400 && lastError.toLowerCase().includes('api_key')) break;
        if (res.status === 401 || res.status === 403) break;
      } catch (err: any) {
        lastError = err?.message || 'Falha de conexão com a API Gemini.';
      }
    }

    return { success: false, error: lastError || 'Erro ao consultar Google Gemini.' };
  }

  if (action === 'plan') {
    const sectorsList = (sectors as Sector[] || []).map(s => `"${s.id}" (${s.name})`).join(', ');
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
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
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

        if (res.ok) {
          const json = await res.json();
          const contentStr = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (contentStr) {
            const parsed = JSON.parse(contentStr);
            return { success: true, parsed, model };
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
  }

  if (action === 'project') {
    const { projectTitle, projectSummary, sector } = body;
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
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
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
              return { success: true, modules, model };
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

    return { success: false, error: lastError || 'Erro ao sugerir frentes do projeto no Gemini.' };
  }

  return { success: false, error: 'Ação desconhecida.' };
}
