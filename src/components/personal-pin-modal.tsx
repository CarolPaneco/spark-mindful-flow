import { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  User,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PersonalPinModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin?: string | undefined;
  onUpdatePin?: (newPin: string) => void;
  targetWorkspace?: 'personal' | 'business';
}

export function PersonalPinModal({
  open,
  onClose,
  onSuccess,
  currentPin = '',
  onUpdatePin,
  targetWorkspace = 'personal',
}: PersonalPinModalProps) {
  const hasExistingPin = Boolean(currentPin && currentPin.trim().length > 0);

  // Estados
  const [view, setView] = useState<'unlock' | 'setup' | 'change'>(
    hasExistingPin ? 'unlock' : 'setup'
  );
  const [enteredPin, setEnteredPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setView(hasExistingPin ? 'unlock' : 'setup');
      setEnteredPin('');
      setNewPin('');
      setConfirmPin('');
      setError(null);
      setIsUnlocked(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [open, hasExistingPin]);

  const isGoingPersonal = targetWorkspace === 'personal';

  // Validação de desbloqueio com senha existente
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!enteredPin.trim()) {
      setError('Digite sua senha de segurança.');
      return;
    }

    if (enteredPin.trim() === currentPin.trim()) {
      setIsUnlocked(true);
      toast.success(
        isGoingPersonal
          ? 'Espaço Pessoal desbloqueado com sucesso! 🔓'
          : 'Workspace da Empresa desbloqueado com sucesso! 🏢'
      );
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 350);
    } else {
      setError('Senha incorreta. Tente novamente.');
      toast.error('Senha incorreta de segurança.');
    }
  };

  // Salvar nova senha (na configuração inicial ou alteração)
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNew = newPin.trim();
    const cleanConfirm = confirmPin.trim();

    if (!cleanNew) {
      setError('Informe a nova senha de segurança.');
      return;
    }

    if (cleanNew.length < 4) {
      setError('A senha de segurança deve ter pelo menos 4 caracteres.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setError('A confirmação da senha não coincide com a senha digitada.');
      return;
    }

    if (onUpdatePin) {
      onUpdatePin(cleanNew);
    }

    toast.success('Senha de segurança de transição salva com sucesso! 🔒');
    setIsUnlocked(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 350);
  };

  // Continuar sem senha (opção livre caso não queira proteger)
  const handleContinueWithoutPin = () => {
    toast.info('Transição concluída sem senha de bloqueio. ✨');
    onSuccess();
    onClose();
  };

  // Remover senha de segurança
  const handleRemovePin = () => {
    if (onUpdatePin) {
      onUpdatePin('');
    }
    toast.success('Senha de segurança removida. Agora os espaços alternam livremente.');
    setView('setup');
    setEnteredPin('');
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-border/90 shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-violet/20 border border-primary/30 flex items-center justify-center text-primary shadow-xs">
            {isUnlocked ? (
              <Unlock size={24} className="text-green animate-bounce" />
            ) : view === 'setup' ? (
              <ShieldCheck size={24} className="text-violet animate-pulse" />
            ) : (
              <Lock size={22} className="text-primary animate-pulse" />
            )}
          </div>

          <DialogTitle className="text-xl font-display font-bold text-foreground">
            {view === 'setup'
              ? 'Proteção de Transição de Espaço'
              : view === 'change'
              ? 'Alterar Senha de Segurança'
              : 'Espaço Protegido por Senha'}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {view === 'setup'
              ? isGoingPersonal
                ? 'Você está alternando para o seu Espaço Pessoal. Se quiser privacidade contra acessos de terceiros, defina uma senha de segurança agora (opcional).'
                : 'Você está alternando para o Workspace da Empresa. Se quiser, defina uma senha de segurança agora (opcional).'
              : view === 'change'
              ? 'Digite a nova senha e confirme para atualizar sua proteção de transição.'
              : isGoingPersonal
              ? 'Você está no Workspace da Empresa. Digite sua senha de segurança para acessar seu Espaço Pessoal.'
              : 'Digite sua senha de segurança para acessar o Workspace Corporativo.'}
          </DialogDescription>
        </DialogHeader>

        {/* 1. MODO DESBLOQUEIO COM SENHA ATUAL */}
        {view === 'unlock' && (
          <form onSubmit={handleUnlock} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Senha de Segurança:</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Transição {isGoingPersonal ? 'Empresa ➔ Pessoal' : 'Pessoal ➔ Empresa'}
                </span>
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-border/80 bg-secondary/50 text-foreground font-mono text-center tracking-widest text-lg focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                  placeholder="••••"
                  value={enteredPin}
                  onChange={e => {
                    setEnteredPin(e.target.value);
                    setError(null);
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50">
                <ShieldAlert size={14} />
                <span>{error}</span>
              </p>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/70">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-muted-foreground hover:text-primary gap-1 px-1 cursor-pointer"
                  onClick={() => {
                    setView('change');
                    setNewPin('');
                    setConfirmPin('');
                    setError(null);
                  }}
                >
                  <KeyRound size={12} />
                  <span>Alterar Senha</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-destructive/80 hover:text-destructive gap-1 px-1 cursor-pointer"
                  onClick={handleRemovePin}
                  title="Remover proteção com senha"
                >
                  <Trash2 size={12} />
                  <span>Remover</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs cursor-pointer"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs font-semibold px-4 cursor-pointer gap-1"
                  disabled={!enteredPin.trim() || isUnlocked}
                >
                  <span>Desbloquear</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* 2. MODO DEFINIR SENHA (SETUP INICIAL - SE O USUÁRIO QUISER) */}
        {view === 'setup' && (
          <div className="space-y-4 pt-2">
            <form onSubmit={handleSavePin} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-violet/10 border border-violet/25 text-xs text-foreground space-y-1">
                <p className="font-semibold text-violet flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Defina uma senha se desejar proteção
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Caso divida este computador ou navegador com colegas de equipe, você pode definir uma senha e verificação de senha para alternar entre os espaços.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Nova Senha de Segurança:
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none"
                    placeholder="Mínimo 4 caracteres (números ou letras)"
                    value={newPin}
                    onChange={e => {
                      setNewPin(e.target.value);
                      setError(null);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Verificação da Senha (Confirme):
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-10 px-3 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none"
                  placeholder="Digite a mesma senha novamente"
                  value={confirmPin}
                  onChange={e => {
                    setConfirmPin(e.target.value);
                    setError(null);
                  }}
                />
              </div>

              {error && (
                <p className="text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50">
                  <ShieldAlert size={14} />
                  <span>{error}</span>
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/70">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={handleContinueWithoutPin}
                >
                  Continuar sem Senha
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs cursor-pointer"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 text-xs font-semibold px-4 cursor-pointer gap-1 bg-violet hover:bg-violet/90 text-white"
                    disabled={!newPin.trim() || !confirmPin.trim()}
                  >
                    <Check size={13} />
                    <span>Salvar Senha & Alternar</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* 3. MODO ALTERAR SENHA */}
        {view === 'change' && (
          <form onSubmit={handleSavePin} className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Nova Senha de Segurança:
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none"
                  placeholder="Mínimo 4 caracteres"
                  value={newPin}
                  onChange={e => {
                    setNewPin(e.target.value);
                    setError(null);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Verificação da Senha (Confirme):
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-10 px-3 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none"
                placeholder="Repita a nova senha"
                value={confirmPin}
                onChange={e => {
                  setConfirmPin(e.target.value);
                  setError(null);
                }}
              />
            </div>

            {error && (
              <p className="text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50">
                <ShieldAlert size={14} />
                <span>{error}</span>
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs cursor-pointer"
                onClick={() => setView('unlock')}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs font-semibold px-4 cursor-pointer gap-1"
                disabled={!newPin.trim() || !confirmPin.trim()}
              >
                <Check size={13} />
                <span>Salvar Nova Senha</span>
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
