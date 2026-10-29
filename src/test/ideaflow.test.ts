import { describe, expect, it } from 'vitest';
import {
  initialSectors,
  isFlowData,
  planIdea,
  seedData,
  formatMinutes,
  getSubIdeas,
  getParentIdea,
  getProjectStats,
  generateSubModulesAi,
  FIVE_WHYS_QUESTIONS,
  suggestFiveWhysOffline,
  defaultCompanyWorkspace,
  defaultCompanySectors,
  defaultTeamMembers,
  createStarterBusinessIdeas,
  generateAiSteps,
  resolveSector,
  NO_SECTOR,
} from '@/lib/ideaflow';

describe('Ideaflow offline engine', () => {
  it('creates an actionable idea with a 15-minute first step', () => {
    const idea = planIdea('Criar um app de livros urgente para hoje', initialSectors);
    expect(idea.sector).toBe('tech');
    expect(idea.priority).toBe('Urgente');
    expect(idea.steps[0]?.minutes).toBe(15);
    expect(idea.minutes).toBe(idea.steps.reduce((n, s) => n + s.minutes, 0));
    expect(idea.stage).toBe(0);
  });

  it('accepts complete backups and rejects malformed data', () => {
    expect(isFlowData(seedData(false))).toBe(true);
    expect(isFlowData(seedData(true))).toBe(true);
    expect(isFlowData({ ideas: [], sectors: [] })).toBe(false);
    const data = seedData(true);
    const first = data.ideas[0];
    if (first) first.stage = 8 as never;
    expect(isFlowData(data)).toBe(false);
  });

  it('formats durations', () => {
    expect(formatMinutes(90)).toBe('1h 30min');
    expect(formatMinutes(25)).toBe('25 min');
  });

  it('supports complex macro projects with nested sub-ideas', () => {
    const data = seedData(true);
    const project = data.ideas.find(i => i.id === 'demo-7');
    expect(project).toBeDefined();
    expect(project?.isProject).toBe(true);

    const subIdeas = getSubIdeas(data.ideas, 'demo-7');
    expect(subIdeas.length).toBeGreaterThanOrEqual(2);

    const frontEnd = subIdeas.find(i => i.id === 'demo-7-front');
    expect(frontEnd).toBeDefined();

    const parent = getParentIdea(data.ideas, frontEnd!);
    expect(parent?.id).toBe('demo-7');

    const stats = getProjectStats(project!, data.ideas);
    expect(stats.totalSub).toBe(subIdeas.length);
    expect(stats.totalMinutes).toBeGreaterThan(project!.minutes);
  });

  it('generates coherent sub-modules for complex plans using heuristic AI', () => {
    const modules = generateSubModulesAi(
      'Site de Vendas E-commerce',
      'Plataforma completa de vendas com catálogo e gateway',
      'business'
    );
    expect(modules.length).toBeGreaterThanOrEqual(3);
    expect(modules.some(m => m.title.includes('Front-end') || m.title.includes('Interface'))).toBe(true);
    expect(modules.some(m => m.title.includes('Back-end') || m.title.includes('API'))).toBe(true);
  });

  it('generates domain-aware modules for home renovation without tech jargon', () => {
    const modules = generateSubModulesAi(
      'Reformar minha cozinha',
      'Trocar armários, piso e iluminação',
      'personal'
    );
    expect(modules.length).toBeGreaterThanOrEqual(3);
    // Should NOT have front-end or back-end
    expect(modules.some(m => /front-end|back-end|api|software/i.test(m.title))).toBe(false);
    // Should have renovation related stages
    expect(modules.some(m => /planejamento|orçamento|alvenaria|marcenaria|pintura/i.test(m.title))).toBe(true);
  });

  it('correctly tracks and filters archived ideas', () => {
    const data = seedData(true);
    const archived = data.ideas.filter(i => i.archived);
    expect(archived.length).toBeGreaterThanOrEqual(1);

    const active = data.ideas.filter(i => !i.archived);
    expect(active.every(i => !i.archived)).toBe(true);
  });

  it('provides ready-to-use sector templates with starter ideas', async () => {
    const { READY_SECTOR_TEMPLATES, buildStarterIdeasForSector } = await import('@/lib/sector-templates');
    expect(READY_SECTOR_TEMPLATES.length).toBeGreaterThanOrEqual(5);

    const techTemplate = READY_SECTOR_TEMPLATES.find(t => t.id === 'tecnologia');
    expect(techTemplate).toBeDefined();
    expect(techTemplate?.starterIdeas.length).toBeGreaterThanOrEqual(3);

    const ideas = buildStarterIdeasForSector('custom-tech-id', techTemplate!);
    expect(ideas.length).toBe(techTemplate!.starterIdeas.length);
    expect(ideas[0]?.sector).toBe('custom-tech-id');
    expect(ideas[0]?.steps.length).toBeGreaterThanOrEqual(3);
  });

  it('generates a deep funnel dossier and understands user funnel questions', async () => {
    const { generateFunnelDossier, askMentorAi } = await import('@/lib/ai-assistant');
    const data = seedData(true);
    const dossier = generateFunnelDossier(data.ideas, data.sectors);

    expect(dossier).toContain('ESTUDO DO FUNIL EM TEMPO REAL');
    expect(dossier).toContain('Faísca');
    expect(dossier).toContain('Em Fluxo');

    // Testa se o Mentor IA analisa o funil e cita as ideias reais
    const funnelAnswer = await askMentorAi({
      message: 'Como estão meus funis atualmente?',
      allIdeas: data.ideas,
      sectors: data.sectors,
    });
    expect(funnelAnswer.reply).toContain('Diagnóstico');
    expect(funnelAnswer.reply.length).toBeGreaterThan(100);

    // Testa se o Mentor IA identifica uma ideia específica pelo título
    const ideaSpecificAnswer = await askMentorAi({
      message: 'Qual o próximo passo para o app de livros?',
      allIdeas: data.ideas,
      sectors: data.sectors,
    });
    expect(ideaSpecificAnswer.reply.toLowerCase()).toContain('livros');
  });

  it('handles mental health and vulnerability with deep empathy and zero robotic process', async () => {
    const { askMentorAi } = await import('@/lib/ai-assistant');
    const answer = await askMentorAi({
      message: 'estou com depressao e nao consigo fazer nada',
    });

    // Deve acolher com afeto e JAMAIS responder com processos ou metas
    expect(answer.reply).toContain('não precisa ser produtivo hoje');
    expect(answer.reply).toContain('188');
    expect(answer.reply).not.toContain('Clareza de Intenção');
    expect(answer.reply).not.toContain('Micro-Passo de Validação');
  });

  it('responds naturally and conversationally to greetings and casual chat like a real chatbot', async () => {
    const { askMentorAi } = await import('@/lib/ai-assistant');
    
    // Testa "oi tudo bem"
    const greeting = await askMentorAi({ message: 'oi tudo bem' });
    expect(greeting.reply).toContain('Tudo ótimo');
    expect(greeting.reply).not.toContain('Clareza do Resultado Desejado');

    // Testa "quem é você" e também com gíria "quem é vc"
    const identity = await askMentorAi({ message: 'quem é você?' });
    expect(identity.reply).toContain('Mentor Ideaflow');
    expect(identity.reply).not.toContain('Clareza de Objetivo');

    const identitySlang = await askMentorAi({ message: 'quem é vc' });
    expect(identitySlang.reply).toContain('Mentor Ideaflow');
    expect(identitySlang.reply).not.toContain('Entendi o que você trouxe');
    expect(identitySlang.reply).not.toContain('ideia(s) em andamento no aplicativo');

    // Testa piada
    const joke = await askMentorAi({ message: 'conta uma piada' });
    expect(joke.reply).toContain('programador');

    // Testa o que é ideaflow
    const about = await askMentorAi({ message: 'o que é o ideaflow?' });
    expect(about.reply).toContain('Faísca');
    expect(about.reply).toContain('Setores');

    // Testa agradecimento
    const gratitude = await askMentorAi({ message: 'muito obrigado!' });
    expect(gratitude.reply).toContain('Por nada');
  });

  it('supports the 5 Whys methodology for deep idea context and planning', () => {
    expect(FIVE_WHYS_QUESTIONS).toHaveLength(5);
    expect(FIVE_WHYS_QUESTIONS[0].step).toBe(1);

    const offlineWhys = suggestFiveWhysOffline('Fazer um bolo de cenoura artesanal para vender');
    expect(offlineWhys).toHaveLength(5);
    expect(offlineWhys[0]).toContain('sabor');

    const sampleWhys = [
      'Criar uma confeitaria caseira sem conservantes',
      'Pessoas no bairro procuram doces artesanais',
      'Faltava testar a receita em tamanho família',
      'Independência financeira e realização',
      'Vender sob encomenda no fim de semana',
    ];

    const planned = planIdea('Fazer bolo de cenoura', initialSectors, sampleWhys);
    expect(planned.fiveWhys).toEqual(sampleWhys);
    expect(planned.scope).toContain('Criar uma confeitaria caseira sem conservantes');
    expect(planned.steps.length).toBeGreaterThanOrEqual(1);
  });

  it('supports Enterprise Workspace with company sectors, team members and business ideas', () => {
    expect(defaultCompanySectors.length).toBeGreaterThanOrEqual(4);
    expect(defaultCompanySectors.some((s: any) => s.id === 'qa')).toBe(true);
    expect(defaultCompanySectors.some((s: any) => s.id === 'quality')).toBe(true);
    expect(defaultCompanySectors.some((s: any) => s.id === 'marketing')).toBe(true);

    expect(defaultTeamMembers.length).toBeGreaterThanOrEqual(3);
    expect(defaultCompanyWorkspace.name).toBeDefined();

    const bizIdeas = createStarterBusinessIdeas();
    expect(bizIdeas.length).toBeGreaterThan(0);
    expect(bizIdeas.every((i: any) => i.workspace === 'business')).toBe(true);
    expect(bizIdeas.some((i: any) => i.assignedTo)).toBe(true);

    const initial = seedData();
    initial.workspaceMode = 'business';
    initial.companyWorkspace = defaultCompanyWorkspace;
    initial.ideas = bizIdeas;
    expect(isFlowData(initial)).toBe(true);
  });

  it('generates context-accurate steps for vlog and creative projects without generic startup templates', () => {
    const title = 'Vlog show do bts';
    const summary = 'vou no show do bts e queria fazer um vlog completo a partir da viagem do aeroporto ate o final';
    const stepsMvp = generateAiSteps(title, summary, 'personal', 'mvp');
    expect(stepsMvp.length).toBeGreaterThanOrEqual(3);
    const combinedText = stepsMvp.map(s => s.text.toLowerCase()).join(' ');
    // Does NOT contain generic software startup keywords
    expect(combinedText).not.toContain('mockup');
    expect(combinedText).not.toContain('público-alvo');
    // DOES contain media/vlog related keywords
    expect(combinedText).toMatch(/vlog|grava|show|aeroporto|clipe|bateria/);
  });

  it('strictly isolates user sectors and avoids generalizing preset sectors', () => {
    // Novo usuário padrão começa sem setores pré-definidos
    const freshData = seedData(false);
    expect(freshData.sectors).toEqual([]);

    // resolveSector sem setores disponíveis retorna sempre 'Sem setor'
    const unresolved1 = resolveSector('tech', []);
    expect(unresolved1.name).toBe('Sem setor');
    expect(unresolved1.id).toBe(NO_SECTOR.id);

    const unresolved2 = resolveSector('none', []);
    expect(unresolved2.name).toBe('Sem setor');

    // Apenas setores que o próprio usuário cadastrou são reconhecidos
    const customSectors = [
      { id: 'musica-01', name: 'Produção Musical', tone: 'violet' as const },
    ];
    const resolved = resolveSector('musica-01', customSectors);
    expect(resolved.name).toBe('Produção Musical');

    // Não herda setores de outros usuários por inferência arbitrária
    const unknownSector = resolveSector('fitness', customSectors);
    expect(unknownSector.name).toBe('Sem setor');
  });
});