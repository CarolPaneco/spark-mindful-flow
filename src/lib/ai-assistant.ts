import { Idea, Sector, Step, planIdea, generateAiSteps } from './ideaflow';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: 'gemini' | 'local';
  suggestedActions?: string[];
}

export const AI_STORAGE_KEY = 'ideaflow-gemini-key';

export function cleanGeminiKey(key: string): string {
  if (!key) return '';
  return key.trim().replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '');
}

export function getActiveGeminiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(AI_STORAGE_KEY);
    if (stored && stored.trim()) return cleanGeminiKey(stored);
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim()) {
    return cleanGeminiKey(envKey);
  }
  return '';
}

export function getStoredGeminiKey(): string {
  return getActiveGeminiKey();
}

export function setStoredGeminiKey(key: string) {
  if (typeof window === 'undefined') return;
  const cleaned = cleanGeminiKey(key);
  if (!cleaned) {
    localStorage.removeItem(AI_STORAGE_KEY);
  } else {
    localStorage.setItem(AI_STORAGE_KEY, cleaned);
  }
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
 * Motor de IA Heurística e Cognitiva Local (Offline & 100% Gratuito).
 * Funciona imediatamente sem depender de servidores ou chaves.
 */
function localAiResponse(userMessage: string, contextIdea?: Idea, allIdeas?: Idea[]): string {
  const query = userMessage.toLowerCase();

  // Se o contexto for uma ideia específica
  if (contextIdea) {
    if (query.includes('bolo') || query.includes('receita') || query.includes('cenoura') || query.includes('cozinha') || query.includes('avó') || query.includes('família')) {
      return `Que ideia cheia de afeto para **${contextIdea.title}**! ❤️\n\n` +
        `Aqui está o plano prático para tornar essa visita inesquecível:\n\n` +
        `1. **Checagem de Ingredientes (15 min):** Veja se tem cenouras frescas, ovos, óleo, farinha e açúcar.\n` +
        `2. **Preparo e Forno (45 min):** Bata os líquidos no liquidificador, misture delicadamente a farinha e leve para assar a 180°C.\n` +
        `3. **Cobertura Especial (20 min):** Faça uma calda de chocolate bem brilhante (manteiga, cacau, açúcar e leite).\n` +
        `4. **A Visita:** Deixe esfriar, embale com cuidado e aproveite cada minuto de conversa com sua avó!\n\n` +
        `💡 *Dica do Mentor:* O segredo do bolo fofinho é não bater demais a farinha de trigo. E o segredo da vida é aproveitar esses momentos com quem amamos.`;
    }

    if (query.includes('passo') || query.includes('etapa') || query.includes('fazer')) {
      return `Aqui está um plano estratégico de ação para **${contextIdea.title}**:\n\n` +
        `1. **Primeiro Marco (15 min):** ${contextIdea.immediate || 'Definir o resultado visual em 1 frase.'}\n` +
        `2. **Validação Simples:** Mostre esse rascunho para 1 pessoa e peça a opinião mais sincera.\n` +
        `3. **Execução do Núcleo:** Elimine qualquer funcionalidade que não seja essencial para o objetivo principal.\n` +
        `4. **Fechamento:** Finalize os últimos ajustes e coloque em uso real.\n\n` +
        `💡 *Dica do Mentor:* Não espere ficar perfeito. O feedback do mundo real é 10x mais valioso que o planejamento no papel.`;
    }

    if (query.includes('destrav') || query.includes('procrastin') || query.includes('bloquei') || query.includes('dificuldade')) {
      return `Vamos destravar **${contextIdea.title}** agora mesmo.\n\n` +
        `Geralmente a procrastinação acontece por dois motivos: ou o próximo passo está muito vago, ou o escopo parece assustadoramente grande.\n\n` +
        `🔥 **Exercício dos 5 minutos:**\n` +
        `Abra um cronômetro e trabalhe nesta ideia durante apenas 5 minutos, sem a obrigação de terminar. Se quiser parar depois de 5 minutos, pare. (Quase sempre seu cérebro engrena e continua).\n\n` +
        `Se o escopo estiver pesado, use a aba **Mudança de Rota** para cortar metade das pendências e lançar uma versão menor hoje.`;
    }

    if (query.includes('monetiz') || query.includes('vender') || query.includes('ganhar') || query.includes('preço')) {
      return `Estratégia de monetização para **${contextIdea.title}**:\n\n` +
        `1. **Pré-venda / Validação Antecipada:** Antes de construir tudo, converse com 3 pessoas que sofrem com essa dor e pergunte se pagariam para ter isso resolvido.\n` +
        `2. **Modelo de Preço Simples:** Comece com um valor único ou assinatura acessível para os primeiros 10 clientes ("early adopters").\n` +
        `3. **Garantia Incondicional:** Reduza o risco de quem compra oferecendo garantia de satisfação total.`;
    }

    if (query.includes('escopo') || query.includes('pivô') || query.includes('mudar') || query.includes('simplificar')) {
      return `Análise de Escopo para **${contextIdea.title}**:\n\n` +
        `Escopo atual: *"${contextIdea.scope || 'Versão inicial'}"*\n\n` +
        `✂️ **Regra do Corte Radical:** Se você tivesse que lançar esse projeto amanhã às 18h, o que você deixaria de fora?\n` +
        `O que sobrar é o seu verdadeiro MVP (Mínimo Produto Viável). Registre essa decisão na aba **Mudança de Rota** do projeto para guardar o motivo da mudança.`;
    }

    return `Analisando sua ideia **"${contextIdea.title}"** (Setor: ${contextIdea.sector}, Prioridade: ${contextIdea.priority}):\n\n` +
      `Ela tem atualmente ${contextIdea.steps.length} passos definidos e ${contextIdea.dedicated} minutos dedicados.\n\n` +
      `🎯 **Recomendação prioritária:** O próximo passo imediato é *" ${contextIdea.immediate} "*. Que tal iniciar uma sessão de foco de 15 minutos agora?`;
  }

  // Se a pergunta for sobre o conjunto de ideias ou geral
  if (query.includes('focar') || query.includes('hoje') || query.includes('começar') || query.includes('prioridade')) {
    const urgent = allIdeas?.find(i => i.priority === 'Urgente' && i.stage < 4);
    const inFlow = allIdeas?.find(i => i.stage === 2);
    const chosen = urgent || inFlow || allIdeas?.[0];

    if (chosen) {
      return `Com base no seu funil, sua prioridade número 1 hoje deve ser **"${chosen.title}"**.\n\n` +
        `• **Por que ela?** ${chosen.priority === 'Urgente' ? 'Ela está marcada com prioridade Urgente.' : 'Ela já está na fase Em Fluxo e pronta para avançar.'}\n` +
        `• **Próximo passo:** ${chosen.immediate}\n` +
        `• **Sugestão:** Reserve o bloco da Manhã na aba 'Hoje' para trabalhar nela.`;
    }
  }

  if (query.includes('funil') || query.includes('status') || query.includes('resumo') || query.includes('analis')) {
    const total = allIdeas?.length ?? 0;
    const completed = allIdeas?.filter(i => i.stage === 4).length ?? 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `📊 **Diagnóstico Geral do seu Ideaflow:**\n\n` +
      `• Você possui **${total} ideias cadastradas**.\n` +
      `• **${completed} ideias já viraram Realidade** (${rate}% de conclusão).\n\n` +
      `Seu maior desafio agora é manter a taxa de conversão das ideias que estão em 'Faísca' e 'Estrutura'. Escolha apenas 1 ideia para avançar esta semana!`;
  }

  return `Estou aqui como seu **Mentor Ideaflow** para transformar suas ideias em projetos reais!\n\n` +
    `Você pode me pedir:\n` +
    `• *"Qual ideia devo focar hoje?"*\n` +
    `• *"Crie um checklist de 5 passos para meu projeto"*\n` +
    `• *"Como destravar uma ideia que está parada há muito tempo?"*\n` +
    `• *"Me ajude a reduzir o escopo para lançar rápido"*\n\n` +
    `O que você gostaria de explorar agora?`;
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

  const systemInstruction = `Você é o Mentor Ideaflow, um consultor e copiloto de alta performance, Lean Startup e psicologia da ação.
Seu objetivo é ajudar o usuário a transformar ideias (de qualquer natureza: tecnologia, negócios, culinária, família, projetos pessoais, marcenaria) em projetos reais, práticos e executáveis.
Diretrizes:
- Seja encorajador, afetuoso, direto, prático e sem enrolação teórica.
- Sugira micro-passos de 15 a 30 minutos e ações físicas concretas.
- Fale em português do Brasil com formatação markdown rica (tópicos, negrito, emojis).
${contextText ? `Contexto atual do usuário no aplicativo: ${contextText}` : ''}`;

  // Higieniza e garante alternância estrita de turnos para o Gemini (user -> model -> user -> ...)
  const sanitizedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  // Filtra mensagens vazias
  const validHistory = (history || []).filter(h => h && typeof h.text === 'string' && h.text.trim());

  for (const turn of validHistory) {
    const role: 'user' | 'model' = turn.role === 'model' ? 'model' : 'user';
    const last = sanitizedContents[sanitizedContents.length - 1];
    if (last && last.role === role) {
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
  if (sanitizedContents.length > 0 && sanitizedContents[0].role === 'model') {
    sanitizedContents.unshift({
      role: 'user',
      parts: [{ text: 'Olá Mentor, gostaria de orientações sobre minhas ideias.' }],
    });
  }

  // Adiciona a mensagem atual do usuário garantindo papel 'user'
  const lastTurn = sanitizedContents[sanitizedContents.length - 1];
  if (lastTurn && lastTurn.role === 'user') {
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
            sectors[0];

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
              sectors[0];

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
 * 1. Tenta via backend seguro (/api/gemini) sem problemas de CORS.
 * 2. Em caso de ausência de chave ou falha na API, usa o Motor Cognitivo Heurístico Local (100% Gratuito & Offline) e informa o erro se houver.
 */
export async function askMentorAi({
  message,
  contextIdea,
  allIdeas,
  history = [],
}: {
  message: string;
  contextIdea?: Idea;
  allIdeas?: Idea[];
  history?: { role: 'user' | 'model'; text: string }[];
}): Promise<{ reply: string; provider: 'gemini' | 'local'; error?: string }> {
  const geminiKey = getActiveGeminiKey();

  if (geminiKey) {
    let contextText = '';
    if (contextIdea) {
      contextText = `Ideia Atual: Título: "${contextIdea.title}", Setor: "${contextIdea.sector}", Prioridade: "${contextIdea.priority}", Estágio: ${contextIdea.stage}, Resumo: "${contextIdea.summary}", Escopo: "${contextIdea.scope || 'N/A'}", Passos: ${JSON.stringify(contextIdea.steps)}`;
    } else if (allIdeas) {
      contextText = `Total de Ideias: ${allIdeas.length}. Ideias em andamento: ${allIdeas.map(i => i.title).join(', ')}`;
    }

    // 1. Tenta via backend seguro para eliminar problemas de CORS no navegador
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mentor',
          apiKey: geminiKey,
          message,
          contextText,
          history,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reply) {
          return { reply: data.reply, provider: 'gemini' };
        }
        if (data.error) {
          console.warn('Erro no /api/gemini:', data.error);
          const localReply = localAiResponse(message, contextIdea, allIdeas);
          return { reply: localReply, provider: 'local', error: data.error };
        }
      }
    } catch (err: any) {
      console.warn('Backend /api/gemini indisponível, tentando fallback:', err?.message);
    }

    // 2. Fallback direto caso o endpoint local não esteja acessível
    try {
      const geminiReply = await callGeminiApiWithHistory({
        apiKey: geminiKey,
        message,
        contextText,
        history,
      });

      return { reply: geminiReply, provider: 'gemini' };
    } catch (err: any) {
      console.warn('Falha na API Gemini, usando motor local gratuito:', err?.message);
      const localReply = localAiResponse(message, contextIdea, allIdeas);
      return {
        reply: localReply,
        provider: 'local',
        error: err?.message || 'Falha na resposta do Google Gemini',
      };
    }
  }

  // Fallback para Motor Cognitivo Local 100% Gratuito
  const localReply = localAiResponse(message, contextIdea, allIdeas);
  return { reply: localReply, provider: 'local' };
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

