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
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { IdeaCard } from '@/components/idea-card';
import { IdeaDetail } from '@/components/idea-detail';
import { FocusTimer } from '@/components/focus-timer';
import { CreateProjectSheet } from '@/components/create-project-sheet';
import { stageNames, stageTones, defaultCompanyWorkspace, type Idea } from '@/lib/ideaflow';

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

  const isBusinessMode = data.workspaceMode === 'business';
  const company = data.companyWorkspace;
  const activeSectors = isBusinessMode && company ? company.sectors : data.sectors;

  const workspaceIdeas = data.ideas.filter(i => {
    if (isBusinessMode) {
      if (i.workspace !== 'business') return false;
      // Isola ideias por empresa ativa para suportar múltiplas empresas por conta/email
      if (company?.id && i.companyId && i.companyId !== company.id) {
        return false;
      }
      return true;
    }
    return i.workspace !== 'business';
  });

  const activeIdeas = workspaceIdeas.filter(i => !i.archived);
  const archivedCount = workspaceIdeas.filter(i => i.archived).length;
  const complexProjectsCount = activeIdeas.filter(
    i => i.isProject || workspaceIdeas.some(sub => sub.parentId === i.id)
  ).length;

  const ideas = workspaceIdeas.filter(i => {
    if (showArchived ? !i.archived : i.archived) return false;
    if (sector !== 'all' && i.sector !== sector) return false;
    if (scopeFilter === 'projects' && !i.isProject) return false;
    if (scopeFilter === 'standalone' && (i.isProject || i.parentId)) return false;
    return `${i.title} ${i.summary} ${i.department ?? ''} ${i.assignedTo ?? ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  });

  return (
    <>
      <div className="page-heading">
        <div className="relative">
          {/* Brilho cósmico ambiente atrás do título */}
          <div className="absolute -top-8 -left-8 w-56 h-28 bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            {isBusinessMode ? (
              <Building2 size={12} className="text-violet" />
            ) : (
              <Sparkles size={11} className="floating-spark text-primary" />
            )}
            <span className="tracking-wide uppercase text-[10px]">
              {isBusinessMode ? `Workspace Empresarial · ${company?.name ?? 'Organização'}` : 'Fluxo Criativo Pessoal'}
            </span>
          </div>

          <h1>
            {isBusinessMode ? (
              <>
                Sua empresa, <span className="motion-heading-gradient">em sincronia.</span>
              </>
            ) : (
              <>
                Suas ideias, <span className="motion-heading-gradient">em movimento.</span>
              </>
            )}
          </h1>
          <p className="page-subtitle">
            {isBusinessMode
              ? 'Gestão de iniciativas por departamentos: Tecnologia, Marketing, Testes/QA, Qualidade e Operações.'
              : 'Crie ideias individuais ou estruture projetos completos com frentes e módulos organizados.'}
          </p>
        </div>

        {/* Botões lado a lado: Novo Projeto e Nova Ideia */}
        <div className="action-buttons flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            aria-label="Novo projeto"
            variant="outline"
            className="border-violet/40 bg-violet/10 text-violet hover:bg-violet/20 hover:text-violet gap-1.5 h-10 sm:h-[43px] px-3.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex-1 sm:flex-initial justify-center"
            onClick={() => setCreateProjectOpen(true)}
            title="Criar um novo projeto estruturado com ideias dentro"
          >
            <FolderPlus size={16} className="text-violet" />
            <span>Projeto</span>
          </Button>

          <Button
            aria-label="Nova ideia"
            className="new-idea gap-1.5 cursor-pointer h-10 sm:h-[43px] px-4 text-xs sm:text-sm font-semibold rounded-xl active:scale-95 transition-all shadow-xs flex-1 sm:flex-initial justify-center"
            onClick={capture}
            title="Capturar uma nova ideia rápida"
          >
            <Plus size={16} />
            <span>Ideia</span>
          </Button>
        </div>
      </div>

      <div className="stats-bar flex items-center gap-3 sm:gap-6 my-6 py-2.5 px-3.5 sm:px-4 rounded-xl glass-panel border border-border/60 overflow-x-auto scrollbar-none">
        <span className="flex items-center gap-2 shrink-0">
          <span className="p-1 rounded-md bg-cyan/15 text-cyan border border-cyan/25">
            <Zap size={13} />
          </span>
          <span><strong>{activeIdeas.length}</strong> ativas</span>
        </span>
        <span className="stats-divider shrink-0" />
        <span className="flex items-center gap-2 shrink-0">
          <span className="p-1 rounded-md bg-violet/15 text-violet border border-violet/25">
            <FolderTree size={13} />
          </span>
          <span><strong>{complexProjectsCount}</strong> macro</span>
        </span>
        <span className="stats-divider shrink-0" />
        <span className="flex items-center gap-2 shrink-0">
          <span className="p-1 rounded-md bg-pink/15 text-pink border border-pink/25">
            <Flame size={13} />
          </span>
          <span><strong>{activeIdeas.filter(i => i.stage === 2).length}</strong> em ação</span>
        </span>
        <span className="stats-divider shrink-0" />
        <span className="flex items-center gap-2 shrink-0">
          <span className="p-1 rounded-md bg-green/15 text-green border border-green/25">
            <CheckCircle2 size={13} />
          </span>
          <span><strong>{activeIdeas.filter(i => i.stage === 4).length}</strong> prontas</span>
        </span>
        <span className="spark-note hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground ml-auto shrink-0">
          <Sparkles size={13} className="text-amber animate-pulse" />
          Pequenas ações. Grandes realizações.
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

      <div className="funnel-toolbar flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-border">
        {/* Filtro de Escopo: no mobile ocupa 100% como grid de 3 colunas perfeitamente simétricas */}
        <div className="w-full sm:w-auto">
          <div className="segmented p-0.5 border border-border/80 w-full sm:w-auto grid grid-cols-3 sm:flex h-9 sm:h-8">
            <Button
              variant="ghost"
              size="sm"
              className={`h-full text-xs font-medium justify-center flex-1 sm:flex-initial ${scopeFilter === 'all' ? 'selected' : ''}`}
              onClick={() => setScopeFilter('all')}
            >
              Tudo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-full text-xs font-medium gap-1 justify-center flex-1 sm:flex-initial ${scopeFilter === 'projects' ? 'selected text-violet font-semibold' : ''}`}
              onClick={() => setScopeFilter('projects')}
              title="Filtrar apenas Projetos Macro"
            >
              <FolderTree size={12} />
              <span>Projetos ({complexProjectsCount})</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-full text-xs font-medium justify-center flex-1 sm:flex-initial ${scopeFilter === 'standalone' ? 'selected' : ''}`}
              onClick={() => setScopeFilter('standalone')}
              title="Filtrar apenas ideias individuais"
            >
              Avulsas
            </Button>
          </div>
        </div>

        {/* Linha de Setores com rolagem horizontal suave e alinhamento reto */}
        <div className="filter-row flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 w-full">
          <Button
            variant="ghost"
            className={`filter-button h-8 shrink-0 text-xs px-3 rounded-lg border ${sector === 'all' ? 'selected' : 'border-border/40'}`}
            onClick={() => setSector('all')}
          >
            Todos os setores
          </Button>
          {activeSectors.map(s => (
            <Button
              variant="ghost"
              key={s.id}
              className={`filter-button tone-${s.tone} h-8 shrink-0 text-xs px-3 rounded-lg border ${sector === s.id ? 'selected' : 'border-border/40'}`}
              onClick={() => setSector(s.id)}
            >
              <Circle className={`text-${s.tone}`} fill="currentColor" />
              {s.name}
            </Button>
          ))}
          <Button
            variant="ghost"
            className={`filter-button h-8 shrink-0 text-xs px-3 rounded-lg border ${showArchived ? 'selected text-amber border-amber/40 bg-amber/10' : 'border-border/40'}`}
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
