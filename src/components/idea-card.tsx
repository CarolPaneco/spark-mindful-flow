import { ArrowUpRight, Check, Clock3, Play, MoreHorizontal, Zap, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { formatMinutes, type Idea } from '@/lib/ideaflow';
interface Props { idea: Idea; onOpen: (idea: Idea) => void; onFocus: (idea: Idea) => void }
export function IdeaCard({ idea, onOpen, onFocus }: Props) {
  const { data } = useFlow();
  const sector = data.sectors.find(s => s.id === idea.sector);
  const completed = idea.steps.filter(s => s.done).length;
  const percent = idea.steps.length ? Math.round(completed / idea.steps.length * 100) : 0;
  return <article className={`idea-card tone-${sector?.tone ?? 'cyan'} ${idea.stage === 4 ? 'realized' : ''}`}>
    <div className="flex items-center justify-between gap-2"><span className="sector-tag"><Circle size={7} fill="currentColor" />{sector?.name ?? 'Sem setor'}</span><Button variant="ghost" size="icon" className="card-menu" aria-label={`Detalhes: ${idea.title}`} onClick={() => onOpen(idea)}><MoreHorizontal /></Button></div>
    <Button variant="ghost" onClick={() => onOpen(idea)} className="card-title"><h3>{idea.title}</h3></Button>
    <p className="card-summary">{idea.summary}</p>
    <div className="card-meta"><span><Clock3 size={13} />{formatMinutes(idea.minutes)}</span><span className={`priority ${idea.priority === 'Urgente' ? 'text-pink' : idea.priority === 'Importante' ? 'text-amber' : ''}`}>{idea.priority === 'Normal' ? <Circle size={7} fill="currentColor" /> : <Zap size={12} />}{idea.priority}</span></div>
    <div className="card-progress"><div className="flex justify-between"><span>{idea.stage === 4 ? 'Você fez acontecer' : 'Pequenos passos'}</span><span>{completed}/{idea.steps.length}</span></div><progress value={percent} max={100} aria-label={`${percent}% concluído`} /></div>
    <div className="card-footer">{idea.stage === 4 ? <span className="text-green flex items-center gap-2"><Check size={14} />Realizado</span> : <Button variant="ghost" className="focus-button" onClick={() => onFocus(idea)}><Play size={12} fill="currentColor" />Começar foco</Button>}<Button variant="ghost" size="icon" aria-label={`Abrir ${idea.title}`} className="arrow-button" onClick={() => onOpen(idea)}><ArrowUpRight /></Button></div>
  </article>;
}