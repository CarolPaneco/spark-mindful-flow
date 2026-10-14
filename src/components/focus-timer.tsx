import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Headphones, Volume2, VolumeX } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import { type Idea } from '@/lib/ideaflow';
import { toast } from 'sonner';
export function FocusTimer({ idea, onClose }: { idea: Idea | null; onClose: () => void }) {
  const { setData } = useFlow();
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const end = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => { if (idea) { setSeconds(1500); setMode('focus'); setRunning(false); } }, [idea?.id]);
  useEffect(() => {
    if (!running || !idea) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((end.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        setRunning(false);
        if (mode === 'focus') setData(p => ({ ...p, ideas: p.ideas.map(i => i.id === idea.id ? { ...i, dedicated: i.dedicated + 25 } : i) }));
        if (sound && audio.current) { const context = audio.current; [523.25, 659.25, 783.99].forEach((freq, i) => { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = freq; oscillator.connect(gain); gain.connect(context.destination); const start = context.currentTime + i * 0.25; gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.12, start + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, start + 1); oscillator.start(start); oscillator.stop(start + 1); }); }
        toast.success(mode === 'focus' ? 'Foco concluído! 25 minutos adicionados à sua ideia.' : 'Pausa concluída. Vamos para o próximo passo?');
      }
    }, 250);
    return () => clearInterval(timer);
  }, [running, idea, mode, sound, setData]);
  const toggle = () => { if (!running && seconds > 0) { end.current = Date.now() + seconds * 1000; if (sound) { try { audio.current ??= new AudioContext(); void audio.current.resume(); } catch { /* Timer remains usable without sound */ } } } setRunning(r => seconds > 0 ? !r : false); };
  return <Drawer open={!!idea} onOpenChange={open => { if (!open && (!running || window.confirm('Encerrar esta sessão de foco?'))) { setRunning(false); onClose(); } }}><DrawerContent><div className="sheet-body focus-sheet"><div className="sheet-eyebrow justify-center"><Headphones size={16} />SEU MOMENTO DE FOCO</div><DrawerTitle className="text-center text-xl mt-3">{idea?.title}</DrawerTitle><DrawerDescription className="text-center mt-2">Uma coisa de cada vez. Você está avançando.</DrawerDescription><div className="segmented mt-7"><Button variant="ghost" className={mode === 'focus' ? 'selected' : ''} onClick={() => { setMode('focus'); setRunning(false); setSeconds(1500); }}>Foco · 25 min</Button><Button variant="ghost" className={mode === 'break' ? 'selected' : ''} onClick={() => { setMode('break'); setRunning(false); setSeconds(300); }}>Pausa · 5 min</Button></div><div className="timer-ring"><svg viewBox="0 0 240 240" aria-hidden="true"><circle className="timer-track" cx="120" cy="120" r="108" /><circle className="timer-progress" cx="120" cy="120" r="108" pathLength="100" strokeDasharray={`${seconds / (mode === 'focus' ? 1500 : 300) * 100} 100`} /></svg><div><strong>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</strong><span>{running ? 'EM HIPERFOCO' : seconds === 0 ? 'CONCLUÍDO' : 'RESPIRA. E COMEÇA.'}</span></div></div><div className="flex gap-4 items-center justify-center"><Button variant="ghost" size="icon" aria-label="Reiniciar timer" onClick={() => { setRunning(false); setSeconds(mode === 'focus' ? 1500 : 300); }}><RotateCcw /></Button><Button className="primary-action px-10" onClick={toggle}>{running ? <Pause /> : <Play />}{running ? 'Pausar' : 'Iniciar foco'}</Button><Button variant="ghost" size="icon" aria-label={sound ? 'Desativar som' : 'Ativar som'} onClick={() => setSound(s => !s)}>{sound ? <Volume2 /> : <VolumeX />}</Button></div></div></DrawerContent></Drawer>;
}