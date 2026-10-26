import { useState } from 'react';
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
  Building2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  supabase,
  upsertUserProfile,
  loadCompanyByCode,
  createCompanyJoinRequest,
  createCompanyInSupabase,
} from '@/lib/supabase';
import { createCustomCompanyWorkspace, defaultCompanySectors } from '@/lib/ideaflow';
import { useFlow } from '@/components/flow-provider';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ open, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const { setData } = useFlow();
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

  // Escolha do perfil inicial ao criar conta
  const [accountType, setAccountType] = useState<'personal' | 'join_company' | 'create_company'>('personal');
  const [companyCode, setCompanyCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');

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
          userFriendlyMsg = 'Limite temporário de envio de e-mails atingido pelo Supabase (máx. 3-4 envios/hora). Aguarde alguns minutos ou desative a confirmação de e-mail no painel do Supabase.';
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

      if (accountType === 'join_company') {
        const cleanCode = companyCode.trim().toUpperCase();
        if (!cleanCode) {
          setErrorMessage('Informe o código da empresa fornecido pelo Key User.');
          return;
        }
      }

      if (accountType === 'create_company') {
        if (!newCompanyName.trim()) {
          setErrorMessage('Informe o nome da sua empresa / startup.');
          return;
        }
      }
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        // Validação antecipada do código de empresa se for entrar com código
        if (accountType === 'join_company') {
          const cleanCode = companyCode.trim().toUpperCase();
          const remoteComp = await loadCompanyByCode(cleanCode);
          if (!remoteComp && cleanCode !== 'ACME-2026') {
            setErrorMessage(`Código corporativo "${cleanCode}" não foi encontrado no Supabase. Verifique com seu Key User.`);
            setLoading(false);
            return;
          }
        }

        let authUser: any = null;
        let registerError: any = null;

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

        if (error) {
          const errLower = (error.message || '').toLowerCase();
          const isRateLimit = errLower.includes('rate limit') || errLower.includes('over_email_send_rate_limit');
          const isAlready = errLower.includes('already registered');

          // Tenta entrar diretamente caso a conta já tenha sido criada no Supabase
          if (isRateLimit || isAlready) {
            const loginRes = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPassword,
            });
            if (loginRes.data?.user) {
              authUser = loginRes.data.user;
            } else {
              registerError = error;
            }
          } else {
            registerError = error;
          }
        } else {
          authUser = data?.user;
          // Se o Supabase não criou sessão imediata, faz o login direto sem precisar checar e-mail
          if (!data.session) {
            const loginRes = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPassword,
            });
            if (loginRes.data?.user) {
              authUser = loginRes.data.user;
            }
          }
        }

        if (registerError) throw registerError;

        if (authUser) {
          // Salva perfil inicial
          const userRole = accountType === 'create_company' ? 'Key User & Fundador(a)' : 'Criador(a)';
          await upsertUserProfile({
            id: authUser.id,
            name: name.trim() || 'Criador(a)',
            username: username.trim().toLowerCase() || cleanEmail.split('@')[0],
            role: userRole,
          }).catch(console.warn);

          // Configura o workspace conforme a escolha do usuário
          if (accountType === 'create_company') {
            const newWorkspace = createCustomCompanyWorkspace(
              newCompanyName.trim(),
              'Tecnologia & Inovação',
              name.trim() || 'Key User Fundador',
              cleanEmail,
              authUser.id
            );
            await createCompanyInSupabase(newWorkspace, authUser.id);
            setData(prev => ({
              ...prev,
              workspaceMode: 'business',
              companyWorkspace: newWorkspace,
            }));
            toast.success(`Empresa "${newWorkspace.name}" fundada! Você é o Key User. Código: ${newWorkspace.shareCode} 👑`, { duration: 6000 });
          } else if (accountType === 'join_company') {
            const cleanCode = companyCode.trim().toUpperCase();
            const remoteComp = await loadCompanyByCode(cleanCode);
            const compId = remoteComp?.id || `comp-${cleanCode.toLowerCase().replace('-', '_')}`;
            const compName = remoteComp?.name || `Corporação (${cleanCode})`;

            await createCompanyJoinRequest({
              id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              companyId: compId,
              companyCode: cleanCode,
              userId: authUser.id,
              userName: name.trim() || 'Colaborador(a)',
              userEmail: cleanEmail,
              department: 'tech',
              role: 'Colaborador(a)',
              status: 'pending',
              createdAt: new Date().toISOString(),
            });

            setData(prev => ({
              ...prev,
              workspaceMode: 'business',
              companyWorkspace: {
                id: compId,
                shareCode: cleanCode,
                name: compName,
                sectors: defaultCompanySectors,
                members: [
                  {
                    id: authUser.id,
                    name: name.trim() || 'Colaborador(a)',
                    email: cleanEmail,
                    role: 'Colaborador(a)',
                    department: 'tech',
                    isKeyUser: false,
                    status: 'pending',
                  },
                ],
                keyUserName: remoteComp?.keyUserName || 'Key User',
                isKeyUser: false,
              },
            }));
            toast.success(`Pedido de adesão enviado ao Key User de "${compName}"! 👥`, { duration: 5000 });
          } else {
            // Uso Pessoal / Autônomo
            setData(prev => ({
              ...prev,
              workspaceMode: 'personal',
              companyWorkspace: undefined,
            }));
            toast.success('Conta pessoal criada com sucesso! ✨');
          }

          // O tutorial faz o tour pelo app para quem acabou de se cadastrar
          localStorage.removeItem('ideaflow_tutorial_completed');
          window.dispatchEvent(new Event('ideaflow:tutorial'));

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
      let rawMsg = err?.message || 'Falha ao autenticar.';
      const lower = String(rawMsg).toLowerCase();
      let userFriendlyMsg = rawMsg;

      if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
        userFriendlyMsg = 'Limite temporário de envio de e-mails atingido pelo Supabase (máx. 3 envios/hora). Para cadastros ilimitados sem depender de e-mail, desmarque "Confirm email" no painel do Supabase.';
      } else if (lower.includes('already registered') || lower.includes('user already exists')) {
        userFriendlyMsg = 'Este e-mail já está cadastrado. Alterne para a aba "Entrar" acima para acessar sua conta.';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-100 dark:bg-[#07090E] select-none overflow-y-auto animate-in fade-in duration-200">
      {/* Luz ambiente suave de fundo sólido */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_100%,rgba(139,92,246,0.08),transparent)] pointer-events-none" />

      {/* Clique fora para fechar */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-900/20 space-y-4 sm:space-y-5 z-10 animate-in zoom-in-95 duration-200">
        {/* Botão X para Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-90 cursor-pointer z-20 border border-slate-200"
          aria-label="Fechar"
          title="Fechar e continuar sem entrar"
        >
          <X size={18} />
        </button>

        {/* Cabeçalho */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white mb-1 shadow-md shadow-cyan-500/25">
            {mode === 'forgot' ? <KeyRound size={24} /> : <AudioLines size={24} />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            {mode === 'forgot'
              ? 'Recuperar Senha'
              : mode === 'login'
                ? 'Entrar no Ideaflow'
                : 'Criar sua Conta'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
            {mode === 'forgot'
              ? 'Digite seu e-mail cadastrado para receber o link de redefinição segura.'
              : mode === 'login'
                ? 'Acesse suas ideias e projetos sincronizados em qualquer dispositivo.'
                : 'Crie sua conta para sincronizar suas ideias e cumprir sua primeira missão.'}
          </p>
        </div>

        {/* Abas Alternadoras (Apenas entre Login e Cadastro) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer active:scale-95 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
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
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer active:scale-95 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
            >
              Criar Conta
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 font-medium">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
            {errorMessage.toLowerCase().includes('rate limit') && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Como resolver no Supabase (em 30 segundos):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-amber-900/90 leading-relaxed text-[11px] sm:text-xs">
                  <li>Acesse o painel do seu projeto no <strong>Supabase</strong></li>
                  <li>Vá em <strong>Authentication</strong> → <strong>Providers</strong> → <strong>Email</strong></li>
                  <li>Desmarque a caixa <strong>"Confirm email"</strong> e clique em <strong>Save</strong></li>
                </ol>
                <p className="text-[10px] sm:text-[11px] text-amber-800/80 border-t border-amber-200 pt-1.5">
                  Isso desativa a necessidade de e-mail de confirmação e permite novos cadastros instantâneos sem limite de envios.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!localStorage.getItem('ideaflow_tutorial_completed')) {
                      window.dispatchEvent(new Event('ideaflow:tutorial'));
                    }
                    onClose();
                  }}
                  className="w-full py-2 px-3 mt-1 rounded-xl bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Entrar agora no Modo Convidado (100% Funcional)</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODO ESQUECI MINHA SENHA: CONFIRMAÇÃO DE ENVIO */}
        {mode === 'forgot' && forgotSent ? (
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50 text-center space-y-3">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Link de Recuperação Enviado!</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Enviamos as instruções para <strong className="text-slate-900">{email}</strong>.
              Verifique sua caixa de entrada e a pasta de spam.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs font-semibold bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setForgotSent(false);
                setMode('login');
              }}
            >
              Voltar para o Login
            </Button>
          </div>
        ) : (
          /* Formulário Principal */
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Seu Nome
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon
                      size={18}
                      className="absolute left-3.5 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Caroline Silva"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 rounded-xl pl-11 pr-4 h-12 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Nome de Usuário (@handle)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 text-sm font-mono pointer-events-none">
                      @
                    </span>
                    <input
                      type="text"
                      placeholder="caroline"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 rounded-xl pl-11 pr-4 h-12 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                {/* ESCOLHA DE OBJETIVO INICIAL (PESSOAL OU EMPRESA) */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Como deseja começar?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAccountType('personal')}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        accountType === 'personal'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                          : 'text-slate-500 hover:text-slate-800 font-medium'
                      }`}
                    >
                      <UserIcon size={16} className={accountType === 'personal' ? 'text-cyan-600' : ''} />
                      <span className="text-[10px] leading-tight">Pessoal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('join_company')}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        accountType === 'join_company'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                          : 'text-slate-500 hover:text-slate-800 font-medium'
                      }`}
                    >
                      <Users size={16} className={accountType === 'join_company' ? 'text-violet-600' : ''} />
                      <span className="text-[10px] leading-tight">Código Time</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('create_company')}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        accountType === 'create_company'
                          ? 'bg-violet-600 text-white shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800 font-medium'
                      }`}
                    >
                      <Building2 size={16} />
                      <span className="text-[10px] leading-tight">Criar Empresa</span>
                    </button>
                  </div>

                  {/* Detalhe se for Código de Time */}
                  {accountType === 'join_company' && (
                    <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 space-y-2 animate-in fade-in-50">
                      <label className="text-[11px] font-bold text-violet-900 block">
                        Código da Empresa Fornecido pelo Key User *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: ACME-2026"
                        value={companyCode}
                        onChange={e => setCompanyCode(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-violet-300 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                      />
                      <p className="text-[10px] text-violet-700 leading-tight">
                        O código será validado na nuvem e o Key User receberá seu pedido de acesso.
                      </p>
                    </div>
                  )}

                  {/* Detalhe se for Criar Empresa */}
                  {accountType === 'create_company' && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in-50">
                      <label className="text-[11px] font-bold text-slate-900 block">
                        Nome da sua Empresa / Startup *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Stark Inovações"
                        value={newCompanyName}
                        onChange={e => setNewCompanyName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <p className="text-[10px] text-slate-600 leading-tight">
                        Você será o <strong>Key User</strong> desta organização e receberá um código exclusivo para compartilhar com sua equipe.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={18}
                  className="absolute left-3.5 text-slate-400 pointer-events-none"
                />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 rounded-xl pl-11 pr-4 h-12 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium"
                  autoFocus
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Senha
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                        }}
                        className="text-xs text-cyan-600 hover:text-cyan-700 font-bold hover:underline cursor-pointer"
                      >
                        Esqueci minha senha
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock
                      size={18}
                      className="absolute left-3.5 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={mode === 'register' ? 'Mínimo 6 chars (letra + número)' : 'Sua senha'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 rounded-xl pl-11 pr-11 h-12 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 active:scale-90 transition-transform cursor-pointer"
                      title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CAMPO: CONFIRMAÇÃO DE SENHA PARA O CADASTRO */}
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Confirmar Senha
                    </label>
                    <div className="relative flex items-center">
                      <Lock
                        size={18}
                        className="absolute left-3.5 text-slate-400 pointer-events-none"
                      />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Repita sua senha exatamente"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border rounded-xl pl-11 pr-11 h-12 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium ${
                          confirmPassword && !passwordsMatch
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                            : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 active:scale-90 transition-transform cursor-pointer"
                        title={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Checklist Visual de Requisitos de Senha */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 mt-2">
                      <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                        Requisitos de Segurança da Senha:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <span
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                            hasLength
                              ? 'text-emerald-700 font-bold bg-emerald-50 border-emerald-200'
                              : 'text-slate-500 bg-white border-slate-200 font-medium'
                          }`}
                        >
                          <CheckCircle2 size={13} className={hasLength ? 'text-emerald-600' : 'opacity-40'} />
                          Mínimo 6 chars
                        </span>
                        <span
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                            hasLetter
                              ? 'text-emerald-700 font-bold bg-emerald-50 border-emerald-200'
                              : 'text-slate-500 bg-white border-slate-200 font-medium'
                          }`}
                        >
                          <CheckCircle2 size={13} className={hasLetter ? 'text-emerald-600' : 'opacity-40'} />
                          Pelo menos 1 letra
                        </span>
                        <span
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                            hasNumber
                              ? 'text-emerald-700 font-bold bg-emerald-50 border-emerald-200'
                              : 'text-slate-500 bg-white border-slate-200 font-medium'
                          }`}
                        >
                          <CheckCircle2 size={13} className={hasNumber ? 'text-emerald-600' : 'opacity-40'} />
                          Pelo menos 1 número
                        </span>
                        <span
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                            passwordsMatch
                              ? 'text-emerald-700 font-bold bg-emerald-50 border-emerald-200'
                              : 'text-slate-500 bg-white border-slate-200 font-medium'
                          }`}
                        >
                          <CheckCircle2 size={13} className={passwordsMatch ? 'text-emerald-600' : 'opacity-40'} />
                          Senhas coincidem
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              type="submit"
              disabled={loading || (mode === 'register' && !isPasswordValid)}
              className="w-full h-12 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white shadow-lg shadow-cyan-600/20 active:scale-[0.98] transition-all cursor-pointer gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>
                    {mode === 'forgot'
                      ? 'Enviando link...'
                      : mode === 'login'
                        ? 'Entrando...'
                        : 'Criando conta...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'forgot'
                      ? 'Enviar Link de Recuperação'
                      : mode === 'login'
                        ? 'Entrar no Ideaflow'
                        : 'Cadastrar e Começar'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>

            {mode === 'forgot' && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-slate-600 hover:text-slate-900 font-semibold gap-1.5 mt-1"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
              >
                <ArrowLeft size={14} />
                Voltar para o Login
              </Button>
            )}
          </form>
        )}

        {/* Rodapé e Fechar */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Nuvem Segura Ativa</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!localStorage.getItem('ideaflow_tutorial_completed')) {
                window.dispatchEvent(new Event('ideaflow:tutorial'));
              }
              onClose();
            }}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Entrar como Convidado
          </button>
        </div>
      </div>
    </div>
  );
}
