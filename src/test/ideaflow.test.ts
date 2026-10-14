import { describe, expect, it } from 'vitest';
import { initialSectors, isFlowData, planIdea, seedData, formatMinutes } from '@/lib/ideaflow';
describe('Ideaflow offline engine', () => {
  it('creates an actionable idea with a 15-minute first step', () => {
    const idea = planIdea('Criar um app de livros urgente para hoje', initialSectors);
    expect(idea.sector).toBe('tech'); expect(idea.priority).toBe('Urgente'); expect(idea.steps[0]?.minutes).toBe(15); expect(idea.minutes).toBe(idea.steps.reduce((n, s) => n + s.minutes, 0)); expect(idea.stage).toBe(0);
  });
  it('accepts complete backups and rejects malformed data', () => { expect(isFlowData(seedData())).toBe(true); expect(isFlowData({ ideas: [], sectors: [] })).toBe(false); const data = seedData(); const first = data.ideas[0]; if (first) first.stage = 8 as never; expect(isFlowData(data)).toBe(false); });
  it('formats durations', () => { expect(formatMinutes(90)).toBe('1h 30min'); expect(formatMinutes(25)).toBe('25 min'); });
});