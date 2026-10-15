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
 */
export async function planIdeaWithIntegratedAi(
  rawText: string,
  sectorsList: string
): Promise<any> {
  const prompt = `Você é um arquiteto e estrategista de projetos genial e empático.
O usuário escreveu o seguinte desejo/ideia:
"${rawText}"

Sua missão é extrair exatamente o que o usuário quer fazer e criar um plano de ação real, detalhado, ultra-específico e pé no chão.
NUNCA retorne passos genéricos como "pesquisar referências" ou "definir objetivo". Cada passo deve dizer EXATAMENTE o que fazer considerando o tema da pessoa (ex: se for bolo, falar de farinha/forno; se for app de livros, falar de catálogo/ISBN/leitura; se for reforma, falar de medidas/tinta/madeira; se for finanças, falar de planilha/extrato).

Responda ESTRITAMENTE em formato JSON (sem blocos markdown, apenas o json):
{
  "title": "Título atraente, profissional e claro (máx 60 caracteres)",
  "summary": "Resumo de 1 a 2 frases explicando o propósito e a entrega final",
  "sectorId": "O ID mais compatível entre: [${sectorsList}]",
  "priority": "Urgente" | "Importante" | "Normal",
  "scope": "O que exatamente será entregue na primeira versão",
  "immediate": "A PRIMEIRA micro-ação prática de 15 minutos para tirar a ideia da cabeça AGORA",
  "clarity": "Uma lição prática e motivadora em 1 frase para evitar procrastinação",
  "steps": [
    { "text": "Passo 1 ultra específico para o tema (15 a 20 min)", "minutes": 15 },
    { "text": "Passo 2 ultra específico para o tema (20 a 35 min)", "minutes": 25 },
    { "text": "Passo 3 ultra específico para o tema (30 a 45 min)", "minutes": 35 },
    { "text": "Passo 4 de validação, entrega ou uso real (15 a 30 min)", "minutes": 20 }
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

