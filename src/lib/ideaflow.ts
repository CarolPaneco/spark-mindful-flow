export type Tone = 'cyan' | 'pink' | 'amber' | 'green' | 'violet';
export type Stage = 0 | 1 | 2 | 3 | 4;
export type DayBlock = 'Manhã' | 'Tarde' | 'Noite';

export interface Sector {
  id: string;
  name: string;
  tone: Tone;
}

export interface Step {
  id?: string;
  text: string;
  minutes: number;
  done: boolean;
}

export interface PivotRecord {
  id: string;
  date: string;
  type: 'Redução de Escopo' | 'Expansão de Escopo' | 'Mudança de Rota' | 'Pausa Estratégica';
  previousScope: string;
  newScope: string;
  reason: string;
}

export interface IdeaNote {
  id: string;
  createdAt: string;
  text: string;
}

export interface Idea {
  id: string;
  title: string;
  summary: string;
  sector: string;
  priority: 'Urgente' | 'Importante' | 'Normal';
  stage: Stage;
  minutes: number;
  dedicated: number;
  steps: Step[];
  immediate: string;
  clarity: string;
  day?: string | undefined;
  block?: DayBlock | undefined;
  scope?: string | undefined;
  pivots?: PivotRecord[] | undefined;
  notes?: IdeaNote[] | undefined;
  targetDate?: string | undefined;
  dueDate?: string | undefined;
}

export interface FlowData {
  ideas: Idea[];
  sectors: Sector[];
  theme: 'dark' | 'light';
  palette: string;
}

export const stageNames = ['Faísca', 'Estrutura', 'Em Fluxo', 'Ajustes', 'Realidade'];
export const stageTones: Tone[] = ['cyan', 'violet', 'pink', 'amber', 'green'];
export const palettes = ['Aurora', 'Oceano', 'Solar', 'Flora', 'Prisma', 'Pulse'];

export const initialSectors: Sector[] = [
  { id: 'tech', name: 'Tecnologia', tone: 'cyan' },
  { id: 'business', name: 'Negócios', tone: 'violet' },
  { id: 'personal', name: 'Vida pessoal', tone: 'pink' },
  { id: 'wood', name: 'Marcenaria', tone: 'amber' },
];

const makeIdea = (
  id: string,
  title: string,
  summary: string,
  sector: string,
  stage: Stage,
  minutes: number,
  done: number,
  priority: Idea['priority'] = 'Normal',
  scope?: string,
  pivots?: PivotRecord[],
  notes?: IdeaNote[]
): Idea => {
  const steps: Step[] = [
    'Definir objetivo e resultado em 1 frase',
    'Pesquisar 3 referências práticas',
    'Criar primeira versão do protótipo/MVP',
    'Revisar, testar e compartilhar feedback',
  ].map((text, i) => ({
    id: `step-${id}-${i}`,
    text,
    minutes: Math.round(minutes / 4),
    done: i < done,
  }));

  return {
    id,
    title,
    summary,
    sector,
    stage,
    minutes,
    dedicated: stage === 4 ? minutes : done * 25,
    priority,
    scope: scope ?? 'Foco em validação rápida e entrega do primeiro protótipo funcional.',
    immediate: steps[0]?.text ?? 'Definir o primeiro resultado e listar recursos.',
    clarity: 'Um passo pequeno e concreto vale mais que um plano perfeito.',
    steps,
    pivots: pivots ?? [],
    notes: notes ?? [
      {
        id: `note-${id}-1`,
        createdAt: '2026-10-10 14:30',
        text: 'Ideia inicial validada com ótimas perspectivas. Próximo passo é focar no essencial.',
      },
    ],
  };
};

