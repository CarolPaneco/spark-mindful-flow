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
  Pencil,
  Trash2,
  Heart,
  Activity,
  Target,
  FolderPlus,
  HelpCircle,
  X,
  Wand2,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useFlow } from '@/components/flow-provider';
import { IdeaCard } from '@/components/idea-card';
import { IdeaDetail } from '@/components/idea-detail';
import { FocusTimer } from '@/components/focus-timer';
import {
  READY_SECTOR_TEMPLATES,
  buildStarterIdeasForSector,
  type SectorTemplate,
} from '@/lib/sector-templates';
import {
  calculateGlobalSectorComparison,
  calculateSectorAnalytics,
  formatMinutes,
  stageNames,
  type Tone,
  type Idea,
  type Sector,
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

const tones: Tone[] = ['cyan', 'pink', 'amber', 'green', 'violet'];

function getSectorIcon(id: string, name: string) {
  const text = (name + ' ' + id).toLowerCase();
  if (text.includes('tech') || text.includes('tecnol') || text.includes('program') || text.includes('código')) return Code2;
  if (text.includes('relacion') || text.includes('famíl') || text.includes('amor') || text.includes('amigo')) return Heart;
  if (text.includes('saúd') || text.includes('bem-estar') || text.includes('trein') || text.includes('corpo')) return Activity;
  if (text.includes('negóc') || text.includes('carreir') || text.includes('financ') || text.includes('trabalh') || text.includes('business')) return BriefcaseBusiness;
  if (text.includes('marcen') || text.includes('madeir') || text.includes('artesan')) return Hammer;
  if (text.includes('criativ') || text.includes('arte') || text.includes('escrit') || text.includes('foto')) return Sparkles;
  if (text.includes('pessoal') || text.includes('vida') || text.includes('casa')) return Flower2;
  return Shapes;
}

function getTemplateIcon(iconName: string) {
  switch (iconName) {
    case 'tech': return Code2;
    case 'relationship': return Heart;
    case 'health': return Activity;
    case 'business': return BriefcaseBusiness;
    case 'creative': return Sparkles;
    case 'lifestyle': return Flower2;
    default: return Shapes;
  }
}

function Sectors() {
  const { data, setData } = useFlow();
  const [mounted, setMounted] = useState(false);

  // Estados de Criação de Setor
  const [create, setCreate] = useState(false);
  const [name, setName] = useState('');
  const [tone, setTone] = useState<Tone>('cyan');

  // Estados de Edição de Setor
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [editName, setEditName] = useState('');
  const [editTone, setEditTone] = useState<Tone>('cyan');

  // Estados de Exclusão de Setor
  const [deletingSector, setDeletingSector] = useState<Sector | null>(null);
  const [reassignSectorId, setReassignSectorId] = useState<string>('');

  // Estados de Modelos Prontos (Templates)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<SectorTemplate | null>(null);
  const [includeStarterIdeas, setIncludeStarterIdeas] = useState(true);

  // Navegação e drawers de detalhes
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

  // Abertura de modal de exclusão
  const openDeleteModal = (sec: Sector, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingSector(sec);
    const otherSectors = data.sectors.filter(s => s.id !== sec.id);
    setReassignSectorId(otherSectors[0]?.id || '');
  };

  // Confirmação de exclusão
  const confirmDeleteSector = () => {
    if (!deletingSector) return;
    const sectorId = deletingSector.id;
    const sectorName = deletingSector.name;

    setData(prev => {
      const remainingSectors = prev.sectors.filter(s => s.id !== sectorId);
      const targetSector = reassignSectorId || (remainingSectors[0]?.id ?? 'geral');

      const updatedIdeas = prev.ideas.map(i => {
        if (i.sector === sectorId) {
          return { ...i, sector: targetSector };
        }
        return i;
      });

      return {
        ...prev,
        sectors: remainingSectors,
        ideas: updatedIdeas,
      };
    });

    toast.success(`Setor "${sectorName}" excluído com sucesso.`);
    setDeletingSector(null);
    if (selected === sectorId) {
      setSelected(null);
    }
  };

  // Abertura de modal de edição
  const openEditModal = (sec: Sector, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSector(sec);
    setEditName(sec.name);
    setEditTone(sec.tone);
  };

  // Confirmação de edição
  const confirmEditSector = () => {
    if (!editingSector || !editName.trim()) return;
    const trimmed = editName.trim();

    setData(prev => ({
      ...prev,
      sectors: prev.sectors.map(s =>
        s.id === editingSector.id ? { ...s, name: trimmed, tone: editTone } : s
      ),
    }));

    toast.success(`Setor atualizado para "${trimmed}"!`);
    setEditingSector(null);
  };

  // Adoção de Modelo Pronto
  const handleAdoptTemplate = (template: SectorTemplate, withIdeas = true) => {
    const existing = data.sectors.find(s => s.name.toLowerCase() === template.name.toLowerCase());
    const sectorId = existing ? existing.id : crypto.randomUUID();

    const newSector: Sector = {
      id: sectorId,
      name: template.name,
      tone: template.tone,
    };

    const starterIdeas = withIdeas ? buildStarterIdeasForSector(sectorId, template) : [];

    setData(prev => {
      const sectorsList = existing ? prev.sectors : [...prev.sectors, newSector];
      return {
        ...prev,
        sectors: sectorsList,
        ideas: [...prev.ideas, ...starterIdeas],
      };
    });

    toast.success(
      `Setor "${template.name}" ${existing ? 'atualizado' : 'criado'} com sucesso! ${
        withIdeas ? `${starterIdeas.length} ideias modelo adicionadas ao seu funil.` : ''
      }`
    );
    setPreviewTemplate(null);
    setShowTemplatesModal(false);
  };

  const ideasInDeletingSector = deletingSector
    ? data.ideas.filter(i => i.sector === deletingSector.id)
    : [];

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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9 gap-1.5"
            onClick={() => setShowTemplatesModal(true)}
          >
            <Sparkles size={14} className="text-amber" />
            <span className="button-label">Modelos Prontos</span>
          </Button>

          {data.sectors.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-1.5"
              onClick={() => setShowGlobalCharts(!showGlobalCharts)}
            >
              <BarChart3 size={14} className="text-primary" />
              {showGlobalCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
            </Button>
          )}

          <Button aria-label="Novo setor" className="new-idea" onClick={() => setCreate(true)}>
            <Plus />
            <span className="button-label">Novo setor</span>
          </Button>
        </div>
      </div>

      {/* CASO ESPECIAL: 0 SETORES CADASTRADOS -> PRIMEIRA MISSÃO COM MODELOS PRONTOS */}
      {data.sectors.length === 0 ? (
        <section className="mt-8">
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-card to-card/60 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
              <Target size={17} />
              PRIMEIRA MISSÃO DO CRIADOR
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground mt-2">
              Crie seu primeiro Setor de Realização
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Seu espaço Ideaflow está 100% limpo para suas próprias vitórias. Para organizar seu
              funil, escolha um modelo pronto abaixo com ideias práticas estruturadas com 1 clique, ou
              crie um setor personalizado do zero:
            </p>

            {/* Grid dos Modelos Prontos da Missão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {READY_SECTOR_TEMPLATES.map(tmpl => {
                const Icon = getTemplateIcon(tmpl.iconName);
                return (
                  <div
                    key={tmpl.id}
                    className={`p-5 rounded-xl border border-border bg-card/70 hover:bg-card hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between group tone-${tmpl.tone} shadow-sm`}
                    onClick={() => {
                      setPreviewTemplate(tmpl);
                      setIncludeStarterIdeas(true);
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="p-2.5 rounded-lg bg-secondary/80 border border-border text-foreground group-hover:scale-110 transition-transform">
                          <Icon size={20} />
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {tmpl.starterIdeas.length} Ideias Prontas
                        </span>
                      </div>
                      <h3 className="font-semibold text-base text-foreground mt-3.5 group-hover:text-primary transition-colors">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-primary font-medium">
                      <span>Ver ideias & ativar</span>
                      <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-muted-foreground">
                Prefere começar com um nome exclusivo sem ideias pré-definidas?
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => setCreate(true)}
              >
                <Plus size={14} />
                Criar setor personalizado em branco
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <>
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

          {/* Grid de Todos os Setores com Ações de Editar e Excluir */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-heading">Explorar Setores</h2>
              <span className="text-xs text-muted-foreground font-mono">
                {data.sectors.length} setor(es) ativo(s)
              </span>
            </div>

            <div className="sectors-grid">
              {data.sectors.map(s => {
                const Icon = getSectorIcon(s.id, s.name);
                const ideas = data.ideas.filter(i => i.sector === s.id);
                const done = ideas.filter(i => i.stage === 4).length;
                const minutes = ideas.reduce((sum, i) => sum + i.dedicated, 0);

                return (
                  <article className={`sector-item tone-${s.tone} group relative`} key={s.id}>
                    {/* Botões de Ação Rápida (Editar e Excluir) */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        aria-label={`Editar setor ${s.name}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
                        onClick={e => openEditModal(s, e)}
                        title="Editar setor (nome e cor)"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Excluir setor ${s.name}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={e => openDeleteModal(s, e)}
                        title="Excluir setor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="sector-symbol">
                      <Icon size={23} />
                    </div>
                    <h2 className="pr-14 truncate">{s.name}</h2>
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
                    <Button
                      variant="ghost"
                      className="sector-open"
                      onClick={() => setSelected(s.id)}
                    >
                      Explorar setor & Dashboard
                      <ArrowUpRight size={15} />
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* 1. MODAL / DRAWER: CRIAR NOVO SETOR */}
      <Drawer open={create} onOpenChange={setCreate}>
        <DrawerContent>
          <div className="sheet-body max-w-md mx-auto w-full">
            <DrawerTitle className="sheet-title">Um novo espaço para criar.</DrawerTitle>
            <DrawerDescription className="mt-3">
              Qual parte do seu universo merece um setor?
            </DrawerDescription>
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
              className="primary-action w-full mt-6"
              onClick={() => {
                setData(p => ({
                  ...p,
                  sectors: [...p.sectors, { id: crypto.randomUUID(), name: name.trim(), tone }],
                }));
                setName('');
                setCreate(false);
                toast.success(`Setor "${name.trim()}" criado com sucesso!`);
              }}
            >
              <Plus size={16} />
              Criar setor
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* 2. MODAL / DRAWER: EDITAR SETOR */}
      <Drawer
        open={Boolean(editingSector)}
        onOpenChange={v => {
          if (!v) setEditingSector(null);
        }}
      >
        <DrawerContent>
          <div className="sheet-body max-w-md mx-auto w-full">
            <DrawerTitle className="sheet-title">Editar Setor</DrawerTitle>
            <DrawerDescription className="mt-2">
              Altere o nome e o tom de cor deste setor no seu funil.
            </DrawerDescription>

            <label className="field-label mt-6">
              Nome do setor
              <input
                className="text-field"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Nome do setor..."
                maxLength={40}
              />
            </label>

            <p className="text-xs text-muted-foreground mt-5">Cor do setor</p>
            <div className="color-options">
              {tones.map(t => (
                <Button
                  key={t}
                  size="icon"
                  className={`color-swatch tone-${t} ${editTone === t ? 'selected' : ''}`}
                  aria-label={`Cor ${t}`}
                  onClick={() => setEditTone(t)}
                >
                  {editTone === t && <Check size={13} />}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-6">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setEditingSector(null)}
              >
                Cancelar
              </Button>
              <Button
                disabled={!editName.trim()}
                className="primary-action w-1/2"
                onClick={confirmEditSector}
              >
                Salvar alterações
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* 3. MODAL / DRAWER: EXCLUIR SETOR */}
      <Drawer
        open={Boolean(deletingSector)}
        onOpenChange={v => {
          if (!v) setDeletingSector(null);
        }}
      >
        <DrawerContent>
          <div className="sheet-body max-w-md mx-auto w-full">
            <DrawerTitle className="sheet-title text-destructive flex items-center gap-2">
              <Trash2 size={18} />
              Excluir Setor
            </DrawerTitle>
            <DrawerDescription className="mt-2">
              Você tem certeza que deseja excluir o setor{' '}
              <strong className="text-foreground font-semibold">"{deletingSector?.name}"</strong>?
            </DrawerDescription>

            {ideasInDeletingSector.length > 0 ? (
              <div className="mt-5 p-4 rounded-xl border border-amber/30 bg-amber/10 space-y-3">
                <p className="text-xs font-medium text-amber-500 flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  Este setor possui {ideasInDeletingSector.length} ideia(s) vinculada(s).
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para não perder suas ideias, escolha para qual setor deseja movê-las:
                </p>
                <label className="field-label mt-2">
                  Destino das ideias:
                  <select
                    className="text-field"
                    value={reassignSectorId}
                    onChange={e => setReassignSectorId(e.target.value)}
                  >
                    {data.sectors
                      .filter(s => s.id !== deletingSector?.id)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    <option value="geral">Geral (Sem setor)</option>
                  </select>
                </label>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-4">
                Este setor está vazio e não possui nenhuma ideia vinculada.
              </p>
            )}

            <div className="flex items-center gap-2 mt-6">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setDeletingSector(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-1/2"
                onClick={confirmDeleteSector}
              >
                Excluir definitivamente
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* 4. MODAL / DRAWER: LISTA DE MODELOS PRONTOS */}
      <Drawer open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
        <DrawerContent className="max-h-[92vh]">
          <div className="sheet-body max-w-2xl mx-auto w-full space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="sheet-title flex items-center gap-2">
                  <Sparkles size={18} className="text-amber" />
                  Modelos Prontos de Setores
                </DrawerTitle>
                <DrawerDescription className="mt-1">
                  Comece instantaneamente com setores inspiradores e ideias já desenhadas para agir.
                </DrawerDescription>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {READY_SECTOR_TEMPLATES.map(tmpl => {
                const Icon = getTemplateIcon(tmpl.iconName);
                const isAlreadyAdded = data.sectors.some(
                  s => s.name.toLowerCase() === tmpl.name.toLowerCase()
                );

                return (
                  <div
                    key={tmpl.id}
                    className={`p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between group tone-${tmpl.tone}`}
                    onClick={() => {
                      setPreviewTemplate(tmpl);
                      setIncludeStarterIdeas(true);
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-lg bg-secondary border border-border text-foreground group-hover:scale-105 transition-transform">
                          <Icon size={18} />
                        </span>
                        {isAlreadyAdded ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green/10 text-green border border-green/20">
                            Já adicionado
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            3 Ideias Inclusas
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mt-3 group-hover:text-primary transition-colors">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <Button size="sm" variant="outline" className="mt-4 w-full h-8 text-xs gap-1">
                      <Plus size={13} />
                      Explorar ideias do modelo
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* 5. MODAL / DRAWER: PREVIEW DO MODELO SELECIONADO */}
      <Drawer
        open={Boolean(previewTemplate)}
        onOpenChange={v => {
          if (!v) setPreviewTemplate(null);
        }}
      >
        <DrawerContent className="max-h-[92vh]">
          <div className="sheet-body max-w-xl mx-auto w-full space-y-5">
            {previewTemplate && (
              <>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary tracking-wider">
                    <Wand2 size={14} />
                    MODELO RECOMENDADO
                  </div>
                  <DrawerTitle className="sheet-title mt-1.5">{previewTemplate.name}</DrawerTitle>
                  <DrawerDescription className="mt-1">
                    {previewTemplate.description}
                  </DrawerDescription>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ideias Inclusas neste Modelo ({previewTemplate.starterIdeas.length})
                    </h3>
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {previewTemplate.starterIdeas.map((idea, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-border bg-card/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-medium text-foreground">
                            {idea.title}
                          </strong>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              idea.priority === 'Urgente'
                                ? 'bg-pink/10 text-pink'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {idea.priority}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{idea.summary}</p>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                          <CheckCircle2 size={12} className="text-green" />
                          <span>{idea.steps.length} passos estruturados ({idea.minutes} min)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-primary h-4 w-4 rounded"
                    checked={includeStarterIdeas}
                    onChange={e => setIncludeStarterIdeas(e.target.checked)}
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-foreground">
                      Adicionar as {previewTemplate.starterIdeas.length} ideias modelo ao meu funil
                    </span>
                    <span className="text-muted-foreground">
                      Você pode editá-las ou adaptá-las livremente a qualquer momento.
                    </span>
                  </div>
                </label>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-1/3"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Voltar
                  </Button>
                  <Button
                    className="primary-action w-2/3"
                    onClick={() => handleAdoptTemplate(previewTemplate, includeStarterIdeas)}
                  >
                    <Plus size={16} />
                    {includeStarterIdeas ? 'Criar Setor com Ideias' : 'Criar Setor Vazio'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 6. DASHBOARD EXCLUSIVO DO SETOR SELECIONADO */}
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

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <DrawerTitle className="sheet-title">{selectedSector.name}</DrawerTitle>
                    <DrawerDescription className="mt-1">
                      {selectedAnalytics.healthMessage}
                    </DrawerDescription>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => openEditModal(selectedSector)}
                    >
                      <Pencil size={13} />
                      Editar setor
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteModal(selectedSector)}
                    >
                      <Trash2 size={13} />
                      Excluir setor
                    </Button>
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