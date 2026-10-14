import { useState } from 'react';
import {
  AudioLines,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, upsertUserProfile } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ open, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Informe e-mail e senha.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              name: name.trim() || 'Criador(a)',
              username: username.trim().toLowerCase() || cleanEmail.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Salva perfil inicial
          await upsertUserProfile({
            id: data.user.id,
            name: name.trim() || 'Criador(a)',
            username: username.trim().toLowerCase() || cleanEmail.split('@')[0],
            role: 'Criador(a)',
          }).catch(console.warn);

          toast.success('Conta criada com sucesso! Bem-vindo(a) ao Ideaflow! ✨');
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            throw new Error('E-mail ou senha incorretos.');
          }
          throw error;
        }

        if (data.user) {
          toast.success('Login realizado com sucesso! Suas ideias foram sincronizadas.');
          if (onSuccess) onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      setErrorMessage(err?.message || 'Falha ao autenticar.');
      toast.error(err?.message || 'Erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Clique fora para fechar */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto p-5 sm:p-7 bg-card border border-border/80 rounded-3xl shadow-2xl space-y-4 sm:space-y-5 z-10 animate-in zoom-in-95 duration-200">
        {/* Botão X para Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer z-20 shadow-xs"
          aria-label="Fechar"
          title="Fechar e continuar sem entrar"
        >
          <X size={18} />
        </button>

        {/* Cabeçalho */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 text-primary mb-1 shadow-xs">
            <AudioLines size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">
            {mode === 'login' ? 'Entrar no Ideaflow' : 'Criar sua Conta'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {mode === 'login'
              ? 'Acesse suas ideias e projetos sincronizados em qualquer dispositivo.'
              : 'Comece a organizar suas ideias e projetos na nuvem segura gratuita.'}
          </p>
        </div>

        {/* Abas Alternadoras */}
        <div className="grid grid-cols-2 p-1 bg-secondary/70 rounded-2xl border border-border/60">
          <button
            type="button"
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
              mode === 'login'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
              mode === 'register'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
          >
            Criar Conta
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Seu Nome
                </label>
                <div className="relative flex items-center">
                  <UserIcon
                    size={18}
                    className="absolute left-3.5 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Caroline Silva"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-secondary/35 hover:bg-secondary/50 focus:bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-4 h-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Nome de Usuário (@handle)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-muted-foreground text-sm font-mono pointer-events-none">
                    @
                  </span>
                  <input
                    type="text"
                    placeholder="caroline"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-secondary/35 hover:bg-secondary/50 focus:bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-4 h-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              E-mail
            </label>
            <div className="relative flex items-center">
              <Mail
                size={18}
                className="absolute left-3.5 text-muted-foreground pointer-events-none"
              />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary/35 hover:bg-secondary/50 focus:bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-4 h-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Senha
            </label>
            <div className="relative flex items-center">
              <Lock
                size={18}
                className="absolute left-3.5 text-muted-foreground pointer-events-none"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary/35 hover:bg-secondary/50 focus:bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-11 h-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground active:scale-90 transition-transform cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-sm font-bold rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{mode === 'login' ? 'Entrando...' : 'Criando conta...'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Entrar no Ideaflow' : 'Cadastrar e Começar'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>

        {/* Rodapé e Fechar */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green font-medium">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span>Supabase Conectado</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-foreground/80 hover:text-foreground hover:bg-secondary/80 py-1.5 px-3 rounded-xl border border-border transition-colors cursor-pointer"
          >
            Entrar como Convidado
          </button>
        </div>
      </div>
    </div>
  );
}

