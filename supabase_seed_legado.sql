-- ==============================================================================
-- IDEALFLOW — SCRIPT DE DADOS LEGADOS & AMBIENTE COMPLETO PARA APRESENTAÇÃO
-- UID da Usuária: c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4
-- ==============================================================================

-- 1. Garante que as tabelas necessárias existam com todas as colunas
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  name text,
  username text,
  role text,
  avatar_url text,
  sectors jsonb,
  company_workspace jsonb,
  workspace_pin text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id text PRIMARY KEY,
  name text NOT NULL,
  share_code text NOT NULL,
  industry text,
  mission text,
  owner_id uuid,
  key_user_name text,
  key_user_email text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_members (
  id text PRIMARY KEY,
  company_id text REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id text,
  name text NOT NULL,
  email text,
  role text,
  department text,
  is_key_user boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_join_requests (
  id text PRIMARY KEY,
  company_id text REFERENCES public.companies(id) ON DELETE CASCADE,
  company_code text,
  user_id text,
  user_name text NOT NULL,
  user_email text NOT NULL,
  department text,
  role text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ideas (
  id text PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  sector text DEFAULT 'personal',
  priority text DEFAULT 'Normal',
  stage integer DEFAULT 0,
  minutes integer DEFAULT 60,
  dedicated integer DEFAULT 0,
  immediate text,
  clarity text,
  scope text,
  steps jsonb DEFAULT '[]'::jsonb,
  notes jsonb DEFAULT '[]'::jsonb,
  pivots jsonb DEFAULT '[]'::jsonb,
  parent_id text,
  is_project boolean DEFAULT false,
  archived boolean DEFAULT false,
  archived_at text,
  workspace text DEFAULT 'personal',
  company_id text,
  assigned_to text,
  department text,
  five_whys jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Garante que TODAS as colunas existam em todas as tabelas caso já tenham sido criadas anteriormente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sectors jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_workspace jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS workspace_pin text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS share_code text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS mission text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS owner_id uuid;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS key_user_name text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS key_user_email text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS is_key_user boolean DEFAULT false;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS company_code text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS user_name text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS user_email text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.company_join_requests ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS sector text DEFAULT 'personal';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS priority text DEFAULT 'Normal';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS stage integer DEFAULT 0;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS minutes integer DEFAULT 60;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS dedicated integer DEFAULT 0;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS immediate text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS clarity text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS scope text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS steps jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS notes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS pivots jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS parent_id text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_project boolean DEFAULT false;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS archived_at text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS workspace text DEFAULT 'personal';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS five_whys jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Desativa RLS para simplificar a apresentação local ou cria políticas permissivas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permissao publica profiles') THEN
    CREATE POLICY "Permissao publica profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permissao publica companies') THEN
    CREATE POLICY "Permissao publica companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permissao publica company_members') THEN
    CREATE POLICY "Permissao publica company_members" ON public.company_members FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permissao publica company_join_requests') THEN
    CREATE POLICY "Permissao publica company_join_requests" ON public.company_join_requests FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permissao publica ideas') THEN
    CREATE POLICY "Permissao publica ideas" ON public.ideas FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ==============================================================================
-- 2. PERFIL DA CRIADORA TECH
-- ==============================================================================
INSERT INTO public.profiles (
  id,
  name,
  username,
  role,
  avatar_url,
  workspace_pin,
  sectors,
  updated_at
) VALUES (
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Carol Tech',
  'carol_dev',
  'Dev Web & Criadora Tech',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  '1234',
  '[
    {"id": "tech", "name": "Desenvolvimento & Sites", "tone": "cyan"},
    {"id": "insta", "name": "Conteúdo & Instagram", "tone": "pink"},
    {"id": "fitness", "name": "Academia & Dieta", "tone": "amber"},
    {"id": "family", "name": "Família & Vida Pessoal", "tone": "green"},
    {"id": "business", "name": "Projetos & Clientes", "tone": "violet"}
  ]'::jsonb,
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  role = EXCLUDED.role,
  avatar_url = EXCLUDED.avatar_url,
  workspace_pin = EXCLUDED.workspace_pin,
  sectors = EXCLUDED.sectors,
  updated_at = now();

-- ==============================================================================
-- 3. EMPRESAS (DUAS EMPRESAS DA MESMA USUÁRIA)
-- ==============================================================================

-- Empresa 1: A solicitada pelo usuário (comp-supe_585)
INSERT INTO public.companies (
  id,
  name,
  share_code,
  industry,
  mission,
  owner_id,
  key_user_name,
  key_user_email,
  updated_at
) VALUES (
  'comp-supe_585',
  'SuperDev Studio',
  'SUPE-585',
  'Software & Soluções Web de Alta Performance',
  'Criar aplicações web ultrarrápidas, modernas e acessíveis que aceleram o crescimento de negócios digitais.',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Carol Tech (Fundadora)',
  'carol@superdev.com.br',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  share_code = EXCLUDED.share_code,
  industry = EXCLUDED.industry,
  mission = EXCLUDED.mission,
  owner_id = EXCLUDED.owner_id,
  key_user_name = EXCLUDED.key_user_name,
  key_user_email = EXCLUDED.key_user_email,
  updated_at = now();

-- Empresa 2: Segunda empresa (Hub de Conteúdo & Infoprodutos Tech)
INSERT INTO public.companies (
  id,
  name,
  share_code,
  industry,
  mission,
  owner_id,
  key_user_name,
  key_user_email,
  updated_at
) VALUES (
  'comp-spark_920',
  'CodeSpark Creators Lab',
  'SPARK-920',
  'Educação, Mídia & Conteúdo Tech',
  'Democratizar a programação com conteúdos práticos, visuais e de impacto para a nova geração de devs.',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Carol Tech (Fundadora)',
  'carol@codespark.io',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  share_code = EXCLUDED.share_code,
  industry = EXCLUDED.industry,
  mission = EXCLUDED.mission,
  owner_id = EXCLUDED.owner_id,
  key_user_name = EXCLUDED.key_user_name,
  key_user_email = EXCLUDED.key_user_email,
  updated_at = now();

-- ==============================================================================
-- Garante que user_id seja opcional e remove travas de foreign key para membros convidados
ALTER TABLE public.company_members DROP CONSTRAINT IF EXISTS company_members_user_id_fkey;
ALTER TABLE public.company_join_requests DROP CONSTRAINT IF EXISTS company_join_requests_user_id_fkey;
ALTER TABLE public.company_members ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.company_join_requests ALTER COLUMN user_id DROP NOT NULL;

-- 4. MEMBROS DA EQUIPE (EQUIPE DA EMPRESA comp-supe_585)
-- ==============================================================================

-- Carol como Key User & Fundadora
INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-supe-carol',
  'comp-supe_585',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Carol Tech',
  'carol@superdev.com.br',
  'Fundadora & Tech Lead',
  'quality',
  true,
  'active'
) ON CONFLICT (id) DO UPDATE SET is_key_user = true, status = 'active';

-- Gabriel Martins (Dev Fullstack Sênior)
INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-supe-gabriel',
  'comp-supe_585',
  NULL,
  'Gabriel Martins',
  'gabriel.dev@superdev.com.br',
  'Desenvolvedor Fullstack Sênior',
  'tech',
  false,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Camila Siqueira (UI/UX Designer)
INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-supe-camila',
  'comp-supe_585',
  NULL,
  'Camila Siqueira',
  'camila.design@superdev.com.br',
  'Product & UI/UX Designer',
  'quality',
  false,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Felipe Queiroz (QA & Testes)
INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-supe-felipe',
  'comp-supe_585',
  NULL,
  'Felipe Queiroz',
  'felipe.qa@superdev.com.br',
  'Engenheiro de Qualidade & QA',
  'qa',
  false,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Letícia Ramos (Marketing & Growth)
INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-supe-leticia',
  'comp-supe_585',
  NULL,
  'Letícia Ramos',
  'leticia.growth@superdev.com.br',
  'Head de Tráfego & Aquisição B2B',
  'marketing',
  false,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Membros da Empresa 2 (CodeSpark)
INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-spark-carol',
  'comp-spark_920',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Carol Tech',
  'carol@codespark.io',
  'Criadora & Diretora de Conteúdo',
  'quality',
  true,
  'active'
) ON CONFLICT (id) DO UPDATE SET is_key_user = true, status = 'active';

INSERT INTO public.company_members (id, company_id, user_id, name, email, role, department, is_key_user, status)
VALUES (
  'mem-spark-amanda',
  'comp-spark_920',
  NULL,
  'Amanda Torres',
  'amanda.video@codespark.io',
  'Editora de Vídeo & Motion Designer',
  'marketing',
  false,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 5. SOLICITAÇÃO PENDENTE DE ENTRADA NA EMPRESA (Para mostrar ao vivo o Key User aprovando!)
-- ==============================================================================
INSERT INTO public.company_join_requests (
  id,
  company_id,
  company_code,
  user_id,
  user_name,
  user_email,
  department,
  role,
  status,
  created_at
) VALUES (
  'req-rodrigo-101',
  'comp-supe_585',
  'SUPE-585',
  NULL,
  'Rodrigo Alves',
  'rodrigo.devjr@gmail.com',
  'tech',
  'Desenvolvedor Front-end Júnior',
  'pending',
  now() - interval '2 hours'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. IDEIAS PESSOAIS (VIDA REAL: CONTEÚDO TECH, DEV SITES, DIETA, ACADEMIA E FAMÍLIA)
-- ==============================================================================

-- Remove ideias de teste anteriores para recriar o acervo limpo
DELETE FROM public.ideas WHERE user_id = 'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4';

-- IDEIA 1: Reels 5 Erros de React (ESTÁGIO 4: REALIZAÇÃO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes, pivots
) VALUES (
  'idea-p-01',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Reels: 5 Erros que todo Júnior comete em React',
  'Vídeo curto dinâmico mostrando useEffect com dependência errada, mutação de estado e falta de keys no map. Gravado, editado e postado.',
  'insta',
  'Importante',
  4, -- Realização
  90,
  95,
  'Responder aos 120 comentários no Instagram',
  'Gerar engajamento e autoridade técnica para atrair clientes de desenvolvimento.',
  'Reels de até 60 segundos com gancho nos 3 primeiros segundos e chamada para ação no final.',
  'personal',
  false,
  '[
    {"text": "Escrever roteiro com 5 erros comuns e código corrigido", "minutes": 20, "done": true},
    {"text": "Gravar telas no VS Code com fonte Fira Code e tema Dracula", "minutes": 25, "done": true},
    {"text": "Gravar take falado com iluminação suave e microfone de lapela", "minutes": 20, "done": true},
    {"text": "Edição com legendas dinâmicas e zoom nos trechos importantes", "minutes": 25, "done": true},
    {"text": "Publicar às 18h30 com carrossel de capa atrativo", "minutes": 5, "done": true}
  ]'::jsonb,
  '[
    {"id": "n1", "createdAt": "2026-08-15 19:30", "text": "Bateu 48 mil visualizações! Dezenas de DMs elogiando a explicação didática sobre o useEffect."},
    {"id": "n2", "createdAt": "2026-08-16 11:00", "text": "Duas pessoas pediram orçamento para criação de sites institucionais através deste Reels."}
  ]'::jsonb,
  '[]'::jsonb
);

-- IDEIA 2: Carrossel de Arquitetura Serverless (ESTÁGIO 3: PRÁTICA & VALIDAÇÃO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes, pivots
) VALUES (
  'idea-p-02',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Carrossel: Como estruturei minha primeira API Serverless',
  'Passo a passo visual explicando funções serverless na Netlify e Supabase para quem tem medo de backend.',
  'insta',
  'Normal',
  3, -- Prática / Validação
  120,
  80,
  'Revisar os slides 4 e 5 no Canva para garantir contraste',
  'Desmistificar o backend serverless para a comunidade frontend.',
  'Carrossel de 7 lâminas com ilustrações vetoriais e diagrama de fluxo.',
  'personal',
  false,
  '[
    {"text": "Estruturar o texto de cada lâmina no Notion", "minutes": 30, "done": true},
    {"text": "Criar o design das lâminas no Canva seguindo a identidade visual", "minutes": 45, "done": true},
    {"text": "Exportar e testar legibilidade no feed de testes do Instagram", "minutes": 15, "done": false},
    {"text": "Escrever legenda completa com palavras-chave e hashtags de programação", "minutes": 20, "done": false},
    {"text": "Agendar publicação para quinta-feira no melhor horário", "minutes": 10, "done": false}
  ]'::jsonb,
  '[
    {"id": "n3", "createdAt": "2026-09-02 14:15", "text": "A paleta neon sobre fundo escuro ficou perfeita no mockup de celular."}
  ]'::jsonb,
  '[
    {
      "id": "piv-1",
      "date": "2026-09-01",
      "type": "Redução de Escopo",
      "previousScope": "Carrossel de 10 páginas cobrindo AWS Lambda, Cloudflare Workers e Netlify.",
      "newScope": "Focar apenas em Netlify Functions + Supabase para manter o carrossel leve e objetivo.",
      "reason": "10 lâminas ficaria cansativo para o público iniciante no Instagram."
    }
  ]'::jsonb
);