export const seedData = (): FlowData => ({
  theme: 'dark',
  palette: 'Aurora',
  sectors: initialSectors.map(s => ({ ...s })),
  ideas: [
    makeIdea(
      'demo-1',
      'Um app para conectar pessoas e livros',
      'Transformar a troca de livros em novas conexões literárias.',
      'tech',
      2,
      120,
      2,
      'Importante',
      'Versão 1.0 web app com busca por CEP e catálogo de até 50 títulos.',
      [
        {
          id: 'piv-1',
          date: '2026-10-08',
          type: 'Redução de Escopo',
          previousScope: 'App nativo iOS e Android com sistema complexo de frete e chat em tempo real.',
          newScope: 'Web App simples com formulário direto e contato via WhatsApp.',
          reason: 'Lançar em 2 semanas em vez de 6 meses para validar se as pessoas realmente trocam livros no bairro.',
        },
      ],
      [
        {
          id: 'note-d1-1',
          createdAt: '2026-10-09 10:15',
          text: 'Falei com 4 vizinhos que adoraram a proposta de empréstimo local.',
        },
      ]
    ),
    makeIdea(
      'demo-2',
      'Meu cantinho de criação',
      'Um espaço que inspira a colocar ideias no mundo físico.',
      'wood',
      0,
      120,
      0,
      'Normal',
      'Bancada dobrável de parede e painel perfurado para ferramentas.'
    ),
    makeIdea(
      'demo-3',
      'Lançar minha newsletter semanal',
      'Uma dose semanal de ideias, curadoria e aprendizados sem filtros.',
      'business',
      1,
      60,
      1,
      'Importante',
      'Edição semanal de 500 palavras no Substack sobre design e negócios.',
      [
        {
          id: 'piv-3',
          date: '2026-10-11',
          type: 'Mudança de Rota',
          previousScope: 'Blog próprio com plataforma customizada em Astro.',
          newScope: 'Substack direto para focar 100% no texto e não na infraestrutura.',
          reason: 'A infraestrutura estava servindo de procrastinação para não escrever o primeiro texto.',
        },
      ]
    ),
    makeIdea(
      'demo-4',
      'Uma rotina com mais presença',
      'Menos piloto automático. Mais intenção e foco no presente.',
      'personal',
      1,
      45,
      1
    ),
    makeIdea(
      'demo-5',
      'Portfólio que conta minha história',
      'Dar vida aos projetos que merecem ser vistos pelo mercado.',
      'tech',
      2,
      120,
      2,
      'Urgente'
    ),
    makeIdea(
      'demo-6',
      'Minha primeira coleção de móveis',
      'Design autoral em madeira maciça, feito com as próprias mãos.',
      'wood',
      2,
      180,
      2,
      'Importante'
    ),
    makeIdea(
      'demo-7',
      'Tirar a loja online do papel',
      'Ajustar os últimos detalhes antes de abrir as portas para o público.',
      'business',
      3,
      90,
      3
    ),
    makeIdea(
      'demo-8',
      'Voltar a correr, no meu ritmo',
      'Um compromisso de saúde comigo. Um passo de cada vez.',
      'personal',
      4,
      60,
      4
    ),
  ],
});

export function localDate(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatMinutes(minutes: number): string {
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}min` : ''}`
    : `${minutes} min`;
}

/**
 * Motor de IA Heurística local para sugerir passos detalhados conforme o contexto e estilo desejado.
 */
