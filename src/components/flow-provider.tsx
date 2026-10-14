import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { seedData, isFlowData, type FlowData, type Idea } from '@/lib/ideaflow';
import { toast } from 'sonner';

interface FlowStore { data: FlowData; setData: React.Dispatch<React.SetStateAction<FlowData>>; updateIdea: (id: string, patch: Partial<Idea>) => void; ready: boolean }
const FlowContext = createContext<FlowStore | null>(null);
export function FlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FlowData>(seedData);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const stored = localStorage.getItem('ideaflow-v1'); if (stored) { const parsed: unknown = JSON.parse(stored); if (isFlowData(parsed)) setData(parsed); else toast.error('O backup local está inválido. Os exemplos foram carregados.'); } } catch { toast.error('Não foi possível ler os dados salvos neste dispositivo.'); }
    setReady(true);
    void import('@/lib/pwa').then(m => m.registerOffline());
  }, []);
  useEffect(() => { if (!ready) return; document.documentElement.classList.toggle('light', data.theme === 'light'); document.documentElement.dataset['palette'] = data.palette; try { localStorage.setItem('ideaflow-v1', JSON.stringify(data)); } catch { toast.error('Não foi possível salvar. Exporte um backup para proteger suas ideias.'); } }, [data, ready]);
  const updateIdea = (id: string, patch: Partial<Idea>) => setData(prev => ({ ...prev, ideas: prev.ideas.map(i => i.id === id ? { ...i, ...patch } : i) }));
  return <FlowContext.Provider value={{ data, setData, updateIdea, ready }}>{children}</FlowContext.Provider>;
}
export function useFlow() { const context = useContext(FlowContext); if (!context) throw new Error('FlowProvider is required'); return context; }