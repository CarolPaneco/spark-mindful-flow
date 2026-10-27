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
  parentId?: string | undefined; // ID do projeto macro pai (aninhamento)
  isProject?: boolean | undefined; // Se esta ideia é um projeto macro com sub-módulos
  archived?: boolean | undefined; // Se esta ideia foi arquivada
  archivedAt?: string | undefined; // Data do arquivamento
  fiveWhys?: string[] | undefined; // Respostas da técnica dos 5 Porquês para contextualizar a IA
  workspace?: 'personal' | 'business' | undefined; // Contexto: pessoal ou empresarial
  companyId?: string | undefined; // ID da empresa compartilhada para sincronização entre membros
  assignedTo?: string | undefined; // Responsável pela iniciativa na equipe
  department?: string | undefined; // Setor ou departamento empresarial
}

export type WorkspaceType = 'personal' | 'business';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string | undefined;
  avatar?: string | undefined;
  department?: string | undefined; // id do setor
  isKeyUser?: boolean | undefined; // Se é o Key User / Administrador da empresa
  status?: ('active' | 'pending') | undefined;
}

export interface CompanyJoinRequest {
  id: string;
  companyId: string;
  companyCode: string;
  userId?: string | undefined;
  userName: string;
  userEmail: string;
  department: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CompanyWorkspace {
  id?: string | undefined;
  shareCode?: string | undefined;
  name: string;
  industry?: string;
  mission?: string;
  sectors: Sector[];
  members: TeamMember[];
  ownerId?: string | undefined;
  keyUserName?: string | undefined;
  keyUserEmail?: string | undefined;
  isKeyUser?: boolean | undefined;
  pendingRequests?: CompanyJoinRequest[] | undefined;
}

export interface UserProfile {
  name: string;
  role: string;
  bio?: string | undefined;
  streak: number;
  personalPin?: string | undefined; // Senha de 4 dígitos para proteger o espaço pessoal
}

export interface FlowData {
  ideas: Idea[];
  sectors: Sector[];
  theme: 'dark' | 'light';
  palette: string;
  profile?: UserProfile | undefined;
  workspaceMode?: WorkspaceType | undefined;
  companyWorkspace?: CompanyWorkspace | undefined;
  companies?: CompanyWorkspace[] | undefined; // Todas as empresas vinculadas ao usuário (proprietário ou membro)
  activeCompanyId?: string | undefined; // ID da empresa ativa no momento
}

export const stageNames = ['Faísca', 'Estrutura', 'Em Fluxo', 'Ajustes', 'Realidade'];
export const stageTones: Tone[] = ['cyan', 'violet', 'pink', 'amber', 'green'];
export const palettes = ['Aurora', 'Oceano', 'Solar', 'Flora', 'Prisma', 'Pulse'];

export const initialSectors: Sector[] = [
  { id: 'tech', name: 'Tecnologia', tone: 'cyan' },
  { id: 'business', name: 'Negócios', tone: 'violet' },
  { id: 'personal', name: 'Vida pessoal', tone: 'pink' },
];

export const defaultCompanySectors: Sector[] = [
  { id: 'tech', name: 'Tecnologia & Dev', tone: 'cyan' },
  { id: 'marketing', name: 'Marketing & Growth', tone: 'pink' },
  { id: 'qa', name: 'Testes & QA', tone: 'amber' },
  { id: 'quality', name: 'Qualidade & Produto', tone: 'green' },
  { id: 'ops', name: 'Operações & RH', tone: 'violet' },
];

export const defaultTeamMembers: TeamMember[] = [
  { id: 'member-1', name: 'Você (Líder / Admin)', role: 'Product Leader & Founder', email: 'lider@empresa.com', department: 'quality' },
  { id: 'member-2', name: 'Beatriz Costa', role: 'Tech Lead / Dev Fullstack', email: 'beatriz@empresa.com', department: 'tech' },
  { id: 'member-3', name: 'Marina Silva', role: 'Head de Marketing & Growth', email: 'marina@empresa.com', department: 'marketing' },
  { id: 'member-4', name: 'Lucas Rocha', role: 'Engenheiro de QA & Testes', email: 'lucas@empresa.com', department: 'qa' },
];

export const defaultCompanyWorkspace: CompanyWorkspace = {
  id: 'comp-acme-corp',
  shareCode: 'ACME-2026',
  name: 'Acme Inovações S.A.',
  industry: 'Tecnologia & Serviços Digitais',
  mission: 'Construir produtos ágeis, estáveis e com excelência contínua para nossos clientes.',
  sectors: defaultCompanySectors,
  members: defaultTeamMembers,
  keyUserName: 'Você (Líder / Admin)',
  isKeyUser: true,
  pendingRequests: [],
};

export function generateCompanyCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const prefix = (clean.slice(0, 4) || 'CORP').padEnd(4, 'X');
  const year = new Date().getFullYear();
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${random}`;
}

export function createCustomCompanyWorkspace(
  name: string,
  industry: string,
  keyUserName: string,
  keyUserEmail?: string,
  userId?: string
): CompanyWorkspace {
  const shareCode = generateCompanyCode(name);
  const companyId = `comp-${shareCode.toLowerCase().replace('-', '_')}`;
  return {
    id: companyId,
    shareCode,
    name: name.trim() || 'Nova Corporação',
    industry: industry.trim() || 'Tecnologia & Inovação',
    mission: 'Alinhar times, escalar resultados e transformar grandes metas em entregas reais.',
    sectors: defaultCompanySectors,
    members: [
      {
        id: userId || `member-${Date.now()}`,
        name: keyUserName.trim() || 'Key User Fundador',
        role: 'Key User & Diretor(a)',
        email: keyUserEmail || 'admin@empresa.com',
        department: 'quality',
        isKeyUser: true,
        status: 'active',
      },
    ],
    ownerId: userId,
    keyUserName: keyUserName.trim() || 'Key User Fundador',
    keyUserEmail,
    isKeyUser: true,
    pendingRequests: [],
  };
}

export function createStarterBusinessIdeas(): Idea[] {
  return [
    {
      id: 'biz-1',
      title: 'Pipeline CI/CD Automatizado & Testes de Regressão',
      summary: 'Garantir que novos deploys passem por bateria de testes automatizados com taxa de falha zero.',
      sector: 'qa',
      workspace: 'business',
      department: 'Testes & QA',
      assignedTo: 'Lucas Rocha',
      stage: 2,
      minutes: 180,
      dedicated: 90,
      priority: 'Urgente',
      scope: 'Configurar suites no GitHub Actions com relatório de cobertura e alertas automáticos.',
      immediate: 'Escrever casos de teste ponta a ponta para o fluxo de checkout e login.',
      clarity: 'Qualidade contínua reduz chamados de suporte em 40%.',
      steps: [
        { id: 'biz-1-s1', text: 'Mapear fluxos críticos e casos de teste prioritários', minutes: 40, done: true },
        { id: 'biz-1-s2', text: 'Configurar execução paralela no pipeline de CI', minutes: 50, done: true },
        { id: 'biz-1-s3', text: 'Integrar testes de carga e monitoramento de latência', minutes: 50, done: false },
        { id: 'biz-1-s4', text: 'Apresentar métricas de estabilidade para a diretoria', minutes: 40, done: false },
      ],
      fiveWhys: [
        'Evitar que bugs cheguem a clientes corporativos em produção.',
        'Houve 2 incidentes no último trimestre que poderiam ser pegos no build.',
        'Não tínhamos uma esteira de QA automatizada antes de cada merge.',
        'Aumenta a confiança dos clientes e reduz estresse da equipe de plantão.',
        'Começar pelos fluxos de pagamento e autenticação resolve 80% do risco.',
      ],
    },
    {
      id: 'biz-2',
      title: 'Campanha de Aquisição B2B via Conteúdo & Inbound',
      summary: 'Estruturar funil de inbound marketing com webinars e cases de clientes para gerar 50 MQLs/mês.',
      sector: 'marketing',
      workspace: 'business',
      department: 'Marketing & Growth',
      assignedTo: 'Marina Silva',
      stage: 1,
      minutes: 120,
      dedicated: 30,
      priority: 'Importante',
      scope: 'Lançar landing page de materiais ricos e sequência de e-mails segmentada.',
      immediate: 'Gravar primeiro case de sucesso em vídeo com depoimento do cliente Alpha.',
      clarity: 'Aquisição orientada a autoridade atrai leads com ticket médio 3x maior.',
      steps: [
        { id: 'biz-2-s1', text: 'Roteirizar entrevista com cliente Alpha', minutes: 30, done: true },
        { id: 'biz-2-s2', text: 'Publicar landing page de captação de leads', minutes: 30, done: false },
        { id: 'biz-2-s3', text: 'Ativar campanhas de distribuição no LinkedIn Ads', minutes: 30, done: false },
        { id: 'biz-2-s4', text: 'Conectar leads ao CRM comercial para nutrição', minutes: 30, done: false },
      ],
      fiveWhys: [
        'Aumentar o faturamento da empresa com clientes corporativos recorrentes.',
        'A base atual depende de indicações e precisa de previsibilidade.',
        'Ainda não tínhamos uma estratégia de conteúdo estruturada com prova social.',
        'Permite a empresa contratar mais talentos e acelerar desenvolvimento de produto.',
        'Provas sociais reais geram credibilidade imediata com baixo custo por aquisição.',
      ],
    },
    {
      id: 'biz-3',
      title: 'Manual de Boas Práticas & Certificação de Qualidade Interna',
      summary: 'Padronizar critérios de aceite, code review e auditoria de acessibilidade para toda a engenharia.',
      sector: 'quality',
      workspace: 'business',
      department: 'Qualidade & Produto',
      assignedTo: 'Você (Líder / Admin)',
      stage: 3,
      minutes: 150,
      dedicated: 120,
      priority: 'Importante',
      scope: 'Documentar checklist de definição de pronto (DoD) e guia de acessibilidade WCAG 2.1.',
      immediate: 'Finalizar revisão do checklist e treinar líderes técnicos dos esquadrões.',
      clarity: 'Processos claros evitam retrabalho e alinham expectativas entre equipes.',
      steps: [
        { id: 'biz-3-s1', text: 'Compilar diretrizes de acessibilidade e segurança', minutes: 40, done: true },
        { id: 'biz-3-s2', text: 'Validar checklist com os líderes de Tecnologia e QA', minutes: 40, done: true },
        { id: 'biz-3-s3', text: 'Publicar documentação na base de conhecimento interna', minutes: 40, done: true },
        { id: 'biz-3-s4', text: 'Rodar auditoria piloto no sprint corrente', minutes: 30, done: false },
      ],
    },
    {
      id: 'biz-4',
      title: 'Refatoração da Arquitetura para Alta Disponibilidade',
      summary: 'Modernizar microsserviços de mensageria com cache Redis e failover automático.',
      sector: 'tech',
      workspace: 'business',
      department: 'Tecnologia & Dev',
      assignedTo: 'Beatriz Costa',
      stage: 0,
      minutes: 240,
      dedicated: 0,
      priority: 'Urgente',
      scope: 'Reduzir latência de resposta de 350ms para menos de 60ms sob picos de acesso.',
      immediate: 'Benchmark das rotas de banco de dados e identificar gargalos de I/O.',
      clarity: 'Sistemas rápidos retêm clientes e viabilizam contratos de SLA corporativo.',
      steps: [
        { id: 'biz-4-s1', text: 'Benchmark das rotas de banco de dados e gargalos', minutes: 60, done: false },
        { id: 'biz-4-s2', text: 'Implementar camada de cache em memória', minutes: 60, done: false },
        { id: 'biz-4-s3', text: 'Configurar réplica de leitura e failover', minutes: 60, done: false },
        { id: 'biz-4-s4', text: 'Executar teste de estresse simulando 10k requisições/s', minutes: 60, done: false },
      ],
    },
  ];
}

export const FIVE_WHYS_QUESTIONS_PERSONAL = [
  {
    step: 1,
    title: '1º Por quê: O Objetivo Raiz',
    question: 'Por que você quer realizar essa ideia ou projeto?',
    placeholder: 'Ex: Para resolver a dor X ou criar uma nova fonte de renda/hábito...',
  },
  {
    step: 2,
    title: '2º Por quê: A Necessidade Atual',
    question: 'Por que isso é importante ou prioridade agora?',
    placeholder: 'Ex: Porque o momento exige mudança ou a oportunidade surgiu agora...',
  },
  {
    step: 3,
    title: '3º Por quê: O Obstáculo Central',
    question: 'Por que isso ainda não foi feito ou qual é o maior desafio?',
    placeholder: 'Ex: Porque faltava clareza de passos práticos, tempo ou recurso...',
  },
  {
    step: 4,
    title: '4º Por quê: O Impacto Real',
    question: 'Por que o sucesso dessa ideia fará diferença de verdade na sua vida?',
    placeholder: 'Ex: Vai gerar autonomia, realização pessoal ou ajudar pessoas...',
  },
  {
    step: 5,
    title: '5º Por quê: A Escolha do Formato',
    question: 'Por que essa abordagem simples é o melhor ponto de partida?',
    placeholder: 'Ex: Porque começar pequeno valida a ideia com rapidez e baixo risco...',
  },
] as const;

export const FIVE_WHYS_QUESTIONS_BUSINESS = [
  {
    step: 1,
    title: '1º Por quê: Impacto Estratégico',
    question: 'Qual objetivo estratégico ou meta corporativa essa iniciativa atende?',
    placeholder: 'Ex: Reduzir tempo de resposta ao cliente, aumentar conversão em 15% ou eliminar gargalo...',
  },
  {
    step: 2,
    title: '2º Por quê: Dor do Cliente ou Ineficiência Interna',
    question: 'Qual problema real do cliente ou gargalo de processo estamos resolvendo?',
    placeholder: 'Ex: Retrabalho manual de planilhas consome 6 horas semanais do time...',
  },
  {
    step: 3,
    title: '3º Por quê: Setor Responsável & Recursos',
    question: 'Qual departamento deve liderar a execução e quais dependências existem?',
    placeholder: 'Ex: Tecnologia & Dev lidera com apoio de Qualidade para validação das regras...',
  },
  {
    step: 4,
    title: '4º Por quê: Retorno Esperado (ROI & Eficiência)',
    question: 'Qual métrica quantificável comprovará o sucesso da entrega?',
    placeholder: 'Ex: Redução de 30% em chamados de suporte, economia de R$ 15k ou ganho de SLA...',
  },
  {
    step: 5,
    title: '5º Por quê: Escopo do MVP Corporativo',
    question: 'Por que validar esta versão enxuta antes de expandir o escopo?',
    placeholder: 'Ex: Permite homologar com 1 departamento piloto sem risco operacional...',
  },
] as const;

export const FIVE_WHYS_QUESTIONS = FIVE_WHYS_QUESTIONS_PERSONAL;

export function getFiveWhysQuestions(isBusiness?: boolean) {
  return isBusiness ? FIVE_WHYS_QUESTIONS_BUSINESS : FIVE_WHYS_QUESTIONS_PERSONAL;
}

export function suggestFiveWhysOffline(titleOrText: string, isBusiness?: boolean): string[] {
  const lower = (titleOrText || '').toLowerCase();

  if (isBusiness) {
    if (/sistema|app|dev|software|api|banco|infra|deploy|bug|qa|teste/.test(lower)) {
      return [
        'Aumentar a confiabilidade técnica, reduzir tempo de deploy e elevar a segurança dos dados da empresa.',
        'A equipe e os clientes enfrentam lentidão ou risco de instabilidade na operação atual.',
        'Tecnologia & Dev lidera a implementação com alinhamento contínuo com Qualidade & QA.',
        'Redução drástica de falhas em produção (SLO de 99.9%) e maior agilidade nas entregas de produto.',
        'Entregar um piloto controlado com testes automatizados valida o ganho sem parar a operação.',
      ];
    }
    if (/venda|marketing|growth|lead|cliente|convers|campanha|receita/.test(lower)) {
      return [
        'Acelerar a aquisição qualificada de clientes e expandir a receita recorrente da empresa.',
        'Canais atuais atingiram teto de eficiência e o mercado demanda inovação no posicionamento.',
        'Marketing & Growth conduz com apoio de Vendas e Produto para garantir fechamentos rápidos.',
        'Crescimento de 20% no pipeline de oportunidades e diminuição do Custo de Aquisição (CAC).',
        'Lançar uma campanha-piloto de 15 dias valida a conversão com baixo orçamento inicial.',
      ];
    }
    if (/processo|rh|treinamento|onboard|equipe|contrat|operaç/.test(lower)) {
      return [
        'Padronizar fluxos internos, elevar o engajamento do time e diminuir o tempo de integração de colaboradores.',
        'O crescimento da empresa tornou a comunicação dispersa e aumentou o retrabalho dos setores.',
        'Operações & RH lidera com participação ativa dos líderes de cada departamento.',
        'Redução de 40% nas dúvidas rotineiras e colaboradores 100% autônomos em metade do tempo.',
        'Começar com um manual vivo e checklist de 1 página garante adoção imediata por todos.',
      ];
    }
    return [
      'Alinhar a iniciativa aos objetivos estratégicos do trimestre para gerar valor corporativo real.',
      'Existe um gargalo claro afetando clientes ou a produtividade dos colaboradores hoje.',
      'O departamento responsável possui capacidade para executar em sprints curtas e ágeis.',
      'Gera retorno palpável em produtividade, economia de tempo ou receita para o negócio.',
      'Executar um MVP enxuto valida a eficácia antes de alocar recursos adicionais do orçamento.',
    ];
  }

  if (/bolo|receita|culin|cozinh|doce|pão|restaurante|café|comida/.test(lower)) {
    return [
      'Compartilhar sabor e carinho com um produto gastronômico autêntico e de alta qualidade.',
      'Existe uma demanda crescente por alimentos caseiros, artesanais e frescos.',
      'Ainda não havia testado a receita padronizada nem definido as embalagens e porções certas.',
      'Traz realização pessoal imediata e pode se transformar em uma fonte de renda deliciosa.',
      'Começar com fornadas pequenas sob encomenda valida o sabor e os clientes sem desperdício.',
    ];
  }

  if (/app|site|software|bot|api|saas|plataforma|sistema|código|dev/.test(lower)) {
    return [
      'Resolver um problema real de organização ou produtividade de forma intuitiva e sem atrito.',
      'Usuários perdem horas com ferramentas burocráticas e buscam soluções leves e focadas.',
      'Faltava definir um MVP enxuto para não cair na armadilha do perfeccionismo ou complexidade.',
      'Criar um produto escalável com impacto direto no dia a dia das pessoas.',
      'Lançar uma versão funcional inicial valida o interesse antes de escrever código desnecessário.',
    ];
  }

  if (/venda|negócio|loja|cliente|empresa|monetiz|renda|consultoria|curso/.test(lower)) {
    return [
      'Construir uma oferta com valor claro que transforme uma competência em receita previsível.',
      'O mercado está receptivo e preciso diversificar minhas fontes de faturamento agora.',
      'Faltava empacotar a proposta em uma oferta irresistível e abordar os primeiros clientes.',
      'Gera sustentabilidade financeira, independência e impacto comercial comprovado.',
      'Validar primeiro com 3 a 5 contatos próximos garante tração com custo quase zero.',
    ];
  }

  if (/reforma|casa|quarto|apartamento|marcenaria|móvel|jardim|obra/.test(lower)) {
    return [
      'Tornar o espaço mais agradável, funcional e acolhedor para o dia a dia.',
      'O ambiente atual está gerando desconforto ou desordem na rotina.',
      'Faltava listar as medidas, materiais necessários e definir um cronograma por etapas.',
      'Um espaço bem cuidado melhora o bem-estar mental, foco e convivência diária.',
      'Dividir em etapas (planejamento, materiais e montagem) evita frustração e custos extras.',
    ];
  }

  return [
    'Transformar essa inspiração em algo concreto e visível no mundo real.',
    'É o momento certo para tirar da cabeça antes que a rotina faça a ideia se perder.',
    'Faltava um método claro para quebrar a meta em passos executáveis de 15 a 30 minutos.',
    'Traz sensação de progresso real, propósito ativo e evolução pessoal.',
    'Dar o primeiro passo simples reduz o medo de errar e cria tração imediata.',
  ];
}

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
  notes?: IdeaNote[],
  parentId?: string,
  isProject?: boolean,
  archived?: boolean
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
    parentId,
    isProject,
    archived,
  };
};

export const seedData = (withDemos = false): FlowData => {
  const demoIdeas = [
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
      'personal',
      2,
      180,
      2,
      'Importante'
    ),
    makeIdea(
      'demo-7',
      'Tirar a loja online do papel (Projeto Macro)',
      'Plano completo de e-commerce integrando catálogo e pagamentos.',
      'business',
      2,
      240,
      2,
      'Importante',
      'Projeto macro contendo módulos de Front-end, Back-end e Lançamento.',
      undefined,
      undefined,
      undefined,
      true // isProject
    ),
    makeIdea(
      'demo-7-front',
      'Loja: Front-end & Vitrine de Produtos',
      'Catálogo interativo, carrinho de compras e design responsivo.',
      'business',
      3,
      120,
      3,
      'Normal',
      'Interface do usuário para o e-commerce.',
      undefined,
      undefined,
      'demo-7' // parentId
    ),
    makeIdea(
      'demo-7-back',
      'Loja: Back-end & Gateway de Pagamentos',
      'Integração com Mercado Pago/Stripe, cálculo de frete e pedidos.',
      'business',
      2,
      120,
      2,
      'Urgente',
      'Serviços e APIs de suporte à loja online.',
      undefined,
      undefined,
      'demo-7' // parentId
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
    makeIdea(
      'demo-archived-1',
      'Protótipo em papel da ideia antiga v0',
      'Ideia arquivada para manter o histórico sem poluir o funil principal.',
      'tech',
      1,
      45,
      1,
      'Normal',
      undefined,
      undefined,
      undefined,
      undefined,
      false,
      true // archived
    ),
  ];

  return {
    theme: 'light',
    palette: 'Aurora',
    profile: {
      name: 'Explorador Ideaflow',
      role: 'Criador & Desenvolvedor',
      bio: 'Transformando ideias em realidade, um passo consciente de cada vez.',
      streak: 6,
    },
    workspaceMode: 'personal',
    companyWorkspace: undefined,
    sectors: withDemos ? initialSectors.map(s => ({ ...s })) : [],
    ideas: withDemos ? demoIdeas : [],
  };
};

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
  style: 'mvp' | 'rapido' | 'estruturado' | 'expansao' = 'estruturado',
  fiveWhys?: string[]
): Step[] {
  const lower = `${title} ${summary}`.toLowerCase();
  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const cleanTitle = (title.trim() || 'Nova Ideia').slice(0, 45);

  const isMedia = /vlog|video|vídeo|youtube|show|bts|música|musica|banda|viagem|viajar|aeroporto|grava|foto|podcast|filma|conteudo|conteúdo|reels|tiktok|cinema|ensaio|kpop/i.test(lower);
  const isCooking = /bolo|receita|cenoura|cozinha|almoço|jantar|comida|avó|avô|visita|família|aniversário|sobremesa|pão|doce|culinár/i.test(lower);
  const isWriting = /livro|leitura|ler|escrever|capítulo|ebook|artigo|texto|redigir|poema|roteiro/i.test(lower);
  const isWood = sectorId === 'wood' || /marcenaria|madeira|móvel|físico|oficina|artesanato|projeto|ferramenta/i.test(lower);
  const isTravel = !isMedia && /viagem|viajar|férias|passeio|hotel|passagem|roteiro|mala/i.test(lower);
  const isFitness = /correr|corrida|treino|academia|exercício|saúde|peso|dieta|hábito|meditar|alongar|sono/i.test(lower);
  const isFinance = /dinheiro|finança|economizar|investir|gasto|orçamento|dívida|reserva/i.test(lower);
  const isStudy = /estudar|curso|aprender|certificação|faculdade|idioma|inglês|prova/i.test(lower);
  const isTech = sectorId === 'tech' || /app|site|software|código|codigo|api|banco|web|frontend|backend|plataforma|sistema|saas|computador|program/i.test(lower);
  const isBusiness = sectorId === 'business' || /venda|cliente|preço|preco|loja|marketing|negócio|negocio|lançar|lancar|empresa|monetiz|comercial/i.test(lower);

  const why1 = validWhys[0] || '';
  const why3 = validWhys[2] || validWhys[1] || '';
  const why5 = validWhys[4] || validWhys[3] || '';

  // 1. MÍDIA, VLOG, SHOW, CONTEÚDO, EVENTOS
  if (isMedia) {
    if (style === 'mvp') {
      return [
        { id: crypto.randomUUID(), text: why1 ? `Roteirizar os momentos indispensáveis do vlog de “${cleanTitle}” com foco em: ${why1.slice(0, 50)}` : `Roteirizar os 4 momentos indispensáveis do vlog de “${cleanTitle}” (aeroporto, chegada, show e bastidores)`, minutes: 15, done: false },
        { id: crypto.randomUUID(), text: `Checar baterias extras, microfone e memória livre no celular ou câmera`, minutes: 15, done: false },
        { id: crypto.randomUUID(), text: why3 ? `Gravar tomadas do trajeto e abertura espontânea superando: “${why3.slice(0, 50)}”` : `Gravar as tomadas-chave do trajeto e abertura espontânea contando a expectativa`, minutes: 30, done: false },
        { id: crypto.randomUUID(), text: why5 ? `Decupar clipes gravados e fazer primeiro corte rápido visando: “${why5.slice(0, 50)}”` : `Decupar os melhores clipes gravados e fazer um primeiro corte rápido e dinâmico`, minutes: 20, done: false },
      ];
    }
    if (style === 'rapido') {
      return [
        { id: crypto.randomUUID(), text: `Anotar 3 ideias de cenas criativas no aeroporto e durante o show`, minutes: 10, done: false },
        { id: crypto.randomUUID(), text: `Configurar estabilização e resolução de vídeo no aplicativo de gravação`, minutes: 10, done: false },
        { id: crypto.randomUUID(), text: `Gravar tomada rápida de 1 minuto expressando a empolgação da viagem`, minutes: 10, done: false },
      ];
    }
    if (style === 'expansao') {
      return [
        { id: crypto.randomUUID(), text: `Cortar os 3 melhores trechos do show/viagem em formato Shorts/Reels/TikTok`, minutes: 25, done: false },
        { id: crypto.randomUUID(), text: `Criar miniatura atraente e publicar o vlog com tags, capítulos e descrição`, minutes: 20, done: false },
        { id: crypto.randomUUID(), text: `Interagir com comentários e comunidades de fãs do evento`, minutes: 15, done: false },
      ];
    }
    return [
      { id: crypto.randomUUID(), text: `Definir a narrativa visual e checklist de tomadas da viagem ao show`, minutes: 20, done: false },
      { id: crypto.randomUUID(), text: `Preparar kit de gravação (baterias carregadas, áudio limpo e backup)`, minutes: 15, done: false },
      { id: crypto.randomUUID(), text: `Capturar cenas do aeroporto, trajeto, público e o ápice do show`, minutes: 40, done: false },
      { id: crypto.randomUUID(), text: `Montar linha do tempo da edição com cortes dinâmicos e trilha sonora`, minutes: 35, done: false },
      { id: crypto.randomUUID(), text: `Finalizar cor, calibrar áudio e exportar o vlog completo em alta resolução`, minutes: 20, done: false },
    ];
  }

  // 2. CULINÁRIA E COZINHA
  if (isCooking) {
    if (style === 'mvp' || style === 'rapido') {
      return [
        { id: crypto.randomUUID(), text: `Conferir os ingredientes na despensa e anotar o que falta comprar`, minutes: 10, done: false },
        { id: crypto.randomUUID(), text: `Adquirir os itens frescos que faltam e separar utensílios`, minutes: 20, done: false },
        { id: crypto.randomUUID(), text: `Executar a receita no modo prático e acompanhar o tempo de forno`, minutes: 35, done: false },
        { id: crypto.randomUUID(), text: `Servir ou degustar a primeira porção fresca e avaliar o sabor`, minutes: 15, done: false },
      ];
    }
    return [
      { id: crypto.randomUUID(), text: 'Conferir os ingredientes na despensa e anotar o que falta comprar', minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Ir ao mercado e adquirir os itens frescos e a embalagem', minutes: 25, done: false },
      { id: crypto.randomUUID(), text: 'Executar o preparo e acompanhar o tempo de forno com atenção', minutes: 45, done: false },
      { id: crypto.randomUUID(), text: 'Finalizar a montagem/decoração e servir ou entregar com carinho', minutes: 20, done: false },
    ];
  }

  // 3. MARCENARIA E OFICINA
  if (isWood) {
    return [
      { id: crypto.randomUUID(), text: `Desenhar esboço com medidas finais de “${cleanTitle}” e lista de cortes`, minutes: 25, done: false },
      { id: crypto.randomUUID(), text: 'Verificar ferramentas, insumos e separar o material bruto', minutes: 30, done: false },
      { id: crypto.randomUUID(), text: 'Executar cortes principais, usinagem e pré-montagem', minutes: 50, done: false },
      { id: crypto.randomUUID(), text: 'Lixamento progressivo, aplicação de acabamento e montagem final', minutes: 35, done: false },
    ];
  }

  // 4. LIVROS, ESCRITA E ARTIGOS
  if (isWriting) {
    return [
      { id: crypto.randomUUID(), text: `Definir a ideia central e sumário de 3 pontos para “${cleanTitle}”`, minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Escrever o primeiro rascunho de 500 palavras sem se censurar', minutes: 30, done: false },
      { id: crypto.randomUUID(), text: 'Lapidar o ritmo, clareza e eliminar trechos desnecessários', minutes: 20, done: false },
      { id: crypto.randomUUID(), text: 'Compartilhar com 1 leitor de confiança ou publicar a primeira versão', minutes: 15, done: false },
    ];
  }

  // 5. SAÚDE, TREINO, EXERCÍCIOS
  if (isFitness) {
    return [
      { id: crypto.randomUUID(), text: 'Separar roupas confortáveis, tênis e garrafa de água', minutes: 10, done: false },
      { id: crypto.randomUUID(), text: 'Executar a primeira sessão em ritmo agradável e sustentável', minutes: 25, done: false },
      { id: crypto.randomUUID(), text: 'Alongar levemente e registrar o nível de energia e bem-estar', minutes: 10, done: false },
      { id: crypto.randomUUID(), text: 'Fixar no calendário os próximos dias da semana para manter o hábito', minutes: 10, done: false },
    ];
  }

  // 6. VIAGEM E PASSEIOS
  if (isTravel) {
    return [
      { id: crypto.randomUUID(), text: `Definir as datas estimadas e orçamento limite para “${cleanTitle}”`, minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Pesquisar 3 opções de transporte e hospedagem bem avaliadas', minutes: 30, done: false },
      { id: crypto.randomUUID(), text: 'Montar roteiro dia a dia com paradas indispensáveis', minutes: 25, done: false },
      { id: crypto.randomUUID(), text: 'Confirmar reservas e montar checklist de bagagem e documentos', minutes: 20, done: false },
    ];
  }

  // 7. FINANÇAS E ECONOMIA
  if (isFinance) {
    return [
      { id: crypto.randomUUID(), text: 'Abrir extrato dos últimos 30 dias e listar os custos fixos', minutes: 20, done: false },
      { id: crypto.randomUUID(), text: 'Identificar 2 despesas supérfluas que podem ser canceladas', minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Definir valor mensal da meta a ser poupado logo no recebimento', minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Automatizar transferência para reserva de emergência', minutes: 10, done: false },
    ];
  }

  // 8. ESTUDOS E APRENDIZADO
  if (isStudy) {
    return [
      { id: crypto.randomUUID(), text: `Mapear o conteúdo programático inicial para “${cleanTitle}”`, minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Reservar bloco protegido de 25 minutos para estudar o módulo 1', minutes: 25, done: false },
      { id: crypto.randomUUID(), text: 'Fazer anotações manuscritas dos 3 conceitos mais relevantes', minutes: 20, done: false },
      { id: crypto.randomUUID(), text: 'Resolver 2 exercícios práticos para fixar o aprendizado', minutes: 15, done: false },
    ];
  }

  // 9. TECNOLOGIA, SOFTWARES E APPS
  if (isTech) {
    if (style === 'mvp') {
      return [
        { id: crypto.randomUUID(), text: `Definir a jornada única principal de “${cleanTitle}” em 1 fluxo`, minutes: 15, done: false },
        { id: crypto.randomUUID(), text: 'Construir a versão mais simples funcional (mockup ou protótipo)', minutes: 35, done: false },
        { id: crypto.randomUUID(), text: 'Testar com 1 pessoa real simulando o uso do começo ao fim', minutes: 20, done: false },
        { id: crypto.randomUUID(), text: 'Anotar aprendizados prioritários para a próxima iteração', minutes: 15, done: false },
      ];
    }
    return [
      { id: crypto.randomUUID(), text: 'Desenhar o fluxo principal de telas e jornada do usuário', minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Estruturar o modelo de dados e componentes essenciais', minutes: 30, done: false },
      { id: crypto.randomUUID(), text: 'Desenvolver a funcionalidade principal ponta a ponta', minutes: 45, done: false },
      { id: crypto.randomUUID(), text: 'Testar usabilidade no celular e publicar preview online', minutes: 20, done: false },
    ];
  }

  // 10. NEGÓCIOS, VENDAS E MARKETING
  if (isBusiness) {
    return [
      { id: crypto.randomUUID(), text: `Definir a dor urgente do cliente e a proposta de “${cleanTitle}”`, minutes: 15, done: false },
      { id: crypto.randomUUID(), text: 'Estruturar a oferta com precificação clara e garantia simples', minutes: 25, done: false },
      { id: crypto.randomUUID(), text: 'Apresentar a proposta para 3 clientes potenciais diretamente', minutes: 35, done: false },
      { id: crypto.randomUUID(), text: 'Registrar feedbacks de objeções e ajustar a mensagem de venda', minutes: 20, done: false },
    ];
  }

  // 11. GERAL / PERSONALIZADO COM 5 PORQUÊS SE DISPONÍVEIS
  if (validWhys.length >= 2) {
    return [
      { id: crypto.randomUUID(), text: `Destravar o primeiro passo concreto de “${cleanTitle}”: ${why1.slice(0, 55)}`, minutes: 15, done: false },
      { id: crypto.randomUUID(), text: `Estruturar os materiais essenciais superando: “${why3.slice(0, 50)}”`, minutes: 25, done: false },
      { id: crypto.randomUUID(), text: `Executar o núcleo prático da entrega sem desvios ou distrações`, minutes: 40, done: false },
      { id: crypto.randomUUID(), text: `Concluir a primeira versão e validar o impacto: “${why5.slice(0, 60)}”`, minutes: 20, done: false },
    ];
  }

  return [
    { id: crypto.randomUUID(), text: `Escrever o resultado esperado de “${cleanTitle}” em 3 tópicos claros`, minutes: 15, done: false },
    { id: crypto.randomUUID(), text: `Separar materiais e organizar o ambiente para o início imediato`, minutes: 20, done: false },
    { id: crypto.randomUUID(), text: `Executar a primeira etapa prática com foco contínuo no cronômetro`, minutes: 35, done: false },
    { id: crypto.randomUUID(), text: `Avaliar o progresso obtido e marcar o próximo passo no funil`, minutes: 15, done: false },
  ];
}

export function planIdea(text: string, sectors: Sector[], fiveWhys?: string[]): Idea {
  const lower = text.toLocaleLowerCase('pt-BR');
  const rules: [RegExp, string][] = [
    [/app|site|software|código|tecnolog|digital|api|sistema/, 'tech'],
    [/vender|negócio|loja|newsletter|cliente|empresa|monetizar/, 'business'],
    [/rotina|saúde|correr|pessoal|viagem|exercício|hábito|bolo|receita|cozinha|madeira|móvel|marcen|oficina/, 'personal'],
  ];
  const suggested = rules.find(([re]) => re.test(lower))?.[1];
  const sector = sectors.find(s => s.id === suggested) ?? sectors[0];
  const title = (text.trim().split(/[.!?\n]/)[0] ?? text.trim()).slice(0, 80);
  const priority = /urgente|hoje|prazo|amanhã|imediat/.test(lower)
    ? 'Urgente'
    : /importante|lançar|criar|começar|foco/.test(lower)
      ? 'Importante'
      : 'Normal';

  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0);
  const extraContext = validWhys && validWhys.length > 0 ? ` ${validWhys.join(' ')}` : '';
  const steps = generateAiSteps(title, `${text}${extraContext}`, sector?.id ?? 'personal', 'estruturado', validWhys);
  const totalMinutes = steps.reduce((sum, s) => sum + s.minutes, 0);

  const scopeNote = validWhys && validWhys[0]
    ? `Entrega inicial da ideia "${title}". Propósito raiz: ${validWhys[0]}`
    : `Entrega inicial da ideia "${title}". Foco no essencial para validar sem atrasos.`;

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
    scope: scopeNote,
    immediate: steps[0]?.text ?? 'Definir o primeiro resultado em uma frase.',
    clarity: validWhys && validWhys[3]
      ? `Foco no porquê: ${validWhys[3]}`
      : 'Reduza o escopo. Você só precisa avançar o primeiro passo, não resolver tudo agora.',
    pivots: [],
    fiveWhys: validWhys && validWhys.length > 0 ? validWhys : undefined,
    notes: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: validWhys && validWhys.length > 0
          ? `Ideia estruturada com a metodologia dos 5 Porquês para máxima clareza de execução.`
          : 'Ideia capturada. Pronta para lapidação e primeiro passo.',
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

  const mostDelayed = sortedByDelay[0] && sortedByDelay[0].sector.id !== mostDeveloped?.sector.id ? sortedByDelay[0] : (sortedByDelay[1] ?? sortedByDelay[0] ?? null);

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

/**
 * Retorna as sub-ideias (módulos) vinculadas a um projeto pai.
 */
export function getSubIdeas(ideas: Idea[], parentId: string, includeArchived = false): Idea[] {
  return ideas.filter(i => i.parentId === parentId && (includeArchived || !i.archived));
}

/**
 * Retorna a ideia/projeto pai de uma determinada sub-ideia.
 */
export function getParentIdea(ideas: Idea[], idea: Idea): Idea | undefined {
  if (!idea.parentId) return undefined;
  return ideas.find(i => i.id === idea.parentId);
}

/**
 * Calcula métricas agregadas de um projeto macro com seus módulos.
 */
export function getProjectStats(projectIdea: Idea, allIdeas: Idea[]): {
  totalSub: number;
  completedSub: number;
  percent: number;
  totalMinutes: number;
  dedicatedMinutes: number;
} {
  const subIdeas = getSubIdeas(allIdeas, projectIdea.id, false);
  if (subIdeas.length === 0) {
    const completedSteps = projectIdea.steps.filter(s => s.done).length;
    const totalSteps = projectIdea.steps.length;
    return {
      totalSub: 0,
      completedSub: 0,
      percent: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
      totalMinutes: projectIdea.minutes,
      dedicatedMinutes: projectIdea.dedicated,
    };
  }

  const completedSub = subIdeas.filter(i => i.stage === 4).length;
  const percent = Math.round((completedSub / subIdeas.length) * 100);
  const totalMinutes = subIdeas.reduce((sum, i) => sum + i.minutes, projectIdea.minutes);
  const dedicatedMinutes = subIdeas.reduce((sum, i) => sum + i.dedicated, projectIdea.dedicated);

  return {
    totalSub: subIdeas.length,
    completedSub,
    percent,
    totalMinutes,
    dedicatedMinutes,
  };
}

/**
 * Detecta o setor ideal com base no título e texto da ideia/projeto.
 */
export function detectSectorFromTitle(text: string, sectors: Sector[]): string {
  const lower = text.toLowerCase();
  
  if (/cozinha|reforma|quarto|casa|apartamento|banheiro|obra|pintura|sala|parede|telhado|jardim|encanamento|elétrica/.test(lower)) {
    // Se existir setor de marcenaria/casa ou pessoal
    const woodOrHome = sectors.find(s => s.id === 'wood' || s.id === 'personal');
    return woodOrHome?.id ?? 'personal';
  }

  if (/bolo|receita|comida|culinária|jantar|almoço|avó|família|viagem|férias|saúde|hábito|treino|academia|dieta|dormir|leitura|livro|meditação/.test(lower)) {
    const personal = sectors.find(s => s.id === 'personal');
    return personal?.id ?? 'personal';
  }

  if (/marcenaria|madeira|móvel|móveis|mesa|cadeira|estante|oficina|artesanato|serra|lixa/.test(lower)) {
    const wood = sectors.find(s => s.id === 'wood');
    return wood?.id ?? 'wood';
  }

  if (/vendas|loja|cliente|faturamento|financeiro|investimento|marketing|empresa|startup|negócio|produto|preço|lucro/.test(lower)) {
    const biz = sectors.find(s => s.id === 'business');
    return biz?.id ?? 'business';
  }

  if (/site|app|software|sistema|código|api|programação|frontend|backend|banco de dados|tecnologia|computador/.test(lower)) {
    const tech = sectors.find(s => s.id === 'tech');
    return tech?.id ?? 'tech';
  }

  return sectors[0]?.id ?? 'personal';
}

/**
 * Gera sugestões inteligentes de módulos/sub-ideias com base no escopo e setor.
 */
export function generateSubModulesAi(
  projectTitle: string,
  projectSummary: string,
  sectorId: string,
  fiveWhys?: string[]
): { title: string; summary: string; minutes: number }[] {
  const validWhys = fiveWhys?.filter(w => typeof w === 'string' && w.trim().length > 0) || [];
  const whysContext = validWhys.join(' ');
  const lower = `${projectTitle} ${projectSummary} ${sectorId} ${whysContext}`.toLowerCase();

  // 1. Reformas, Construção, Decoração e Casa (ex: Reformar minha cozinha)
  if (/reforma|cozinha|quarto|casa|apartamento|banheiro|obra|pintura|sala|parede|telhado|azulejo|piso|encanamento|elétrica/.test(lower)) {
    return [
      {
        title: `${projectTitle}: Planejamento & Orçamento`,
        summary: 'Definir estilo, listar materiais, cotar fornecedores e estabelecer limite financeiro.',
        minutes: 60,
      },
      {
        title: `${projectTitle}: Demolição, Alvenaria & Infraestrutura`,
        summary: 'Remoção de móveis antigos, ajustes de pontos hidráulicos, tomadas elétricas e revestimentos.',
        minutes: 180,
      },
      {
        title: `${projectTitle}: Marcenaria, Bancadas & Iluminação`,
        summary: 'Instalação de armários sob medida, bancadas de pedra e fitas LED/luminárias focais.',
        minutes: 120,
      },
      {
        title: `${projectTitle}: Pintura, Eletros & Decoração Final`,
        summary: 'Pintura lavável, instalação dos eletrodomésticos e organização dos utensílios.',
        minutes: 90,
      },
    ];
  }

  // 2. Culinária, Gastronomia, Festas e Visitas Afetuosas
  if (/bolo|receita|cenoura|cozinha|culinária|jantar|almoço|doce|festa|aniversário|avó|família/.test(lower)) {
    return [
      {
        title: `${projectTitle}: Ingredientes & Utensílios`,
        summary: 'Conferir despensa, comprar insumos frescos de qualidade e separar fôrmas/utensílios.',
        minutes: 45,
      },
      {
        title: `${projectTitle}: Preparo & Ponto de Cocção`,
        summary: 'Executar a receita com atenção aos tempos de forno e textura ideal da massa.',
        minutes: 75,
      },
      {
        title: `${projectTitle}: Cobertura, Recheio & Decoração`,
        summary: 'Preparar a calda especial (ex: chocolate brilhante) e finalizar a apresentação.',
        minutes: 40,
      },
      {
        title: `${projectTitle}: Embalagem & Encontro/Celebração`,
        summary: 'Embalar com carinho e desfrutar do momento especial junto com quem você ama.',
        minutes: 30,
      },
    ];
  }

  // 3. Marcenaria e Artesanato Físico
  if (/marcenaria|madeira|móvel|móveis|mesa|cadeira|estante|oficina|artesanato/.test(lower)) {
    return [
      {
        title: `${projectTitle}: Projeto Técnico & Medidas`,
        summary: 'Desenho detalhado com cotas, espessuras e plano de corte otimizado.',
        minutes: 60,
      },
      {
        title: `${projectTitle}: Preparação & Aparelhamento`,
        summary: 'Seleção das peças de madeira, corte preliminar e desempeno das faces.',
        minutes: 90,
      },
      {
        title: `${projectTitle}: Usinagem, Encaixes & Montagem`,
        summary: 'Execução de cavilhas, encaixes tradicionais e colagem estrutural.',
        minutes: 180,
      },
      {
        title: `${projectTitle}: Lixamento & Acabamento Final`,
        summary: 'Lixamento progressivo dos grãos e aplicação de óleo mineral ou verniz protetor.',
        minutes: 90,
      },
    ];
  }

  // 4. Tecnologia, Apps, Plataformas e Websites
  if (/site|vendas|loja|ecommerce|e-commerce|web|plataforma|app|aplicativo|software|api|saas/.test(lower)) {
    return [
      {
        title: `${projectTitle}: Interface & Front-end`,
        summary: 'Construir a experiência visual, componentes responsivos e fluxos de navegação.',
        minutes: 120,
      },
      {
        title: `${projectTitle}: API & Back-end`,
        summary: 'Estruturar o banco de dados, regras de negócio e serviços de autenticação.',
        minutes: 150,
      },
      {
        title: `${projectTitle}: Checkout & Pagamentos`,
        summary: 'Configurar gateway de pagamentos, validações de pedidos e confirmações por e-mail.',
        minutes: 90,
      },
      {
        title: `${projectTitle}: Marketing & Lançamento`,
        summary: 'Preparar página de captura, lista de espera e primeiros canais de aquisição.',
        minutes: 60,
      },
    ];
  }

  // 5. Saúde, Hábitos Pessoais, Estudos ou Treinos
  if (/saúde|exercício|corrida|treino|academia|dieta|hábito|estudos|leitura|livro|meditação/.test(lower)) {
    return [
      {
        title: `${projectTitle}: Definição de Rotina & Metas`,
        summary: 'Definir horários realistas, métricas semanais e gatilhos de consistência.',
        minutes: 30,
      },
      {
        title: `${projectTitle}: Preparação do Ambiente & Recursos`,
        summary: 'Separar materiais, roupas de treino, livros ou aplicativos de apoio.',
        minutes: 45,
      },
      {
        title: `${projectTitle}: Ciclo Inicial de Prática (7 Dias)`,
        summary: 'Executar os primeiros dias com foco em disciplina e sem cobrança de perfeição.',
        minutes: 90,
      },
      {
        title: `${projectTitle}: Avaliação de Progresso & Ajustes`,
        summary: 'Revisar como o corpo/mente respondeu e adaptar para manter no longo prazo.',
        minutes: 30,
      },
    ];
  }

  // Fallback geral estruturado e humano (sem viés puramente tecnológico)
  return [
    {
      title: `${projectTitle}: Fase 1 - Planejamento & Recursos`,
      summary: 'Mapear requisitos, levantar referências e separar tudo o que é necessário para começar.',
      minutes: 60,
    },
    {
      title: `${projectTitle}: Fase 2 - Execução do Núcleo Principal`,
      summary: 'Colocar a mão na massa na parte mais importante que torna o projeto real.',
      minutes: 120,
    },
    {
      title: `${projectTitle}: Fase 3 - Ajustes, Detalhes & Acabamento`,
      summary: 'Polir arestas, testar na prática e refinar o resultado final.',
      minutes: 60,
    },
    {
      title: `${projectTitle}: Fase 4 - Entrega, Uso Real ou Celebração`,
      summary: 'Colocar em uso diário, apresentar para quem importa ou comemorar a conclusão.',
      minutes: 45,
    },
  ];
}