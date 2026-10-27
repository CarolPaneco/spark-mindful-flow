import { i as __toESM } from "../_runtime.mjs";
import { c as formatMinutes, n as calculateSectorAnalytics, t as calculateGlobalSectorComparison } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as Heart, $t as Activity, Ct as Clock, It as ChartColumn, N as Pencil, Ot as CircleCheck, Pt as Check, Ut as BriefcaseBusiness, X as Layers, _ as Sparkles, ct as Flower2, d as Trash2, f as Target, j as Plus, jt as ChevronRight, l as TriangleAlert, n as X, nt as Hammer, qt as ArrowUpRight, r as WandSparkles, u as TrendingUp, w as Shapes, xt as CodeXml } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFlow, t as Button } from "./ai-assistant-3aCui_AD.mjs";
import { i as Bar, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
import { a as IdeaDetail, i as DrawerTitle, n as DrawerContent, r as DrawerDescription, t as Drawer$1 } from "./idea-detail-De8DGVyi.mjs";
import { t as FocusTimer } from "./focus-timer-BQa0LN4H.mjs";
import { t as IdeaCard } from "./idea-card-DWCdOy6O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setores-D7wsIA45.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var READY_SECTOR_TEMPLATES = [
	{
		id: "tecnologia",
		name: "Tecnologia & Inovação",
		tone: "cyan",
		iconName: "tech",
		description: "Projetos de software, inteligência artificial, portfólio e aprendizados técnicos.",
		starterIdeas: [
			{
				title: "Criar meu Portfólio Moderno & Vitrine de Projetos",
				summary: "Construir um site veloz e elegante para apresentar minhas realizações e habilidades ao mundo.",
				priority: "Importante",
				immediate: "Listar os 3 melhores projetos que já construí ou quero construir.",
				clarity: "Sua história e o que você constrói merecem um palco claro e profissional.",
				scope: "Página web responsiva com apresentação pessoal, 3 projetos com links e contato direto.",
				minutes: 90,
				steps: [
					{
						text: "Listar os 3 projetos principais e seus diferenciais em 1 página",
						minutes: 20
					},
					{
						text: "Estruturar o layout visual (Hero, Projetos, Sobre mim, Contato)",
						minutes: 30
					},
					{
						text: "Montar a versão funcional e testar em celular e computador",
						minutes: 25
					},
					{
						text: "Publicar online e compartilhar link com 3 colegas para feedback",
						minutes: 15
					}
				]
			},
			{
				title: "MVP de um Aplicativo / Ferramenta Digital",
				summary: "Validar uma solução simples e prática para resolver um problema real.",
				priority: "Urgente",
				immediate: "Definir o problema central em 1 frase e o resultado esperado em 15 minutos.",
				clarity: "O melhor aplicativo é o menor possível que resolve uma dor de verdade.",
				scope: "Primeira versão navegável focada no fluxo essencial, sem recursos secundários.",
				minutes: 120,
				steps: [
					{
						text: "Escrever o problema do usuário e a única ação central do app",
						minutes: 20
					},
					{
						text: "Desenhar no papel as 3 telas principais do fluxo",
						minutes: 25
					},
					{
						text: "Desenvolver a versão 0.1 com funcionalidade básica operando",
						minutes: 55
					},
					{
						text: "Testar com 2 pessoas reais observando onde elas clicam",
						minutes: 20
					}
				]
			},
			{
				title: "Dominar uma Nova Stack / Ferramenta de IA",
				summary: "Aprofundar em uma ferramenta que alavanque minha produtividade e capacidade técnica.",
				priority: "Normal",
				immediate: "Escolher a ferramenta exata e assistir a um tutorial prático de 15 min.",
				clarity: "Aprender na prática construindo um micro-projeto fixa 10x mais que teoria pura.",
				scope: "Construir 1 mini-experimento funcional usando a nova tecnologia em até 3 dias.",
				minutes: 60,
				steps: [
					{
						text: "Instalar a ferramenta ou configurar chave/ambiente de testes",
						minutes: 15
					},
					{
						text: "Seguir tutorial básico construindo o clássico \"Hello World\"",
						minutes: 20
					},
					{
						text: "Criar uma funcionalidade personalizada adaptada a uma ideia minha",
						minutes: 25
					}
				]
			}
		]
	},
	{
		id: "relacionamento",
		name: "Relacionamento & Família",
		tone: "pink",
		iconName: "relationship",
		description: "Momentos especiais, conexões afetivas com quem amamos e tempo de qualidade.",
		starterIdeas: [
			{
				title: "Planejar Viagem ou Final de Semana Especial",
				summary: "Criar memórias inesquecíveis fora da rotina com quem é importante para mim.",
				priority: "Importante",
				immediate: "Abrir um mapa ou site e listar 3 opções de lugares aconchegantes.",
				clarity: "Viagens não são gastos, são investimentos em conexões e descanso profundo.",
				scope: "Definição de destino, orçamento estimado, hospedagem e roteiro leve de 2 dias.",
				minutes: 60,
				steps: [
					{
						text: "Alinhar datas livres no calendário e preferência de destino",
						minutes: 15
					},
					{
						text: "Pesquisar 3 opções de estadias agradáveis e custo estimado",
						minutes: 25
					},
					{
						text: "Fazer reserva e combinar detalhes práticos de transporte",
						minutes: 20
					}
				]
			},
			{
				title: "Noite Sem Telas: Jantar & Conversas Significativas",
				summary: "Desconectar dos celulares para um momento de presença real e risadas sinceras.",
				priority: "Normal",
				immediate: "Escolher um dia desta semana e convidar com carinho.",
				clarity: "A presença inteira é o presente mais valioso que podemos dar a alguém.",
				scope: "Jantar caseiro ou especial sem notificações, com música agradável e conversa aberta.",
				minutes: 45,
				steps: [
					{
						text: "Escolher a receita ou prato favorito para a ocasião",
						minutes: 15
					},
					{
						text: "Comprar os ingredientes frescos na quitanda ou mercado",
						minutes: 20
					},
					{
						text: "Guardar os celulares em uma cesta e aproveitar a noite inteira",
						minutes: 10
					}
				]
			},
			{
				title: "Reconectar com Amigos Queridos",
				summary: "Retomar contato com pessoas queridas que a correria do dia a dia acabou afastando.",
				priority: "Normal",
				immediate: "Mandar uma mensagem carinhosa para 1 amigo especial agora.",
				clarity: "Grandes amizades não precisam de frequência diária, precisam de sinceridade e lembrança.",
				scope: "Mensagem de afeto para 3 amigos e marcação de um café ou chamada de vídeo.",
				minutes: 30,
				steps: [
					{
						text: "Listar 3 amigos queridos que sinto saudade",
						minutes: 5
					},
					{
						text: "Enviar uma mensagem espontânea perguntando como eles estão",
						minutes: 10
					},
					{
						text: "Marcar um encontro presencial ou ligar para colocar a conversa em dia",
						minutes: 15
					}
				]
			}
		]
	},
	{
		id: "saude",
		name: "Saúde & Bem-Estar",
		tone: "green",
		iconName: "health",
		description: "Vitalidade do corpo, mente serena, alimentação consciente e sono reparador.",
		starterIdeas: [
			{
				title: "Ritmo de Treinos & Movimento Diário (3x por semana)",
				summary: "Construir o hábito sustentável de se exercitar com prazer e sem extremos.",
				priority: "Urgente",
				immediate: "Separar tênis e roupa de treino perto da cama para amanhã cedo.",
				clarity: "Consistência moderada bate intensidade esporádica todos os dias.",
				scope: "Completar 3 sessões de 30 a 45 minutos de exercício por semana durante 21 dias.",
				minutes: 60,
				steps: [
					{
						text: "Definir os 3 dias da semana e os horários fixos de treino",
						minutes: 10
					},
					{
						text: "Montar roteiro simples de exercícios ou caminhada/corrida",
						minutes: 20
					},
					{
						text: "Realizar o primeiro treino comemorando a vitória do primeiro passo",
						minutes: 30
					}
				]
			},
			{
				title: "Alimentação Consciente & Marmitas Práticas da Semana",
				summary: "Comer com mais qualidade, economizar e evitar o piloto automático do delivery.",
				priority: "Importante",
				immediate: "Escrever no bloco de notas o cardápio simples para os próximos 3 almoços.",
				clarity: "Cuidar do que colocamos no prato é cuidar da nossa clareza mental e energia.",
				scope: "Planejamento e preparo de 3 refeições equilibradas com alimentos de verdade.",
				minutes: 90,
				steps: [
					{
						text: "Montar lista de compras com legumes, verduras e fontes de proteína",
						minutes: 15
					},
					{
						text: "Fazer feira ou mercado focado apenas na lista",
						minutes: 35
					},
					{
						text: "Cozinhar e porcionar os recipientes para a semana",
						minutes: 40
					}
				]
			},
			{
				title: "Higiene do Sono & Rotina Noturna Leve",
				summary: "Acordar com disposição e energia renovada através de um ritual de desaceleração.",
				priority: "Normal",
				immediate: "Configurar alarme para desligar telas 45 minutos antes de dormir.",
				clarity: "O seu dia produtivo de amanhã começa na noite de hoje.",
				scope: "Desconectar telas às 22h, ler livro físico e manter quarto escuro e fresco.",
				minutes: 30,
				steps: [
					{
						text: "Colocar o celular para carregar fora do alcance da cama",
						minutes: 5
					},
					{
						text: "Preparar um chá quente de camomila ou melissa",
						minutes: 10
					},
					{
						text: "Ler 10 páginas de um livro agradável com luz baixa",
						minutes: 15
					}
				]
			}
		]
	},
	{
		id: "negocios",
		name: "Negócios & Carreira",
		tone: "violet",
		iconName: "business",
		description: "Crescimento profissional, produtos, clientes, monetização e estabilidade financeira.",
		starterIdeas: [
			{
				title: "Lançar Nova Oferta de Serviço ou Consultoria",
				summary: "Estruturar uma solução clara e apresentar para os primeiros clientes potenciais.",
				priority: "Urgente",
				immediate: "Escrever em 1 parágrafo: quem eu ajudo, qual resultado entrego e o preço.",
				clarity: "Dinheiro é o subproduto do valor real que você gera na vida das pessoas.",
				scope: "Definição da oferta em 1 página e contato direto com 3 prospectos qualificados.",
				minutes: 90,
				steps: [
					{
						text: "Mapear a maior dor dos meus clientes ideais",
						minutes: 20
					},
					{
						text: "Escrever a proposta de valor e garantia em tópicos claros",
						minutes: 30
					},
					{
						text: "Enviar mensagem para 3 pessoas com convite de conversa diagnóstica",
						minutes: 40
					}
				]
			},
			{
				title: "Organizar Finanças & Reserva de Emergência",
				summary: "Conquistar paz de espírito financeira mapeando gastos e poupando intencionalmente.",
				priority: "Importante",
				immediate: "Abrir o extrato do último mês e categorizar os 5 maiores gastos.",
				clarity: "Paz financeira não depende apenas de quanto entra, mas do controle do que sai.",
				scope: "Planilha ou anotação simples com receitas, despesas fixas e meta de reserva para 6 meses.",
				minutes: 60,
				steps: [
					{
						text: "Listar gastos fixos e identificar 2 assinaturas que posso cancelar hoje",
						minutes: 20
					},
					{
						text: "Definir o valor mensal automático que vai direto para a reserva",
						minutes: 15
					},
					{
						text: "Configurar transferência programada logo após o recebimento",
						minutes: 25
					}
				]
			},
			{
				title: "Otimizar Posicionamento Profissional & LinkedIn",
				summary: "Atrair melhores oportunidades comunicando com autoridade o que sei fazer de melhor.",
				priority: "Normal",
				immediate: "Atualizar o título do perfil destacando a transformação que gero.",
				clarity: "Quem comunica com clareza lidera e se destaca no mercado.",
				scope: "Revisão do perfil, foto profissional e publicação de 1 artigo prático.",
				minutes: 60,
				steps: [
					{
						text: "Reescrever o \"Sobre mim\" focando em resultados e histórico",
						minutes: 25
					},
					{
						text: "Pedir depoimento ou recomendação para 2 ex-colegas de confiança",
						minutes: 15
					},
					{
						text: "Publicar um aprendizado prático recente da minha área",
						minutes: 20
					}
				]
			}
		]
	},
	{
		id: "criatividade",
		name: "Criatividade & Expressão",
		tone: "amber",
		iconName: "creative",
		description: "Artes manuais, escrita, marcenaria, fotografia, música e expressão da alma.",
		starterIdeas: [{
			title: "Escrever Primeiros Ensaios ou Newsletter",
			summary: "Compartilhar ideias, visões de mundo e aprendizados através da palavra escrita.",
			priority: "Normal",
			immediate: "Escrever no bloco de notas o tema do primeiro texto sem pensar em perfeição.",
			clarity: "Escrever é a melhor forma de organizar o próprio pensamento.",
			scope: "Rascunho de 500 palavras sobre um tema que amo e publicação no Substack ou blog.",
			minutes: 60,
			steps: [
				{
					text: "Escolher 1 ideia central e listar 3 tópicos de apoio",
					minutes: 15
				},
				{
					text: "Escrever o primeiro rascunho de uma vez, sem editar no caminho",
					minutes: 30
				},
				{
					text: "Revisar para clareza, cortar excessos e publicar",
					minutes: 15
				}
			]
		}, {
			title: "Projeto Manual: Marcenaria ou Decoração Afetiva",
			summary: "Criar uma peça física com as próprias mãos para transformar um cantinho da casa.",
			priority: "Importante",
			immediate: "Fazer o primeiro rascunho com lápis e régua das medidas da peça.",
			clarity: "O trabalho manual ancora a mente no presente e gera orgulho tangível.",
			scope: "Construção ou reforma de uma luminária, prateleira ou objeto decorativo.",
			minutes: 120,
			steps: [
				{
					text: "Desenhar a peça com lista de cortes e materiais",
					minutes: 25
				},
				{
					text: "Separar madeiras, parafusos, lixas e ferramentas necessárias",
					minutes: 35
				},
				{
					text: "Executar cortes, montagem e acabamento com óleo natural ou cera",
					minutes: 60
				}
			]
		}]
	}
];
/**
* Instancia as ideias modelo para um setor específico.
*/
var READY_COMPANY_SECTOR_TEMPLATES = [
	{
		id: "tech_dev",
		name: "Tecnologia & Dev",
		tone: "cyan",
		iconName: "tech",
		description: "Engenharia de software, automação de infraestrutura, escalabilidade de microsserviços e APIs.",
		starterIdeas: [{
			title: "Otimização de Performance & Redução de Latência de APIs",
			summary: "Mapear rotas críticas do sistema e aplicar cache para garantir tempo de resposta abaixo de 200ms.",
			priority: "Importante",
			immediate: "Listar as 3 rotas com maior tempo de resposta nos logs do servidor.",
			clarity: "Sistemas rápidos e estáveis constroem confiança imediata com clientes corporativos.",
			scope: "Auditoria de gargalos em banco de dados, camada de cache Redis e testes de carga simulando pico.",
			minutes: 120,
			steps: [
				{
					text: "Identificar as 3 rotas mais lentas nos logs de produção",
					minutes: 25
				},
				{
					text: "Implementar camada de cache em memória para leituras repetidas",
					minutes: 45
				},
				{
					text: "Criar índices otimizados no banco de dados",
					minutes: 30
				},
				{
					text: "Executar teste de carga e documentar o ganho de latência",
					minutes: 20
				}
			]
		}, {
			title: "Automação de CI/CD & Deploy Contínuo com Zero Downtime",
			summary: "Configurar esteira automatizada para validar testes e publicar novas versões com segurança total.",
			priority: "Urgente",
			immediate: "Desenhar o fluxo ideal da esteira (Lint -> Testes -> Homologação -> Produção).",
			clarity: "Deploys automatizados eliminam o estresse de entregas e previnem erros manuais.",
			scope: "Pipeline de integração contínua rodando testes unitários e lint a cada push.",
			minutes: 90,
			steps: [
				{
					text: "Criar arquivo de configuração de workflow de CI/CD",
					minutes: 25
				},
				{
					text: "Integrar suíte de testes automáticos com bloqueio de merge em caso de falha",
					minutes: 30
				},
				{
					text: "Configurar notificações de status no canal da equipe",
					minutes: 15
				},
				{
					text: "Testar 1 deploy de ponta a ponta simulado",
					minutes: 20
				}
			]
		}]
	},
	{
		id: "qualidade_produto",
		name: "Qualidade & Produto",
		tone: "green",
		iconName: "business",
		description: "Product Discovery, pesquisa contínua com clientes, Design System e validação de roadmap.",
		starterIdeas: [{
			title: "Discovery Contínuo & Entrevistas com Clientes-Chave",
			summary: "Entrevistar 5 clientes reais para entender suas maiores dores na rotina com nossa solução.",
			priority: "Urgente",
			immediate: "Elaborar roteiro de 5 perguntas abertas focadas em problemas reais.",
			clarity: "Construir o que os clientes realmente precisam evita meses de desenvolvimento desperdiçado.",
			scope: "Roteiro de entrevista, realização de 5 conversas e relatório de síntese de oportunidades.",
			minutes: 100,
			steps: [
				{
					text: "Redigir roteiro de 5 perguntas abertas sobre fluxo de trabalho do cliente",
					minutes: 20
				},
				{
					text: "Agendar e conduzir as 3 primeiras entrevistas de 20 minutos",
					minutes: 45
				},
				{
					text: "Sintetizar padrões de dores e oportunidades em 1 página executiva",
					minutes: 25
				},
				{
					text: "Apresentar conclusões para o time de tecnologia e liderança",
					minutes: 10
				}
			]
		}, {
			title: "Padronização do Design System & Consistência de UI/UX",
			summary: "Alinhar componentes visuais, tipografia e estados de botão para agilizar a criação de novas telas.",
			priority: "Normal",
			immediate: "Catalogar os 5 componentes mais usados no aplicativo (botões, inputs, cards, modais).",
			clarity: "Um Design System consistente reduz tempo de desenvolvimento em 40% e eleva a percepção de valor.",
			scope: "Biblioteca de componentes documentada e aplicada nas páginas centrais.",
			minutes: 80,
			steps: [
				{
					text: "Catalogar discrepâncias visuais nos componentes atuais",
					minutes: 20
				},
				{
					text: "Definir tokens de cores, espaçamentos e variantes de botões",
					minutes: 30
				},
				{
					text: "Aplicar a padronização no fluxo principal da aplicação",
					minutes: 30
				}
			]
		}]
	},
	{
		id: "marketing_growth",
		name: "Marketing & Growth",
		tone: "pink",
		iconName: "creative",
		description: "Aquisição de clientes, campanhas de tração, nutrição de leads e métricas de conversão.",
		starterIdeas: [{
			title: "Otimização da Página de Apresentação & Conversão de Leads",
			summary: "Reestruturar títulos, prova social e botões de ação para aumentar a taxa de conversão em 25%.",
			priority: "Urgente",
			immediate: "Reescrever a promessa principal da primeira dobra em 1 frase clara e impactante.",
			clarity: "Clareza vende mais que complexidade: o cliente precisa entender o benefício em 5 segundos.",
			scope: "Nova versão da página com proposta de valor direta, depoimentos e formulário simplificado.",
			minutes: 90,
			steps: [
				{
					text: "Definir a nova proposta de valor central e call-to-action primário",
					minutes: 20
				},
				{
					text: "Incluir 3 depoimentos reais e selos de segurança/confiabilidade",
					minutes: 25
				},
				{
					text: "Implementar as melhorias visuais e testar responsividade mobile",
					minutes: 30
				},
				{
					text: "Medir a taxa de conversão por 7 dias comparando com o período anterior",
					minutes: 15
				}
			]
		}]
	},
	{
		id: "testes_qa",
		name: "Testes & QA",
		tone: "amber",
		iconName: "tech",
		description: "Garantia de qualidade contínua, testes E2E nos fluxos críticos e prevenção de regressões.",
		starterIdeas: [{
			title: "Cobertura de Testes Automatizados nos Fluxos Críticos",
			summary: "Criar testes automatizados para login, cadastro e criação de iniciativas para evitar quebras.",
			priority: "Importante",
			immediate: "Listar os 3 fluxos que nunca podem quebrar em produção.",
			clarity: "Qualidade não é um evento antes do release, é um hábito contínuo da engenharia.",
			scope: "Suíte de testes de regressão executando antes de cada versão ser liberada.",
			minutes: 90,
			steps: [
				{
					text: "Escrever casos de teste para o fluxo de autenticação e permissões",
					minutes: 30
				},
				{
					text: "Escrever casos de teste para captura e persistência de dados",
					minutes: 35
				},
				{
					text: "Configurar relatório automático de cobertura de código",
					minutes: 25
				}
			]
		}]
	},
	{
		id: "operacoes_rh",
		name: "Operações & Pessoas",
		tone: "violet",
		iconName: "relationship",
		description: "Gestão de processos organizacionais, onboarding de talentos e comunicação transparente.",
		starterIdeas: [{
			title: "Manual Vivo de Onboarding de Novos Colaboradores",
			summary: "Montar checklist claro para novos membros começarem a produzir com autonomia em até 48 horas.",
			priority: "Importante",
			immediate: "Listar os 5 primeiros acessos e ferramentas necessárias para o novo colaborador.",
			clarity: "Um bom onboarding reduz ansiedade, eleva o pertencimento e acelera resultados do time.",
			scope: "Documento centralizado com missão, links úteis, contatos-chave e tarefas da primeira semana.",
			minutes: 75,
			steps: [
				{
					text: "Listar acessos obrigatórios e ferramentas de comunicação",
					minutes: 20
				},
				{
					text: "Redigir guia dos primeiros 3 dias com missões práticas e mentor de apoio",
					minutes: 35
				},
				{
					text: "Validar o guia com o último membro contratado para coletar feedback",
					minutes: 20
				}
			]
		}]
	}
];
function getReadySectorTemplates(isBusiness) {
	return isBusiness ? READY_COMPANY_SECTOR_TEMPLATES : READY_SECTOR_TEMPLATES;
}
function buildStarterIdeasForSector(sectorId, template, workspace = "personal") {
	return template.starterIdeas.map((seed, idx) => {
		const ideaId = crypto.randomUUID();
		const steps = seed.steps.map((st, stepIdx) => ({
			id: `step-${ideaId}-${stepIdx}`,
			text: st.text,
			minutes: st.minutes,
			done: false
		}));
		return {
			id: ideaId,
			title: seed.title,
			summary: seed.summary,
			sector: sectorId,
			stage: idx === 0 ? 1 : 0,
			priority: seed.priority,
			minutes: seed.minutes,
			dedicated: 0,
			steps,
			immediate: seed.immediate,
			clarity: seed.clarity,
			scope: seed.scope,
			workspace,
			pivots: [],
			notes: [{
				id: `note-${ideaId}-init`,
				createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit"
				}),
				text: `Iniciativa criada a partir do modelo oficial de ${template.name}! 🚀`
			}]
		};
	});
}
var tones = [
	"cyan",
	"pink",
	"amber",
	"green",
	"violet"
];
function getSectorIcon(id, name) {
	const text = (name + " " + id).toLowerCase();
	if (text.includes("tech") || text.includes("tecnol") || text.includes("program") || text.includes("código")) return CodeXml;
	if (text.includes("relacion") || text.includes("famíl") || text.includes("amor") || text.includes("amigo")) return Heart;
	if (text.includes("saúd") || text.includes("bem-estar") || text.includes("trein") || text.includes("corpo")) return Activity;
	if (text.includes("negóc") || text.includes("carreir") || text.includes("financ") || text.includes("trabalh") || text.includes("business")) return BriefcaseBusiness;
	if (text.includes("marcen") || text.includes("madeir") || text.includes("artesan")) return Hammer;
	if (text.includes("criativ") || text.includes("arte") || text.includes("escrit") || text.includes("foto")) return Sparkles;
	if (text.includes("pessoal") || text.includes("vida") || text.includes("casa")) return Flower2;
	return Shapes;
}
function getTemplateIcon(iconName) {
	switch (iconName) {
		case "tech": return CodeXml;
		case "relationship": return Heart;
		case "health": return Activity;
		case "business": return BriefcaseBusiness;
		case "creative": return Sparkles;
		case "lifestyle": return Flower2;
		default: return Shapes;
	}
}
function Sectors() {
	const { data, setData } = useFlow();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [create, setCreate] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [tone, setTone] = (0, import_react.useState)("cyan");
	const [editingSector, setEditingSector] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editTone, setEditTone] = (0, import_react.useState)("cyan");
	const [deletingSector, setDeletingSector] = (0, import_react.useState)(null);
	const [reassignSectorId, setReassignSectorId] = (0, import_react.useState)("");
	const [showTemplatesModal, setShowTemplatesModal] = (0, import_react.useState)(false);
	const [previewTemplate, setPreviewTemplate] = (0, import_react.useState)(null);
	const [includeStarterIdeas, setIncludeStarterIdeas] = (0, import_react.useState)(true);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [showGlobalCharts, setShowGlobalCharts] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const isBusiness = data.workspaceMode === "business";
	const company = data.companyWorkspace;
	const readyTemplates = getReadySectorTemplates(isBusiness);
	const currentSectors = isBusiness && company ? company.sectors : data.sectors;
	const workspaceIdeas = data.ideas.filter((i) => isBusiness ? i.workspace === "business" : i.workspace !== "business");
	const activeIdeas = workspaceIdeas.filter((i) => !i.archived);
	const comparison = calculateGlobalSectorComparison(currentSectors, activeIdeas);
	const selectedSector = selected ? currentSectors.find((s) => s.id === selected) ?? null : null;
	const selectedAnalytics = selectedSector ? calculateSectorAnalytics(selectedSector, activeIdeas) : null;
	const openDeleteModal = (sec, e) => {
		if (e) e.stopPropagation();
		setDeletingSector(sec);
		const otherSectors = currentSectors.filter((s) => s.id !== sec.id);
		setReassignSectorId(otherSectors[0]?.id || "");
	};
	const confirmDeleteSector = () => {
		if (!deletingSector) return;
		const sectorId = deletingSector.id;
		const sectorName = deletingSector.name;
		setData((prev) => {
			const remainingSectors = prev.sectors.filter((s) => s.id !== sectorId);
			const targetSector = reassignSectorId || (remainingSectors[0]?.id ?? "geral");
			const updatedIdeas = prev.ideas.map((i) => {
				if (i.sector === sectorId) return {
					...i,
					sector: targetSector
				};
				return i;
			});
			return {
				...prev,
				sectors: remainingSectors,
				ideas: updatedIdeas
			};
		});
		toast.success(`Setor "${sectorName}" excluído com sucesso.`);
		setDeletingSector(null);
		if (selected === sectorId) setSelected(null);
	};
	const openEditModal = (sec, e) => {
		if (e) e.stopPropagation();
		setEditingSector(sec);
		setEditName(sec.name);
		setEditTone(sec.tone);
	};
	const confirmEditSector = () => {
		if (!editingSector || !editName.trim()) return;
		const trimmed = editName.trim();
		setData((prev) => ({
			...prev,
			sectors: prev.sectors.map((s) => s.id === editingSector.id ? {
				...s,
				name: trimmed,
				tone: editTone
			} : s)
		}));
		toast.success(`Setor atualizado para "${trimmed}"!`);
		setEditingSector(null);
	};
	const handleAdoptTemplate = (template, withIdeas = true) => {
		const existing = data.sectors.find((s) => s.name.toLowerCase() === template.name.toLowerCase());
		const sectorId = existing ? existing.id : crypto.randomUUID();
		const newSector = {
			id: sectorId,
			name: template.name,
			tone: template.tone
		};
		const starterIdeas = withIdeas ? buildStarterIdeasForSector(sectorId, template) : [];
		setData((prev) => {
			const sectorsList = existing ? prev.sectors : [...prev.sectors, newSector];
			return {
				...prev,
				sectors: sectorsList,
				ideas: [...prev.ideas, ...starterIdeas]
			};
		});
		toast.success(`Setor "${template.name}" ${existing ? "atualizado" : "criado"} com sucesso! ${withIdeas ? `${starterIdeas.length} ideias modelo adicionadas ao seu funil.` : ""}`);
		setPreviewTemplate(null);
		setShowTemplatesModal(false);
	};
	const ideasInDeletingSector = deletingSector ? data.ideas.filter((i) => i.sector === deletingSector.id) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-heading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Seus setores, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "em equilíbrio." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "page-subtitle",
				children: "Acompanhe o desenvolvimento de cada área da sua vida e identifique onde acelerar."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "text-xs h-9 gap-1.5",
						onClick: () => setShowTemplatesModal(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							size: 14,
							className: "text-amber"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "button-label",
							children: "Modelos Prontos"
						})]
					}),
					data.sectors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "text-xs h-9 gap-1.5",
						onClick: () => setShowGlobalCharts(!showGlobalCharts),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, {
							size: 14,
							className: "text-primary"
						}), showGlobalCharts ? "Ocultar Gráficos" : "Ver Gráficos"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						"aria-label": "Novo setor",
						className: "new-idea",
						onClick: () => setCreate(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "button-label",
							children: "Novo setor"
						})]
					})
				]
			})]
		}),
		data.sectors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 sm:p-8 rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-card to-card/60 relative overflow-hidden shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { size: 17 }), "PRIMEIRA MISSÃO DO CRIADOR"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl sm:text-3xl font-display font-medium text-foreground mt-2",
						children: "Crie seu primeiro Setor de Realização"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed",
						children: "Seu espaço Ideaflow está 100% limpo para suas próprias vitórias. Para organizar seu funil, escolha um modelo pronto abaixo com ideias práticas estruturadas com 1 clique, ou crie um setor personalizado do zero:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6",
						children: readyTemplates.map((tmpl) => {
							const Icon = getTemplateIcon(tmpl.iconName);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-5 rounded-xl border border-border bg-card/70 hover:bg-card hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between group tone-${tmpl.tone} shadow-sm`,
								onClick: () => {
									setPreviewTemplate(tmpl);
									setIncludeStarterIdeas(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "p-2.5 rounded-lg bg-secondary/80 border border-border text-foreground group-hover:scale-110 transition-transform",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 20 })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20",
											children: [tmpl.starterIdeas.length, " Ideias Prontas"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-base text-foreground mt-3.5 group-hover:text-primary transition-colors",
										children: tmpl.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2",
										children: tmpl.description
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-primary font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ver ideias & ativar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
										size: 15,
										className: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
									})]
								})]
							}, tmpl.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 pt-4 border-t border-border/60 flex items-center justify-between flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Prefere começar com um nome exclusivo sem ideias pré-definidas?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "text-xs gap-1.5",
							onClick: () => setCreate(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), "Criar setor personalizado em branco"]
						})]
					})
				]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-xl border border-green/30 bg-card relative overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold text-green flex items-center gap-1.5 uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 15 }), "Setor Mais Desenvolvido"]
						}), comparison.mostDeveloped && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: [comparison.mostDeveloped.completionRate, "% realizado"]
						})]
					}), comparison.mostDeveloped ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-2xl font-display font-medium text-foreground",
									children: comparison.mostDeveloped.sector.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs px-2 py-0.5 rounded bg-green/10 text-green border border-green/20",
									children: "Líder em Tração"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-2 leading-relaxed",
								children: [
									comparison.mostDeveloped.completedIdeas,
									" de ",
									comparison.mostDeveloped.totalIdeas,
									" ideias realizadas ·",
									" ",
									formatMinutes(comparison.mostDeveloped.totalMinutesDedicated),
									" de foco investido."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7 text-xs text-green border-green/30 gap-1 hover:bg-green/10",
									onClick: () => setSelected(comparison.mostDeveloped.sector.id),
									children: ["Ver detalhes do setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 13 })]
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-3",
						children: "Adicione e conclua ideias para visualizar o setor líder."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-xl border border-pink/30 bg-card relative overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold text-pink flex items-center gap-1.5 uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }), "Setor com Atenção Necessária"]
						}), comparison.mostDelayed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: [comparison.mostDelayed.totalIdeas - comparison.mostDelayed.completedIdeas, " pendentes"]
						})]
					}), comparison.mostDelayed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-2xl font-display font-medium text-foreground",
									children: comparison.mostDelayed.sector.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs px-2 py-0.5 rounded bg-pink/10 text-pink border border-pink/20",
									children: "Atraso / Pouco Foco"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-2 leading-relaxed",
								children: [
									comparison.mostDelayed.healthMessage,
									" Há",
									" ",
									comparison.mostDelayed.stageDistribution[0]?.count ?? 0,
									" ideia(s) ainda em rascunho."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7 text-xs text-pink border-pink/30 gap-1 hover:bg-pink/10",
									onClick: () => setSelected(comparison.mostDelayed.sector.id),
									children: ["Destravar ideias deste setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 13 })]
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-3",
						children: "Todos os setores estão com excelente nível de avanço!"
					})]
				})]
			}), showGlobalCharts && mounted && comparison.chartData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl border border-border bg-card/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between mb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, {
							size: 14,
							className: "text-primary"
						}), "Ideias por Setor (Total vs Realizadas)"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-48 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: comparison.chartData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "var(--muted-foreground)",
									fontSize: 11
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									fontSize: 11,
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									backgroundColor: "var(--card)",
									borderColor: "var(--border)",
									fontSize: "12px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "total",
									name: "Total de Ideias",
									fill: "var(--secondary)",
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "concluidas",
									name: "Realizadas",
									fill: "var(--green)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between mb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							size: 14,
							className: "text-violet"
						}), "Horas de Foco Dedicadas por Setor"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-48 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: comparison.chartData,
							margin: {
								top: 10,
								right: 10,
								left: -10,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "var(--muted-foreground)",
									fontSize: 11
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									fontSize: 11,
									unit: "h"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										backgroundColor: "var(--card)",
										borderColor: "var(--border)",
										fontSize: "12px"
									},
									formatter: (val) => [`${val} horas`, "Tempo"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "horasDedicadas",
									name: "Horas de Foco",
									fill: "var(--primary)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})] })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "section-heading",
					children: isBusiness && company ? `Setores de ${company.name}` : "Explorar Setores"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground font-mono",
					children: [currentSectors.length, " setor(es) ativo(s)"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sectors-grid",
				children: currentSectors.map((s) => {
					const Icon = getSectorIcon(s.id, s.name);
					const ideas = workspaceIdeas.filter((i) => i.sector === s.id);
					const done = ideas.filter((i) => i.stage === 4).length;
					const minutes = ideas.reduce((sum, i) => sum + i.dedicated, 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `sector-item tone-${s.tone} group relative`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-3.5 right-3.5 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Editar setor ${s.name}`,
									className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors",
									onClick: (e) => openEditModal(s, e),
									title: "Editar setor (nome e cor)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 14 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Excluir setor ${s.name}`,
									className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
									onClick: (e) => openDeleteModal(s, e),
									title: "Excluir setor",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sector-symbol",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 23 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "pr-14 truncate",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								ideas.length,
								" ideias · ",
								done,
								" realizadas"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground mt-1 flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 11 }),
									formatMinutes(minutes),
									" de foco"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
								value: done,
								max: Math.max(1, ideas.length),
								"aria-label": `${done} ideias realizadas`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "sector-open",
								onClick: () => setSelected(s.id),
								children: ["Explorar setor & Dashboard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 15 })]
							})
						]
					}, s.id);
				})
			})]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
			open: create,
			onOpenChange: setCreate,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-body max-w-md mx-auto w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
						className: "sheet-title",
						children: "Um novo espaço para criar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
						className: "mt-3",
						children: "Qual parte do seu universo merece um setor?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field-label mt-6",
						children: ["Nome do setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "text-field",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Ex.: Fotografia, Culinária, Música...",
							maxLength: 40
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-5",
						children: "Cor do setor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "color-options",
						children: tones.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							className: `color-swatch tone-${t} ${tone === t ? "selected" : ""}`,
							"aria-label": `Cor ${t}`,
							onClick: () => setTone(t),
							children: tone === t && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 })
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: !name.trim() || data.sectors.some((s) => s.name.toLowerCase() === name.trim().toLowerCase()),
						className: "primary-action w-full mt-6",
						onClick: () => {
							setData((p) => ({
								...p,
								sectors: [...p.sectors, {
									id: crypto.randomUUID(),
									name: name.trim(),
									tone
								}]
							}));
							setName("");
							setCreate(false);
							toast.success(`Setor "${name.trim()}" criado com sucesso!`);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), "Criar setor"]
					})
				]
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
			open: Boolean(editingSector),
			onOpenChange: (v) => {
				if (!v) setEditingSector(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-body max-w-md mx-auto w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
						className: "sheet-title",
						children: "Editar Setor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
						className: "mt-2",
						children: "Altere o nome e o tom de cor deste setor no seu funil."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field-label mt-6",
						children: ["Nome do setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "text-field",
							value: editName,
							onChange: (e) => setEditName(e.target.value),
							placeholder: "Nome do setor...",
							maxLength: 40
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-5",
						children: "Cor do setor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "color-options",
						children: tones.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							className: `color-swatch tone-${t} ${editTone === t ? "selected" : ""}`,
							"aria-label": `Cor ${t}`,
							onClick: () => setEditTone(t),
							children: editTone === t && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 })
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-1/2",
							onClick: () => setEditingSector(null),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !editName.trim(),
							className: "primary-action w-1/2",
							onClick: confirmEditSector,
							children: "Salvar alterações"
						})]
					})
				]
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
			open: Boolean(deletingSector),
			onOpenChange: (v) => {
				if (!v) setDeletingSector(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-body max-w-md mx-auto w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerTitle, {
						className: "sheet-title text-destructive flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 18 }), "Excluir Setor"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerDescription, {
						className: "mt-2",
						children: [
							"Você tem certeza que deseja excluir o setor",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-foreground font-semibold",
								children: [
									"\"",
									deletingSector?.name,
									"\""
								]
							}),
							"?"
						]
					}),
					ideasInDeletingSector.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 p-4 rounded-xl border border-amber/30 bg-amber/10 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium text-amber-500 flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }),
									"Este setor possui ",
									ideasInDeletingSector.length,
									" ideia(s) vinculada(s)."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: "Para não perder suas ideias, escolha para qual setor deseja movê-las:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field-label mt-2",
								children: ["Destino das ideias:", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "text-field",
									value: reassignSectorId,
									onChange: (e) => setReassignSectorId(e.target.value),
									children: [data.sectors.filter((s) => s.id !== deletingSector?.id).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.name
									}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "geral",
										children: "Geral (Sem setor)"
									})]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-4",
						children: "Este setor está vazio e não possui nenhuma ideia vinculada."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-1/2",
							onClick: () => setDeletingSector(null),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							className: "w-1/2",
							onClick: confirmDeleteSector,
							children: "Excluir definitivamente"
						})]
					})
				]
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
			open: showTemplatesModal,
			onOpenChange: setShowTemplatesModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
				className: "max-h-[92vh]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sheet-body max-w-2xl mx-auto w-full space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerTitle, {
							className: "sheet-title flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								size: 18,
								className: "text-amber"
							}), isBusiness ? "Modelos de Departamentos da Empresa" : "Modelos Prontos de Setores"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
							className: "mt-1",
							children: isBusiness ? "Adicione departamentos estratégicos com iniciativas corporativas prontas para a equipe executar." : "Comece instantaneamente com setores inspiradores e ideias já desenhadas para agir."
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2",
						children: readyTemplates.map((tmpl) => {
							const Icon = getTemplateIcon(tmpl.iconName);
							const isAlreadyAdded = data.sectors.some((s) => s.name.toLowerCase() === tmpl.name.toLowerCase());
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between group tone-${tmpl.tone}`,
								onClick: () => {
									setPreviewTemplate(tmpl);
									setIncludeStarterIdeas(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "p-2 rounded-lg bg-secondary border border-border text-foreground group-hover:scale-105 transition-transform",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
										}), isAlreadyAdded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-2 py-0.5 rounded bg-green/10 text-green border border-green/20",
											children: "Já adicionado"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20",
											children: "3 Ideias Inclusas"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-sm text-foreground mt-3 group-hover:text-primary transition-colors",
										children: tmpl.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 line-clamp-2",
										children: tmpl.description
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "mt-4 w-full h-8 text-xs gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 13 }), "Explorar ideias do modelo"]
								})]
							}, tmpl.id);
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
			open: Boolean(previewTemplate),
			onOpenChange: (v) => {
				if (!v) setPreviewTemplate(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
				className: "max-h-[92vh]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sheet-body max-w-xl mx-auto w-full space-y-5",
					children: previewTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-bold uppercase text-primary tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { size: 14 }), "MODELO RECOMENDADO"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
								className: "sheet-title mt-1.5",
								children: previewTemplate.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
								className: "mt-1",
								children: previewTemplate.description
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: [
										"Ideias Inclusas neste Modelo (",
										previewTemplate.starterIdeas.length,
										")"
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 max-h-60 overflow-y-auto pr-1",
								children: previewTemplate.starterIdeas.map((idea, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl border border-border bg-card/80 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-sm font-medium text-foreground",
												children: idea.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] px-2 py-0.5 rounded ${idea.priority === "Urgente" ? "bg-pink/10 text-pink" : "bg-primary/10 text-primary"}`,
												children: idea.priority
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: idea.summary
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												size: 12,
												className: "text-green"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												idea.steps.length,
												" passos estruturados (",
												idea.minutes,
												" min)"
											] })]
										})
									]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "accent-primary h-4 w-4 rounded",
								checked: includeStarterIdeas,
								onChange: (e) => setIncludeStarterIdeas(e.target.checked)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold block text-foreground",
									children: [
										"Adicionar as ",
										previewTemplate.starterIdeas.length,
										" ideias modelo ao meu funil"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Você pode editá-las ou adaptá-las livremente a qualquer momento."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "w-1/3",
								onClick: () => setPreviewTemplate(null),
								children: "Voltar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "primary-action w-2/3",
								onClick: () => handleAdoptTemplate(previewTemplate, includeStarterIdeas),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), includeStarterIdeas ? "Criar Setor com Ideias" : "Criar Setor Vazio"]
							})]
						})
					] })
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
			open: Boolean(selected && selectedSector),
			onOpenChange: (v) => {
				if (!v) setSelected(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
				className: "max-h-[92vh]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sheet-body max-w-3xl mx-auto w-full space-y-6",
					children: selectedSector && selectedAnalytics && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sheet-eyebrow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), "DASHBOARD EXCLUSIVO DO SETOR"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs px-2.5 py-0.5 rounded-full border ${selectedAnalytics.healthStatus === "Em Alta" ? "border-green/40 text-green bg-green/10" : selectedAnalytics.healthStatus === "Em Atraso" ? "border-pink/40 text-pink bg-pink/10" : "border-primary/40 text-primary bg-primary/10"}`,
									children: selectedAnalytics.healthStatus
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelected(null),
									className: "p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors",
									title: "Fechar (Esc)",
									"aria-label": "Fechar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
								className: "sheet-title",
								children: selectedSector.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
								className: "mt-1",
								children: selectedAnalytics.healthMessage
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-8 text-xs gap-1.5",
										onClick: () => openEditModal(selectedSector),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 13 }), "Editar setor"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10",
										onClick: () => openDeleteModal(selectedSector),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 }), "Excluir setor"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 text-xs gap-1 primary-action",
										onClick: () => {
											setSelected(null);
											window.dispatchEvent(new CustomEvent("ideaflow:capture"));
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), "Nova ideia neste setor"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-lg bg-card border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: "Total de Ideias"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-xl font-display font-medium text-foreground",
										children: selectedAnalytics.totalIdeas
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-lg bg-card border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: "Realizadas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-xl font-display font-medium text-green",
										children: selectedAnalytics.completedIdeas
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-lg bg-card border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: "Taxa de Conclusão"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-xl font-display font-medium text-primary",
										children: [selectedAnalytics.completionRate, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-lg bg-card border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: "Tempo Dedicado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-xl font-display font-medium text-foreground",
										children: formatMinutes(selectedAnalytics.totalMinutesDedicated)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-lg bg-card border border-border space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
											size: 14,
											className: "text-primary"
										}),
										"Funil de Estágios em ",
										selectedSector.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [selectedAnalytics.totalIdeas - selectedAnalytics.completedIdeas, " em andamento"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-2 text-center",
								children: selectedAnalytics.stageDistribution.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded bg-secondary/50 border border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block truncate",
										children: stage.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-base font-display text-foreground",
										children: stage.count
									})]
								}, stage.stage))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-sm",
									children: "Ideias deste Universo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Toque para abrir o dashboard individual da ideia"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stage-cards",
								children: [activeIdeas.filter((i) => i.sector === selected).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaCard, {
									idea: i,
									onOpen: (idea) => {
										setSelected(null);
										setDetail(idea.id);
									},
									onFocus: (idea) => {
										setSelected(null);
										setFocus(idea);
									}
								}, i.id)), !data.ideas.some((i) => i.sector === selected) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "day-empty text-center py-8",
									children: "Nenhuma ideia neste setor ainda. Capture a primeira faísca!"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 border-t border-border flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "gap-1.5 cursor-pointer",
								onClick: () => setSelected(null),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 }), "Fechar Painel do Setor"]
							})
						})
					] })
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaDetail, {
			ideaId: detail,
			onClose: () => setDetail(null),
			onFocus: setFocus
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusTimer, {
			idea: focus,
			onClose: () => setFocus(null)
		})
	] });
}
//#endregion
export { Sectors as component };
