import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Flower2,
  Hammer,
  Plus,
  Shapes,
  BriefcaseBusiness,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart as PieChartIcon,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useFlow } from '@/components/flow-provider';
import { IdeaCard } from '@/components/idea-card';
import { IdeaDetail } from '@/components/idea-detail';
import { FocusTimer } from '@/components/focus-timer';
import {
  calculateGlobalSectorComparison,
  calculateSectorAnalytics,
  formatMinutes,
  stageNames,
  type Tone,
  type Idea,
} from '@/lib/ideaflow';

export const Route = createFileRoute('/setores')({
  head: () => ({
    meta: [
      { title: 'Setores & Desempenho · Ideaflow' },
      {
        name: 'description',
        content: 'Dashboard comparativo dos seus setores e visão detalhada de cada área.',
      },
      { property: 'og:title', content: 'Setores & Desempenho · Ideaflow' },
      {
        property: 'og:description',
        content: 'Descubra qual área da sua vida está avançando e onde vale a pena colocar mais foco.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Sectors,
});

const icons: Record<string, typeof Code2> = {
  tech: Code2,
  business: BriefcaseBusiness,
  personal: Flower2,
  wood: Hammer,
};

const tones: Tone[] = ['cyan', 'pink', 'amber', 'green', 'violet'];

function Sectors() {
  const { data, setData } = useFlow();
  const [mounted, setMounted] = useState(false);
  const [create, setCreate] = useState(false);
  const [name, setName] = useState('');
  const [tone, setTone] = useState<Tone>('cyan');
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [focus, setFocus] = useState<Idea | null>(null);
  const [showGlobalCharts, setShowGlobalCharts] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeIdeas = data.ideas.filter(i => !i.archived);
  const comparison = calculateGlobalSectorComparison(data.sectors, activeIdeas);
  const selectedSector = data.sectors.find(s => s.id === selected);
  const selectedAnalytics = selectedSector
    ? calculateSectorAnalytics(selectedSector, activeIdeas)
    : null;

  return (
    <>
      {/* Cabeçalho da Página */}
      <div className="page-heading">
        <div>
          <h1>
            Seus setores, <span>em equilíbrio.</span>
          </h1>
          <p className="page-subtitle">
            Acompanhe o desenvolvimento de cada área da sua vida e identifique onde acelerar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9 gap-1.5"
            onClick={() => setShowGlobalCharts(!showGlobalCharts)}
          >
            <BarChart3 size={14} className="text-primary" />
            {showGlobalCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
          </Button>
          <Button aria-label="Novo setor" className="new-idea" onClick={() => setCreate(true)}>
            <Plus />
            <span className="button-label">Novo setor</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARD COMPARATIVO GERAL DE SETORES */}
      <section className="mt-8 space-y-6">
        {/* Cards de Destaque: Mais Desenvolvido vs Em Atraso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Setor Mais Desenvolvido */}
          <div className="p-5 rounded-xl border border-green/30 bg-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp size={15} />
                Setor Mais Desenvolvido
              </span>
              {comparison.mostDeveloped && (
                <span className="text-xs text-muted-foreground font-mono">
                  {comparison.mostDeveloped.completionRate}% realizado
                </span>
              )}
            </div>

            {comparison.mostDeveloped ? (
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <strong className="text-2xl font-display font-medium text-foreground">
                    {comparison.mostDeveloped.sector.name}
                  </strong>
                  <span className="text-xs px-2 py-0.5 rounded bg-green/10 text-green border border-green/20">
                    Líder em Tração
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {comparison.mostDeveloped.completedIdeas} de {comparison.mostDeveloped.totalIdeas} ideias realizadas ·{' '}
                  {formatMinutes(comparison.mostDeveloped.totalMinutesDedicated)} de foco investido.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-green border-green/30 gap-1 hover:bg-green/10"
                    onClick={() => setSelected(comparison.mostDeveloped!.sector.id)}
                  >
                    Ver detalhes do setor
                    <ChevronRight size={13} />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-3">
                Adicione e conclua ideias para visualizar o setor líder.
              </p>
            )}
          </div>

          {/* Card: Setor em Atraso / Atenção */}
          <div className="p-5 rounded-xl border border-pink/30 bg-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle size={15} />
                Setor com Atenção Necessária
              </span>
              {comparison.mostDelayed && (
                <span className="text-xs text-muted-foreground font-mono">
                  {comparison.mostDelayed.totalIdeas - comparison.mostDelayed.completedIdeas} pendentes
                </span>
              )}
            </div>

            {comparison.mostDelayed ? (
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <strong className="text-2xl font-display font-medium text-foreground">
                    {comparison.mostDelayed.sector.name}
                  </strong>
                  <span className="text-xs px-2 py-0.5 rounded bg-pink/10 text-pink border border-pink/20">
                    Atraso / Pouco Foco
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {comparison.mostDelayed.healthMessage} Há{' '}
                  {comparison.mostDelayed.stageDistribution[0]?.count ?? 0} ideia(s) ainda em rascunho.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-pink border-pink/30 gap-1 hover:bg-pink/10"
                    onClick={() => setSelected(comparison.mostDelayed!.sector.id)}
                  >
                    Destravar ideias deste setor
                    <ChevronRight size={13} />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-3">
                Todos os setores estão com excelente nível de avanço!
              </p>
            )}
          </div>
        </div>

        {/* Gráficos Comparativos Gerais com Recharts */}
        {showGlobalCharts && mounted && comparison.chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl border border-border bg-card/60">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-primary" />
                  Ideias por Setor (Total vs Realizadas)
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="total" name="Total de Ideias" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="concluidas" name="Realizadas" fill="var(--green)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock size={14} className="text-violet" />
                  Horas de Foco Dedicadas por Setor
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} unit="h" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} horas`, 'Tempo']}
                    />
                    <Bar dataKey="horasDedicadas" name="Horas de Foco" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Grid de Todos os Setores */}
      <section className="mt-8">
        <h2 className="section-heading mb-4">Explorar Setores</h2>
        <div className="sectors-grid">
          {data.sectors.map(s => {
            const Icon = icons[s.id] ?? Shapes;
            const ideas = data.ideas.filter(i => i.sector === s.id);
            const done = ideas.filter(i => i.stage === 4).length;
            const minutes = ideas.reduce((sum, i) => sum + i.dedicated, 0);

            return (
              <article className={`sector-item tone-${s.tone}`} key={s.id}>
                <div className="sector-symbol">
                  <Icon size={23} />
                </div>
                <h2>{s.name}</h2>
                <p>
                  {ideas.length} ideias · {done} realizadas
                </p>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock size={11} />
                  {formatMinutes(minutes)} de foco
                </div>
                <progress
                  value={done}
                  max={Math.max(1, ideas.length)}
                  aria-label={`${done} ideias realizadas`}
                />
                <Button variant="ghost" className="sector-open" onClick={() => setSelected(s.id)}>
                  Explorar setor & Dashboard
                  <ArrowUpRight size={15} />
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Modal / Drawer para Criar Novo Setor */}
      <Drawer open={create} onOpenChange={setCreate}>
        <DrawerContent>
          <div className="sheet-body max-w-md mx-auto w-full">
            <DrawerTitle className="sheet-title">Um novo espaço para criar.</DrawerTitle>
            <DrawerDescription className="mt-3">Qual parte do seu universo merece um setor?</DrawerDescription>
            <label className="field-label mt-6">
              Nome do setor
              <input
                className="text-field"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex.: Fotografia, Culinária, Música..."
                maxLength={40}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-5">Cor do setor</p>
            <div className="color-options">
              {tones.map(t => (
                <Button
                  key={t}
                  size="icon"
                  className={`color-swatch tone-${t} ${tone === t ? 'selected' : ''}`}
                  aria-label={`Cor ${t}`}
                  onClick={() => setTone(t)}
                >
                  {tone === t && <Check size={13} />}
                </Button>
              ))}
            </div>
            <Button
              disabled={
                !name.trim() ||
                data.sectors.some(s => s.name.toLowerCase() === name.trim().toLowerCase())
              }
              className="primary-action w-full"
              onClick={() => {
                setData(p => ({
                  ...p,
                  sectors: [...p.sectors, { id: crypto.randomUUID(), name: name.trim(), tone }],
                }));
                setName('');
                setCreate(false);
              }}
            >
              <Plus />
              Criar setor
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* DASHBOARD EXCLUSIVO DO SETOR SELECIONADO */}
      <Drawer
        open={Boolean(selectedSector)}
        onOpenChange={v => {
          if (!v) setSelected(null);
        }}
      >
        <DrawerContent className="max-h-[92vh]">
          <div className="sheet-body max-w-3xl mx-auto w-full space-y-6">
            {selectedSector && selectedAnalytics && (
              <>
                {/* Cabeçalho do Setor */}
                <div className="flex items-center justify-between">
                  <div className="sheet-eyebrow">
                    <Sparkles size={14} />
                    DASHBOARD EXCLUSIVO DO SETOR
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${
                      selectedAnalytics.healthStatus === 'Em Alta'
                        ? 'border-green/40 text-green bg-green/10'
                        : selectedAnalytics.healthStatus === 'Em Atraso'
                          ? 'border-pink/40 text-pink bg-pink/10'
                          : 'border-primary/40 text-primary bg-primary/10'
                    }`}
                  >
                    {selectedAnalytics.healthStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <DrawerTitle className="sheet-title">{selectedSector.name}</DrawerTitle>
                    <DrawerDescription className="mt-1">
                      {selectedAnalytics.healthMessage}
                    </DrawerDescription>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1 primary-action"
                    onClick={() => {
                      setSelected(null);
                      window.dispatchEvent(new CustomEvent('ideaflow:capture'));
                    }}
                  >
                    <Plus size={14} />
                    Nova ideia neste setor
                  </Button>
                </div>

                {/* Métricas Principais do Setor */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-card border border-border">
                    <span className="text-[11px] text-muted-foreground block">Total de Ideias</span>
                    <strong className="text-xl font-display font-medium text-foreground">
                      {selectedAnalytics.totalIdeas}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border">
                    <span className="text-[11px] text-muted-foreground block">Realizadas</span>
                    <strong className="text-xl font-display font-medium text-green">
                      {selectedAnalytics.completedIdeas}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border">
                    <span className="text-[11px] text-muted-foreground block">Taxa de Conclusão</span>
                    <strong className="text-xl font-display font-medium text-primary">
                      {selectedAnalytics.completionRate}%
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border">
                    <span className="text-[11px] text-muted-foreground block">Tempo Dedicado</span>
                    <strong className="text-xl font-display font-medium text-foreground">
                      {formatMinutes(selectedAnalytics.totalMinutesDedicated)}
                    </strong>
                  </div>
                </div>

                {/* Distribuição por Estágios do Funil neste Setor */}
                <div className="p-4 rounded-lg bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Layers size={14} className="text-primary" />
                      Funil de Estágios em {selectedSector.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedAnalytics.totalIdeas - selectedAnalytics.completedIdeas} em andamento
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center">
                    {selectedAnalytics.stageDistribution.map(stage => (
                      <div key={stage.stage} className="p-2 rounded bg-secondary/50 border border-border/60">
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {stage.name}
                        </span>
                        <strong className="text-base font-display text-foreground">{stage.count}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lista de Ideias deste Setor */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Ideias deste Universo</h3>
                    <span className="text-xs text-muted-foreground">
                      Toque para abrir o dashboard individual da ideia
                    </span>
                  </div>

                  <div className="stage-cards">
                    {activeIdeas
                      .filter(i => i.sector === selected)
                      .map(i => (
                        <IdeaCard
                          key={i.id}
                          idea={i}
                          onOpen={idea => {
                            setSelected(null);
                            setDetail(idea.id);
                          }}
                          onFocus={idea => {
                            setSelected(null);
                            setFocus(idea);
                          }}
                        />
                      ))}
                    {!data.ideas.some(i => i.sector === selected) && (
                      <p className="day-empty text-center py-8">
                        Nenhuma ideia neste setor ainda. Capture a primeira faísca!
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <IdeaDetail ideaId={detail} onClose={() => setDetail(null)} onFocus={setFocus} />
      <FocusTimer idea={focus} onClose={() => setFocus(null)} />
    </>
  );
}