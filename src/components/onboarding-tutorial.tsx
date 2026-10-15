import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Layers3,
  Sparkles,
  Mic,
  CalendarDays,
  Shapes,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Target,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TourStep {
  target: 'funil' | 'hoje' | 'setores' | 'mentor' | 'capture';
  route?: '/' | '/hoje' | '/setores';
  title: string;
  badge: string;
  description: string;
  tip: string;
  icon: typeof Layers3;
  color: string;
  glowColor: string;
}

const tourSteps: TourStep[] = [
  {
    target: 'funil',
    route: '/',
    title: 'O Funil de 5 Estágios',
    badge: 'Passo 1 de 5 · O Fluxo Principal',
    description:
      'Suas ideias não ficam perdidas em listas estáticas. Elas evoluem de forma natural por 5 etapas: Faísca (ideia bruta) ➔ Estrutura ➔ Em Fluxo ➔ Ajustes ➔ Realidade (concluída!).',
    tip: '💡 Dica: Arraste os cards para frente conforme realiza os passos, ou toque em qualquer card para ver o dashboard individual.',
    icon: Layers3,
    color: 'text-cyan',
    glowColor: 'from-cyan/25 to-cyan/5 border-cyan/40',
  },
  {
    target: 'hoje',
    route: '/hoje',
    title: 'Meu Dia & Blocos de Foco',
    badge: 'Passo 2 de 5 · Gestão do Tempo',
    description:
      'Planeje suas ações do dia divididas em Manhã, Tarde e Noite. Toque em "Começar Foco" em qualquer ideia para ativar o cronômetro consciente de 25 minutos sem distrações.',
    tip: '💡 Dica: Foque em apenas 1 ou 2 passos por dia para manter a mente leve e avançar com consistência real.',
    icon: CalendarDays,
    color: 'text-green',
    glowColor: 'from-green/25 to-green/5 border-green/40',
  },
  {
    target: 'setores',
    route: '/setores',
    title: 'Seus Setores & Modelos Prontos',
    badge: 'Passo 3 de 5 · Primeira Missão',
    description:
      'Seus universos de realização (Tecnologia, Relacionamento, Saúde, Negócios...). Sua primeira missão é criar ou escolher seu primeiro setor através dos nossos modelos prontos com ideias inspiradoras!',
    tip: '💡 Dica: Você pode criar, alterar cores/nomes ou excluir setores a qualquer momento com total liberdade.',
    icon: Shapes,
    color: 'text-violet',
    glowColor: 'from-violet/25 to-violet/5 border-violet/40',
  },
  {
    target: 'mentor',
    title: 'Mentor IA em Tempo Real',
    badge: 'Passo 4 de 5 · Copiloto Inteligente',
    description:
      'Seu copiloto de alta performance e acolhimento humano. Ele estuda seus funis em tempo real, ajuda a destravar procrastinação, sugere planos de MVP e oferece acolhimento emocional quando você precisar.',
    tip: '💡 Dica: Toque no botão brilhante "Mentor IA" no topo sempre que quiser conselhos, tirar dúvidas ou desabafar.',
    icon: Sparkles,
    color: 'text-amber',
    glowColor: 'from-amber/25 to-amber/5 border-amber/40',
  },
  {
    target: 'capture',
    title: 'Captura Imediata por Voz ou Texto',
    badge: 'Passo 5 de 5 · Esvazie a Mente',
    description:
      'Teve uma faísca ou lembrança? Toque no botão central com microfone para falar ou digitar em 10 segundos. A inteligência artificial estrutura o primeiro micro-passo de 15 minutos para você!',
    tip: '💡 Dica: Tirar da cabeça e colocar no Ideaflow libera sua mente para viver com foco e presença.',
    icon: Mic,
    color: 'text-pink',
    glowColor: 'from-pink/25 to-pink/5 border-pink/40',
  },
];

interface OnboardingTutorialProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingTutorial({ open, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const navigate = useNavigate();

  const step = tourSteps[currentStep];
  const isLast = currentStep === tourSteps.length - 1;

  // Atualiza posição do elemento focado e navega para a aba certa
  useEffect(() => {
    if (!open || !step) return;

    if (step.route) {
      void navigate({ to: step.route });
    }

    const updateSpotlight = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        setSpotlightRect(el.getBoundingClientRect());
      } else {
        setSpotlightRect(null);
      }
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight, true);
    const timer = setTimeout(updateSpotlight, 150);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight, true);
      clearTimeout(timer);
    };
  }, [open, currentStep, step?.target, step?.route, navigate]);

  if (!open || !step) return null;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('ideaflow_tutorial_completed', 'true');
      toast.success('Tour concluído! Bem-vindo(a) ao seu novo espaço de realização ✨');
      onClose();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(0, s - 1));
  };

  const handleSkip = () => {
    localStorage.setItem('ideaflow_tutorial_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* 1. MÁSCARA COM HOLOFOTE CIRÚRGICO SOBRE O ELEMENTO DESTACADO */}
      {spotlightRect ? (
        <div
          className="fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out tour-spotlight-active"
          style={{
            top: `${Math.max(0, spotlightRect.top - 8)}px`,
            left: `${Math.max(0, spotlightRect.left - 8)}px`,
            width: `${spotlightRect.width + 16}px`,
            height: `${spotlightRect.height + 16}px`,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75), 0 0 35px var(--primary)',
            border: '2px solid var(--primary)',
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-slate-950/75 dark:bg-[#05070C]/85 backdrop-blur-xs transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Clique fora suave para avançar */}
      <div className="fixed inset-0 pointer-events-auto" onClick={handleNext} aria-hidden="true" />

      {/* 2. CARD FLUTUANTE DO TOUR */}
      <div
        className="fixed z-50 pointer-events-auto transition-all duration-300 ease-out left-1/2 -translate-x-1/2 bottom-28 sm:bottom-32 w-[92%] max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7 bg-white dark:bg-[#0F121C] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/90 space-y-5 animate-in zoom-in-95 duration-200">
          {/* Topo: Indicador de Passo e Botão Pular */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/25">
                {step.badge}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              title="Pular tour e começar a usar"
            >
              <span>Pular Tour</span>
              <X size={14} />
            </button>
          </div>

          {/* Conteúdo do Passo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.glowColor} border flex items-center justify-center ${step.color} shadow-sm shrink-0`}
              >
                <step.icon size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
                {step.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
              {step.description}
            </p>

            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80 text-xs text-muted-foreground leading-relaxed">
              {step.tip}
            </div>
          </div>

          {/* Rodapé com Navegação */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
            {/* Indicador de progresso em bolinhas */}
            <div className="flex items-center gap-1.5">
              {tourSteps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStep
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                  }`}
                  aria-label={`Ir para passo ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-9 px-3 text-xs gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Anterior</span>
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleNext}
                className="h-9 px-4 text-xs font-semibold gap-1.5 primary-action"
              >
                <span>{isLast ? 'Concluir Tour!' : 'Próximo'}</span>
                {isLast ? <Check size={14} /> : <ArrowRight size={14} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
