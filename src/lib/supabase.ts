import { createClient, type User, type Session } from '@supabase/supabase-js';
import type { Idea, FlowData } from './ideaflow';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vhljktzcvqzwssmvbznx.supabase.co';
const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGprdHpjdnF6d3NzbXZiem54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5ODM3NzgsImV4cCI6MjEwNzU1OTc3OH0.038F4A9BrYERvqzSYg-efASctcJxM5qx7fUf5m4fzqE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface AuthProfile {
  id: string;
  name?: string | undefined;
  username?: string | undefined;
  role?: string | undefined;
  avatar_url?: string | undefined;
}

/**
 * Converte ideia do Supabase para formato interno do Ideaflow
 */
export function rowToIdea(row: any): Idea {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary || '',
    sector: row.sector || 'personal',
    priority: row.priority || 'Normal',
    stage: row.stage ?? 0,
    minutes: row.minutes ?? 60,
    dedicated: row.dedicated ?? 0,
    immediate: row.immediate || '',
    clarity: row.clarity || '',
    scope: row.scope || '',
    steps: Array.isArray(row.steps) ? row.steps : [],
    notes: Array.isArray(row.notes) ? row.notes : [],
    pivots: Array.isArray(row.pivots) ? row.pivots : [],
    parentId: row.parent_id || undefined,
    isProject: Boolean(row.is_project),
    archived: Boolean(row.archived),
    archivedAt: row.archived_at || undefined,
  };
}

/**
 * Converte ideia do Ideaflow para linha do Supabase
 */
export function ideaToRow(idea: Idea, userId: string) {
  return {
    id: idea.id,
    user_id: userId,
    title: idea.title,
    summary: idea.summary || '',
    sector: idea.sector || 'personal',
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
 * Sincroniza uma lista de ideias com o Supabase (Upsert em lote)
 */
export async function syncIdeasToSupabase(ideas: Idea[], userId: string): Promise<void> {
  if (!userId || ideas.length === 0) return;

  const rows = ideas.map(idea => ideaToRow(idea, userId));

  const { error } = await supabase.from('ideas').upsert(rows, { onConflict: 'id' });

  if (error) {
    console.warn('Erro ao sincronizar ideias com Supabase:', error);
    throw error;
  }
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
export async function upsertUserProfile(profile: AuthProfile): Promise<void> {
  await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
}

