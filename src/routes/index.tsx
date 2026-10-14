import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Columns3,
  Flame,
  LayoutList,
  Plus,
  Search,
  Sparkles,
  Zap,
  FolderTree,
  FolderPlus,
  Archive,
  ArchiveRestore,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { IdeaCard } from '@/components/idea-card';
import { IdeaDetail } from '@/components/idea-detail';
import { FocusTimer } from '@/components/focus-timer';
import { CreateProjectSheet } from '@/components/create-project-sheet';
import { stageNames, stageTones, type Idea } from '@/lib/ideaflow';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Seu funil de ideias · Ideaflow' },
      {
        name: 'description',
        content: 'Da primeira faísca à realidade: organize suas ideias em cinco etapas e encontre seu próximo passo.',
      },
      { property: 'og:title', content: 'Seu funil de ideias · Ideaflow' },
      { property: 'og:description', content: 'Transforme suas ideias em realização, um pequeno passo de cada vez.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Index,
});

function Index() {
  const { data, setData } = useFlow();
  const [sector, setSector] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'board' | 'list'>('board');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'projects' | 'standalone'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [focus, setFocus] = useState<Idea | null>(null);
  const [mobileStage, setMobileStage] = useState(0);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCreateProject = () => setCreateProjectOpen(true);
    window.addEventListener('ideaflow:create-project', handleCreateProject);
    return () => {
      window.removeEventListener('ideaflow:create-project', handleCreateProject);
    };
  }, []);

  const capture = () => window.dispatchEvent(new Event('ideaflow:capture'));

  const activeIdeas = data.ideas.filter(i => !i.archived);
  const archivedCount = data.ideas.filter(i => i.archived).length;
  const complexProjectsCount = activeIdeas.filter(
    i => i.isProject || data.ideas.some(sub => sub.parentId === i.id)
  ).length;

  const ideas = data.ideas.filter(i => {
    if (showArchived ? !i.archived : i.archived) return false;
    if (sector !== 'all' && i.sector !== sector) return false;
    if (scopeFilter === 'projects' && !i.isProject) return false;
    if (scopeFilter === 'standalone' && (i.isProject || i.parentId)) return false;
    return `${i.title} ${i.summary}`.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Suas ideias, <span>em movimento.</span>
          </h1>
          <p className="page-subtitle">
            Crie ideias individuais ou estruture projetos completos com frentes e módulos organizados.
          </p>
        </div>

        {/* Botões lado a lado: Novo Projeto e Nova Ideia */}
        <div className="action-buttons flex items-center gap-2 shrink-0">
          <Button
            aria-label="Novo projeto"
            variant="outline"
            className="border-violet/40 bg-violet/10 text-violet hover:bg-violet/20 hover:text-violet gap-1.5 h-9 sm:h-[43px] px-2.5 sm:px-3.5 text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
            onClick={() => setCreateProjectOpen(true)}
            title="Criar um novo projeto estruturado com ideias dentro"
          >
            <FolderPlus size={15} className="text-violet" />
            <span>Projeto</span>
          </Button>

          <Button
            aria-label="Nova ideia"
            className="new-idea gap-1.5 cursor-pointer h-9 sm:h-[43px] px-3 sm:px-4 text-xs font-semibold"
            onClick={capture}
            title="Capturar uma nova ideia rápida"
          >
            <Plus size={15} />
            <span>Ideia</span>
          </Button>
        </div>
      </div>

      <div className="stats-bar">
        <span>
          <Zap className="text-cyan" />
          <strong>{activeIdeas.length}</strong> ideias ativas
        </span>
        <span className="stats-divider" />
        <span>
          <FolderTree className="text-violet" />
          <strong>{complexProjectsCount}</strong> projetos macro
        </span>
        <span className="stats-divider" />
        <span>
          <Flame className="text-pink" />
          <strong>{activeIdeas.filter(i => i.stage === 2).length}</strong> em movimento
        </span>
        <span className="stats-divider" />
        <span>
          <CheckCircle2 className="text-green" />
          <strong>{activeIdeas.filter(i => i.stage === 4).length}</strong> realizadas
        </span>
        <span className="spark-note">
          <Sparkles />
          Pequenas ações. Grandes possibilidades.
        </span>
      </div>

      {showArchived && (
        <div className="mb-4 p-3.5 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-between text-xs text-amber">
          <span className="flex items-center gap-2">
            <Archive size={15} />
            Visualizando <strong>{ideas.length} ideias arquivadas</strong>. Elas ficam fora do seu fluxo ativo para manter sua mente focada.
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber hover:bg-amber/20"
            onClick={() => setShowArchived(false)}
          >
            Voltar ao funil ativo
          </Button>
        </div>
      )}

      <div className="funnel-toolbar">
        <div className="filter-row">
          {/* Filtro de Escopo: Todos, Projetos ou Ideias Avulsas */}
          <div className="segmented p-0.5 border border-border/80">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 text-xs ${scopeFilter === 'all' ? 'selected' : ''}`}
              onClick={() => setScopeFilter('all')}
            >
              Tudo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 text-xs gap-1 ${scopeFilter === 'projects' ? 'selected text-violet font-semibold' : ''}`}
              onClick={() => setScopeFilter('projects')}
              title="Filtrar apenas Projetos Macro"
            >
              <FolderTree size={12} />
              Projetos ({complexProjectsCount})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 text-xs ${scopeFilter === 'standalone' ? 'selected' : ''}`}
              onClick={() => setScopeFilter('standalone')}
              title="Filtrar apenas ideias individuais"
            >
              Avulsas
            </Button>
          </div>

          <span className="stats-divider hidden sm:inline" />

          {/* Filtro de Setor */}
          <Button
            variant="ghost"
            className={`filter-button ${sector === 'all' ? 'selected' : ''}`}
            onClick={() => setSector('all')}
          >
            Todos os setores
          </Button>
          {data.sectors.map(s => (
            <Button
              variant="ghost"
              key={s.id}
              className={`filter-button tone-${s.tone} ${sector === s.id ? 'selected' : ''}`}
              onClick={() => setSector(s.id)}
            >
              <Circle className={`text-${s.tone}`} fill="currentColor" />
              {s.name}
            </Button>
          ))}
          <Button
            variant="ghost"
            className={`filter-button ${showArchived ? 'selected text-amber border-amber/40 bg-amber/10' : ''}`}
            onClick={() => setShowArchived(!showArchived)}
            title="Alternar entre ideias ativas e arquivadas"
          >
            <Archive size={12} className={showArchived ? 'text-amber' : ''} />
            {showArchived ? 'Ver Ativas' : `Arquivadas (${archivedCount})`}
          </Button>
        </div>

        <div className="toolbar-right">
          <label className="search-box">
            <Search />
            <input
              aria-label="Buscar ideias"
              placeholder="Buscar ideia…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
          <div className="view-switch">
            <Button
              variant="ghost"
              className={view === 'board' ? 'selected' : ''}
              size="icon"
              aria-label="Visualização em colunas"
              onClick={() => setView('board')}
            >
              <Columns3 />
            </Button>
            <Button
              variant="ghost"
              className={view === 'list' ? 'selected' : ''}
              size="icon"
              aria-label="Visualização em lista"
              onClick={() => setView('list')}
            >
              <LayoutList />
            </Button>
          </div>
        </div>
      </div>

      <div className="mobile-stages">
        {stageNames.map((name, i) => (
          <Button
            key={name}
            variant="ghost"
            className={`tone-${stageTones[i]} ${mobileStage === i ? 'selected' : ''}`}
            onClick={() => {
              setMobileStage(i);
              const column = board.current?.children[i];
              if (column instanceof HTMLElement) {
                board.current?.scrollTo({ left: column.offsetLeft - 22, behavior: 'smooth' });
              }
            }}
          >
            {String(i + 1).padStart(2, '0')} {name}
          </Button>
        ))}
      </div>

      <div
        ref={board}
        className={`kanban ${view === 'list' ? 'list-view' : ''}`}
        onScroll={e => {
          if (window.innerWidth > 700) return;
          const element = e.currentTarget;
          const first = element.children[0];
          if (first instanceof HTMLElement) {
            setMobileStage(Math.min(4, Math.round(element.scrollLeft / (first.offsetWidth + 15))));
          }
        }}
      >
        {stageNames.map((name, stage) => (
          <section className={`kanban-column tone-${stageTones[stage]}`} key={name}>
            <div className="stage-heading">
              <span className="stage-number">{String(stage + 1).padStart(2, '0')}</span>
              <h2>{name}</h2>
              <span className="stage-count">{ideas.filter(i => i.stage === stage).length}</span>
              {stage < 4 ? <ArrowRight /> : <CheckCircle2 />}
            </div>
            <div className="stage-cards">
              {ideas
                .filter(i => i.stage === stage)
                .map(i => (
                  <IdeaCard
                    key={i.id}
                    idea={i}
                    onOpen={idea => setDetail(idea.id)}
                    onFocus={setFocus}
                  />
                ))}
              {!ideas.some(i => i.stage === stage) && (
                <div className="empty-column">
                  {showArchived
                    ? 'Nenhuma ideia arquivada nesta etapa.'
                    : scopeFilter === 'projects'
                      ? 'Nenhum projeto macro nesta etapa.'
                      : 'Um novo espaço para avançar.'}
                </div>
              )}
            </div>
            {!showArchived && (
              <Button variant="ghost" className="add-stage" onClick={capture}>
                <Plus />
                Uma nova possibilidade
              </Button>
            )}
          </section>
        ))}
      </div>

      <div className="flow-inspiration">
        <Sparkles />
        Você não precisa de mais tempo. Só do próximo passo.
      </div>

      <IdeaDetail ideaId={detail} onClose={() => setDetail(null)} onFocus={setFocus} />
      <FocusTimer idea={focus} onClose={() => setFocus(null)} />
      <CreateProjectSheet
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onOpenProject={id => setDetail(id)}
      />
    </>
  );
}
