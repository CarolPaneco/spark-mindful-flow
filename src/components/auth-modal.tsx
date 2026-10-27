import { useState, useEffect } from 'react';
import {
  AudioLines,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  supabase,
  upsertUserProfile,
} from '@/lib/supabase';
import { useFlow } from '@/components/flow-provider';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ open, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const { data, setData, user } = useFlow();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setErrorMessage(null);
      setForgotSent(false);
      // Pré-preenche o e-mail caso já exista um usuário recente, mas a senha deve ser sempre digitada
      if (user?.email && !email) {
        setEmail(user.email);
      }
      setPassword('');
      setConfirmPassword('');
    }
  }, [open, defaultMode]);

  if (!open) return null;

  // Critérios de validação de senha para cadastro
  const hasLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = hasLength && hasLetter && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. MODO: ESQUECI MINHA SENHA
    if (mode === 'forgot') {
      if (!cleanEmail) {
        setErrorMessage('Informe o e-mail cadastrado.');
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          typeof window !== 'undefined' ? { redirectTo: `${window.location.origin}/` } : {}
        );

        if (error) throw error;

        setForgotSent(true);
        toast.success('Link de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      } catch (err: any) {
        console.error('Erro na recuperação de senha:', err);
        let rawMsg = err?.message || 'Falha ao enviar e-mail de recuperação.';
        const lower = String(rawMsg).toLowerCase();
        let userFriendlyMsg = rawMsg;

        if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
          userFriendlyMsg = 'Limite temporário de envio de e-mails atingido pelo Supabase (máx. 3-4 envios/hora). Aguarde alguns minutos.';
        }
        setErrorMessage(userFriendlyMsg);
        toast.error(userFriendlyMsg, { duration: 6000 });
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. MODO: CADASTRO OU LOGIN
    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Informe e-mail e senha.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Informe seu nome completo para o cadastro.');
        return;
      }
      if (!hasLength) {
        setErrorMessage('A senha deve ter no mínimo 6 dígitos.');
        return;
      }
      if (!hasLetter) {
        setErrorMessage('A senha deve conter pelo menos uma letra.');
        return;
      }
      if (!hasNumber) {
        setErrorMessage('A senha deve conter pelo menos um número.');
        return;
      }
      if (!passwordsMatch) {
        setErrorMessage('As duas senhas digitadas não coincidem.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        // Tenta cadastrar o usuário no Supabase
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              name: name.trim() || 'Criador(a)',
              username: username.trim().toLowerCase() || cleanEmail.split('@')[0],
            },
          },
        });

        // Verificação estrita de e-mail já existente:
        // O usuário determinou: "se tiver conta > no caso email < nao pode criar mais contas mesmo que seja em outro setor"
        const errLower = (signUpError?.message || '').toLowerCase();
        const isAlreadyRegistered =
          errLower.includes('already registered') ||
          errLower.includes('user already exists') ||
          errLower.includes('email address has already been registered') ||
          Boolean(signUpData?.user && Array.isArray(signUpData.user.identities) && signUpData.user.identities.length === 0);

        if (isAlreadyRegistered) {
          const msg = 'Este e-mail já possui uma conta cadastrada. Por segurança, faça login com sua senha.';
          setErrorMessage(msg);
          toast.warning(msg, { duration: 6000 });
          setMode('login');
          setPassword('');
          setConfirmPassword('');
          setLoading(false);
          return;
        }

        if (signUpError) {
          throw signUpError;
        }

        let authUser = signUpData?.user;

        // Se o Supabase não abriu sessão automática imediata, faz o sign in
        if (!signUpData?.session) {
          const loginRes = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });
          if (loginRes.data?.user) {
            authUser = loginRes.data.user;
          }
        }

        if (authUser) {
          // Salva perfil inicial do usuário pessoal
          await upsertUserProfile({
            id: authUser.id,
            name: name.trim() || 'Criador(a)',
            username: username.trim().toLowerCase() || cleanEmail.split('@')[0],
            role: 'Criador(a)',
          }).catch(console.warn);

          setData(prev => ({
            ...prev,
            workspaceMode: 'personal',
          }));

          toast.success('Conta criada com sucesso! ✨');

          // Dispara tutorial
          localStorage.removeItem('ideaflow_tutorial_completed');
          window.dispatchEvent(new Event('ideaflow:tutorial'));

          if (typeof window !== 'undefined') {
            sessionStorage.setItem('ideaflow_session_unlocked', 'true');
          }
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        // MODO LOGIN COM E-MAIL E SENHA PADRÃO
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (signInError) {
          const errLower = (signInError.message || '').toLowerCase();
          if (errLower.includes('invalid login credentials')) {
            throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
          }
          throw signInError;
        }

        if (signInData.user) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('ideaflow_session_unlocked', 'true');
            // Restaura o PIN/senha salvo para este e-mail imediatamente
            const cachedPin = localStorage.getItem(`ideaflow_pin_${cleanEmail}`);
            if (cachedPin) {
              localStorage.setItem('ideaflow_personal_pin', cachedPin);
            }
          }
          toast.success('Login realizado com sucesso! Suas ideias e empresas foram carregadas. 🚀');
          if (onSuccess) onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      let rawMsg = err?.message || 'Falha ao autenticar.';
      const lower = String(rawMsg).toLowerCase();
      let userFriendlyMsg = rawMsg;

      if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
        userFriendlyMsg = 'Limite temporário de envio de e-mails atingido pelo Supabase. Aguarde alguns minutos.';
      } else if (lower.includes('already registered') || lower.includes('user already exists')) {
        userFriendlyMsg = 'Este e-mail já possui uma conta cadastrada. Faça login com sua senha.';
        setMode('login');
      } else if (lower.includes('invalid login credentials')) {
        userFriendlyMsg = 'E-mail ou senha incorretos.';
      }

      setErrorMessage(userFriendlyMsg);
      toast.error(userFriendlyMsg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#090D16] dark:bg-[#07090E] select-none overflow-y-auto animate-in fade-in duration-200">
      {/* Clique fora para fechar (apenas permitido quando já estiver logado) */}
      {user && (
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      )}

      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto p-6 sm:p-8 bg-white dark:bg-card text-slate-900 dark:text-foreground border border-slate-200 dark:border-border rounded-3xl shadow-2xl space-y-4 sm:space-y-5 z-10 animate-in zoom-in-95 duration-200">
        {/* Botão Fechar (apenas permitido quando já estiver logado) */}
        {user && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-secondary dark:hover:bg-secondary/80 text-slate-500 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer z-20 border border-slate-200 dark:border-border"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        )}

        {/* Cabeçalho */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white mb-1 shadow-md shadow-cyan-500/25">
            {mode === 'forgot' ? <KeyRound size={24} /> : <AudioLines size={24} />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-foreground tracking-tight">
            {mode === 'forgot'
              ? 'Recuperar Senha'
              : mode === 'login'
              ? 'Entrar no Ideaflow'
              : 'Criar sua Conta'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed max-w-xs mx-auto font-medium">
            {mode === 'forgot'
              ? 'Digite seu e-mail cadastrado para receber o link de redefinição segura.'
              : mode === 'login'
              ? 'Digite seu e-mail e senha cadastrada para acessar seu espaço seguro.'
              : 'Crie sua conta única de usuário para acessar seus projetos e fundar empresas no app.'}
          </p>
        </div>

        {/* Abas Alternadoras: Entrar vs Criar Conta */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-secondary rounded-2xl border border-slate-200 dark:border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl text-center transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-card text-slate-900 dark:text-foreground shadow-sm font-bold'
                  : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
              }`}
            >
              Entrar com Senha
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl text-center transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-card text-slate-900 dark:text-foreground shadow-sm font-bold'
                  : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* Feedback de erro */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-destructive/15 border border-rose-200 dark:border-destructive/30 text-rose-700 dark:text-destructive text-xs flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* MODO ESQUECI MINHA SENHA: CONFIRMAÇÃO DE ENVIO */}
        {mode === 'forgot' && forgotSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-3 animate-in fade-in-50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={20} />
            </div>
            <p className="font-semibold text-sm">E-mail de recuperação enviado!</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
              Enviamos um link seguro para <strong className="font-mono">{email}</strong>. Clique nele para redefinir sua senha.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold cursor-pointer"
              onClick={() => {
                setMode('login');
                setForgotSent(false);
              }}
            >
              Voltar ao Login
            </Button>
          </div>
        ) : (
          /* FORMULÁRIO DE LOGIN / CADASTRO */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block">
                    Nome Completo *
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon size={16} className="absolute left-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Caroline Martins"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-3.5 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block">
                    Nome de Usuário (@handle)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 text-sm font-mono pointer-events-none">@</span>
                    <input
                      type="text"
                      placeholder="caroline"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-9 pr-3.5 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block">
                E-mail Corporativo ou Pessoal *
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-3.5 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block">
                    Senha de Acesso *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                      }}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-10 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block">
                    Confirmação de Senha *
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repita sua senha"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-10 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Validador visual de senha */}
                <div className="p-3 bg-slate-50 dark:bg-secondary/40 rounded-xl border border-slate-200 dark:border-border space-y-1 text-[11px]">
                  <p className="font-semibold text-slate-700 dark:text-foreground mb-1">Requisitos de segurança:</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <span className={`flex items-center gap-1 ${hasLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      {hasLength ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Mínimo 6 dígitos
                    </span>
                    <span className={`flex items-center gap-1 ${hasLetter ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      {hasLetter ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Pelo menos 1 letra
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      {hasNumber ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Pelo menos 1 número
                    </span>
                    <span className={`flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      {passwordsMatch ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Senhas coincidem
                    </span>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading || (mode === 'register' && !isPasswordValid)}
              className="w-full h-12 bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/25 cursor-pointer transition-all active:scale-[0.99] gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processando...</span>
                </>
              ) : mode === 'forgot' ? (
                <span>Enviar Link de Recuperação</span>
              ) : mode === 'login' ? (
                <>
                  <span>Entrar com Senha</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Criar Minha Conta</span>
                  <Sparkles size={16} />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Rodapé Alternador para Modo 'forgot' */}
        {mode === 'forgot' && !forgotSent && (
          <div className="text-center pt-2 border-t border-slate-200 dark:border-border">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-foreground font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Voltar para tela de login</span>
            </button>
          </div>
        )}

        {/* Dica de Segurança */}
        <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Autenticação protegida via Supabase Auth</span>
        </div>

        {/* Opção secundária para quem quiser navegar offline se ainda não fez login */}
        {!user && (
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-slate-400 dark:text-muted-foreground hover:text-slate-200 dark:hover:text-foreground underline transition-colors cursor-pointer"
            >
              Continuar como visitante (modo offline local)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

