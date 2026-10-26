import { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, KeyRound, ShieldAlert, ArrowRight, Check, X, ShieldCheck } from 'lucide-react';
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
  currentPin: string;
  onUpdatePin?: (newPin: string) => void;
}

export function PersonalPinModal({
  open,
  onClose,
  onSuccess,
  currentPin = '1234',
  onUpdatePin,
}: PersonalPinModalProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newDigits, setNewDigits] = useState<string[]>(['', '', '', '']);
  const [confirmDigits, setConfirmDigits] = useState<string[]>(['', '', '', '']);
  const [changeStep, setChangeStep] = useState<'verify' | 'new' | 'confirm'>('verify');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const newPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const confirmPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (open) {
      setDigits(['', '', '', '']);
      setError(false);
      setIsChangingPin(false);
      setIsUnlocked(false);
      setChangeStep('verify');
      setTimeout(() => {
        inputRefs[0]?.current?.focus();
      }, 150);
    }
  }, [open]);

  const handleDigitChange = (index: number, value: string) => {
    // Apenas números
    const cleanValue = value.replace(/\D/g, '').slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = cleanValue;
    setDigits(nextDigits);
    setError(false);

    if (cleanValue && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }

    // Se preencheu os 4 dígitos, valida imediatamente
    if (cleanValue && index === 3 && nextDigits.every(d => d !== '')) {
      const enteredPin = nextDigits.join('');
      validatePin(enteredPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;

    const nextDigits = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      nextDigits[i] = pasted[i] || '';
    }
    setDigits(nextDigits);

    if (pasted.length === 4) {
      validatePin(pasted);
    } else {
      inputRefs[Math.min(pasted.length, 3)]?.current?.focus();
    }
  };

  const validatePin = (enteredPin: string) => {
    const expectedPin = currentPin || '1234';

    if (enteredPin === expectedPin) {
      setIsUnlocked(true);
      setTimeout(() => {
        toast.success('Espaço pessoal desbloqueado com sucesso! 🔓');
        onSuccess();
        onClose();
      }, 400);
    } else {
      setError(true);
      toast.error('Senha incorreta de 4 dígitos. Tente novamente.');
      setTimeout(() => {
        setDigits(['', '', '', '']);
        inputRefs[0]?.current?.focus();
      }, 400);
    }
  };

  // Fluxo de alteração de PIN
  const handleSaveNewPin = () => {
    const p1 = newDigits.join('');
    const p2 = confirmDigits.join('');

    if (p1.length !== 4) {
      toast.error('O novo PIN deve ter 4 dígitos numéricos.');
      return;
    }

    if (p1 !== p2) {
      toast.error('Os dois PINs digitados não conferem.');
      return;
    }

    if (onUpdatePin) {
      onUpdatePin(p1);
    }
    localStorage.setItem('ideaflow_personal_pin', p1);
    toast.success('Nova senha pessoal de 4 dígitos cadastrada com sucesso! 🔒');
    setIsChangingPin(false);
    setDigits(['', '', '', '']);
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-border/90 shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-violet/20 border border-primary/30 flex items-center justify-center text-primary shadow-xs">
            {isUnlocked ? (
              <Unlock size={24} className="text-green animate-bounce" />
            ) : (
              <Lock size={22} className="text-primary animate-pulse" />
            )}
          </div>

          <DialogTitle className="text-xl font-display font-bold text-foreground">
            {isChangingPin ? 'Alterar Senha Pessoal' : 'Área Pessoal Protegida'}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isChangingPin
              ? 'Defina um novo código de 4 dígitos para proteger seu espaço individual.'
              : 'Você está no Workspace da Empresa. Digite sua senha pessoal de 4 dígitos para acessar suas ideias e projetos particulares.'}
          </DialogDescription>
        </DialogHeader>

        {!isChangingPin ? (
          <div className="space-y-6 pt-3">
            {/* 4 Caixas de Dígitos do PIN */}
            <div
              className={`flex items-center justify-center gap-3 ${
                error ? 'animate-shake' : ''
              }`}
              onPaste={handlePaste}
            >
              {[0, 1, 2, 3].map(index => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digits[index]}
                  onChange={e => handleDigitChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  disabled={isUnlocked}
                  className={`w-13 h-14 text-center text-2xl font-bold font-mono rounded-xl border transition-all outline-none ${
                    error
                      ? 'border-destructive bg-destructive/10 text-destructive ring-2 ring-destructive/30'
                      : isUnlocked
                      ? 'border-green bg-green/10 text-green ring-2 ring-green/30'
                      : digits[index]
                      ? 'border-primary bg-primary/10 text-foreground ring-2 ring-primary/20'
                      : 'border-border/80 bg-secondary/50 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25'
                  }`}
                  aria-label={`Dígito ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50">
                <ShieldAlert size={14} />
                <span>Senha incorreta de 4 dígitos. Tente novamente.</span>
              </p>
            )}

            {/* Rodapé explicativo e senha padrão */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/70 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck size={14} className="text-primary" />
                  Privacidade no ambiente de trabalho
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-primary font-bold">
                  Padrão: 1234
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Essa camada de segurança garante que colegas de trabalho não tenham acesso acidental ao seu funil particular.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary gap-1 cursor-pointer"
                onClick={() => {
                  setIsChangingPin(true);
                  setNewDigits(['', '', '', '']);
                  setConfirmDigits(['', '', '', '']);
                }}
              >
                <KeyRound size={13} />
                <span>Alterar meu PIN</span>
              </Button>

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
                  type="button"
                  size="sm"
                  className="h-8 text-xs font-semibold px-4 cursor-pointer"
                  onClick={() => validatePin(digits.join(''))}
                  disabled={digits.some(d => d === '') || isUnlocked}
                >
                  <span>Entrar</span>
                  <ArrowRight size={13} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* MODO: ALTERAR SENHA DE 4 DÍGITOS */
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Novo PIN (4 dígitos):
              </label>
              <div className="flex items-center gap-2 justify-center">
                {[0, 1, 2, 3].map(index => (
                  <input
                    key={index}
                    ref={newPinRefs[index]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={newDigits[index]}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(-1);
                      const next = [...newDigits];
                      next[index] = val;
                      setNewDigits(next);
                      if (val && index < 3) newPinRefs[index + 1]?.current?.focus();
                    }}
                    className="w-11 h-12 text-center text-xl font-bold font-mono rounded-lg border border-border bg-secondary/50 focus:border-primary outline-none"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Confirme o Novo PIN:
              </label>
              <div className="flex items-center gap-2 justify-center">
                {[0, 1, 2, 3].map(index => (
                  <input
                    key={index}
                    ref={confirmPinRefs[index]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={confirmDigits[index]}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(-1);
                      const next = [...confirmDigits];
                      next[index] = val;
                      setConfirmDigits(next);
                      if (val && index < 3) confirmPinRefs[index + 1]?.current?.focus();
                    }}
                    className="w-11 h-12 text-center text-xl font-bold font-mono rounded-lg border border-border bg-secondary/50 focus:border-primary outline-none"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/70">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs cursor-pointer"
                onClick={() => setIsChangingPin(false)}
              >
                Voltar
              </Button>
              <Button
                type="button"
                size="sm"
                className="text-xs font-semibold px-4 gap-1.5 cursor-pointer"
                onClick={handleSaveNewPin}
                disabled={newDigits.some(d => d === '') || confirmDigits.some(d => d === '')}
              >
                <Check size={13} />
                <span>Salvar Novo PIN</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