-- IDEIA 3: Automação no Make / n8n para responder DMs (ESTÁGIO 2: MOVIMENTO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes, pivots
) VALUES (
  'idea-p-03',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Automação no Make para DMs: Envio do Template Grátis',
  'Quando alguém comentar "EU QUERO" no post, enviar link do repositório no GitHub automaticamente por direct.',
  'insta',
  'Urgente',
  2, -- Movimento
  90,
  55,
  'Conectar webhook do ManyChat com o Google Sheets',
  'Automatizar a entrega de brindes digitais sem passar 3 horas respondendo DM manual.',
  'Fluxo automatizado conectando Instagram Graph API, webhook e entrega do template.',
  'personal',
  false,
  '[
    {"text": "Criar gatilho de palavra-chave no Manychat", "minutes": 25, "done": true},
    {"text": "Configurar mensagem de boas-vindas com o link de download", "minutes": 20, "done": true},
    {"text": "Fazer teste com conta secundária enviando a palavra teste", "minutes": 20, "done": false},
    {"text": "Subir o post no Instagram anunciando o material gratuito", "minutes": 25, "done": false}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb
);

-- IDEIA 4: Live Coding de Sábado: Clone do Notion (ESTÁGIO 0: FAÍSCA)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes, pivots
) VALUES (
  'idea-p-04',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Live Coding de Sábado: Construir clone do Notion em 1h',
  'Fazer uma transmissão ao vivo no YouTube/Twitch montando um editor de blocos com Tailwind e React TipTap.',
  'insta',
  'Normal',
  0, -- Faísca
  60,
  0,
  'Escolher a biblioteca de editor rica (TipTap vs Slate)',
  'Avaliar interesse da audiência em formato de lives longas de programação prática.',
  'Projetinho simples de bloco de texto e markdown em tempo real.',
  'personal',
  false,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb
);

