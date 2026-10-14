import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, Columns3, Flame, LayoutList, Plus, Search, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { IdeaCard } from '@/components/idea-card';
import { IdeaDetail } from '@/components/idea-detail';
import { FocusTimer } from '@/components/focus-timer';
import { stageNames, stageTones, type Idea } from '@/lib/ideaflow';
export const Route = createFileRoute('/')({ head: () => ({ meta: [{ title: 'Seu funil de ideias · Ideaflow' }, { name: 'description', content: 'Da primeira faísca à realidade: organize suas ideias em cinco etapas e encontre seu próximo passo.' }, { property: 'og:title', content: 'Seu funil de ideias · Ideaflow' }, { property: 'og:description', content: 'Transforme suas ideias em realização, um pequeno passo de cada vez.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Index });
function Index() {
  const { data } = useFlow();
  const [sector, setSector] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'board' | 'list'>('board');
  const [detail, setDetail] = useState<string | null>(null);
  const [focus, setFocus] = useState<Idea | null>(null);
  const [mobileStage, setMobileStage] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const capture = () => window.dispatchEvent(new Event('ideaflow:capture'));
  const ideas = data.ideas.filter(i => (sector === 'all' || i.sector === sector) && `${i.title} ${i.summary}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <><div className="page-heading"><div><h1>Suas ideias, <span>em movimento.</span></h1><p className="page-subtitle">Da primeira faísca ao “eu consegui”. Um passo de cada vez.</p></div><Button aria-label="Nova ideia" className="new-idea" onClick={capture}><Plus size={16} /><span className="button-label">Nova ideia</span></Button></div>
    <div className="stats-bar"><span><Zap className="text-cyan" /><strong>{data.ideas.length}</strong> ideias no universo</span><span className="stats-divider" /><span><Flame className="text-pink" /><strong>{data.ideas.filter(i => i.stage === 2).length}</strong> em movimento</span><span className="stats-divider" /><span><CheckCircle2 className="text-green" /><strong>{data.ideas.filter(i => i.stage === 4).length}</strong> realizadas</span><span className="spark-note"><Sparkles />Pequenas ações. Grandes possibilidades.</span></div>
    <div className="funnel-toolbar"><div className="filter-row"><Button variant="ghost" className={`filter-button ${sector === 'all' ? 'selected' : ''}`} onClick={() => setSector('all')}>Todos os setores</Button>{data.sectors.map(s => <Button variant="ghost" key={s.id} className={`filter-button tone-${s.tone} ${sector === s.id ? 'selected' : ''}`} onClick={() => setSector(s.id)}><Circle className={`text-${s.tone}`} fill="currentColor" />{s.name}</Button>)}</div><div className="toolbar-right"><label className="search-box"><Search /><input aria-label="Buscar ideias" placeholder="Buscar ideia…" value={search} onChange={e => setSearch(e.target.value)} /></label><div className="view-switch"><Button variant="ghost" className={view === 'board' ? 'selected' : ''} size="icon" aria-label="Visualização em colunas" onClick={() => setView('board')}><Columns3 /></Button><Button variant="ghost" className={view === 'list' ? 'selected' : ''} size="icon" aria-label="Visualização em lista" onClick={() => setView('list')}><LayoutList /></Button></div></div></div>
    <div className="mobile-stages">{stageNames.map((name, i) => <Button key={name} variant="ghost" className={`tone-${stageTones[i]} ${mobileStage === i ? 'selected' : ''}`} onClick={() => { setMobileStage(i); const column = board.current?.children[i]; if (column instanceof HTMLElement) board.current?.scrollTo({ left: column.offsetLeft - 22, behavior: 'smooth' }); }}>{String(i + 1).padStart(2, '0')} {name}</Button>)}</div>
    <div ref={board} className={`kanban ${view === 'list' ? 'list-view' : ''}`} onScroll={e => { if (window.innerWidth > 700) return; const element = e.currentTarget; const first = element.children[0]; if (first instanceof HTMLElement) setMobileStage(Math.min(4, Math.round(element.scrollLeft / (first.offsetWidth + 15)))); }}>{stageNames.map((name, stage) => <section className={`kanban-column tone-${stageTones[stage]}`} key={name}><div className="stage-heading"><span className="stage-number">{String(stage + 1).padStart(2, '0')}</span><h2>{name}</h2><span className="stage-count">{ideas.filter(i => i.stage === stage).length}</span>{stage < 4 ? <ArrowRight /> : <CheckCircle2 />}</div><div className="stage-cards">{ideas.filter(i => i.stage === stage).map(i => <IdeaCard key={i.id} idea={i} onOpen={idea => setDetail(idea.id)} onFocus={setFocus} />)}{!ideas.some(i => i.stage === stage) && <div className="empty-column">Um novo espaço para avançar.</div>}</div><Button variant="ghost" className="add-stage" onClick={capture}><Plus />Uma nova possibilidade</Button></section>)}</div>
    <div className="flow-inspiration"><Sparkles />Você não precisa de mais tempo. Só do próximo passo.</div><IdeaDetail ideaId={detail} onClose={() => setDetail(null)} onFocus={setFocus} /><FocusTimer idea={focus} onClose={() => setFocus(null)} /></>;
}
