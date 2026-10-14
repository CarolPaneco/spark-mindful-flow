import { useState } from 'react';
import {
  Layers3,
  Sparkles,
  Mic,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TutorialStep {
  title: string;
  badge: string;
  description: string;
  tip: string;
  icon: typeof Layers3;
  color: string;
  glowColor: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Funil de Ideias & Etapas',
    badge: 'Organização do Fluxo',
    description:
      'Suas ideias não ficam perdidas. Elas passam por 5 etapas naturais: Faísca ➔ Estrutura ➔ Em Fluxo ➔ Polimento ➔ Realidade.',
    tip: '💡 Dica: No celular, deslize para os lados para ver cada coluna ou toque na etapa superior para pular direto para ela.',
    icon: Layers3,
    color: 'text-cyan',
    glowColor: 'from-cyan/20 to-cyan/5 border-cyan/40',
  },
  {
    title: 'Mentor IA Oficial do App',
    badge: 'Inteligência Fixa',
    description:
      'No topo da tela, toque em "Mentor IA" a qualquer momento para conversar com a inteligência do Ideaflow.',
    tip: '💡 Dica: Peça planos de 4 passos, tire dúvidas de culinária, reformas, negócios ou técnicas para destravar procrastinação.',
    icon: Sparkles,
    color: 'text-violet',
    glowColor: 'from-violet/20 to-violet/5 border-violet/40',
  },
  {
    title: 'Captura Rápida & Áudio',
    badge: 'Gravação Fácil',
    description:
      'Ideias surgem a qualquer momento. Use o botão central com o microfone para falar ou digitar livremente.',
    tip: '💡 Dica: A IA analisa o que você falou e gera um plano com o primeiro micro-passo de 15 minutos já pronto.',
    icon: Mic,
    color: 'text-pink',
    glowColor: 'from-pink/20 to-pink/5 border-pink/40',
  },
  {
    title: 'Meu Dia & Blocos de Foco',
    badge: 'Ação com Intenção',
    description:
      'Acesse a aba "Hoje" para planejar o que vai realizar nos blocos da Manhã, Tarde e Noite, com cronômetro de foco integrado.',
    tip: '💡 Dica: Foque em apenas 1 ou 2 passos por dia para evitar ansiedade e avançar com consistência.',
    icon: CalendarDays,
    color: 'text-green',
    glowColor: 'from-green/20 to-green/5 border-green/40',
  },
];

interface OnboardingTutorialProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingTutorial({ open, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!open) return null;

  const step = tutorialSteps[currentStep];
  const isLast = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(0, s - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Clique fora */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-card border border-border/80 rounded-3xl shadow-2xl space-y-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Topo do Card com indicador e botão Pular */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25">
              Passo {currentStep + 1} de {tutorialSteps.length}
            </span>
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Tutorial Rápido
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            title="Pular tutorial e começar a usar"
          >
            <span>Pular Tutorial</span>
            <X size={14} />
          </button>
        </div>

        {/* Conteúdo do Passo */}
        <div className="space-y-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.glowColor} border flex items-center justify-center ${step.color} shadow-sm transition-all`}
          >
            <step.icon size={28} />
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {step.badge}
            </span>
            <h2 className="text-2xl font-display font-bold text-foreground mt-0.5">
              {step.title}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            {step.description}
          </p>

          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/70 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {step.tip}
          </div>
        </div>

        {/* Indicadores de bolinha (Dots) */}
        <div className="flex items-center justify-center gap-2 py-1">
          {tutorialSteps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentStep ? 'w-7 bg-primary' : 'w-2 bg-secondary hover:bg-muted-foreground'
              }`}
              aria-label={`Ir para passo ${i + 1}`}
            />
          ))}
        </div>

        {/* Rodapé com Navegação */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="h-11 px-4 text-xs sm:text-sm rounded-xl gap-1.5 cursor-pointer disabled:opacity-30"
          >
            <ArrowLeft size={16} />
            <span>Anterior</span>
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            className="h-11 px-5 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-primary-foreground gap-1.5 active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
          >
            {isLast ? (
              <>
                <span>Começar a Usar</span>
                <Check size={16} />
              </>
            ) : (
              <>
                <span>Próximo</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