-- IDEIA 5: Site da Clínica Sorriso & Arte (ESTÁGIO 4: REALIZAÇÃO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes, pivots
) VALUES (
  'idea-p-05',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Desenvolvimento de Site para Clínica Odontológica',
  'Landing page com agendamento direto pelo WhatsApp, depoimentos e integração com Google Meu Negócio. Projeto 100% entregue e aprovado!',
  'business',
  'Importante',
  4, -- Realização
  180,
  190,
  'Emitir nota fiscal e solicitar depoimento em vídeo',
  'Criar presença digital profissional que converte visitantes em consultas agendadas.',
  'Landing page responsiva de 5 seções + SEO local para consultório.',
  'personal',
  false,
  '[
    {"text": "Briefing e alinhamento das cores da clínica", "minutes": 30, "done": true},
    {"text": "Prototipagem rápida no Figma com aprovação da Dra. Carla", "minutes": 45, "done": true},
    {"text": "Codificação com Vite, Tailwind CSS e formulário WhatsApp", "minutes": 60, "done": true},
    {"text": "Configuração de domínio no Registro.br e deploy na Netlify", "minutes": 30, "done": true},
    {"text": "Teste de velocidade no Google PageSpeed (Bateu 99 no mobile)", "minutes": 15, "done": true}
  ]'::jsonb,
  '[
    {"id": "n4", "createdAt": "2026-07-20 16:40", "text": "Cliente super satisfeita! Indicou outro médico para fazer o site no mês que vem."}
  ]'::jsonb,
  '[]'::jsonb
);

