import { Idea, Sector, Step, planIdea, generateAiSteps, generateSubModulesAi } from './ideaflow';
import {
  getActiveGroqKey,
  callGroqChat,
  planIdeaWithGroq,
  generateProjectModulesWithGroq,
  isGroqActive,
} from './groq';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: 'groq' | 'gemini' | 'local';
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

  // 1. Reforma, Casa, Decoração e Construção
  if (query.includes('reform') || query.includes('cozinha') || query.includes('banheiro') || query.includes('quarto') || query.includes('casa') || query.includes('pintura') || query.includes('piso') || query.includes('obra')) {
    const title = contextIdea ? `para **${contextIdea.title}**` : 'para a sua reforma';
    return `Planejamento prático de execução ${title}! 🛠️🏡\n\n` +
      `Toda reforma bem-sucedida precisa de ordem para evitar desperdício de dinheiro e estresse:\n\n` +
      `1. **Levantamento e Medição (20 min):** Meça as paredes, bancadas e pontos de tomada. Fotografe tudo de diferentes ângulos.\n` +
      `2. **Lista de Materiais e Cotação (40 min):** Liste revestimentos, tintas, ferragens e consulte preços em pelo menos 2 lojas locais.\n` +
      `3. **Desocupação e Proteção (30 min):** Retire louças, armários ou móveis soltos. Cubra o chão e passagens com papelão ou lona.\n` +
      `4. **Execução em Ordem Correta:**\n` +
      `   • 1º Infraestrutura (hidráulica e elétrica)\n` +
      `   • 2º Revestimentos e alvenaria\n` +
      `   • 3º Pintura e acabamentos\n` +
      `   • 4º Instalação de marcenaria e iluminação\n\n` +
      `🎯 **Ação Imediata de 15 min:** Pegue uma trena e anote as 3 principais medidas do espaço no bloco de notas da ideia.\n` +
      `💡 *Dica do Mentor:* Deixe 15% de margem no orçamento para imprevistos. O segredo de uma reforma leve é respeitar a ordem das etapas!`;
  }

  // 2. Gastronomia, Receitas e Cozinha Afetiva
  if (query.includes('bolo') || query.includes('receita') || query.includes('cenoura') || query.includes('doce') || query.includes('almoço') || query.includes('jantar') || query.includes('avó') || query.includes('família')) {
    const title = contextIdea ? `para **${contextIdea.title}**` : 'para sua receita especial';
    return `Que ideia cheia de afeto e sabor ${title}! 🍰❤️\n\n` +
      `Aqui está o roteiro infalível para preparar tudo com carinho e sem correria:\n\n` +
      `1. **Mise en Place / Checagem (15 min):** Separe e pese todos os ingredientes antes de ligar o forno (cenouras frescas, ovos em temperatura ambiente, óleo, açúcar e farinha).\n` +
      `2. **Preparo da Massa (15 min):** Bata os líquidos no liquidificador até ficar homogêneo. Peneire a farinha e o fermento em uma tigela e misture delicadamente com um fouet (não bata para não solar).\n` +
      `3. **Forno (40-45 min):** Forno pré-aquecido a 180°C. Faça o teste do palito no centro aos 40 minutos.\n` +
      `4. **Cobertura de Chocolate Brilhante (15 min):** Em uma panela pequena, junte manteiga, cacau em pó, leite e açúcar. Ferva em fogo baixo até engrossar e jogue sobre o bolo morno.\n\n` +
      `🎯 **Ação Imediata de 15 min:** Vá até a despensa e verifique a validade do fermento em pó.\n` +
      `💡 *Dica do Mentor:* Momentos ao redor da mesa criam memórias para a vida toda. Aproveite cada minuto do preparo!`;
  }

  // 3. Marcenaria, Artesanato e Projetos Manuais
  if (query.includes('marcenaria') || query.includes('madeira') || query.includes('móvel') || query.includes('lixar') || query.includes('verniz') || query.includes('artesanato') || query.includes('oficina')) {
    const title = contextIdea ? `para **${contextIdea.title}**` : 'para o seu projeto manual';
    return `Roteiro artesanal de precisão ${title}! 🪵📐\n\n` +
      `1. **Desenho e Plano de Corte (25 min):** Coloque no papel o esboço com as dimensões exatas e a lista de peças.\n` +
      `2. **Preparação dos Materiais (30 min):** Escolha as tábuas ou chapas, verifique esquadros e faça as marcações a lápis.\n` +
      `3. **Cortes e Junções (60 min):** Realize os cortes com calma e faça a pré-montagem para garantir que os encaixes estejam perfeitos.\n` +
      `4. **Lixamento Progressivo (45 min):** Lixe no sentido dos veios da madeira (grão 80 ➔ 150 ➔ 220).\n` +
      `5. **Acabamento Protetor (30 min):** Aplique óleo mineral, cera de abelha ou seladora com pincel ou pano de algodão.\n\n` +
      `🎯 **Ação Imediata de 15 min:** Defina as medidas externas da peça e anote no resumo da ideia.\n` +
      `💡 *Dica do Mentor:* A paciência no lixamento é o que diferencia uma peça comum de uma obra-prima.`;
  }

  // 4. Negócios, Vendas, Clientes e Monetização
  if (query.includes('monetiz') || query.includes('vender') || query.includes('ganhar') || query.includes('preço') || query.includes('cliente') || query.includes('loja') || query.includes('marketing')) {
    const title = contextIdea ? `para **${contextIdea.title}**` : 'para o seu negócio';
    return `Estratégia de validação comercial e monetização ${title}! 💼📈\n\n` +
      `1. **Definição da Dor Urgente:** As pessoas não compram produtos, compram soluções para suas dores ou atalhos para seus desejos.\n` +
      `2. **Pré-venda / 3 Primeiros Clientes:** Antes de gastar dinheiro com estoque ou plataformas complexas, converse com 3 pessoas reais e faça uma oferta irresistível com desconto de pioneiro.\n` +
      `3. **Modelo de Precificação Simples:** Calcule custo + seu tempo + margem de 40% a 60%. Nunca cobre abaixo do mercado para não desvalorizar seu trabalho.\n` +
      `4. **Garantia Incondicional:** Ofereça 100% de satisfação garantida para que o cliente sinta risco zero ao fechar com você.\n\n` +
      `🎯 **Ação Imediata de 15 min:** Escreva em 1 parágrafo: "Eu ajudo [Público] a conseguir [Resultado] sem [Maior Dor]."\n` +
      `💡 *Dica do Mentor:* Vender é prestar um serviço. Se o seu projeto gera valor verdadeiro, oferecê-lo com confiança é ajudar o próximo.`;
  }

  // 5. Destravar Procrastinação e Bloqueios
  if (query.includes('destrav') || query.includes('procrastin') || query.includes('bloquei') || query.includes('dificuldade') || query.includes('preguiça') || query.includes('começar')) {
    const title = contextIdea ? `em **${contextIdea.title}**` : 'no seu projeto';
    return `Vamos destravar esse nó agora mesmo ${title}! ⚡🧠\n\n` +
      `A procrastinação quase nunca é preguiça. Ela é uma resposta do cérebro a um passo que está vago demais ou a um medo sutil de falhar.\n\n` +
      `🔥 **O Método dos 5 Minutos (Regra de Ouro):**\n` +
      `Não tente terminar o projeto hoje. Pegue um cronômetro e comprometa-se a agir nele por apenas **5 minutos cronometrados**.\n` +
      `• Se ao final de 5 minutos você quiser parar, tem permissão total para parar.\n` +
      `• Na prática, 80% das vezes o cérebro quebra o atrito estático e continua trabalhando feliz.\n\n` +
      `✂️ **Corte Radical:** Reduza pela metade o que você pretendia fazer hoje. O que é o MÍNIMO que você pode entregar agora?\n\n` +
      `🎯 **Ação Imediata de 15 min:** Abra a ideia no app, selecione o primeiro passo e toque em **"Começar foco"**!`;
  }

  // 6. Se tiver ideia em contexto
  if (contextIdea) {
    if (query.includes('passo') || query.includes('etapa') || query.includes('fazer') || query.includes('plano')) {
      return `Plano de ação executável para **${contextIdea.title}** (Setor: ${contextIdea.sector}):\n\n` +
        `1. **Primeiro Marco (15 min):** ${contextIdea.immediate || 'Definir o resultado visual em 1 frase.'}\n` +
        `2. **Validação Rápida (30 min):** Execute a versão mais simples possível e avalie o resultado.\n` +
        `3. **Execução do Núcleo (45 min):** Elimine distrações e foque exclusivamente no que gera valor.\n` +
        `4. **Conclusão e Entrega (20 min):** Finalize os detalhes finais e mova o card para a próxima etapa do funil!\n\n` +
        `🎯 **Ação Imediata:** ${contextIdea.immediate}\n` +
        `💡 *Dica do Mentor:* O feito é infinitamente melhor que o perfeito que nunca sai do papel.`;
    }

    if (query.includes('escopo') || query.includes('pivô') || query.includes('mudar') || query.includes('simplificar')) {
      return `Análise de Escopo para **${contextIdea.title}**:\n\n` +
        `Escopo registrado: *"${contextIdea.scope || 'Versão inicial em desenvolvimento'}"*\n\n` +
        `✂️ **A Pergunta do Foco:** "Se você precisasse entregar ou usar essa ideia até amanhã, o que você cortaria sem dó?"\n` +
        `Tudo o que você cortar não é perda — é foco. Registre isso na aba **Mudança de Rota** para manter o projeto leve e realizável!`;
    }

    return `Analisando sua ideia **"${contextIdea.title}"**:\n\n` +
      `• Setor: **${contextIdea.sector}** | Prioridade: **${contextIdea.priority}**\n` +
      `• Passos cadastrados: **${contextIdea.steps.length}** | Tempo estimado: **${contextIdea.minutes} min**\n` +
      `• Próxima ação recomendada: *" ${contextIdea.immediate} "*\n\n` +
      `Que tal iniciar agora um bloco de foco de 15 minutos na aba 'Hoje' para tirar essa ideia da inércia?`;
  }

  // 7. Qual focar hoje / Prioridade geral
  if (query.includes('focar') || query.includes('hoje') || query.includes('começar') || query.includes('prioridade')) {
    const urgent = allIdeas?.find(i => i.priority === 'Urgente' && i.stage < 4);
    const inFlow = allIdeas?.find(i => i.stage === 2);
    const chosen = urgent || inFlow || allIdeas?.[0];

    if (chosen) {
      return `Com base na análise do seu funil, sua prioridade número 1 hoje deve ser **"${chosen.title}"**.\n\n` +
        `• **Por que ela?** ${chosen.priority === 'Urgente' ? 'Ela está com prioridade Urgente marcada.' : 'Ela já está na fase Em Fluxo e pronta para avançar.'}\n` +
        `• **Próximo passo imediato:** ${chosen.immediate}\n` +
        `• **Sugestão:** Reserve o bloco da Manhã ou Tarde na aba 'Hoje' para realizar esse passo!`;
    }
  }

  // 8. Diagnóstico de funil
  if (query.includes('funil') || query.includes('status') || query.includes('resumo') || query.includes('analis')) {
    const total = allIdeas?.length ?? 0;
    const completed = allIdeas?.filter(i => i.stage === 4).length ?? 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `📊 **Diagnóstico Geral do seu Funil de Ideias:**\n\n` +
      `• **${total} ideias** no seu espaço de realização.\n` +
      `• **${completed} ideias já viraram Realidade** (${rate}% concluídas).\n\n` +
      `Seu objetivo agora é pegar uma ideia de 'Estrutura' ou 'Em Fluxo' e focar até levá-la à fase 'Realidade'!`;
  }

  // 9. Resposta Inteligente Geral Contextual
  return `Como seu **Mentor Ideaflow**, analisei sua solicitação:\n\n` +
    `Aqui está a estratégia de 4 passos para transformar isso em ação real:\n\n` +
    `1. **Clareza de Intenção (15 min):** Escreva em uma frase o resultado final que você quer ver pronto.\n` +
    `2. **Micro-Passo Inicial (15 min):** Encontre a menor ação física possível que você pode fazer agora.\n` +
    `3. **Bloco de Execução Concentrada (30 min):** Feche abas paralelas, coloque o celular em modo não perturbe e execute o núcleo.\n` +
    `4. **Revisão e Celebração (10 min):** Avalie o que aprendeu e mova o ponteiro da realização.\n\n` +
    `🎯 **Próximo passo:** Gostaria de focar em alguma ideia específica do seu funil ou detalhar essa iniciativa?`;
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
 * Planeja uma Ideia utilizando a melhor IA disponível:
 * 1. Groq (se chave configurada)
 * 2. Google Gemini (se chave configurada)
 * 3. Motor Cognitivo Heurístico Local (100% Offline e livre de erros)
 */
