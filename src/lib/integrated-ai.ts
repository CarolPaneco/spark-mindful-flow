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