-- IDEIA 6: PROJETO MACRO — Redesign E-commerce Loja Aura Moda (ESTÁGIO 2: MOVIMENTO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes, pivots
) VALUES (
  'idea-p-06-macro',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Redesign Completo do E-commerce da Loja Aura Moda',
  'Projeto macro contendo novo design de vitrine, carrinho interativo, busca com filtro rápido e integração de pagamentos.',
  'business',
  'Urgente',
  2, -- Movimento
  320,
  140,
  'Revisar sub-módulo de vitrine e filtros com o cliente',
  'Aumentar taxa de conversão do e-commerce em pelo menos 25%.',
  'Projeto completo dividido em Front-end, Integração de Pagamento e Deploy.',
  'personal',
  true, -- É PROJETO MACRO!
  '[
    {"text": "Alinhar catálogo de produtos e variações de tamanho/cor", "minutes": 60, "done": true},
    {"text": "Aprovar wireframe da página de produto com a diretoria da loja", "minutes": 60, "done": true},
    {"text": "Sub-módulo: Desenvolver Vitrine e Carrinho Responsivo", "minutes": 120, "done": false},
    {"text": "Sub-módulo: Integrar Checkout com Mercado Pago e Frete Melhor Envio", "minutes": 80, "done": false}
  ]'::jsonb,
  '[
    {"id": "n5", "createdAt": "2026-09-10 11:20", "text": "Contrato assinado no valor de R$ 6.200 com 50% de entrada já recebido."}
  ]'::jsonb,
  '[]'::jsonb
);

-- Sub-tarefa do projeto macro: Vitrine
INSERT INTO public.ideas (
  id, user_id, parent_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps
) VALUES (
  'idea-p-06-sub1',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'idea-p-06-macro',
  'Aura Moda: Vitrine & Filtros de Categoria',
  'Interface de exibição dos vestidos e sapatos com filtro por tamanho, cor e preço.',
  'business',
  'Urgente',
  3, -- Prática / Validação
  120,
  110,
  'Polir a animação de adicionar ao carrinho',
  'Permitir que a cliente filtre o produto em menos de 2 cliques.',
  'Componente de grid responsivo com busca instantânea.',
  'personal',
  false,
  '[
    {"text": "Criar mock de produtos com imagens em WebP otimizadas", "minutes": 40, "done": true},
    {"text": "Implementar drawer lateral de filtros no celular", "minutes": 45, "done": true},
    {"text": "Adicionar estado de loading esqueleto para conexões 4G lentas", "minutes": 35, "done": true}
  ]'::jsonb
);

