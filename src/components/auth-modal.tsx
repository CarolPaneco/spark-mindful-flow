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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-card border border-border/80 rounded-2xl shadow-2xl space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 text-primary mb-1 shadow-xs">
            <AudioLines size={24} />
          </div>
          <h2 className="text-2xl font-display font-semibold text-foreground tracking-tight">
            {mode === 'login' ? 'Entrar no Ideaflow' : 'Criar sua Conta'}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {mode === 'login'
              ? 'Acesse suas ideias e projetos sincronizados em qualquer dispositivo.'
              : 'Comece a organizar suas ideias e projetos na nuvem segura gratuita.'}
          </p>
        </div>

        {/* Abas Alternadoras */}
        <div className="flex p-1 bg-secondary/60 rounded-xl border border-border/60">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-card text-foreground shadow-xs font-semibold'
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
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-card text-foreground shadow-xs font-semibold'
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
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Seu Nome
                </label>
                <div className="relative">
                  <UserIcon
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Caroline Silva"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="text-field text-xs pl-9 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Nome de Usuário (@handle)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    placeholder="caroline"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="text-field text-xs pl-8 py-2.5"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="text-field text-xs pl-9 py-2.5"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="text-field text-xs pl-9 pr-9 py-2.5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full primary-action h-11 text-xs font-semibold gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              <>
                {mode === 'login' ? 'Entrar no Ideaflow' : 'Cadastrar e Começar'}
                <ArrowRight size={15} />
              </>
            )}
          </Button>
        </form>

        {/* Rodapé e Fechar */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-[11px] text-green">
            <ShieldCheck size={13} />
            <span>Banco de dados seguro Supabase</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xs cursor-pointer underline"
          >
            Continuar offline
          </button>
        </div>
      </div>
    </div>
  );
}

