import { useEffect, useState } from 'react';
import { AudioLines, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'wave' | 'logo' | 'fadeout'>('wave');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animação de progresso suave
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 2;
      });
    }, 35);

    // Etapas da animação na tela branca
    const t1 = setTimeout(() => setStage('logo'), 600);
    const t2 = setTimeout(() => setStage('fadeout'), 2200);
    const t3 = setTimeout(() => onComplete(), 2600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-slate-900 transition-opacity duration-500 cursor-pointer select-none ${
        stage === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Toque para pular introdução"
    >
      {/* Círculos de pulso decorativos em fundo branco */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full bg-cyan-100/50 animate-ping opacity-25" />
        <div className="absolute w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] rounded-full bg-violet-100/60 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Ícone com animação de onda sonora */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/25 transition-transform duration-700 transform scale-100 hover:scale-105 animate-bounce">
            <AudioLines size={42} className="stroke-[2.2]" />
          </div>

          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white shadow-sm animate-spin">
            <Sparkles size={13} fill="currentColor" />
          </div>
        </div>

        {/* Marca ideaflow com tipografia marcante */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            idea<span className="text-cyan-600 font-light">flow</span>
            <span className="text-cyan-500">.</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase text-[11px] pt-1">
            Suas ideias em movimento
          </p>
        </div>

        {/* Efeito visual de ondas de áudio */}
        <div className="flex items-center gap-1.5 h-8 my-5">
          {[14, 24, 38, 20, 32, 16, 28, 12].map((height, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-b from-cyan-500 to-violet-500 animate-pulse"
              style={{
                height: `${height}px`,
                animationDelay: `${i * 120}ms`,
                animationDuration: '800ms',
              }}
            />
          ))}
        </div>

        {/* Barra de carregamento suave */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onComplete();
          }}
          className="mt-6 text-xs text-slate-400 hover:text-slate-600 font-medium py-1 px-3 rounded-full hover:bg-slate-100 transition-colors"
        >
          Pular
        </button>
      </div>
    </div>
  );
}

