import { createClient, type User, type Session } from '@supabase/supabase-js';
import { inferSectorFromContent, type Idea, type FlowData, type CompanyWorkspace, type CompanyJoinRequest, type TeamMember } from './ideaflow';

// Polyfill seguro de WebSocket para SSR em Node < 22 (Netlify Serverless)
if (typeof window === 'undefined' && typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class SSRWebSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    readonly readyState = 3;
    onopen: any = null;
    onclose: any = null;
    onerror: any = null;
    onmessage: any = null;
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  };
}

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vhljktzcvqzwssmvbznx.supabase.co';
const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGprdHpjdnF6d3NzbXZiem54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5ODM3NzgsImV4cCI6MjEwNzU1OTc3OH0.038F4A9BrYERvqzSYg-efASctcJxM5qx7fUf5m4fzqE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
  },
});

export interface AuthProfile {
  id: string;
  name?: string | undefined;
  username?: string | undefined;
  role?: string | undefined;
  avatar_url?: string | undefined;
  sectors?: any[] | undefined;
  company_workspace?: any | undefined;
  workspace_pin?: string | undefined;
}

/**
 * Converte ideia do Supabase para formato interno do Ideaflow
 */
export function rowToIdea(row: any): Idea {
  let extraMeta: any = {};
  if (row.summary && typeof row.summary === 'string' && row.summary.includes('<!--ideaflow-meta:')) {
    try {
      const match = row.summary.match(/<!--ideaflow-meta:(.*?)-->/);
      if (match && match[1]) {
        extraMeta = JSON.parse(decodeURIComponent(match[1]));
      }
    } catch {
      // Ignora erro de parse de metadados
    }
  }

  const cleanSummary = row.summary && typeof row.summary === 'string'
    ? row.summary.replace(/<!--ideaflow-meta:.*?-->/, '').trim()
    : '';

  const rawSector = row.sector || extraMeta.sector;
  const resolvedSector = (rawSector && rawSector !== 'geral') ? rawSector : 'none';

  return {
    id: row.id,
    title: row.title,
    summary: cleanSummary,
    sector: resolvedSector,
    priority: row.priority || extraMeta.priority || 'Normal',
    stage: row.stage ?? 0,
    minutes: row.minutes ?? 60,
    dedicated: row.dedicated ?? 0,
    immediate: row.immediate || '',
    clarity: row.clarity || '',
    scope: row.scope || '',
    steps: Array.isArray(row.steps) ? row.steps : [],
    notes: Array.isArray(row.notes) ? row.notes : [],
    pivots: Array.isArray(row.pivots) ? row.pivots : [],
    parentId: row.parent_id || extraMeta.parentId || undefined,
    isProject: Boolean(row.is_project || extraMeta.isProject),
    archived: Boolean(row.archived || extraMeta.archived),
    archivedAt: row.archived_at || extraMeta.archivedAt || undefined,
    // Isolamento estrito de Workspace: se não tem company_id e não é explicitamente business, é estritamente pessoal
    workspace: (row.workspace === 'business' && Boolean(row.company_id || extraMeta.companyId)) ? 'business' : 'personal',
    companyId: (row.workspace === 'business' && (row.company_id || extraMeta.companyId)) ? (row.company_id || extraMeta.companyId) : undefined,
    assignedTo: (row.workspace === 'business') ? (row.assigned_to || extraMeta.assignedTo || undefined) : undefined,
    department: (row.workspace === 'business') ? (row.department || extraMeta.department || undefined) : undefined,
    fiveWhys: Array.isArray(row.five_whys)
      ? row.five_whys
      : Array.isArray(extraMeta.fiveWhys)
      ? extraMeta.fiveWhys
      : undefined,
  };
}

/**
 * Converte ideia do Ideaflow para linha do Supabase
 */
