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
  const [stage, setStage] = useState<'wave' | 'logo' | 'fadeout'>('wave');
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [clickSparks, setClickSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mascotWink, setMascotWink] = useState(false);

  // Bolhas divertidas flutuantes para o usuário interagir e estourar
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([
    { id: 1, icon: Lightbulb, label: 'Faísca', color: 'text-amber-500', bg: 'bg-amber-100/90 border-amber-300', x: 12, y: 22, size: 48, popped: false, delay: '0s' },
    { id: 2, icon: Rocket, label: 'Foco', color: 'text-cyan-500', bg: 'bg-cyan-100/90 border-cyan-300', x: 80, y: 18, size: 52, popped: false, delay: '0.4s' },
    { id: 3, icon: Zap, label: 'Energia', color: 'text-yellow-500', bg: 'bg-yellow-100/90 border-yellow-300', x: 10, y: 68, size: 44, popped: false, delay: '0.8s' },
    { id: 4, icon: Heart, label: 'Saúde', color: 'text-rose-500', bg: 'bg-rose-100/90 border-rose-300', x: 82, y: 65, size: 48, popped: false, delay: '0.2s' },
    { id: 5, icon: Trophy, label: 'Realidade', color: 'text-emerald-500', bg: 'bg-emerald-100/90 border-emerald-300', x: 74, y: 40, size: 46, popped: false, delay: '0.6s' },
    { id: 6, icon: Sparkles, label: 'Ideia', color: 'text-violet-500', bg: 'bg-violet-100/90 border-violet-300', x: 18, y: 44, size: 42, popped: false, delay: '1s' },
  ]);

  useEffect(() => {
    // Progresso suave
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 1.5;
      });
    }, 40);

    // Ciclo de frases divertidas
    const phraseInterval = setInterval(() => {
      setPhraseIndex(idx => (idx + 1) % FUN_PHRASES.length);
    }, 900);

    // Piscada do mascote
    const winkInterval = setInterval(() => {
      setMascotWink(true);
      setTimeout(() => setMascotWink(false), 300);
    }, 1400);

    // Etapas da transição sem vazamento de fundo
    const t1 = setTimeout(() => setStage('logo'), 400);
    const t2 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
      clearInterval(winkInterval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  // Estourar bolha com feedback interativo
  const handlePopBubble = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBubbles(prev =>
      prev.map(b => (b.id === id ? { ...b, popped: true } : b))
    );
    setPoppedCount(c => c + 1);

    // Adiciona faísca no clique
    const rect = e.currentTarget.getBoundingClientRect();
    const sparkId = Date.now() + Math.random();
    setClickSparks(sp => [
      ...sp,
      { id: sparkId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    ]);
    setTimeout(() => {
      setClickSparks(sp => sp.filter(s => s.id !== sparkId));
    }, 800);
  };

  // Efeito ao clicar no fundo
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const sparkId = Date.now() + Math.random();
    setClickSparks(sp => [
      ...sp,
      { id: sparkId, x: e.clientX, y: e.clientY },
    ]);
    setTimeout(() => {
      setClickSparks(sp => sp.filter(s => s.id !== sparkId));
    }, 800);
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-slate-900 select-none overflow-hidden cursor-crosshair"
    >
      {/* Círculos de pulso coloridos no fundo */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-[380px] h-[380px] sm:w-[600px] sm:h-[600px] rounded-full bg-cyan-200/40 animate-ping opacity-30" />
        <div className="absolute w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] rounded-full bg-violet-200/50 animate-pulse" />
        <div className="absolute w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] rounded-full bg-amber-100/60 animate-spin opacity-40" />
      </div>

      {/* Faíscas de clique do usuário */}
      {clickSparks.map(s => (
        <div
          key={s.id}
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 animate-out zoom-out-150 fade-out duration-700 flex items-center justify-center"
          style={{ left: s.x, top: s.y }}
        >
          <div className="relative">
            <span className="text-2xl animate-bounce">✨</span>
            <span className="absolute -top-3 -right-3 text-xs font-bold text-amber-500 bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs">
              +1!
            </span>
          </div>
        </div>
      ))}

      {/* Bolhas interativas flutuantes na tela */}
      {bubbles.map(bubble => {
        if (bubble.popped) return null;
        const IconComponent = bubble.icon;
        return (
          <button
            key={bubble.id}
            type="button"
            onClick={e => handlePopBubble(e, bubble.id)}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              animationDelay: bubble.delay,
            }}
            className={`absolute z-20 flex flex-col items-center justify-center p-2 rounded-2xl border ${bubble.bg} shadow-lg shadow-black/5 hover:scale-125 active:scale-90 transition-all duration-300 animate-bounce cursor-pointer group`}
            title="Toque para estourar a faísca!"
          >
            <IconComponent size={22} className={`${bubble.color} group-hover:rotate-12 transition-transform`} />
            <span className="text-[10px] font-bold text-slate-700 mt-0.5 opacity-80 group-hover:opacity-100">
              {bubble.label}
            </span>
          </button>
        );
      })}

      {/* Contador divertido de bolhas estouradas */}
      {poppedCount > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-300 shadow-md flex items-center gap-1.5 text-xs font-bold text-amber-600 animate-in zoom-in-75 duration-200">
          <PartyPopper size={14} className="text-amber-500" />
          <span>{poppedCount} {poppedCount === 1 ? 'faísca capturada!' : 'faíscas capturadas!'}</span>
        </div>
      )}

      {/* Conteúdo Central */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Mascote Interativo da Faísca com Carinha e Expressão Animada */}
        <div
          onClick={e => {
            e.stopPropagation();
            setMascotWink(true);
            setPoppedCount(c => c + 1);
            setTimeout(() => setMascotWink(false), 400);
          }}
          className="relative mb-5 cursor-pointer group"
          title="Clique em mim!"
        >
          {/* Caixa do Mascote com gradiente alegre e sombra */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 flex flex-col items-center justify-center text-white shadow-2xl shadow-cyan-500/30 group-hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden">
            {/* Olhos e boca expressiva do mascote da faísca */}
            <div className="flex items-center gap-3.5 mb-1 z-10">
              <span
                className={`w-2.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${
                  mascotWink ? 'scale-y-[0.1] h-1' : 'scale-100'
                }`}
              />
              <span className="w-2.5 h-3.5 bg-white rounded-full" />
            </div>
            {/* Sorriso simpático */}
            <div className="w-4 h-2 border-b-2 border-white rounded-b-full mb-1 z-10" />

            {/* Onda sonora embaixo do mascote */}
            <AudioLines size={20} className="text-white/80 stroke-[2.4] z-10 animate-pulse" />

            {/* Brilho interno animado */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          </div>

          {/* Mini-estrela saltitante na orelha */}
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white shadow-md animate-spin">
            <Sparkles size={14} fill="currentColor" />
          </div>

          {/* Dica interativa flutuante */}
          <span className="absolute -bottom-2 bg-white text-[10px] font-bold text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-200 shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
            Toque em mim! 👆
          </span>
        </div>

        {/* Marca ideaflow com tipografia marcante */}
        <div className="space-y-1 mt-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            idea<span className="text-cyan-600 font-light">flow</span>
            <span className="text-cyan-500">.</span>
          </h1>
          <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase text-[11px]">
            Suas ideias em movimento
          </p>
        </div>

        {/* Frases dinâmicas e divertidas que alternam */}
        <div className="h-9 flex items-center justify-center my-3">
          <p className="text-xs sm:text-sm font-medium text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200/60 shadow-xs animate-in fade-in zoom-in-95 duration-300">
            {FUN_PHRASES[phraseIndex]}
          </p>
        </div>

        {/* Equalizador animado multicolorido */}
        <div className="flex items-center gap-1.5 h-8 my-2">
          {[16, 28, 42, 24, 36, 18, 32, 14].map((height, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-b from-cyan-500 via-sky-500 to-violet-500 animate-pulse"
              style={{
                height: `${height}px`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '650ms',
              }}
            />
          ))}
        </div>

        {/* Barra de progresso vibrante */}
        <div className="w-52 h-2 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200/80 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 rounded-full transition-all duration-75 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Botão para pular intro */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onComplete();
          }}
          className="mt-5 text-xs text-slate-500 hover:text-slate-800 font-semibold py-1.5 px-4 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Entrar direto ➔
        </button>
      </div>
    </div>
  );
}