-- Sub-tarefa do projeto macro: Checkout
INSERT INTO public.ideas (
  id, user_id, parent_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps
) VALUES (
  'idea-p-06-sub2',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'idea-p-06-macro',
  'Aura Moda: Checkout Transparente Pix & Cartão',
  'Integração direta com API de pagamentos gerando QR Code Pix dinâmico.',
  'business',
  'Urgente',
  1, -- Estrutura
  100,
  20,
  'Configurar credenciais da sandbox do Mercado Pago',
  'Zero fricção no pagamento para diminuir abandono de carrinho.',
  'Fluxo de checkout de página única.',
  'personal',
  false,
  '[
    {"text": "Cadastrar webhook para receber notificação de Pix pago", "minutes": 40, "done": false},
    {"text": "Criar tela de confirmação de pedido com botão de compartilhar", "minutes": 40, "done": false},
    {"text": "Testar compra simulada no ambiente de testes", "minutes": 20, "done": false}
  ]'::jsonb
);

-- IDEIA 7: Template Starter em Tailwind v4 (ESTÁGIO 1: ESTRUTURA)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps
) VALUES (
  'idea-p-07',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Criar Template Starter de Landing Pages em Tailwind v4',
  'Boilerplate moderno com formulários validados, dark mode, animações suaves e SEO pronto para acelerar novos projetos de clientes.',
  'tech',
  'Normal',
  1, -- Estrutura
  120,
  35,
  'Separar os 5 componentes de Hero Section mais pedidos',
  'Economizar 15 horas de desenvolvimento a cada novo cliente de landing page.',
  'Repositório base no GitHub pronto para clonar.',
  'personal',
  false,
  '[
    {"text": "Definir padrão de tipografia e paleta neutra no Tailwind v4", "minutes": 35, "done": true},
    {"text": "Montar componente de Hero Section e Barra de Navegação mobile", "minutes": 45, "done": false},
    {"text": "Integrar biblioteca de formulários leve com máscara de telefone", "minutes": 40, "done": false}
  ]'::jsonb
);

-- IDEIA 8: Academia & Dieta: Meta de Hipertrofia (ESTÁGIO 3: PRÁTICA & VALIDAÇÃO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes
) VALUES (
  'idea-p-08',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Rotina de Treino 4x na Semana + 120g de Proteína',
  'Manter constância no treino de musculação (Divisão AB) para ter disposição na rotina de dev e gravações. Já na 7ª semana firme!',
  'fitness',
  'Urgente',
  3, -- Prática / Validação
  60,
  180,
  'Separar a roupa de treino da noite anterior para não ter desculpa',
  'Mais energia física, redução de dores nas costas por ficar sentada codando e mente mais focada.',
  '4 treinos semanais de 50 minutos + meta de hidratação de 2,5 litros de água.',
  'personal',
  false,
  '[
    {"text": "Bater meta diária de 2,5 litros de água (garrafinha na mesa sempre)", "minutes": 10, "done": true},
    {"text": "Tomar creatina todos os dias logo após o almoço", "minutes": 5, "done": true},
    {"text": "Treino A: Membros Superiores + Abdômen", "minutes": 50, "done": true},
    {"text": "Treino B: Membros Inferiores com foco em quadríceps", "minutes": 50, "done": false}
  ]'::jsonb,
  '[
    {"id": "n6", "createdAt": "2026-10-12 08:30", "text": "Treinei às 07h da manhã antes de começar a codar. O dia rendeu o dobro!"},
    {"id": "n7", "createdAt": "2026-10-20 20:15", "text": "Progredi a carga no agachamento e no supino com halteres. Sentindo menos fadiga postural."}
  ]'::jsonb
);

-- IDEIA 9: Marmitas Saudáveis do Domingo (ESTÁGIO 2: MOVIMENTO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps
) VALUES (
  'idea-p-09',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Meal Prep aos Domingos: 8 Marmitas Saudáveis da Semana',
  'Cozinhar arroz integral, frango grelhado desfiado, legumes no vapor e congelar para a semana de trabalho corrido.',
  'fitness',
  'Importante',
  2, -- Movimento
  90,
  60,
  'Fazer lista de compras no sacolão para domingo cedo',
  'Evitar pedir delivery por cansaço após horas de programação no fim da tarde.',
  '8 porções equilibradas armazenadas em potes de vidro.',
  'personal',
  false,
  '[
    {"text": "Comprar peito de frango, batata-doce, brócolis e cenoura", "minutes": 30, "done": true},
    {"text": "Temperar o frango com ervas, páprica defumada e limão", "minutes": 20, "done": true},
    {"text": "Assar os legumes na airfryer e grelhar as proteínas", "minutes": 40, "done": false},
    {"text": "Montar as marmitas e etiquetar com as datas", "minutes": 15, "done": false}
  ]'::jsonb
);