export async function planIdeaWithAi(
  rawText: string,
  sectors: Sector[]
): Promise<{ idea: Idea; provider: 'groq' | 'gemini' | 'local'; error?: string }> {
  // 1. Prioriza Groq
  if (isGroqActive()) {
    try {
      const groqResult = await planIdeaWithGroq(rawText, sectors);
      if (groqResult.usedGroq && groqResult.idea) {
        return { idea: groqResult.idea, provider: 'groq' };
      }
    } catch (err: any) {
      console.warn('Groq falhou no planejamento, tentando fallback:', err?.message);
    }
  }

  // 2. Tenta Gemini
  if (getActiveGeminiKey()) {
    try {
      const geminiResult = await planIdeaWithGemini(rawText, sectors);
      if (geminiResult.usedGemini && geminiResult.idea) {
        return { idea: geminiResult.idea, provider: 'gemini' };
      }
    } catch (err: any) {
      console.warn('Gemini falhou no planejamento, usando motor local:', err?.message);
    }
  }

  // 3. Motor Local Seguro
  const fallback = planIdea(rawText, sectors);
  return { idea: fallback, provider: 'local' };
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
 * 1. Prioriza a Groq (LLaMA 3.3/3.1 - ultra-rápida, gratuita e sem bloqueios de CORS).
 * 2. Em seguida tenta o Google Gemini.
 * 3. Fallback contínuo e sem falhas para o Motor Cognitivo Oficial do Ideaflow (100% Offline).
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
}): Promise<{ reply: string; provider: 'groq' | 'gemini' | 'local'; error?: string }> {
  let contextText = '';
  if (contextIdea) {
    contextText = `Ideia Atual: Título: "${contextIdea.title}", Setor: "${contextIdea.sector}", Prioridade: "${contextIdea.priority}", Estágio: ${contextIdea.stage}, Resumo: "${contextIdea.summary}", Escopo: "${contextIdea.scope || 'N/A'}", Passos: ${JSON.stringify(contextIdea.steps)}`;
  } else if (allIdeas) {
    contextText = `Total de Ideias: ${allIdeas.length}. Ideias em andamento: ${allIdeas.map(i => i.title).join(', ')}`;
  }

  // 1. Tenta Groq se chave configurada
  const groqKey = getActiveGroqKey();
  if (groqKey) {
    try {
      const groqMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        {
          role: 'system',
          content: `Você é o Mentor Ideaflow Oficial, copiloto humano, prático e ágil de realização.
Seu foco é ajudar o criador a tirar qualquer ideia do papel (culinária, casa, negócios, tecnologia, marcenaria, família, rotina).
Diretrizes:
- Responda em Português do Brasil com excelente formatação markdown (listas, negritos, emojis acolhedores).
- Seja encorajador, afetuoso, direto e prático (sugira micro-passos de 15 a 30 minutos).
${contextText ? `Contexto do usuário no app: ${contextText}` : ''}`,
        },
        ...history.map(h => ({
          role: (h.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: h.text,
        })),
        { role: 'user' as const, content: message },
      ];

      const groqReply = await callGroqChat({
        messages: groqMessages,
        temperature: 0.7,
      });

      if (groqReply) {
        return { reply: groqReply, provider: 'groq' };
      }
    } catch (err: any) {
      console.warn('Groq falhou, tentando fallback:', err?.message);
    }
  }

  // 2. Tenta Gemini se chave configurada
  const geminiKey = getActiveGeminiKey();
  if (geminiKey) {
    // Tenta via backend seguro
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
      }
    } catch (err: any) {
      console.warn('Backend /api/gemini indisponível, tentando fallback:', err?.message);
    }

    try {
      const geminiReply = await callGeminiApiWithHistory({
        apiKey: geminiKey,
        message,
        contextText,
        history,
      });

      return { reply: geminiReply, provider: 'gemini' };
    } catch (err: any) {
      console.warn('Falha na API Gemini, usando IA Oficial do Ideaflow:', err?.message);
    }
  }

  // 3. Fallback para Motor Cognitivo Local 100% Gratuito (Sempre Seguro & Imediato)
  const localReply = localAiResponse(message, contextIdea, allIdeas);
  return { reply: localReply, provider: 'local' };
}

