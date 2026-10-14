import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Moon,
  Play,
  Plus,
  Sun,
  Sunset,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CalendarCheck,
  CalendarRange,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { FocusTimer } from '@/components/focus-timer';
import { IdeaDetail } from '@/components/idea-detail';
import {
  formatMinutes,
  localDate,
  createGoogleCalendarUrl,
  type DayBlock,
  type Idea,
} from '@/lib/ideaflow';
import { toast } from 'sonner';

export const Route = createFileRoute('/hoje')({
  head: () => ({
    meta: [
      { title: 'Meu dia & Calendário · Ideaflow' },
      {
        name: 'description',
        content: 'Planeje sua rotina por blocos ou pelo calendário interativo e execute o que importa.',
      },
      { property: 'og:title', content: 'Meu dia & Calendário · Ideaflow' },
      { property: 'og:description', content: 'Uma rotina com intenção, espaço e foco.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Today,
});

const blocks: { name: DayBlock; icon: typeof Sun; tone: string }[] = [
  { name: 'Manhã', icon: Sun, tone: 'amber' },
  { name: 'Tarde', icon: Sunset, tone: 'pink' },
  { name: 'Noite', icon: Moon, tone: 'cyan' },
];

function Today() {
  const { data, updateIdea } = useFlow();
  const [viewMode, setViewMode] = useState<'blocks' | 'calendar'>('blocks');
  const [date, setDate] = useState('');
  const [dateText, setDateText] = useState('Hoje é um bom dia para começar.');
  const [focus, setFocus] = useState<Idea | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  // Estados para navegação do calendário
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const todayStr = localDate();
    setDate(todayStr);
    setDateText(
      new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    );
  }, []);

  const scheduled = date ? data.ideas.filter(i => !i.archived && i.day === date) : [];
  const ready = data.ideas.filter(i => !i.archived && i.stage > 0 && i.stage < 4 && i.day !== date);

  // Lógica para montar a matriz de dias do calendário
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const monthName = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const handleReschedulePending = () => {
    const todayStr = localDate();
    const overdue = data.ideas.filter(i => !i.archived && i.day && i.day < todayStr && i.stage < 4);
    if (overdue.length === 0) {
      toast.info('Nenhuma ideia pendente de dias anteriores.');
      return;
    }
    overdue.forEach(i => {
      updateIdea(i.id, { day: todayStr });
    });
    toast.success(`${overdue.length} ideia(s) reagendada(s) para hoje!`);
  };

  return (
    <>
      {/* Cabeçalho da Página com Alternador de Visão */}
      <div className="page-heading">
        <div>
          <h1>
            Meu dia, <span>com intenção.</span>
          </h1>
          <p className="page-subtitle capitalize">{dateText}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="segmented p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 text-xs gap-1.5 ${viewMode === 'blocks' ? 'selected' : ''}`}
              onClick={() => setViewMode('blocks')}
            >
              <Sun size={13} />
              Blocos do Dia
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 text-xs gap-1.5 ${viewMode === 'calendar' ? 'selected' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarRange size={13} />
              Calendário Mensal
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas do Dia Selecionado */}
      <div className="day-metrics">
        <div>
          <strong className="text-primary">
            {formatMinutes(scheduled.reduce((n, i) => n + i.minutes, 0))}
          </strong>
          <span>Tempo planejado ({date === localDate() ? 'Hoje' : date})</span>
        </div>
        <div>
          <strong className="text-green">
            {formatMinutes(scheduled.reduce((n, i) => n + i.dedicated, 0))}
          </strong>
          <span>Tempo dedicado às ideias</span>
        </div>
        <div>
          <strong>{scheduled.length}</strong>
          <span>Ideias programadas</span>
        </div>
      </div>

      {/* MODO 1: VISÃO CALENDÁRIO INTERATIVO */}
      {viewMode === 'calendar' && (
        <section className="p-5 rounded-xl border border-border bg-card space-y-4 mb-8">
          {/* Controles de Mês */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-primary" size={20} />
              <h2 className="font-display font-medium text-lg capitalize">{monthName}</h2>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  const now = new Date();
                  setCalendarMonth(now.getMonth());
                  setCalendarYear(now.getFullYear());
                  setDate(localDate());
                }}
              >
                Mês Atual
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Grid de Dias da Semana */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs text-muted-foreground pb-1 border-b border-border/60">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Dias do Mês */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Espaços em branco antes do dia 1 */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="h-16 rounded-md bg-secondary/15 opacity-30" />
            ))}

            {/* Dias do Mês Atual */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const formattedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = date === formattedDate;
              const isToday = formattedDate === localDate();
              const dayIdeas = data.ideas.filter(idea => !idea.archived && idea.day === formattedDate);

              return (
                <button
                  key={formattedDate}
                  onClick={() => setDate(formattedDate)}
                  className={`h-16 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : isToday
                        ? 'border-primary/50 bg-secondary/40'
                        : 'border-border/60 bg-card hover:border-border hover:bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-medium ${
                        isToday ? 'text-primary font-bold' : isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isToday && <span className="text-[9px] text-primary font-semibold">Hoje</span>}
                  </div>

                  {dayIdeas.length > 0 && (
                    <div className="flex items-center gap-1 overflow-hidden">
                      <span className="text-[10px] font-mono px-1 rounded bg-primary/20 text-primary font-semibold">
                        {dayIdeas.length} {dayIdeas.length === 1 ? 'ideia' : 'ideias'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Barra de Ações Rápidas do Calendário */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              Dia selecionado no calendário:{' '}
              <strong className="text-foreground">{date || 'Nenhum'}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleReschedulePending}
            >
              <CalendarCheck size={13} />
              Reagendar pendentes do passado para hoje
            </Button>
          </div>
        </section>
      )}

      {/* MODO 2: VISÃO EM BLOCOS (MANHÃ / TARDE / NOITE) */}
      <div className="day-blocks">
        {blocks.map(block => {
          const blockIdeas = scheduled.filter(i => i.block === block.name);
          return (
            <section key={block.name}>
              <div className={`day-block-heading tone-${block.tone}`}>
                <block.icon className={`text-${block.tone}`} size={20} />
                <h2>{block.name}</h2>
                <small>
                  {formatMinutes(blockIdeas.reduce((n, i) => n + i.minutes, 0))}
                </small>
              </div>

              {blockIdeas.map(i => (
                <div className="scheduled-item" key={i.id}>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 whitespace-normal text-left"
                    onClick={() => setDetail(i.id)}
                  >
                    <h3>{i.title}</h3>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {formatMinutes(i.minutes)} planejados · {formatMinutes(i.dedicated)} dedicados
                  </p>

                  <div className="schedule-controls">
                    <select
                      aria-label={`Horário: ${i.title}`}
                      value={i.block}
                      onChange={e => updateIdea(i.id, { block: e.target.value as DayBlock })}
                    >
                      {blocks.map(b => (
                        <option key={b.name}>{b.name}</option>
                      ))}
                    </select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary"
                      aria-label={`Focar em ${i.title}`}
                      title="Começar sessão de foco"
                      onClick={() => setFocus(i)}
                    >
                      <Play />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      title="Abrir no Google Agenda"
                      onClick={() => window.open(createGoogleCalendarUrl(i), '_blank')}
                    >
                      <ExternalLink size={14} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      aria-label={`Remover do dia: ${i.title}`}
                      title="Remover deste dia"
                      onClick={() => updateIdea(i.id, { day: undefined, block: undefined })}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              ))}

              {!blockIdeas.length && (
                <p className="day-empty">Espaço livre para o que importa.</p>
              )}
            </section>
          );
        })}
      </div>

      {/* Seção de Ideias Prontas no Funil */}
      <section className="ready-ideas">
        <div className="flex items-center justify-between mb-2">
          <h2 className="section-heading">Ideias prontas no funil</h2>
          <span className="text-xs text-muted-foreground">
            {ready.length} ideias aguardando execução
          </span>
        </div>

        {ready.map(i => (
          <div key={i.id} className="ready-row">
            <div>
              <h3>{i.title}</h3>
              <p>
                {data.sectors.find(s => s.id === i.sector)?.name} · {formatMinutes(i.minutes)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!date}
                onClick={() => {
                  updateIdea(i.id, { day: date, block: 'Manhã' });
                  toast.success(`Ideia agendada para ${date === localDate() ? 'hoje' : date}!`);
                }}
              >
                <Plus size={13} />
                Agendar para {date === localDate() ? 'hoje' : date}
              </Button>
            </div>
          </div>
        ))}

        {!ready.length && (
          <p className="day-empty">Tudo no lugar. Suas ideias já têm espaço hoje.</p>
        )}
      </section>

      <FocusTimer idea={focus} onClose={() => setFocus(null)} />
      <IdeaDetail ideaId={detail} onClose={() => setDetail(null)} onFocus={setFocus} />
    </>
  );
}