export function generateAiSteps(
  title: string,
  summary: string,
  sectorId: string,
  style: 'mvp' | 'rapido' | 'estruturado' | 'expansao' = 'estruturado'
): Step[] {
  const lower = `${title} ${summary}`.toLowerCase();

  if (style === 'mvp') {
    return [
      {
        id: crypto.randomUUID(),
        text: `Definir a promessa central de “${title.slice(0, 35)}” em 1 frase`,
        minutes: 15,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Construir a versão mais simples possível (rascunho/mockup)',
        minutes: 30,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Apresentar para 1 pessoa real do público-alvo',
        minutes: 20,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Coletar o aprendizado e decidir se avança ou ajusta rota',
        minutes: 15,
        done: false,
      },
    ];
  }

  if (style === 'rapido') {
    return [
      {
        id: crypto.randomUUID(),
        text: 'Escrever o resultado esperado no papel em 5 tópicos',
        minutes: 10,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Separar materiais e eliminar distrações da mesa',
        minutes: 10,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Trabalhar em foco ininterrupto no núcleo da ideia',
        minutes: 25,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Registrar o progresso e definir o próximo compromisso',
        minutes: 10,
        done: false,
      },
    ];
  }

  if (style === 'expansao') {
    return [
      {
        id: crypto.randomUUID(),
        text: 'Mapear canais de divulgação e parceiros potenciais',
        minutes: 30,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Automatizar tarefas repetitivas ou criar templates',
        minutes: 45,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Medir métricas de engajamento e satisfação dos usuários',
        minutes: 30,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Planejar a próxima iteração com base nos dados reais',
        minutes: 30,
        done: false,
      },
    ];
  }

  // Estilo Estruturado por setor / contexto
  if (sectorId === 'tech' || /app|site|software|código|api|banco|web|frontend|backend/.test(lower)) {
    return [
      {
        id: crypto.randomUUID(),
        text: 'Desenhar o fluxo principal de telas e jornada do usuário',
        minutes: 15,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Estruturar o modelo de dados e componentes essenciais',
        minutes: 30,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Desenvolver a funcionalidade principal ponta a ponta',
        minutes: 45,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Testar usabilidade em dispositivo móvel e publicar preview',
        minutes: 20,
        done: false,
      },
    ];
  }

  if (sectorId === 'business' || /venda|cliente|preço|loja|marketing|negócio|lançar/.test(lower)) {
    return [
      {
        id: crypto.randomUUID(),
        text: 'Definir o público ideal e a dor urgente que você resolve',
        minutes: 15,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Montar a proposta de valor e a precificação inicial',
        minutes: 25,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Criar página ou mensagem de pré-lançamento para captação',
        minutes: 35,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Abordar 5 clientes em potencial para feedback honesto',
        minutes: 30,
        done: false,
      },
    ];
  }

  if (sectorId === 'wood' || /marcenaria|madeira|móvel|físico|oficina|artesanato|projeto/.test(lower)) {
    return [
      {
        id: crypto.randomUUID(),
        text: 'Desenhar esboço com medidas finais e lista de cortes',
        minutes: 25,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Verificar ferramentas, insumos e comprar o material bruto',
        minutes: 30,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Executar cortes principais, usinagem e pré-montagem',
        minutes: 60,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Lixamento progressivo, aplicação de acabamento e montagem',
        minutes: 45,
        done: false,
      },
    ];
  }

  if (/bolo|receita|cenoura|cozinha|almoço|jantar|comida|avó|avô|visita|família|aniversário/.test(lower)) {
    return [
      {
        id: crypto.randomUUID(),
        text: 'Conferir os ingredientes na despensa e listar o que falta',
        minutes: 15,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Comprar os ingredientes frescos necessários no mercado',
        minutes: 25,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Preparar a receita com carinho e deixar assar no forno',
        minutes: 45,
        done: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Embalar com cuidado e fazer a visita especial para compartilhar',
        minutes: 30,
        done: false,
      },
    ];
  }

  return [
    {
      id: crypto.randomUUID(),
      text: `Escrever o objetivo de “${title.slice(0, 45)}” em uma frase`,
      minutes: 15,
      done: false,
    },
    {
      id: crypto.randomUUID(),
      text: 'Reunir 3 referências práticas e listar os recursos necessários',
      minutes: 20,
      done: false,
    },
    {
      id: crypto.randomUUID(),
      text: 'Criar uma primeira versão simples do resultado',
      minutes: 25,
      done: false,
    },
    {
      id: crypto.randomUUID(),
      text: 'Revisar o resultado e definir o próximo compromisso de evolução',
      minutes: 15,
      done: false,
    },
  ];
}