-- IDEIA 10: Almoço de Família e Aniversário da Mãe (ESTÁGIO 4: REALIZAÇÃO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps, notes
) VALUES (
  'idea-p-10',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Almoço Especial em Família: Aniversário da Mãe',
  'Organizar surpresa de 55 anos da mãe, reunir irmãos, encomendar bolo de frutas vermelhas e passar domingo juntos sem olhar o celular.',
  'family',
  'Urgente',
  4, -- Realização
  120,
  140,
  'Imprimir as 3 melhores fotos antigas para colocar num porta-retrato',
  'Valorizar o tempo com quem realmente importa e recarregar a energia emocional.',
  'Almoço de domingo em restaurante acolhedor com 12 pessoas da família.',
  'personal',
  false,
  '[
    {"text": "Criar grupo secreto com irmãos para dividir a conta do bolo", "minutes": 15, "done": true},
    {"text": "Reservar mesa grande no restaurante italiano preferido dela", "minutes": 20, "done": true},
    {"text": "Encomendar bolo artesanal com recheio de ninho e frutas", "minutes": 25, "done": true},
    {"text": "Comprar presente (leitor Kindle que ela tanto queria)", "minutes": 30, "done": true},
    {"text": "Almoço e comemoração em família", "minutes": 120, "done": true}
  ]'::jsonb,
  '[
    {"id": "n8", "createdAt": "2026-09-22 17:00", "text": "Ela chorou de emoção quando viu o bolo e a família toda reunida! Momento inesquecível."}
  ]'::jsonb
);

-- IDEIA 11: Upgrade do Home Office (ESTÁGIO 2: MOVIMENTO)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps
) VALUES (
  'idea-p-11',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Upgrade Ergonômico do Home Office & Cenário de Gravação',
  'Instalar braço articulado para o monitor duplo, fita LED de fundo para os Reels e apoio de pés.',
  'family',
  'Normal',
  2, -- Movimento
  90,
  45,
  'Organizar o cabeamento debaixo da mesa com canaletas',
  'Cenário bonito para vídeos e postura correta para não travar a lombar.',
  'Mesa limpa, ergonômica e pronta para gravar vídeos em qualquer momento.',
  'personal',
  false,
  '[
    {"text": "Comprar suporte articulado a gás de 2 telas", "minutes": 25, "done": true},
    {"text": "Fixar na mesa e regular altura na linha dos olhos", "minutes": 35, "done": true},
    {"text": "Instalar canaleta adesiva para esconder fios de energia e HDMI", "minutes": 30, "done": false}
  ]'::jsonb
);

-- IDEIA 12: Viagem de Fim de Ano em Família (ESTÁGIO 1: ESTRUTURA)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, steps
) VALUES (
  'idea-p-12',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'Viagem de Fim de Ano da Família para Ubatuba',
  'Alugar casa com quintal e churrasqueira perto da praia para passar o Réveillon com pais e irmãos.',
  'family',
  'Importante',
  1, -- Estrutura
  60,
  20,
  'Cotar 3 opções de casas no Airbnb e mandar no grupo da família',
  'Descanso real de 7 dias após o ano intenso de entregas e novos clientes.',
  'Casa para 8 pessoas do dia 28/12 ao dia 03/01.',
  'personal',
  false,
  '[
    {"text": "Checar datas de recesso de todos os familiares", "minutes": 20, "done": true},
    {"text": "Salvar 4 casas com boa avaliação e preço acessível", "minutes": 30, "done": false},
    {"text": "Confirmar reserva com pagamento parcelado", "minutes": 20, "done": false}
  ]'::jsonb
);

-- IDEIA 13: ARQUIVADA — Protótipo de App em React Native (HISTÓRICO DE MESES)
INSERT INTO public.ideas (
  id, user_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, archived, archived_at, steps
) VALUES (
  'idea-p-13-archived',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'App Mobile de Hábitos em React Native (Arquivado)',
  'Ideia inicial de criar um app nativo de hábitos. Decidi focar primeiro no Ideaflow web responsivo e arquivar o mobile nativo por enquanto.',
  'tech',
  'Normal',
  1,
  60,
  60,
  'Ideia arquivada com sucesso',
  'Manter o histórico sem poluir o funil principal.',
  'App mobile em Expo com notificações push.',
  'personal',
  false,
  true, -- Arquivada!
  '2026-06-14 10:00:00',
  '[]'::jsonb
);

-- ==============================================================================
-- 7. IDEIAS DA EMPRESA 1 (comp-supe_585) — SUPERDEV STUDIO
-- ==============================================================================

