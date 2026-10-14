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
});