/**
 * Gera os módulos de um Projeto utilizando a melhor IA disponível:
 * 1. Groq (se chave configurada)
 * 2. Google Gemini (se chave configurada)
 * 3. Motor Cognitivo Heurístico Local (100% Offline e livre de erros)
 */
export async function generateProjectModulesWithAi(
  projectTitle: string,
  projectSummary: string,
  sector: string
): Promise<{ modules: { title: string; summary: string; minutes: number }[]; provider: 'groq' | 'gemini' | 'local'; error?: string }> {
  // 1. Tenta Groq
  if (isGroqActive()) {
    try {
      const groqResult = await generateProjectModulesWithGroq(projectTitle, projectSummary, sector);
      if (groqResult.usedGroq && groqResult.modules.length > 0) {
        return { modules: groqResult.modules, provider: 'groq' };
      }
    } catch (err: any) {
      console.warn('Groq falhou em módulos de projeto, tentando fallback:', err?.message);
    }
  }

  // 2. Tenta Gemini
  if (getActiveGeminiKey()) {
    try {
      const geminiResult = await generateProjectModulesWithGemini(projectTitle, projectSummary, sector);
      if (geminiResult.usedGemini && geminiResult.modules.length > 0) {
        return { modules: geminiResult.modules, provider: 'gemini' };
      }
    } catch (err: any) {
      console.warn('Gemini falhou em módulos de projeto, usando motor local:', err?.message);
    }
  }

  // 3. Motor Local Seguro
  const fallback = generateSubModulesAi(projectTitle, projectSummary, sector);
  return { modules: fallback, provider: 'local' };
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