-- IDEIA EMPRESA 1: Pipeline CI/CD Netlify (ESTÁGIO 4: REALIZAÇÃO)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps, notes
) VALUES (
  'idea-e-01',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-supe_585',
  'Pipeline de CI/CD com GitHub Actions e Netlify Functions',
  'Automatizar deploys e testes a cada Pull Request aprovado na branch main com zero downtime para clientes.',
  'tech',
  'Importante',
  4, -- Realização
  120,
  130,
  'Monitorar métricas de build na primeira semana',
  'Reduzir tempo de deploy de clientes de 40 minutos manuais para 90 segundos automáticos.',
  'Pipeline completo com lint, type-check e deploy preview automático.',
  'business',
  false,
  'tech',
  'Gabriel Martins',
  '[
    {"text": "Configurar secrets de build e tokens de deploy no GitHub", "minutes": 30, "done": true},
    {"text": "Escrever workflow .github/workflows/deploy.yml", "minutes": 40, "done": true},
    {"text": "Testar build com branch simulada e verificar preview no Netlify", "minutes": 30, "done": true},
    {"text": "Documentar processo no Notion da equipe SuperDev", "minutes": 20, "done": true}
  ]'::jsonb,
  '[
    {"id": "ne1", "createdAt": "2026-09-18 15:40", "text": "Pipeline rodando com 100% de sucesso. Nossos deploys agora levam apenas 1m15s!"}
  ]'::jsonb
);

-- IDEIA EMPRESA 2: Design System SuperDev (ESTÁGIO 3: PRÁTICA & VALIDAÇÃO)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps
) VALUES (
  'idea-e-02',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-supe_585',
  'Design System Interno: Componentes UI Reutilizáveis',
  'Biblioteca de botões, modais, drawers, inputs e tabelas em Tailwind + Radix UI para acelerar a entrega de novos contratos.',
  'quality',
  'Importante',
  3, -- Prática / Validação
  180,
  140,
  'Revisar acessibilidade WCAG dos seletores e alertas',
  'Padronizar a excelência visual dos clientes da agência e dobrar a velocidade da equipe.',
  'Conjunto de 25 componentes com documentação no Storybook.',
  'business',
  false,
  'quality',
  'Camila Siqueira',
  '[
    {"text": "Definir tokens de cores, sombras e raio de borda no Figma", "minutes": 45, "done": true},
    {"text": "Codificar botões, badges, modais e campos de formulário", "minutes": 60, "done": true},
    {"text": "Testar navegação 100% por teclado e leitor de tela", "minutes": 45, "done": true},
    {"text": "Publicar versão 1.0 no pacote npm privado da agência", "minutes": 30, "done": false}
  ]'::jsonb
);

-- IDEIA EMPRESA 3: Testes Automatizados E2E Playwright (ESTÁGIO 2: MOVIMENTO)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps
) VALUES (
  'idea-e-03',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-supe_585',
  'Automação de Testes E2E nos Fluxos de Cadastro e Checkout',
  'Garantir que nenhum bug passe despercebido antes de subir para produção nos sites dos nossos clientes.',
  'qa',
  'Urgente',
  2, -- Movimento
  120,
  70,
  'Criar suíte de testes para recuperação de senha e formulário de contato',
  'Zero chamados de erro crítico em produção.',
  'Script em Playwright cobrindo Chrome, Firefox e Safari mobile.',
  'business',
  false,
  'qa',
  'Felipe Queiroz',
  '[
    {"text": "Instalar Playwright e configurar mock de APIs", "minutes": 30, "done": true},
    {"text": "Escrever teste de ponta a ponta do fluxo de cadastro com sucesso", "minutes": 40, "done": true},
    {"text": "Escrever testes de validação de campos obrigatórios e e-mail inválido", "minutes": 30, "done": false},
    {"text": "Integrar testes no GitHub Actions antes de cada merge", "minutes": 20, "done": false}
  ]'::jsonb
);

-- IDEIA EMPRESA 4: Campanha Google Ads B2B (ESTÁGIO 1: ESTRUTURA)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps
) VALUES (
  'idea-e-04',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-supe_585',
  'Campanha de Tráfego Pago Google Ads para Captação de Clientes',
  'Atrair empresas que precisam renovar seus portais web ou criar sistemas internos sob medida.',
  'marketing',
  'Normal',
  1, -- Estrutura
  90,
  30,
  'Definir lista de 20 palavras-chave com alta intenção de compra',
  'Gerar 15 reuniões de vendas qualificadas no próximo mês.',
  'Campanha de rede de pesquisa focada em empresas de médio porte.',
  'business',
  false,
  'marketing',
  'Letícia Ramos',
  '[
    {"text": "Pesquisa de concorrentes e palavras-chave negativas", "minutes": 30, "done": true},
    {"text": "Redação de 3 variações de anúncios persuasivos", "minutes": 30, "done": false},
    {"text": "Configurar pixel de conversão na página de obrigado da SuperDev", "minutes": 30, "done": false}
  ]'::jsonb
);

