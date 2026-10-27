import { useState, useEffect } from 'react';
import {
  Building2,
  KeyRound,
  Users,
  Send,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/components/flow-provider';
import {
  generateCompanyCode,
  createCustomCompanyWorkspace,
  defaultCompanySectors,
  CompanyJoinRequest,
} from '@/lib/ideaflow';
import {
  createCompanyInSupabase,
  createCompanyJoinRequest,
  loadCompanyByCode,
  loadCompanyIdeasFromSupabase,
} from '@/lib/supabase';
import { toast } from 'sonner';

interface CompanyAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialTab?: 'join' | 'create';
}

export function CompanyAccessModal({ open, onOpenChange, onSuccess, initialTab = 'join' }: CompanyAccessModalProps) {
  const { data, setData, user, syncWithCloud } = useFlow();
  const [tab, setTab] = useState<'join' | 'create'>(initialTab);

  useEffect(() => {
    if (open && initialTab) {
      setTab(initialTab);
    }
  }, [open, initialTab]);

  // Formulário: Entrar com Código
  const [shareCode, setShareCode] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [department, setDepartment] = useState('tech');
  const [role, setRole] = useState('Especialista / Colaborador');
  const [submittingJoin, setSubmittingJoin] = useState(false);

  // Formulário: Criar Empresa (Key User)
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('Tecnologia & Inovação');
  const [keyUserName, setKeyUserName] = useState('');
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Preenche dados padrão do usuário autenticado
  useEffect(() => {
    if (user) {
      setUserEmail(user.email || '');
      const metaName = (user.user_metadata as any)?.name || user.email?.split('@')[0] || '';
      if (!userName && metaName) setUserName(metaName);
      if (!keyUserName && metaName) setKeyUserName(metaName);
    } else if (data.profile?.name) {
      if (!userName) setUserName(data.profile.name);
      if (!keyUserName) setKeyUserName(data.profile.name);
    }
  }, [user, data.profile, open]);

  // Handler: Enviar Pedido com Código ao Key User
  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = shareCode.trim().toUpperCase();
    if (!cleanCode) {
      toast.error('Informe o código da corporação.');
      return;
    }
    if (!userName.trim()) {
      toast.error('Informe seu nome para que o Key User possa identificar você.');
      return;
    }

    try {
      setSubmittingJoin(true);

      // 1. Tenta localizar a empresa no Supabase para validar o código
      const remoteCompany = await loadCompanyByCode(cleanCode);
      if (!remoteCompany && cleanCode !== 'ACME-2026') {
        toast.error(`Código "${cleanCode}" não foi encontrado. Verifique o código com o Key User da sua corporação.`);
        return;
      }
      const companyId = remoteCompany?.id || `comp-${cleanCode.toLowerCase().replace('-', '_')}`;
      const resolvedName = remoteCompany?.name || `Corporação (${cleanCode})`;

      // 2. Registra a solicitação de entrada
      const request: CompanyJoinRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        companyId,
        companyCode: cleanCode,
        userId: user?.id,
        userName: userName.trim(),
        userEmail: userEmail.trim() || 'colaborador@empresa.com',
        department,
        role: role.trim() || 'Colaborador(a)',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await createCompanyJoinRequest(request);

      // 3. Carrega ideias da empresa se já existirem
      const companyIdeas = await loadCompanyIdeasFromSupabase(cleanCode);

      // 4. Atualiza o estado local para entrar no workspace
      const newJoinedComp = {
        id: companyId,
        shareCode: cleanCode,
        name: resolvedName,
        industry: remoteCompany?.industry || 'Tecnologia & Serviços',
        mission: remoteCompany?.mission || 'Crescimento e excelência contínua.',
        sectors: defaultCompanySectors,
        members: [
          {
            id: user?.id || `user-${Date.now()}`,
            name: userName.trim(),
            role: role.trim(),
            email: userEmail.trim(),
            department,
            isKeyUser: false,
            status: 'pending' as const,
          },
        ],
        keyUserName: remoteCompany?.keyUserName || 'Key User da Empresa',
        isKeyUser: false,
      };

      setData(prev => {
        const existingCompanies = prev.companies || (prev.companyWorkspace ? [prev.companyWorkspace] : []);
        const updatedCompanies = [
          newJoinedComp,
          ...existingCompanies.filter(c => c.id !== newJoinedComp.id),
        ];
        return {
          ...prev,
          workspaceMode: 'business',
          companies: updatedCompanies,
          companyWorkspace: newJoinedComp,
          activeCompanyId: newJoinedComp.id,
          ideas: [
            ...companyIdeas,
            ...prev.ideas.filter(i => !companyIdeas.some(ci => ci.id === i.id)),
          ],
        };
      });

      toast.success(
        `Pedido de acesso enviado com sucesso ao Key User de "${resolvedName}"! 🎉`,
        { duration: 4000 }
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(`Erro ao conectar: ${err?.message || 'Verifique o código e tente novamente.'}`);
    } finally {
      setSubmittingJoin(false);
    }
  };

  // Handler: Criar Nova Empresa (Key User / Fundador)
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) {
      toast.error('Informe o nome da sua empresa ou startup.');
      return;
    }
    if (!keyUserName.trim()) {
      toast.error('Informe seu nome como Key User / Fundador.');
      return;
    }

    try {
      setSubmittingCreate(true);
      const newWorkspace = createCustomCompanyWorkspace(
        newCompanyName,
        newCompanyIndustry,
        keyUserName,
        userEmail || user?.email,
        user?.id
      );

      // Salva no Supabase se logado ou tabela ativa
      if (user?.id) {
        await createCompanyInSupabase(newWorkspace, user.id);
      }

      // Aplica no FlowProvider
      setData(prev => {
        const existingCompanies = prev.companies || (prev.companyWorkspace ? [prev.companyWorkspace] : []);
        const updatedCompanies = [
          newWorkspace,
          ...existingCompanies.filter(c => c.id !== newWorkspace.id),
        ];
        return {
          ...prev,
          workspaceMode: 'business',
          companies: updatedCompanies,
          companyWorkspace: newWorkspace,
          activeCompanyId: newWorkspace.id,
        };
      });

      toast.success(
        `Empresa "${newWorkspace.name}" fundada com sucesso! Seu código é ${newWorkspace.shareCode} 👑`,
        { duration: 5000 }
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(`Falha ao fundar empresa: ${err?.message || 'Tente novamente'}`);
    } finally {
      setSubmittingCreate(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card border-border shadow-2xl rounded-2xl">
        {/* Top Header com Gradiente */}
        <div className="p-6 bg-gradient-to-r from-violet-600/15 via-primary/10 to-transparent border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-500 shadow-xs">
              <Building2 size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Portal Corporativo & Áreas de Negócio
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Conecte-se com sua equipe ou crie a estrutura da sua própria empresa.
              </DialogDescription>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/80 rounded-xl mt-5 border border-border/60">
            <button
              type="button"
              onClick={() => setTab('join')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'join'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users size={14} className={tab === 'join' ? 'text-primary' : ''} />
              <span>Entrar com Código</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('create')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'create'
                  ? 'bg-violet-600 text-white shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles size={14} />
              <span>Criar Empresa (Key User)</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: ENTRAR COM CÓDIGO (COLABORADOR) */}
          {tab === 'join' && (
            <form onSubmit={handleJoinWithCode} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-start gap-3">
                <KeyRound size={18} className="text-violet-500 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground">Acesso por Código de Corporação</p>
                  <p className="mt-0.5">
                    Digite o código fornecido pelo <strong>Key User</strong> da sua empresa (ex:{' '}
                    <code className="text-primary font-mono font-bold">ACME-2026</code>) para ingressar
                    no funil corporativo compartilhado.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Código da Empresa / Corporação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ACME-2026"
                  value={shareCode}
                  onChange={e => setShareCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Seu E-mail Profissional
                  </label>
                  <input
                    type="email"
                    placeholder="voce@empresa.com"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Setor de Atuação
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    <option value="tech">Tecnologia & Dev</option>
                    <option value="marketing">Marketing & Growth</option>
                    <option value="qa">Testes & QA</option>
                    <option value="quality">Qualidade & Produto</option>
                    <option value="ops">Operações & RH</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Engenheiro de Software"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={submittingJoin}
                  className="w-full h-10 bg-gradient-to-r from-violet-600 to-primary text-white font-semibold text-xs shadow-md hover:shadow-violet-500/25 gap-2 cursor-pointer"
                >
                  <Send size={14} className={submittingJoin ? 'animate-spin' : ''} />
                  <span>
                    {submittingJoin
                      ? 'Enviando pedido ao Key User...'
                      : 'Enviar Pedido ao Key User & Entrar'}
                  </span>
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: CRIAR EMPRESA (KEY USER / FUNDADOR) */}
          {tab === 'create' && (
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 flex items-start gap-3">
                <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground">Fundar Espaço Corporativo (Key User)</p>
                  <p className="mt-0.5">
                    Como <strong>Key User</strong>, você será o administrador central da corporação:
                    aprova novos membros, configura setores e compartilha o código exclusivo com sua
                    equipe.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Nome da Empresa / Startup *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Acme Inovações, Stark Tech, Lumina Health"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Ramo / Indústria Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: SaaS, E-commerce, Logística"
                    value={newCompanyIndustry}
                    onChange={e => setNewCompanyIndustry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Seu Nome (Key User) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={keyUserName}
                    onChange={e => setKeyUserName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/80 text-xs text-muted-foreground flex items-center justify-between">
                <span>Setores Iniciais Inclusos:</span>
                <span className="font-semibold text-foreground">
                  Tecnologia · Marketing · QA · Qualidade · Operações
                </span>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={submittingCreate}
                  className="w-full h-10 bg-gradient-to-r from-violet-600 to-primary text-white font-semibold text-xs shadow-md hover:shadow-violet-500/25 gap-2 cursor-pointer"
                >
                  <PlusCircle size={15} className={submittingCreate ? 'animate-spin' : ''} />
                  <span>
                    {submittingCreate
                      ? 'Fundando empresa e gerando código...'
                      : 'Fundar Empresa & Tornar-me Key User'}
                  </span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

