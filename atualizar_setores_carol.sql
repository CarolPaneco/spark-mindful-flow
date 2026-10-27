-- ==============================================================================
-- ATUALIZAÇÃO IMEDIATA DE SETORES PARA O USUÁRIO c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4
-- Execute este bloco completo no SQL Editor do Supabase (1 clique)
-- ==============================================================================

-- 1. Garante a existência da coluna sectors na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sectors jsonb;

-- 2. Atualiza o perfil da Carol com os 5 setores organizados e cores vibrantes
UPDATE public.profiles
SET sectors = '[
  {"id": "tech", "name": "Desenvolvimento & Sites", "tone": "cyan"},
  {"id": "insta", "name": "Conteúdo & Instagram", "tone": "pink"},
  {"id": "fitness", "name": "Academia & Dieta", "tone": "amber"},
  {"id": "family", "name": "Família & Vida Pessoal", "tone": "green"},
  {"id": "business", "name": "Projetos & Clientes", "tone": "violet"}
]'::jsonb,
updated_at = now()
WHERE id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4';

-- 3. Atualiza cada ideia no banco para seu setor correspondente e workspace 'personal' estrito
UPDATE public.ideas
SET sector = 'family', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%ubatuba%' OR title ILIKE '%viagem de fim de ano%');

UPDATE public.ideas
SET sector = 'tech', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%live coding%' OR title ILIKE '%notion%');

UPDATE public.ideas
SET sector = 'business', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%checkout transparente%' OR title ILIKE '%aura moda: checkout%');

UPDATE public.ideas
SET sector = 'tech', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%template starter%' OR title ILIKE '%tailwind%');

UPDATE public.ideas
SET sector = 'tech', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%upgrade ergonômico%' OR title ILIKE '%home office%');

UPDATE public.ideas
SET sector = 'business', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%redesign completo do e-commerce%' OR title ILIKE '%loja aura moda%');

UPDATE public.ideas
SET sector = 'fitness', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%meal prep%' OR title ILIKE '%marmitas%');

UPDATE public.ideas
SET sector = 'insta', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%automação no make%' OR title ILIKE '%template grátis%' OR title ILIKE '%dms%');

UPDATE public.ideas
SET sector = 'business', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%vitrine & filtros%' OR title ILIKE '%aura moda: vitrine%');

UPDATE public.ideas
SET sector = 'insta', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%carrossel%' OR title ILIKE '%serverless%');

UPDATE public.ideas
SET sector = 'fitness', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%rotina de treino%' OR title ILIKE '%proteína%');

UPDATE public.ideas
SET sector = 'business', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%clínica odontológica%' OR title ILIKE '%odontol%');

UPDATE public.ideas
SET sector = 'family', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%almoço especial%' OR title ILIKE '%aniversário da mãe%');

UPDATE public.ideas
SET sector = 'insta', workspace = 'personal', company_id = NULL
WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4'
  AND (title ILIKE '%reels%' OR title ILIKE '%erros que todo júnior%');

-- Confirmação rápida
SELECT id, title, sector, workspace, company_id FROM public.ideas WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4';
