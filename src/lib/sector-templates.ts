import { Tone, Idea, Sector, Step } from './ideaflow';

export interface SectorTemplate {
  id: string;
  name: string;
  tone: Tone;
  iconName: 'tech' | 'relationship' | 'health' | 'business' | 'creative' | 'lifestyle';
  description: string;
  starterIdeas: {
    title: string;
    summary: string;
    priority: 'Urgente' | 'Importante' | 'Normal';
    immediate: string;
    clarity: string;
    scope: string;
    minutes: number;
    steps: { text: string; minutes: number }[];
  }[];
}

export const READY_SECTOR_TEMPLATES: SectorTemplate[] = [
  {
    id: 'tecnologia',
    name: 'Tecnologia & Inovação',
    tone: 'cyan',
    iconName: 'tech',
    description: 'Projetos de software, inteligência artificial, portfólio e aprendizados técnicos.',
    starterIdeas: [
      {
        title: 'Criar meu Portfólio Moderno & Vitrine de Projetos',
        summary: 'Construir um site veloz e elegante para apresentar minhas realizações e habilidades ao mundo.',
        priority: 'Importante',
        immediate: 'Listar os 3 melhores projetos que já construí ou quero construir.',
        clarity: 'Sua história e o que você constrói merecem um palco claro e profissional.',
        scope: 'Página web responsiva com apresentação pessoal, 3 projetos com links e contato direto.',
        minutes: 90,
        steps: [
          { text: 'Listar os 3 projetos principais e seus diferenciais em 1 página', minutes: 20 },
          { text: 'Estruturar o layout visual (Hero, Projetos, Sobre mim, Contato)', minutes: 30 },
          { text: 'Montar a versão funcional e testar em celular e computador', minutes: 25 },
          { text: 'Publicar online e compartilhar link com 3 colegas para feedback', minutes: 15 },
        ],
      },
      {
        title: 'MVP de um Aplicativo / Ferramenta Digital',
        summary: 'Validar uma solução simples e prática para resolver um problema real.',
        priority: 'Urgente',
        immediate: 'Definir o problema central em 1 frase e o resultado esperado em 15 minutos.',
        clarity: 'O melhor aplicativo é o menor possível que resolve uma dor de verdade.',
        scope: 'Primeira versão navegável focada no fluxo essencial, sem recursos secundários.',
        minutes: 120,
        steps: [
          { text: 'Escrever o problema do usuário e a única ação central do app', minutes: 20 },
          { text: 'Desenhar no papel as 3 telas principais do fluxo', minutes: 25 },
          { text: 'Desenvolver a versão 0.1 com funcionalidade básica operando', minutes: 55 },
          { text: 'Testar com 2 pessoas reais observando onde elas clicam', minutes: 20 },
        ],
      },
      {
        title: 'Dominar uma Nova Stack / Ferramenta de IA',
        summary: 'Aprofundar em uma ferramenta que alavanque minha produtividade e capacidade técnica.',
        priority: 'Normal',
        immediate: 'Escolher a ferramenta exata e assistir a um tutorial prático de 15 min.',
        clarity: 'Aprender na prática construindo um micro-projeto fixa 10x mais que teoria pura.',
        scope: 'Construir 1 mini-experimento funcional usando a nova tecnologia em até 3 dias.',
        minutes: 60,
        steps: [
          { text: 'Instalar a ferramenta ou configurar chave/ambiente de testes', minutes: 15 },
          { text: 'Seguir tutorial básico construindo o clássico "Hello World"', minutes: 20 },
          { text: 'Criar uma funcionalidade personalizada adaptada a uma ideia minha', minutes: 25 },
        ],
      },
    ],
  },
  {
    id: 'relacionamento',
    name: 'Relacionamento & Família',
    tone: 'pink',
    iconName: 'relationship',
    description: 'Momentos especiais, conexões afetivas com quem amamos e tempo de qualidade.',
    starterIdeas: [
      {
        title: 'Planejar Viagem ou Final de Semana Especial',
        summary: 'Criar memórias inesquecíveis fora da rotina com quem é importante para mim.',
        priority: 'Importante',
        immediate: 'Abrir um mapa ou site e listar 3 opções de lugares aconchegantes.',
        clarity: 'Viagens não são gastos, são investimentos em conexões e descanso profundo.',
        scope: 'Definição de destino, orçamento estimado, hospedagem e roteiro leve de 2 dias.',
        minutes: 60,
        steps: [
          { text: 'Alinhar datas livres no calendário e preferência de destino', minutes: 15 },
          { text: 'Pesquisar 3 opções de estadias agradáveis e custo estimado', minutes: 25 },
          { text: 'Fazer reserva e combinar detalhes práticos de transporte', minutes: 20 },
        ],
      },
      {
        title: 'Noite Sem Telas: Jantar & Conversas Significativas',
        summary: 'Desconectar dos celulares para um momento de presença real e risadas sinceras.',
        priority: 'Normal',
        immediate: 'Escolher um dia desta semana e convidar com carinho.',
        clarity: 'A presença inteira é o presente mais valioso que podemos dar a alguém.',
        scope: 'Jantar caseiro ou especial sem notificações, com música agradável e conversa aberta.',
        minutes: 45,
        steps: [
          { text: 'Escolher a receita ou prato favorito para a ocasião', minutes: 15 },
          { text: 'Comprar os ingredientes frescos na quitanda ou mercado', minutes: 20 },
          { text: 'Guardar os celulares em uma cesta e aproveitar a noite inteira', minutes: 10 },
        ],
      },
      {
        title: 'Reconectar com Amigos Queridos',
        summary: 'Retomar contato com pessoas queridas que a correria do dia a dia acabou afastando.',
        priority: 'Normal',
        immediate: 'Mandar uma mensagem carinhosa para 1 amigo especial agora.',
        clarity: 'Grandes amizades não precisam de frequência diária, precisam de sinceridade e lembrança.',
        scope: 'Mensagem de afeto para 3 amigos e marcação de um café ou chamada de vídeo.',
        minutes: 30,
        steps: [
          { text: 'Listar 3 amigos queridos que sinto saudade', minutes: 5 },
          { text: 'Enviar uma mensagem espontânea perguntando como eles estão', minutes: 10 },
          { text: 'Marcar um encontro presencial ou ligar para colocar a conversa em dia', minutes: 15 },
        ],
      },
    ],
  },
  {
    id: 'saude',
    name: 'Saúde & Bem-Estar',
    tone: 'green',
    iconName: 'health',
    description: 'Vitalidade do corpo, mente serena, alimentação consciente e sono reparador.',
    starterIdeas: [
      {
        title: 'Ritmo de Treinos & Movimento Diário (3x por semana)',
        summary: 'Construir o hábito sustentável de se exercitar com prazer e sem extremos.',
        priority: 'Urgente',
        immediate: 'Separar tênis e roupa de treino perto da cama para amanhã cedo.',
        clarity: 'Consistência moderada bate intensidade esporádica todos os dias.',
        scope: 'Completar 3 sessões de 30 a 45 minutos de exercício por semana durante 21 dias.',
        minutes: 60,
        steps: [
          { text: 'Definir os 3 dias da semana e os horários fixos de treino', minutes: 10 },
          { text: 'Montar roteiro simples de exercícios ou caminhada/corrida', minutes: 20 },
          { text: 'Realizar o primeiro treino comemorando a vitória do primeiro passo', minutes: 30 },
        ],
      },
      {
        title: 'Alimentação Consciente & Marmitas Práticas da Semana',
        summary: 'Comer com mais qualidade, economizar e evitar o piloto automático do delivery.',
        priority: 'Importante',
        immediate: 'Escrever no bloco de notas o cardápio simples para os próximos 3 almoços.',
        clarity: 'Cuidar do que colocamos no prato é cuidar da nossa clareza mental e energia.',
        scope: 'Planejamento e preparo de 3 refeições equilibradas com alimentos de verdade.',
        minutes: 90,
        steps: [
          { text: 'Montar lista de compras com legumes, verduras e fontes de proteína', minutes: 15 },
          { text: 'Fazer feira ou mercado focado apenas na lista', minutes: 35 },
          { text: 'Cozinhar e porcionar os recipientes para a semana', minutes: 40 },
        ],
      },
      {
        title: 'Higiene do Sono & Rotina Noturna Leve',
        summary: 'Acordar com disposição e energia renovada através de um ritual de desaceleração.',
        priority: 'Normal',
        immediate: 'Configurar alarme para desligar telas 45 minutos antes de dormir.',
        clarity: 'O seu dia produtivo de amanhã começa na noite de hoje.',
        scope: 'Desconectar telas às 22h, ler livro físico e manter quarto escuro e fresco.',
        minutes: 30,
        steps: [
          { text: 'Colocar o celular para carregar fora do alcance da cama', minutes: 5 },
          { text: 'Preparar um chá quente de camomila ou melissa', minutes: 10 },
          { text: 'Ler 10 páginas de um livro agradável com luz baixa', minutes: 15 },
        ],
      },
    ],
  },
  {
    id: 'negocios',
    name: 'Negócios & Carreira',
    tone: 'violet',
    iconName: 'business',
    description: 'Crescimento profissional, produtos, clientes, monetização e estabilidade financeira.',
    starterIdeas: [
      {
        title: 'Lançar Nova Oferta de Serviço ou Consultoria',
        summary: 'Estruturar uma solução clara e apresentar para os primeiros clientes potenciais.',
        priority: 'Urgente',
        immediate: 'Escrever em 1 parágrafo: quem eu ajudo, qual resultado entrego e o preço.',
        clarity: 'Dinheiro é o subproduto do valor real que você gera na vida das pessoas.',
        scope: 'Definição da oferta em 1 página e contato direto com 3 prospectos qualificados.',
        minutes: 90,
        steps: [
          { text: 'Mapear a maior dor dos meus clientes ideais', minutes: 20 },
          { text: 'Escrever a proposta de valor e garantia em tópicos claros', minutes: 30 },
          { text: 'Enviar mensagem para 3 pessoas com convite de conversa diagnóstica', minutes: 40 },
        ],
      },
      {
        title: 'Organizar Finanças & Reserva de Emergência',
        summary: 'Conquistar paz de espírito financeira mapeando gastos e poupando intencionalmente.',
        priority: 'Importante',
        immediate: 'Abrir o extrato do último mês e categorizar os 5 maiores gastos.',
        clarity: 'Paz financeira não depende apenas de quanto entra, mas do controle do que sai.',
        scope: 'Planilha ou anotação simples com receitas, despesas fixas e meta de reserva para 6 meses.',
        minutes: 60,
        steps: [
          { text: 'Listar gastos fixos e identificar 2 assinaturas que posso cancelar hoje', minutes: 20 },
          { text: 'Definir o valor mensal automático que vai direto para a reserva', minutes: 15 },
          { text: 'Configurar transferência programada logo após o recebimento', minutes: 25 },
        ],
      },
      {
        title: 'Otimizar Posicionamento Profissional & LinkedIn',
        summary: 'Atrair melhores oportunidades comunicando com autoridade o que sei fazer de melhor.',
        priority: 'Normal',
        immediate: 'Atualizar o título do perfil destacando a transformação que gero.',
        clarity: 'Quem comunica com clareza lidera e se destaca no mercado.',
        scope: 'Revisão do perfil, foto profissional e publicação de 1 artigo prático.',
        minutes: 60,
        steps: [
          { text: 'Reescrever o "Sobre mim" focando em resultados e histórico', minutes: 25 },
          { text: 'Pedir depoimento ou recomendação para 2 ex-colegas de confiança', minutes: 15 },
          { text: 'Publicar um aprendizado prático recente da minha área', minutes: 20 },
        ],
      },
    ],
  },
  {
    id: 'criatividade',
    name: 'Criatividade & Expressão',
    tone: 'amber',
    iconName: 'creative',
    description: 'Artes manuais, escrita, marcenaria, fotografia, música e expressão da alma.',
    starterIdeas: [
      {
        title: 'Escrever Primeiros Ensaios ou Newsletter',
        summary: 'Compartilhar ideias, visões de mundo e aprendizados através da palavra escrita.',
        priority: 'Normal',
        immediate: 'Escrever no bloco de notas o tema do primeiro texto sem pensar em perfeição.',
        clarity: 'Escrever é a melhor forma de organizar o próprio pensamento.',
        scope: 'Rascunho de 500 palavras sobre um tema que amo e publicação no Substack ou blog.',
        minutes: 60,
        steps: [
          { text: 'Escolher 1 ideia central e listar 3 tópicos de apoio', minutes: 15 },
          { text: 'Escrever o primeiro rascunho de uma vez, sem editar no caminho', minutes: 30 },
          { text: 'Revisar para clareza, cortar excessos e publicar', minutes: 15 },
        ],
      },
      {
        title: 'Projeto Manual: Marcenaria ou Decoração Afetiva',
        summary: 'Criar uma peça física com as próprias mãos para transformar um cantinho da casa.',
        priority: 'Importante',
        immediate: 'Fazer o primeiro rascunho com lápis e régua das medidas da peça.',
        clarity: 'O trabalho manual ancora a mente no presente e gera orgulho tangível.',
        scope: 'Construção ou reforma de uma luminária, prateleira ou objeto decorativo.',
        minutes: 120,
        steps: [
          { text: 'Desenhar a peça com lista de cortes e materiais', minutes: 25 },
          { text: 'Separar madeiras, parafusos, lixas e ferramentas necessárias', minutes: 35 },
          { text: 'Executar cortes, montagem e acabamento com óleo natural ou cera', minutes: 60 },
        ],
      },
    ],
  },
];