export function planIdea(text: string, sectors: Sector[]): Idea {
  const lower = text.toLocaleLowerCase('pt-BR');
  const rules: [RegExp, string][] = [
    [/app|site|software|código|tecnolog|digital|api|sistema/, 'tech'],
    [/madeira|móvel|móveis|mesa|marcen|oficina/, 'wood'],
    [/vender|negócio|loja|newsletter|cliente|empresa|monetizar/, 'business'],
    [/rotina|saúde|correr|pessoal|viagem|exercício|hábito|bolo|receita|cozinha|avó|avô|família/, 'personal'],
  ];
  const suggested = rules.find(([re]) => re.test(lower))?.[1];
  const sector = sectors.find(s => s.id === suggested) ?? sectors[0];
  const title = (text.trim().split(/[.!?\n]/)[0] ?? text.trim()).slice(0, 80);
  const priority = /urgente|hoje|prazo|amanhã|imediat/.test(lower)
    ? 'Urgente'
    : /importante|lançar|criar|começar|foco/.test(lower)
      ? 'Importante'
      : 'Normal';

  const steps = generateAiSteps(title, text, sector?.id ?? 'personal', 'estruturado');
  const totalMinutes = steps.reduce((sum, s) => sum + s.minutes, 0);

  return {
    id: crypto.randomUUID(),
    title: title.charAt(0).toUpperCase() + title.slice(1),
    summary: text.trim().slice(0, 180),
    sector: sector?.id ?? 'personal',
    priority,
    stage: 0,
    minutes: totalMinutes,
    dedicated: 0,
    steps,
    scope: `Entrega inicial da ideia "${title}". Foco no essencial para validar sem atrasos.`,
    immediate: steps[0]?.text ?? 'Definir o primeiro resultado em uma frase.',
    clarity: 'Reduza o escopo. Você só precisa avançar o primeiro passo, não resolver tudo agora.',
    pivots: [],
    notes: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: 'Ideia capturada. Pronta para lapidação e primeiro passo.',
      },
    ],
  };
}

/**
 * Inteligência reflexiva da IA para ajudar a destravar e impulsionar a ideia.
 */
export function getAiCoachingInsights(idea: Idea): {
  frictionDiagnosis: string;
  recommendedAction: string;
  coachingQuestion: string;
} {
  const pendingSteps = idea.steps.filter(s => !s.done);
  const completedSteps = idea.steps.filter(s => s.done);

  if (idea.stage === 0) {
    return {
      frictionDiagnosis: 'A ideia ainda está em Faísca. O perigo nesta fase é sonhar demais sem colocar a mão na massa.',
      recommendedAction: `Execute agora mesmo o primeiro passo: "${idea.steps[0]?.text || 'Definir objetivo'}" em apenas ${idea.steps[0]?.minutes || 15} minutos.`,
      coachingQuestion: 'O que seria a versão de 1 página ou 1 dia deste projeto?',
    };
  }

  if (idea.stage === 1) {
    return {
      frictionDiagnosis: 'Na Estrutura, muitas ideias morrem pelo perfeccionismo no checklist.',
      recommendedAction: 'Não tente prever todos os passos futuros. Concentre-se em concluir apenas o próximo da lista.',
      coachingQuestion: 'Se você só pudesse fazer UMA coisa desta lista hoje, qual geraria 80% do impacto?',
    };
  }

  if (idea.stage === 2) {
    return {
      frictionDiagnosis: 'Em Fluxo ativo. Cuidado com o cansaço ou expansão silenciosa de escopo no meio do caminho.',
      recommendedAction: `Você já tem ${completedSteps.length} passo(s) concluído(s). Mantenha o ritmo no próximo bloco de foco.`,
      coachingQuestion: 'Alguma funcionalidade nova apareceu e está atrasando a entrega? Vale a pena registrar um ajuste de rota?',
    };
  }

  if (idea.stage === 3) {
    return {
      frictionDiagnosis: 'Fase de Ajustes finais. Aqui a tentação de "polir para sempre" é gigantesca.',
      recommendedAction: 'Defina uma data limite inegociável de lançamento para esta semana.',
      coachingQuestion: 'O que impede esta ideia de ir para o mundo real agora mesmo?',
    };
  }

  return {
    frictionDiagnosis: 'Ideia realizada e entregue com sucesso! 🏆',
    recommendedAction: 'Documente seus aprendizados no Diário de Bordo para usar nos próximos projetos.',
    coachingQuestion: 'Qual o próximo desafio que você quer transformar em realidade?',
  };
}

