import { useEffect, useState } from 'react';
import { AudioLines, Sparkles, Rocket, Lightbulb, Zap, Heart, Trophy, PartyPopper } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

interface FloatingBubble {
  id: number;
  icon: any;
  label: string;
  color: string;
  bg: string;
  x: number;
  y: number;
  size: number;
  popped: boolean;
  delay: string;
}

const FUN_PHRASES = [
  '💡 Despertando neurônios e ideias geniais...',
  '🚀 Abastecendo foguetes de realização...',
  '☕ Aquecendo o café e alinhando os funis...',
  '⚡ Destruindo a procrastinação em 3, 2, 1...',
  '✨ Quase lá! Preparando seu fluxo consciente...',
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // Progresso fluido
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 2;
      });
    }, 35);

    // Ciclo de frases leves e inspiradoras
    const phraseInterval = setInterval(() => {
      setPhraseIndex(idx => (idx + 1) % FUN_PHRASES.length);
    }, 750);

    // Conclui após 2.2 segundos sem delay desnecessário
    const timer = setTimeout(() => onComplete(), 2200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-slate-900 select-none overflow-hidden">
      {/* Luz ambiente suave de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-cyan-100/40 blur-3xl animate-pulse" />
        <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-violet-100/35 blur-2xl" />
      </div>

      {/* Conteúdo Central */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Ícone da Faísca com Glow e Animação Fluida */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/25 relative overflow-hidden transition-all duration-300">
            <AudioLines size={36} className="text-white stroke-[2.2] animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          </div>

          {/* Brilho orbital sutil */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white shadow-md animate-bounce">
            <Sparkles size={13} fill="currentColor" />
          </div>
        </div>

        {/* Marca ideaflow com tipografia marcante */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            idea<span className="text-cyan-600 font-light">flow</span>
            <span className="text-cyan-500">.</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase text-[11px]">
            Suas ideias em movimento
          </p>
        </div>

        {/* Frases dinâmicas inspiradoras */}
        <div className="h-9 flex items-center justify-center my-3">
          <p className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 px-3.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
            {FUN_PHRASES[phraseIndex]}
          </p>
        </div>

        {/* Barra de progresso vibrante */}
        <div className="w-56 h-2 bg-slate-100 rounded-full overflow-hidden mt-2 border border-slate-200/80 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 rounded-full transition-all duration-75 shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Botão sutil para pular intro se desejar */}
        <button
          type="button"
          onClick={() => onComplete()}
          className="mt-6 text-xs text-slate-400 hover:text-slate-700 font-semibold py-1.5 px-4 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
        >
          Entrar direto ➔
        </button>
      </div>
    </div>
  );
}