/**
 * Instancia as ideias modelo para um setor específico.
 */
export const READY_COMPANY_SECTOR_TEMPLATES: SectorTemplate[] = [
  {
    id: 'tech_dev',
    name: 'Tecnologia & Dev',
    tone: 'cyan',
    iconName: 'tech',
    description: 'Engenharia de software, automação de infraestrutura, escalabilidade de microsserviços e APIs.',
    starterIdeas: [
      {
        title: 'Otimização de Performance & Redução de Latência de APIs',
        summary: 'Mapear rotas críticas do sistema e aplicar cache para garantir tempo de resposta abaixo de 200ms.',
        priority: 'Importante',
        immediate: 'Listar as 3 rotas com maior tempo de resposta nos logs do servidor.',
        clarity: 'Sistemas rápidos e estáveis constroem confiança imediata com clientes corporativos.',
        scope: 'Auditoria de gargalos em banco de dados, camada de cache Redis e testes de carga simulando pico.',
        minutes: 120,
        steps: [
          { text: 'Identificar as 3 rotas mais lentas nos logs de produção', minutes: 25 },
          { text: 'Implementar camada de cache em memória para leituras repetidas', minutes: 45 },
          { text: 'Criar índices otimizados no banco de dados', minutes: 30 },
          { text: 'Executar teste de carga e documentar o ganho de latência', minutes: 20 },
        ],
      },
      {
        title: 'Automação de CI/CD & Deploy Contínuo com Zero Downtime',
        summary: 'Configurar esteira automatizada para validar testes e publicar novas versões com segurança total.',
        priority: 'Urgente',
        immediate: 'Desenhar o fluxo ideal da esteira (Lint -> Testes -> Homologação -> Produção).',
        clarity: 'Deploys automatizados eliminam o estresse de entregas e previnem erros manuais.',
        scope: 'Pipeline de integração contínua rodando testes unitários e lint a cada push.',
        minutes: 90,
        steps: [
          { text: 'Criar arquivo de configuração de workflow de CI/CD', minutes: 25 },
          { text: 'Integrar suíte de testes automáticos com bloqueio de merge em caso de falha', minutes: 30 },
          { text: 'Configurar notificações de status no canal da equipe', minutes: 15 },
          { text: 'Testar 1 deploy de ponta a ponta simulado', minutes: 20 },
        ],
      },
    ],
  },
  {
    id: 'qualidade_produto',
    name: 'Qualidade & Produto',
    tone: 'green',
    iconName: 'business',
    description: 'Product Discovery, pesquisa contínua com clientes, Design System e validação de roadmap.',
    starterIdeas: [
      {
        title: 'Discovery Contínuo & Entrevistas com Clientes-Chave',
        summary: 'Entrevistar 5 clientes reais para entender suas maiores dores na rotina com nossa solução.',
        priority: 'Urgente',
        immediate: 'Elaborar roteiro de 5 perguntas abertas focadas em problemas reais.',
        clarity: 'Construir o que os clientes realmente precisam evita meses de desenvolvimento desperdiçado.',
        scope: 'Roteiro de entrevista, realização de 5 conversas e relatório de síntese de oportunidades.',
        minutes: 100,
        steps: [
          { text: 'Redigir roteiro de 5 perguntas abertas sobre fluxo de trabalho do cliente', minutes: 20 },
          { text: 'Agendar e conduzir as 3 primeiras entrevistas de 20 minutos', minutes: 45 },
          { text: 'Sintetizar padrões de dores e oportunidades em 1 página executiva', minutes: 25 },
          { text: 'Apresentar conclusões para o time de tecnologia e liderança', minutes: 10 },
        ],
      },
      {
        title: 'Padronização do Design System & Consistência de UI/UX',
        summary: 'Alinhar componentes visuais, tipografia e estados de botão para agilizar a criação de novas telas.',
        priority: 'Normal',
        immediate: 'Catalogar os 5 componentes mais usados no aplicativo (botões, inputs, cards, modais).',
        clarity: 'Um Design System consistente reduz tempo de desenvolvimento em 40% e eleva a percepção de valor.',
        scope: 'Biblioteca de componentes documentada e aplicada nas páginas centrais.',
        minutes: 80,
        steps: [
          { text: 'Catalogar discrepâncias visuais nos componentes atuais', minutes: 20 },
          { text: 'Definir tokens de cores, espaçamentos e variantes de botões', minutes: 30 },
          { text: 'Aplicar a padronização no fluxo principal da aplicação', minutes: 30 },
        ],
      },
    ],
  },
  {
    id: 'marketing_growth',
    name: 'Marketing & Growth',
    tone: 'pink',
    iconName: 'creative',
    description: 'Aquisição de clientes, campanhas de tração, nutrição de leads e métricas de conversão.',
    starterIdeas: [
      {
        title: 'Otimização da Página de Apresentação & Conversão de Leads',
        summary: 'Reestruturar títulos, prova social e botões de ação para aumentar a taxa de conversão em 25%.',
        priority: 'Urgente',
        immediate: 'Reescrever a promessa principal da primeira dobra em 1 frase clara e impactante.',
        clarity: 'Clareza vende mais que complexidade: o cliente precisa entender o benefício em 5 segundos.',
        scope: 'Nova versão da página com proposta de valor direta, depoimentos e formulário simplificado.',
        minutes: 90,
        steps: [
          { text: 'Definir a nova proposta de valor central e call-to-action primário', minutes: 20 },
          { text: 'Incluir 3 depoimentos reais e selos de segurança/confiabilidade', minutes: 25 },
          { text: 'Implementar as melhorias visuais e testar responsividade mobile', minutes: 30 },
          { text: 'Medir a taxa de conversão por 7 dias comparando com o período anterior', minutes: 15 },
        ],
      },
    ],
  },
  {
    id: 'testes_qa',
    name: 'Testes & QA',
    tone: 'amber',
    iconName: 'tech',
    description: 'Garantia de qualidade contínua, testes E2E nos fluxos críticos e prevenção de regressões.',
    starterIdeas: [
      {
        title: 'Cobertura de Testes Automatizados nos Fluxos Críticos',
        summary: 'Criar testes automatizados para login, cadastro e criação de iniciativas para evitar quebras.',
        priority: 'Importante',
        immediate: 'Listar os 3 fluxos que nunca podem quebrar em produção.',
        clarity: 'Qualidade não é um evento antes do release, é um hábito contínuo da engenharia.',
        scope: 'Suíte de testes de regressão executando antes de cada versão ser liberada.',
        minutes: 90,
        steps: [
          { text: 'Escrever casos de teste para o fluxo de autenticação e permissões', minutes: 30 },
          { text: 'Escrever casos de teste para captura e persistência de dados', minutes: 35 },
          { text: 'Configurar relatório automático de cobertura de código', minutes: 25 },
        ],
      },
    ],
  },
  {
    id: 'operacoes_rh',
    name: 'Operações & Pessoas',
    tone: 'violet',
    iconName: 'relationship',
    description: 'Gestão de processos organizacionais, onboarding de talentos e comunicação transparente.',
    starterIdeas: [
      {
        title: 'Manual Vivo de Onboarding de Novos Colaboradores',
        summary: 'Montar checklist claro para novos membros começarem a produzir com autonomia em até 48 horas.',
        priority: 'Importante',
        immediate: 'Listar os 5 primeiros acessos e ferramentas necessárias para o novo colaborador.',
        clarity: 'Um bom onboarding reduz ansiedade, eleva o pertencimento e acelera resultados do time.',
        scope: 'Documento centralizado com missão, links úteis, contatos-chave e tarefas da primeira semana.',
        minutes: 75,
        steps: [
          { text: 'Listar acessos obrigatórios e ferramentas de comunicação', minutes: 20 },
          { text: 'Redigir guia dos primeiros 3 dias com missões práticas e mentor de apoio', minutes: 35 },
          { text: 'Validar o guia com o último membro contratado para coletar feedback', minutes: 20 },
        ],
      },
    ],
  },
];