/**
 * Gera URL para criar evento no Google Calendar em 1 clique.
 */
export function createGoogleCalendarUrl(idea: Idea): string {
  const title = encodeURIComponent(`Foco Ideaflow: ${idea.title}`);
  const details = encodeURIComponent(
    `Ideia: ${idea.title}\nSetor: ${idea.sector}\n\nResumo:\n${idea.summary}\n\nPassos:\n` +
      idea.steps.map((s, idx) => `${idx + 1}. [${s.done ? 'x' : ' '}] ${s.text} (${s.minutes}m)`).join('\n')
  );
  const dateStr = idea.targetDate ? idea.targetDate.replace(/-/g, '') : localDate().replace(/-/g, '');
  const dates = `${dateStr}T130000Z/${dateStr}T140000Z`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
}

/**
 * Cria arquivo .ics para download direto e compatibilidade com Apple Calendar / Outlook / Celulares.
 */
export function downloadIcsFile(idea: Idea) {
  const dateStr = idea.targetDate ? idea.targetDate.replace(/-/g, '') : localDate().replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ideaflow//PT',
    'BEGIN:VEVENT',
    `UID:${idea.id}@ideaflow.app`,
    `DTSTAMP:${dateStr}T090000Z`,
    `DTSTART:${dateStr}T100000Z`,
    `DTEND:${dateStr}T110000Z`,
    `SUMMARY:Foco Ideaflow: ${idea.title}`,
    `DESCRIPTION:${idea.summary.replace(/\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${idea.title.slice(0, 20)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Cálculos analíticos para o Dashboard do Setor.
 */
export interface SectorAnalytics {
  sector: Sector;
  totalIdeas: number;
  completedIdeas: number;
  completionRate: number;
  totalMinutesPlanned: number;
  totalMinutesDedicated: number;
  stageDistribution: { stage: Stage; name: string; count: number; tone: Tone }[];
  healthStatus: 'Em Alta' | 'Equilibrado' | 'Em Atraso' | 'Iniciando';
  healthMessage: string;
}

export function calculateSectorAnalytics(sector: Sector, ideas: Idea[]): SectorAnalytics {
  const sectorIdeas = ideas.filter(i => i.sector === sector.id);
  const totalIdeas = sectorIdeas.length;
  const completedIdeas = sectorIdeas.filter(i => i.stage === 4).length;
  const completionRate = totalIdeas > 0 ? Math.round((completedIdeas / totalIdeas) * 100) : 0;
  const totalMinutesPlanned = sectorIdeas.reduce((sum, i) => sum + i.minutes, 0);
  const totalMinutesDedicated = sectorIdeas.reduce((sum, i) => sum + i.dedicated, 0);

  const stageDistribution = stageNames.map((name, idx) => ({
    stage: idx as Stage,
    name,
    count: sectorIdeas.filter(i => i.stage === idx).length,
    tone: stageTones[idx] ?? 'cyan',
  }));

  const stagnantCount = sectorIdeas.filter(i => i.stage <= 1).length;
  let healthStatus: SectorAnalytics['healthStatus'] = 'Equilibrado';
  let healthMessage = 'O setor possui bom equilíbrio entre planejamento e execução.';

  if (totalIdeas === 0) {
    healthStatus = 'Iniciando';
    healthMessage = 'Nenhuma ideia capturada ainda neste setor.';
  } else if (completionRate >= 50) {
    healthStatus = 'Em Alta';
    healthMessage = `Excelente tração! ${completionRate}% das ideias já viraram realidade.`;
  } else if (stagnantCount >= 3 && totalMinutesDedicated < 60) {
    healthStatus = 'Em Atraso';
    healthMessage = 'Muitas ideias ainda em rascunho sem tempo de foco dedicado.';
  }

  return {
    sector,
    totalIdeas,
    completedIdeas,
    completionRate,
    totalMinutesPlanned,
    totalMinutesDedicated,
    stageDistribution,
    healthStatus,
    healthMessage,
  };
}

/**
 * Análise comparativa macro de todos os setores.
 */
export interface GlobalSectorsAnalysis {
  mostDeveloped: SectorAnalytics | null;
  mostDelayed: SectorAnalytics | null;
  sectorMetrics: SectorAnalytics[];
  chartData: {
    name: string;
    total: number;
    concluidas: number;
    horasDedicadas: number;
    taxa: number;
  }[];
}

export function calculateGlobalSectorComparison(sectors: Sector[], ideas: Idea[]): GlobalSectorsAnalysis {
  const sectorMetrics = sectors.map(s => calculateSectorAnalytics(s, ideas));

  // Ordena por taxa de entrega e tempo dedicado para o mais desenvolvido
  const activeMetrics = sectorMetrics.filter(m => m.totalIdeas > 0);

  const sortedByTraction = [...activeMetrics].sort((a, b) => {
    const scoreA = a.completedIdeas * 100 + a.totalMinutesDedicated;
    const scoreB = b.completedIdeas * 100 + b.totalMinutesDedicated;
    return scoreB - scoreA;
  });

  const mostDeveloped = sortedByTraction[0] ?? null;

  // Setor mais em atraso: maior proporção de ideias paradas em estágio 0 e 1 com menos tempo dedicado
  const sortedByDelay = [...activeMetrics].sort((a, b) => {
    const delayA = (a.stageDistribution[0]?.count ?? 0) + (a.stageDistribution[1]?.count ?? 0) - a.completedIdeas;
    const delayB = (b.stageDistribution[0]?.count ?? 0) + (b.stageDistribution[1]?.count ?? 0) - b.completedIdeas;
    return delayB - delayA;
  });

  const mostDelayed = sortedByDelay[0] && sortedByDelay[0].id !== mostDeveloped?.sector.id ? sortedByDelay[0] : (sortedByDelay[1] ?? sortedByDelay[0] ?? null);

  const chartData = sectorMetrics.map(m => ({
    name: m.sector.name,
    total: m.totalIdeas,
    concluidas: m.completedIdeas,
    horasDedicadas: Number((m.totalMinutesDedicated / 60).toFixed(1)),
    taxa: m.completionRate,
  }));

  return {
    mostDeveloped,
    mostDelayed,
    sectorMetrics,
    chartData,
  };
}

export function isFlowData(input: unknown): input is FlowData {
  if (!input || typeof input !== 'object') return false;
  const data = input as Partial<FlowData>;
  return (
    (data.theme === 'dark' || data.theme === 'light') &&
    typeof data.palette === 'string' &&
    Array.isArray(data.sectors) &&
    data.sectors.length > 0 &&
    data.sectors.every(
      s => typeof s.id === 'string' && typeof s.name === 'string' && ['cyan', 'pink', 'amber', 'green', 'violet'].includes(s.tone)
    ) &&
    Array.isArray(data.ideas) &&
    data.ideas.every(
      i =>
        typeof i.id === 'string' &&
        typeof i.title === 'string' &&
        typeof i.summary === 'string' &&
        typeof i.sector === 'string' &&
        Number.isInteger(i.stage) &&
        i.stage >= 0 &&
        i.stage <= 4 &&
        Number.isFinite(i.minutes) &&
        i.minutes >= 0 &&
        Number.isFinite(i.dedicated) &&
        i.dedicated >= 0 &&
        typeof i.immediate === 'string' &&
        typeof i.clarity === 'string' &&
        ['Urgente', 'Importante', 'Normal'].includes(i.priority) &&
        Array.isArray(i.steps) &&
        i.steps.every(s => typeof s.text === 'string' && typeof s.done === 'boolean' && Number.isFinite(s.minutes) && s.minutes >= 0)
    )
  );
}