-- IDEIA EMPRESA 5: Plataforma SaaS de Monitoramento (ESTÁGIO 0: FAÍSCA)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps
) VALUES (
  'idea-e-05',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-supe_585',
  'Bot de Notificação no Telegram quando o Site do Cliente Cair',
  'Ping automático a cada 5 minutos em todas as URLs ativas dos clientes da agência.',
  'tech',
  'Normal',
  0, -- Faísca
  45,
  0,
  'Esboçar arquitetura com cron job da Netlify ou Cloudflare Worker',
  'Avisar o cliente antes que ele mesmo perceba a queda do servidor.',
  'Serviço leve de health-check com alerta instantâneo.',
  'business',
  false,
  'tech',
  'Gabriel Martins',
  '[]'::jsonb
);

-- ==============================================================================
-- 8. IDEIAS DA EMPRESA 2 (comp-spark_920) — CODESPARK CREATORS LAB
-- ==============================================================================

-- IDEIA CODESPARK 1: Mini-Curso Do Figma ao Código (ESTÁGIO 3: PRÁTICA & VALIDAÇÃO)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps, notes
) VALUES (
  'idea-spark-01',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-spark_920',
  'Mini-Curso Gratuito: Do Figma ao Código em 3 Dias',
  'Treinamento prático ensinando a pegar um layout no Figma e transformar em site responsivo no VS Code com HTML semântico e Tailwind.',
  'marketing',
  'Importante',
  3, -- Prática / Validação
  150,
  120,
  'Gravar a aula 3 com o deploy no Netlify',
  'Ajudar 1.000 pessoas a tirarem seu primeiro projeto do papel e construir lista de e-mails.',
  '3 aulas gravadas de 25 minutos + material de apoio em PDF.',
  'business',
  false,
  'marketing',
  'Carol Tech',
  '[
    {"text": "Criar o design exclusivo no Figma para os alunos codificarem", "minutes": 45, "done": true},
    {"text": "Gravar Aula 1: Estruturando o HTML semântico e tags meta", "minutes": 35, "done": true},
    {"text": "Gravar Aula 2: Estilização moderna com Tailwind CSS e flexbox", "minutes": 40, "done": true},
    {"text": "Gravar Aula 3: Publicando o site de graça na Netlify com domínio", "minutes": 30, "done": false}
  ]'::jsonb,
  '[
    {"id": "nsp1", "createdAt": "2026-10-15 14:00", "text": "Mais de 350 pessoas já se inscreveram na lista de espera através do link da bio do Instagram!"}
  ]'::jsonb
);

-- IDEIA CODESPARK 2: Pack de Templates Notion para Devs (ESTÁGIO 1: ESTRUTURA)
INSERT INTO public.ideas (
  id, user_id, company_id, title, summary, sector, priority, stage, minutes, dedicated, immediate, clarity, scope, workspace, is_project, department, assigned_to, steps
) VALUES (
  'idea-spark-02',
  'c0efe1ff-1bf6-443a-9b1b-a3dba995d8d4',
  'comp-spark_920',
  'Kit de Produtividade Notion para Devs Freelancers',
  'Dashboard com gerenciador de clientes, controle financeiro de projetos e repositório de snippets de código.',
  'quality',
  'Normal',
  1, -- Estrutura
  90,
  35,
  'Finalizar a aba de precificação automática de hora/projeto',
  'Oferecer um produto digital acessível de R$ 37 para monetizar a audiência.',
  'Template completo com vídeo explicativo de 10 minutos.',
  'business',
  false,
  'quality',
  'Amanda Torres',
  '[
    {"text": "Estruturar as bases de dados de Clientes e Contratos", "minutes": 30, "done": true},
    {"text": "Criar galeria de atalhos e links úteis de desenvolvimento", "minutes": 30, "done": false},
    {"text": "Montar a página na Kiwify para checkout", "minutes": 30, "done": false}
  ]'::jsonb
);

-- ==============================================================================
-- 9. FINALIZAÇÃO E RELATÓRIO DO SCRIPT
-- ==============================================================================
SELECT
  'DADOS CARREGADOS COM SUCESSO! 🚀' as status,
  (SELECT count(*) FROM public.ideas WHERE workspace = 'personal') as ideias_pessoais,
  (SELECT count(*) FROM public.ideas WHERE workspace = 'business') as ideias_empresariais,
  (SELECT count(*) FROM public.companies) as empresas_cadastradas,
  (SELECT count(*) FROM public.company_members) as membros_de_equipe,
  (SELECT count(*) FROM public.company_join_requests) as solicitacoes_pendentes;

