import { ArrowUpRight, Check, Clock3, Play, MoreHorizontal, Zap, Circle, FolderTree, CornerDownRight, Archive, User, Building2 } from 'lucide-react';
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
  const sector =
    (data.workspaceMode === 'business'
      ? data.companyWorkspace?.sectors.find(s => s.id === idea.sector) ?? data.sectors.find(s => s.id === idea.sector)
      : data.sectors.find(s => s.id === idea.sector) ?? data.companyWorkspace?.sectors.find(s => s.id === idea.sector));
  const completed = idea.steps.filter(s => s.done).length;
  const percent = idea.steps.length ? Math.round((completed / idea.steps.length) * 100) : 0;

  const subIdeas = getSubIdeas(data.ideas, idea.id, false);
  const parent = getParentIdea(data.ideas, idea);

  return (
    <article className={`idea-card tone-${sector?.tone ?? 'cyan'} ${idea.stage === 4 ? 'realized' : ''} animate-in fade-in-50 duration-300 slide-in-from-bottom-1`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="sector-tag transition-all duration-200">
            <Circle size={7} fill="currentColor" />
            {sector?.name ?? idea.department ?? 'Sem setor'}
          </span>
          {idea.assignedTo && (
            <span
              className="text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"
              title={`Responsável: ${idea.assignedTo}`}
            >
              <User size={10} />
              {idea.assignedTo.split(' ')[0]}
            </span>
          )}
          {idea.isProject && (
            <span className="text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold shadow-xs">
              <FolderTree size={11} />
              {subIdeas.length > 0 ? `${subIdeas.length} módulos` : 'Projeto Macro'}
            </span>
          )}
          {parent && (
            <span
              className="text-[10px] bg-secondary/80 text-muted-foreground border border-border/80 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"
              title={`Módulo do projeto: ${parent.title}`}
            >
              <CornerDownRight size={10} className="text-primary" />
              Módulo
            </span>
          )}
          {idea.archived && (
            <span className="text-[10px] bg-amber/20 text-amber border border-amber/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
              <Archive size={10} />
              Arquivada
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="card-menu shrink-0 cursor-pointer"
          aria-label={`Detalhes: ${idea.title}`}
          onClick={() => onOpen(idea)}
        >
          <MoreHorizontal />
        </Button>
      </div>

      <Button variant="ghost" onClick={() => onOpen(idea)} className="card-title group cursor-pointer">
        <h3 className="group-hover:text-primary transition-colors">{idea.title}</h3>
      </Button>

      <p className="card-summary">{idea.summary}</p>

      <div className="card-meta">
        <span className="text-muted-foreground font-medium">
          <Clock3 size={13} className="text-primary/70" />
          {formatMinutes(idea.minutes)}
        </span>
        <span
          className={`priority px-2 py-0.5 rounded-full text-[10.5px] font-semibold flex items-center gap-1 ${
            idea.priority === 'Urgente'
              ? 'text-pink bg-pink/10 border border-pink/25 shadow-xs'
              : idea.priority === 'Importante'
                ? 'text-amber bg-amber/10 border border-amber/25 shadow-xs'
                : 'text-muted-foreground bg-secondary/60 border border-border/60'
          }`}
        >
          {idea.priority === 'Normal' ? <Circle size={6} fill="currentColor" /> : <Zap size={11} className={idea.priority === 'Urgente' ? 'animate-pulse' : ''} />}
          {idea.priority}
        </span>
      </div>

      <div className="card-progress">
        <div className="flex justify-between font-medium">
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
          <span className="text-green flex items-center gap-1.5 font-semibold text-xs py-1 px-2 rounded-full bg-green/10 border border-green/25 shadow-xs">
            <Check size={14} className="stroke-[2.5]" />
            Realizado
          </span>
        ) : (
          <Button variant="ghost" className="focus-button hover:bg-primary/10 rounded-lg px-2 cursor-pointer transition-all active:scale-95" onClick={() => onFocus(idea)}>
            <Play size={12} fill="currentColor" className="text-primary" />
            Começar foco
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Abrir ${idea.title}`}
          className="arrow-button cursor-pointer"
          onClick={() => onOpen(idea)}
        >
          <ArrowUpRight />
        </Button>
      </div>
    </article>
  );
}