export function ideaToRow(idea: Idea, userId: string, companyId?: string) {
  const isPersonal = idea.workspace === 'personal' || (!idea.workspace && !idea.companyId);
  const resolvedWorkspace = isPersonal ? 'personal' : 'business';
  const resolvedCompanyId = isPersonal ? undefined : (idea.companyId || companyId || undefined);

  const meta = {
    workspace: resolvedWorkspace,
    companyId: resolvedCompanyId,
    assignedTo: isPersonal ? undefined : (idea.assignedTo || undefined),
    department: isPersonal ? undefined : (idea.department || undefined),
    fiveWhys: idea.fiveWhys || undefined,
  };
  const metaComment = `\n<!--ideaflow-meta:${encodeURIComponent(JSON.stringify(meta))}-->`;
  const cleanSummary = (idea.summary || '').replace(/<!--ideaflow-meta:.*?-->/, '').trim();

  return {
    id: idea.id,
    user_id: userId,
    title: idea.title,
    summary: `${cleanSummary}${metaComment}`,
    sector: idea.sector || 'none',
    priority: idea.priority || 'Normal',
    stage: idea.stage ?? 0,
    minutes: idea.minutes ?? 60,
    dedicated: idea.dedicated ?? 0,
    immediate: idea.immediate || '',
    clarity: idea.clarity || '',
    scope: idea.scope || '',
    steps: idea.steps || [],
    notes: idea.notes || [],
    pivots: idea.pivots || [],
    parent_id: idea.parentId || null,
    is_project: Boolean(idea.isProject),
    archived: Boolean(idea.archived),
    archived_at: idea.archivedAt || null,
    // Campos estendidos para workspaces e empresas compartilhadas com isolamento estrito
    workspace: resolvedWorkspace,
    company_id: resolvedCompanyId || null,
    assigned_to: isPersonal ? null : (idea.assignedTo || null),
    department: isPersonal ? null : (idea.department || null),
    five_whys: idea.fiveWhys || [],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Carrega todas as ideias do usuário logado no Supabase
 */
export async function loadUserIdeasFromSupabase(userId: string): Promise<Idea[]> {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.warn('Erro ao carregar ideias do Supabase:', error);
    throw error;
  }

  return (data || []).map(rowToIdea);
}

/**
 * Carrega ideias compartilhadas de uma empresa no Supabase
 */
export async function loadCompanyIdeasFromSupabase(companyId: string): Promise<Idea[]> {
  if (!companyId) return [];

  try {
    // Tenta carregar buscando por company_id
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('company_id', companyId)
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(rowToIdea);
    }

    // Se der erro de coluna company_id ou não encontrar, busca ideias com metadados no summary
    const { data: fallbackData } = await supabase
      .from('ideas')
      .select('*')
      .ilike('summary', `%${companyId}%`)
      .order('updated_at', { ascending: false });

    return (fallbackData || []).map(rowToIdea);
  } catch (err) {
    console.warn('Aviso ao carregar ideias compartilhadas da empresa:', err);
    return [];
  }
}

/**
 * Sincroniza uma lista de ideias com o Supabase com fallback inteligente de schema
 */
export async function syncIdeasToSupabase(
  ideas: Idea[],
  userId: string,
  companyId?: string
): Promise<void> {
  if (!userId || ideas.length === 0) return;

  const rows = ideas.map(idea => ideaToRow(idea, userId, companyId));

  try {
    const { error } = await supabase.from('ideas').upsert(rows, { onConflict: 'id' });

    if (error) {
      // Se a tabela do Supabase ainda não tiver as colunas estendidas, salva nas colunas base
      // Os metadados continuam 100% seguros através do comentário codificado no summary!
      const errLower = (error.message || '').toLowerCase();
      if (errLower.includes('column') || error.code === '42703' || error.code === 'PGRST204') {
        const baseRows = rows.map(r => {
          const { workspace, company_id, assigned_to, department, five_whys, ...base } = r as any;
          return base;
        });
        const retryRes = await supabase.from('ideas').upsert(baseRows, { onConflict: 'id' });
        if (retryRes.error) throw retryRes.error;
        return;
      }
      throw error;
    }
  } catch (err) {
    console.warn('Erro ao sincronizar ideias com Supabase:', err);
    throw err;
  }
}

/**
 * Escuta atualizações em tempo real das ideias da empresa
 */
