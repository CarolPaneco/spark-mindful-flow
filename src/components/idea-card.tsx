import { ArrowUpRight, Check, Clock3, Play, MoreHorizontal, Zap, Circle, FolderTree, CornerDownRight, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { formatMinutes, getSubIdeas, getParentIdea, type Idea } from '@/lib/ideaflow';

interface Props {
  idea: Idea;
  onOpen: (idea: Idea) => void;
  onFocus: (idea: Idea) => void;
}

export function IdeaCard({ idea, onOpen, onFocus }: Props) {
  const { data } = useFlow();
  const sector = data.sectors.find(s => s.id === idea.sector);
  const completed = idea.steps.filter(s => s.done).length;
  const percent = idea.steps.length ? Math.round((completed / idea.steps.length) * 100) : 0;

  const subIdeas = getSubIdeas(data.ideas, idea.id, false);
  const parent = getParentIdea(data.ideas, idea);

  return (
    <article className={`idea-card tone-${sector?.tone ?? 'cyan'} ${idea.stage === 4 ? 'realized' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="sector-tag">
            <Circle size={7} fill="currentColor" />
            {sector?.name ?? 'Sem setor'}
          </span>
          {idea.isProject && (
            <span className="text-[10px] bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
              <FolderTree size={11} />
              {subIdeas.length > 0 ? `${subIdeas.length} módulos` : 'Projeto Macro'}
            </span>
          )}
          {parent && (
            <span
              className="text-[10px] bg-secondary/80 text-muted-foreground border border-border/80 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium"
              title={`Módulo do projeto: ${parent.title}`}
            >
              <CornerDownRight size={10} className="text-primary" />
              Módulo
            </span>
          )}
          {idea.archived && (
            <span className="text-[10px] bg-amber/20 text-amber border border-amber/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
              <Archive size={10} />
              Arquivada
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="card-menu shrink-0"
          aria-label={`Detalhes: ${idea.title}`}
          onClick={() => onOpen(idea)}
        >
          <MoreHorizontal />
        </Button>
      </div>

      <Button variant="ghost" onClick={() => onOpen(idea)} className="card-title">
        <h3>{idea.title}</h3>
      </Button>

      <p className="card-summary">{idea.summary}</p>

      <div className="card-meta">
        <span>
          <Clock3 size={13} />
          {formatMinutes(idea.minutes)}
        </span>
        <span
          className={`priority ${
            idea.priority === 'Urgente'
              ? 'text-pink'
              : idea.priority === 'Importante'
                ? 'text-amber'
                : ''
          }`}
        >
          {idea.priority === 'Normal' ? <Circle size={7} fill="currentColor" /> : <Zap size={12} />}
          {idea.priority}
        </span>
      </div>

      <div className="card-progress">
        <div className="flex justify-between">
          <span>
            {idea.stage === 4
              ? 'Você fez acontecer'
              : idea.isProject && subIdeas.length > 0
                ? 'Módulos concluídos'
                : 'Pequenos passos'}
          </span>
          <span>
            {idea.isProject && subIdeas.length > 0
              ? `${subIdeas.filter(s => s.stage === 4).length}/${subIdeas.length}`
              : `${completed}/${idea.steps.length}`}
          </span>
        </div>
        <progress
          value={
            idea.isProject && subIdeas.length > 0
              ? Math.round((subIdeas.filter(s => s.stage === 4).length / subIdeas.length) * 100)
              : percent
          }
          max={100}
          aria-label={`${percent}% concluído`}
        />
      </div>

      <div className="card-footer">
        {idea.stage === 4 ? (
          <span className="text-green flex items-center gap-2">
            <Check size={14} />
            Realizado
          </span>
        ) : (
          <Button variant="ghost" className="focus-button" onClick={() => onFocus(idea)}>
            <Play size={12} fill="currentColor" />
            Começar foco
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Abrir ${idea.title}`}
          className="arrow-button"
          onClick={() => onOpen(idea)}
        >
          <ArrowUpRight />
        </Button>
      </div>
    </article>
  );
}