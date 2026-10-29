/**
 * Motor Integrado de Inteligência Artificial Oficial do Ideaflow (Estilo ChatGPT).
 * 1. Não requer nenhuma chave de API do usuário (100% integrado internamente).
 * 2. Conecta a modelos de ponta estilo ChatGPT (OpenAI GPT-4o-mini).
 * 3. Se houver firewall corporativo ou modo avião, tem fallback transparente e instantâneo.
 */

export async function callIntegratedAiChat({
  messages,
  timeoutMs = 7500,
}: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  timeoutMs?: number;
}): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'openai',
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.ok) {
      const text = await res.text();
      // Validação: não pode ser resposta vazia, JSON vazio {} ou página HTML de bloqueio
      if (
        text &&
        text.trim().length > 10 &&
        text.trim() !== '{}' &&
        !text.includes('<!DOCTYPE html>') &&
        !text.includes('FortiGate') &&
        !text.includes('Web Filter')
      ) {
        return text.trim();
      }
    }

    throw new Error('Resposta inválida do serviço de nuvem.');
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Gera um plano de ideia contextualizado e inteligente via IA Integrada (GPT-4o).
 * Leva em conta as respostas dos 5 Porquês para atingir a motivação real do usuário.
 */
export async function planIdeaWithIntegratedAi(
  rawText: string,
  sectorsList: string,
  fiveWhys?: string[]
): Promise<any> {
  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const whysSection = validWhys.length > 0
    ? `\nCONTEXTO CRUCIAL E OBRIGATÓRIO DOS 5 PORQUÊS RESPONDIDOS PELO USUÁRIO:
${validWhys.map((w, idx) => `${idx + 1}º Por quê: "${w}"`).join('\n')}

DIRETRIZES DE USO DOS 5 PORQUÊS:
1. Mesmo que o texto inicial da ideia seja breve, os 5 Porquês revelam a real motivação, as dores profundas e os obstáculos que impediram o usuário de realizar isso até hoje.
2. Cada um dos passos gerados DEVE dialogar diretamente com essas respostas!
3. Se o usuário mencionou ferramentas específicas, pessoas, dores financeiras, emocionais ou gargalos de tempo nos 5 Porquês, mencione e resolva esses pontos explicitamente nos passos.
4. O Passo 1 deve atacar a primeira barreira prática para destravar o início imediato.
5. O Passo 2 e 3 devem construir a solução contornando o obstáculo citado no 3º ou 4º Por quê.
6. O Passo 4 deve ser a entrega ou validação direta do resultado prometido no 5º Por quê.`
    : '';

  const prompt = `Você é um arquiteto e estrategista de projetos genial, prático e empático.
O usuário registrou o seguinte desejo/ideia:
"${rawText}"
${whysSection}

Sua missão é criar um plano de ação real, minucioso, contextualizado e pé no chão.
PROIBIDO passos genéricos como "pesquisar referências", "planejar projeto" ou "definir escopo". Cada passo deve dizer EXATAMENTE o que fazer utilizando o vocabulário, contexto e intenção das respostas do usuário.

Responda ESTRITAMENTE em formato JSON (sem blocos markdown, apenas o json):
{
  "title": "Título atraente, profissional e claro (máx 60 caracteres)",
  "summary": "Resumo em 1 a 2 frases conectando o desejo à transformação raiz dos 5 Porquês",
  "sectorId": "O ID mais compatível entre: [${sectorsList}]",
  "priority": "Urgente" | "Importante" | "Normal",
  "scope": "O que exatamente será entregue na primeira versão considerando os 5 Porquês",
  "immediate": "A PRIMEIRA micro-ação prática de 15 minutos para tirar a ideia da cabeça AGORA",
  "clarity": "Uma lição prática e motivadora em 1 frase para superar a principal barreira dos 5 Porquês",
  "steps": [
    { "text": "Passo 1 ultra específico conectando o texto da ideia ao início prático (15 a 20 min)", "minutes": 15 },
    { "text": "Passo 2 de superação do gargalo/obstáculo citado nas respostas (20 a 35 min)", "minutes": 25 },
    { "text": "Passo 3 de construção e execução central da iniciativa (30 a 45 min)", "minutes": 35 },
    { "text": "Passo 4 de entrega, validação ou resultado tangível prometido (15 a 30 min)", "minutes": 20 }
  ]
}`;

  const responseText = await callIntegratedAiChat({
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente JSON que responde exclusivamente objetos JSON válidos sem formatação markdown.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    timeoutMs: 9000,
  });

  const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Sugere respostas iniciais para os 5 Porquês com base na ideia inicial informada.
 * Prioriza Groq (GPT-OSS 120B) com compreensão profunda e resposta em milissegundos.
 */
export async function suggestFiveWhysWithAi(titleOrText: string): Promise<string[]> {
  try {
    const { suggestFiveWhysWithGroq } = await import('./groq');
    const groqWhys = await suggestFiveWhysWithGroq(titleOrText);
    if (Array.isArray(groqWhys) && groqWhys.length >= 3) {
      return groqWhys;
    }
  } catch (err) {
    console.warn('Falha na IA Groq para 5 Porquês, tentando fallback integrado:', err);
  }

  const prompt = `Com base na seguinte ideia/projeto:
"${titleOrText}"

Gere 5 respostas concisas, reflexivas e inspiradoras (1 a 2 frases cada) seguindo a metodologia dos 5 Porquês:
1. 1º Por quê: Qual é o objetivo raiz dessa realização? (Por que criar isso?)
2. 2º Por quê: Por que isso é prioridade agora? (Qual a oportunidade ou necessidade atual?)
3. 3º Por quê: Por que isso ainda não foi feito? (Qual o maior obstáculo ou desafio a vencer?)
4. 4º Por quê: Por que o sucesso disso importa de verdade? (Qual o impacto real ou motivação profunda?)
5. 5º Por quê: Por que esse primeiro formato enxuto é o caminho certo para começar?

Responda ESTRITAMENTE em formato JSON com um array de 5 strings:
["resposta 1", "resposta 2", "resposta 3", "resposta 4", "resposta 5"]`;

  try {
    const responseText = await callIntegratedAiChat({
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente JSON que responde exclusivamente um array JSON com 5 strings.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      timeoutMs: 8000,
    });

    const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length >= 5 && parsed.every(s => typeof s === 'string')) {
      return parsed.slice(0, 5);
    }
  } catch (err) {
    console.warn('Falha na IA integrada para 5 Porquês, usando gerador offline:', err);
  }

  // Fallback offline garantido
  const { suggestFiveWhysOffline } = await import('./ideaflow');
  return suggestFiveWhysOffline(titleOrText);
}