export function getReadySectorTemplates(isBusiness?: boolean): SectorTemplate[] {
  return isBusiness ? READY_COMPANY_SECTOR_TEMPLATES : READY_SECTOR_TEMPLATES;
}

export function buildStarterIdeasForSector(sectorId: string, template: SectorTemplate, workspace: 'personal' | 'business' = 'personal'): Idea[] {
  return template.starterIdeas.map((seed, idx) => {
    const ideaId = crypto.randomUUID();
    const steps: Step[] = seed.steps.map((st, stepIdx) => ({
      id: `step-${ideaId}-${stepIdx}`,
      text: st.text,
      minutes: st.minutes,
      done: false,
    }));

    return {
      id: ideaId,
      title: seed.title,
      summary: seed.summary,
      sector: sectorId,
      stage: (idx === 0 ? 1 : 0) as 0 | 1, // A primeira ideia já começa estruturada!
      priority: seed.priority,
      minutes: seed.minutes,
      dedicated: 0,
      steps,
      immediate: seed.immediate,
      clarity: seed.clarity,
      scope: seed.scope,
      workspace,
      pivots: [],
      notes: [
        {
          id: `note-${ideaId}-init`,
          createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          text: `Iniciativa criada a partir do modelo oficial de ${template.name}! 🚀`,
        },
      ],
    };
  });
}