export function subscribeToCompanyIdeas(companyId: string, onUpdate: () => void) {
  if (!companyId) return () => {};

  const channel = supabase
    .channel(`company-ideas-${companyId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ideas' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Deleta uma ideia no Supabase
 */
export async function deleteIdeaFromSupabase(ideaId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('ideas').delete().eq('id', ideaId).eq('user_id', userId);
  if (error) {
    console.warn('Erro ao excluir ideia do Supabase:', error);
  }
}

/**
 * Carrega perfil do usuário
 */
export async function loadUserProfile(userId: string): Promise<AuthProfile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
}

/**
 * Salva perfil do usuário
 */
export async function upsertUserProfile(profile: Partial<AuthProfile> & { id: string }): Promise<void> {
  await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
}

/**
 * Salva a senha de segurança de transição de workspace (Empresa <-> Pessoal) no Supabase
 */
export async function saveUserWorkspacePin(userId: string, pin: string | null): Promise<void> {
  const cleanPin = pin ? pin.trim() : '';
  try {
    // 1. Salva nos metadados de autenticação do usuário no Supabase (Auth user_metadata)
    try {
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: { workspace_pin: cleanPin },
      });
      if (authError) {
        console.warn('Aviso Supabase Auth updateUser:', authError.message);
      } else if (authData?.user) {
        // Confirmação de gravação nos metadados da sessão
      }
    } catch (authErr) {
      console.warn('Falha ao atualizar user_metadata no Supabase:', authErr);
    }

    // 2. Salva na tabela profiles do Supabase (se a coluna workspace_pin existir)
    try {
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: userId,
          workspace_pin: cleanPin,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (profileError) {
        console.warn('Aviso: para persistir também na tabela profiles do Supabase, adicione a coluna: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workspace_pin text;', profileError.message);
      }
    } catch {
      // Ignora erro caso a coluna ainda não tenha sido criada no Supabase
    }
  } catch (err) {
    console.warn('Falha geral ao persistir workspace_pin no Supabase:', err);
  }
}

/**
 * Cria ou atualiza uma empresa no Supabase
 */
export async function createCompanyInSupabase(
  company: CompanyWorkspace,
  userId: string
): Promise<void> {
  if (!company.id) return;

  try {
    const payload = {
      id: company.id,
      name: company.name,
      share_code: company.shareCode,
      industry: company.industry,
      mission: company.mission,
      owner_id: userId,
      key_user_name: company.keyUserName || 'Key User',
      key_user_email: company.keyUserEmail,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('companies').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Tabela companies do Supabase ainda não inicializada ou erro RLS:', error.message);
    }

    // Registra o Key User como membro fundador
    await supabase.from('company_members').upsert(
      {
        id: `mem-${company.id}-${userId}`,
        company_id: company.id,
        user_id: userId,
        name: company.keyUserName || 'Key User',
        email: company.keyUserEmail || 'admin@empresa.com',
        role: 'Key User & Fundador(a)',
        department: 'quality',
        is_key_user: true,
        status: 'active',
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Aviso ao registrar empresa no Supabase:', err);
  }
}

/**
 * Busca uma empresa pelo código de compartilhamento
 */
export async function loadCompanyByCode(shareCode: string): Promise<Partial<CompanyWorkspace> | null> {
  const cleanCode = shareCode.trim().toUpperCase();
  if (!cleanCode) return null;

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('share_code', cleanCode)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        shareCode: data.share_code,
        industry: data.industry,
        mission: data.mission,
        ownerId: data.owner_id,
        keyUserName: data.key_user_name,
        keyUserEmail: data.key_user_email,
      };
    }
  } catch (err) {
    console.warn('Erro ao consultar empresa por código:', err);
  }

  return null;
}

/**
 * Carrega todas as empresas associadas ao usuário (como Key User/fundador ou membro de equipe)
 */
export async function loadUserCompanies(userId: string, userEmail?: string): Promise<CompanyWorkspace[]> {
  if (!userId) return [];

  const companiesMap = new Map<string, any>();

  try {
    // 1. Busca todas as empresas onde o usuário é proprietário/fundador
    const { data: ownedCompanies, error: ownedError } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', userId);

    if (!ownedError && ownedCompanies) {
      ownedCompanies.forEach(comp => {
        companiesMap.set(comp.id, { ...comp, isOwner: true });
      });
    }

    // 2. Busca todas as empresas onde o usuário é membro de equipe (ativo)
    let memberQuery = supabase
      .from('company_members')
      .select('company_id, is_key_user')
      .eq('status', 'active');

    if (userEmail) {
      memberQuery = memberQuery.or(`user_id.eq.${userId},email.eq.${userEmail.trim().toLowerCase()}`);
    } else {
      memberQuery = memberQuery.eq('user_id', userId);
    }

    const { data: memberRows, error: memberError } = await memberQuery;

    if (!memberError && memberRows && memberRows.length > 0) {
      const missingCompIds = memberRows
        .map(m => m.company_id)
        .filter(id => id && !companiesMap.has(id));

      if (missingCompIds.length > 0) {
        const { data: compRows, error: compError } = await supabase
          .from('companies')
          .select('*')
          .in('id', missingCompIds);

        if (!compError && compRows) {
          compRows.forEach(comp => {
            const memInfo = memberRows.find(m => m.company_id === comp.id);
            companiesMap.set(comp.id, {
              ...comp,
              isOwner: comp.owner_id === userId,
              isMemberKeyUser: Boolean(memInfo?.is_key_user),
            });
          });
        }
      }
    }

    // 3. Constrói a lista completa de workspaces com membros e setores
    const results: CompanyWorkspace[] = [];

    for (const comp of companiesMap.values()) {
      // Carrega membros da empresa
      const { data: allMembersData } = await supabase
        .from('company_members')
        .select('*')
        .eq('company_id', comp.id);

      const members: TeamMember[] = (allMembersData || []).map((m: any) => ({
        id: m.user_id || m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        department: m.department,
        isKeyUser: Boolean(m.is_key_user),
        status: m.status || 'active',
      }));

      const isKeyUser = comp.isOwner || comp.owner_id === userId || Boolean(comp.isMemberKeyUser);
      const pendingRequests = isKeyUser ? await loadCompanyJoinRequests(comp.id) : [];

      results.push({
        id: comp.id,
        shareCode: comp.share_code,
        name: comp.name,
        industry: comp.industry || 'Tecnologia & Inovação',
        mission: comp.mission || 'Construir produtos ágeis e colaborativos.',
        sectors: [
          { id: 'tech', name: 'Tecnologia & Dev', tone: 'cyan' },
          { id: 'marketing', name: 'Marketing & Growth', tone: 'pink' },
          { id: 'qa', name: 'Testes & QA', tone: 'amber' },
          { id: 'quality', name: 'Qualidade & Produto', tone: 'green' },
          { id: 'ops', name: 'Operações & RH', tone: 'violet' },
        ],
        members: members.length > 0 ? members : [
          {
            id: userId,
            name: comp.key_user_name || 'Key User',
            email: comp.key_user_email || userEmail,
            role: 'Key User & Fundador(a)',
            department: 'quality',
            isKeyUser: true,
            status: 'active',
          },
        ],
        ownerId: comp.owner_id,
        keyUserName: comp.key_user_name,
        keyUserEmail: comp.key_user_email,
        isKeyUser,
        pendingRequests,
      });
    }

    return results;
  } catch (err) {
    console.warn('Aviso ao carregar empresas do usuário no Supabase:', err);
    return [];
  }
}

/**
 * Carrega a empresa ativa ou primária associada ao usuário
 */
export async function loadUserCompany(userId: string, userEmail?: string): Promise<CompanyWorkspace | null> {
  if (!userId) return null;
  const companies = await loadUserCompanies(userId, userEmail);
  return companies[0] ?? null;
}

/**
 * Cria uma solicitação de entrada na empresa (pedido ao Key User)
 */
export async function createCompanyJoinRequest(req: CompanyJoinRequest): Promise<void> {
  try {
    const payload = {
      id: req.id,
      company_id: req.companyId,
      company_code: req.companyCode,
      user_id: req.userId || null,
      user_name: req.userName,
      user_email: req.userEmail,
      department: req.department,
      role: req.role,
      status: req.status,
      created_at: req.createdAt,
    };

    const { error } = await supabase
      .from('company_join_requests')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Aviso ao salvar solicitação de entrada no Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Aviso ao enviar pedido de adesão ao Key User:', err);
  }
}

/**
 * Carrega solicitações de entrada pendentes para o Key User
 */
export async function loadCompanyJoinRequests(companyId: string): Promise<CompanyJoinRequest[]> {
  if (!companyId) return [];

  try {
    const { data, error } = await supabase
      .from('company_join_requests')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(r => ({
        id: r.id,
        companyId: r.company_id,
        companyCode: r.company_code,
        userId: r.user_id,
        userName: r.user_name,
        userEmail: r.user_email,
        department: r.department,
        role: r.role,
        status: r.status,
        createdAt: r.created_at,
      }));
    }
  } catch (err) {
    console.warn('Aviso ao carregar pedidos de entrada:', err);
  }

  return [];
}

/**
 * Aprova uma solicitação de entrada
 */
export async function approveCompanyJoinRequest(
  requestId: string,
  member: TeamMember,
  companyId: string
): Promise<void> {
  try {
    // 1. Atualiza status da solicitação
    await supabase
      .from('company_join_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    // 2. Insere o membro na lista oficial
    await supabase.from('company_members').upsert(
      {
        id: `mem-${companyId}-${member.id}`,
        company_id: companyId,
        user_id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        is_key_user: false,
        status: 'active',
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Aviso ao aprovar solicitação no Supabase:', err);
  }
}

/**
 * Rejeita uma solicitação de entrada
 */
export async function rejectCompanyJoinRequest(requestId: string): Promise<void> {
  try {
    await supabase
      .from('company_join_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);
  } catch (err) {
    console.warn('Aviso ao rejeitar solicitação:', err);
  }
}
