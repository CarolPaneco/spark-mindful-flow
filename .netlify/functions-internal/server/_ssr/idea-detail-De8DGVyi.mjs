import { i as __toESM } from "../_runtime.mjs";
import { C as stageTones, S as stageNames, a as defaultCompanySectors, c as formatMinutes, d as getAiCoachingInsights, f as getFiveWhysQuestions, h as getSubIdeas, i as createGoogleCalendarUrl, l as generateAiSteps, m as getProjectStats, p as getParentIdea, s as downloadIcsFile, u as generateSubModulesAi, v as localDate, w as suggestFiveWhysOffline } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { At as ChevronUp, Ft as ChartNoAxesColumn, Gt as BookOpen, J as Lightbulb, Jt as ArrowRight, M as Play, N as Pencil, Nt as ChevronDown, Ot as CircleCheck, Pt as Check, Q as History, Qt as ArchiveRestore, Rt as CalendarPlus, Vt as Building2, Zt as Archive, _ as Sparkles, at as GitFork, d as Trash2, ht as Download, j as Plus, kt as CircleAlert, o as Users, ot as FolderTree, p as Tag, pt as ExternalLink, q as ListTodo, rt as GripVertical, s as User, wt as Clock3, yt as Compass, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFlow, d as generateProjectModulesWithGemini, l as cn, t as Button } from "./ai-assistant-3aCui_AD.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { a as Cell, i as Bar, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/idea-detail-De8DGVyi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Drawer$1 = ({ shouldScaleBackground = true, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
	shouldScaleBackground,
	...props
});
Drawer$1.displayName = "Drawer";
Drawer.Trigger;
var DrawerPortal = Drawer.Portal;
Drawer.Close;
var DrawerOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-overlay/80 backdrop-blur-sm", className),
	...props
}));
DrawerOverlay.displayName = Drawer.Overlay.displayName;
var DrawerContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
	ref,
	className: cn("fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex max-h-[92dvh] h-auto max-w-xl flex-col rounded-t-3xl border bg-card", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }), children]
})] }));
DrawerContent.displayName = "DrawerContent";
var DrawerHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("grid gap-1.5 p-4 text-center sm:text-left", className),
	...props
});
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("mt-auto flex flex-col gap-2 p-4", className),
	...props
});
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none", className),
	...props
}));
DrawerTitle.displayName = Drawer.Title.displayName;
var DrawerDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DrawerDescription.displayName = Drawer.Description.displayName;
/**
* Motor Integrado de Inteligência Artificial Oficial do Ideaflow (Estilo ChatGPT).
* 1. Não requer nenhuma chave de API do usuário (100% integrado internamente).
* 2. Conecta a modelos de ponta estilo ChatGPT (OpenAI GPT-4o-mini).
* 3. Se houver firewall corporativo ou modo avião, tem fallback transparente e instantâneo.
*/
async function callIntegratedAiChat({ messages, timeoutMs = 7500 }) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch("https://text.pollinations.ai/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				messages,
				model: "openai"
			}),
			signal: controller.signal
		});
		clearTimeout(timer);
		if (res.ok) {
			const text = await res.text();
			if (text && text.trim().length > 10 && text.trim() !== "{}" && !text.includes("<!DOCTYPE html>") && !text.includes("FortiGate") && !text.includes("Web Filter")) return text.trim();
		}
		throw new Error("Resposta inválida do serviço de nuvem.");
	} catch (err) {
		clearTimeout(timer);
		throw err;
	}
}
/**
* Sugere respostas iniciais para os 5 Porquês com base na ideia inicial informada.
*/
async function suggestFiveWhysWithAi(titleOrText) {
	const prompt = `Com base na seguinte ideia/projeto:
"${titleOrText}"

Gere 5 respostas concisas, reflexivas e inspiradoras (1 a 2 frases cada) seguindo a metodologia dos 5 Porquês:
1. 1º Por quê: Qual é o objetivo raiz dessa realização? (Por que criar isso?)
2. 2º Por quê: Por que isso é prioridade agora? (Qual a oportunidade ou necessidade atual?)
3. 3º Por quê: Por que isso ainda não foi feito? (Qual o maior obstáculo ou desafio a vencer?)
4. 4º Por quê: Por que o sucesso disso importa de verdade? (Qual o impacto real ou motivação profunda?)
5. 5º Por quê: Por que esse primeiro formato enxuto é o caminho certo para começar?

Responda ESTRITAMENTE em formato JSON com um array de 5 strings:
["resposta 1", "resposta 2", "resposta 3", "resposta 4", "resposta 5"]`;
	try {
		const cleaned = (await callIntegratedAiChat({
			messages: [{
				role: "system",
				content: "Você é um assistente JSON que responde exclusivamente um array JSON com 5 strings."
			}, {
				role: "user",
				content: prompt
			}],
			timeoutMs: 8e3
		})).replace(/```json/gi, "").replace(/```/g, "").trim();
		const parsed = JSON.parse(cleaned);
		if (Array.isArray(parsed) && parsed.length >= 5 && parsed.every((s) => typeof s === "string")) return parsed.slice(0, 5);
	} catch (err) {
		console.warn("Falha na IA integrada para 5 Porquês, usando gerador offline:", err);
	}
	const { suggestFiveWhysOffline } = await import("./ideaflow-CpldvHc4.mjs").then((n) => n.g);
	return suggestFiveWhysOffline(titleOrText);
}
function IdeaDetail({ ideaId, onClose, onFocus }) {
	const { data, updateIdea, setData } = useFlow();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [currentIdeaId, setCurrentIdeaId] = (0, import_react.useState)(ideaId);
	const [showPivotForm, setShowPivotForm] = (0, import_react.useState)(false);
	const [pivotType, setPivotType] = (0, import_react.useState)("Redução de Escopo");
	const [newScope, setNewScope] = (0, import_react.useState)("");
	const [pivotReason, setPivotReason] = (0, import_react.useState)("");
	const [noteText, setNoteText] = (0, import_react.useState)("");
	const [newStepText, setNewStepText] = (0, import_react.useState)("");
	const [newStepMinutes, setNewStepMinutes] = (0, import_react.useState)(15);
	const [editingStepIndex, setEditingStepIndex] = (0, import_react.useState)(null);
	const [draggedStepIdx, setDraggedStepIdx] = (0, import_react.useState)(null);
	const [showSubIdeaForm, setShowSubIdeaForm] = (0, import_react.useState)(false);
	const [subIdeaTitle, setSubIdeaTitle] = (0, import_react.useState)("");
	const [subIdeaSummary, setSubIdeaSummary] = (0, import_react.useState)("");
	const [subIdeaMinutes, setSubIdeaMinutes] = (0, import_react.useState)(60);
	const [subIdeaPriority, setSubIdeaPriority] = (0, import_react.useState)("Normal");
	const [isGeneratingSubAi, setIsGeneratingSubAi] = (0, import_react.useState)(false);
	const [editingFiveWhys, setEditingFiveWhys] = (0, import_react.useState)(false);
	const [localFiveWhys, setLocalFiveWhys] = (0, import_react.useState)([
		"",
		"",
		"",
		"",
		""
	]);
	const [isSuggestingWhysDetail, setIsSuggestingWhysDetail] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		setCurrentIdeaId(ideaId);
	}, [ideaId]);
	const idea = data.ideas.find((i) => i.id === currentIdeaId);
	(0, import_react.useEffect)(() => {
		if (idea) {
			setNewScope(idea.scope ?? "");
			setShowPivotForm(false);
			setEditingStepIndex(null);
			setShowSubIdeaForm(false);
			setEditingFiveWhys(false);
			setLocalFiveWhys(idea.fiveWhys && idea.fiveWhys.length ? [...idea.fiveWhys] : [
				"",
				"",
				"",
				"",
				""
			]);
		}
	}, [currentIdeaId, idea?.id]);
	const handleSaveFiveWhysInDetail = () => {
		if (!idea) return;
		const cleaned = localFiveWhys.map((w) => w.trim());
		const hasAny = cleaned.some((w) => w.length > 0);
		updateIdea(idea.id, { fiveWhys: hasAny ? cleaned : void 0 });
		setEditingFiveWhys(false);
		toast.success("5 Porquês atualizados com sucesso! 🎯");
	};
	const isBusinessIdea = idea?.workspace === "business" || data.workspaceMode === "business";
	const currentWhysQuestions = getFiveWhysQuestions(isBusinessIdea);
	const handleSuggestWhysInDetail = async () => {
		if (!idea) return;
		setIsSuggestingWhysDetail(true);
		try {
			const suggestions = await suggestFiveWhysWithAi(`${idea.title}. ${idea.summary}`);
			if (suggestions && suggestions.length > 0) {
				setLocalFiveWhys(suggestions);
				toast.success(isBusinessIdea ? "Perguntas estratégicas sugeridas com IA! 🏢" : "5 Porquês sugeridos com IA! Você pode editar as respostas.");
			}
		} catch {
			const offline = suggestFiveWhysOffline(`${idea.title}. ${idea.summary}`, isBusinessIdea);
			setLocalFiveWhys(offline);
			toast.success(isBusinessIdea ? "Perguntas estratégicas sugeridas pelo motor local da empresa! 🏢" : "5 Porquês sugeridos pelo motor reflexivo!");
		} finally {
			setIsSuggestingWhysDetail(false);
		}
	};
	if (!idea) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open: false,
		onOpenChange: () => onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {})
	});
	const completedStepsCount = idea.steps.filter((s) => s.done).length;
	const totalStepsCount = idea.steps.length;
	const completionPercent = totalStepsCount > 0 ? Math.round(completedStepsCount / totalStepsCount * 100) : 0;
	const coaching = getAiCoachingInsights(idea);
	Math.max(0, totalStepsCount - completedStepsCount);
	const timeData = [{
		name: "Dedicado",
		minutos: idea.dedicated,
		fill: "var(--primary)"
	}, {
		name: "Total Previsto",
		minutos: idea.minutes,
		fill: "var(--violet)"
	}];
	const handleToggleStep = (index) => {
		const updated = idea.steps.map((s, i) => i === index ? {
			...s,
			done: !s.done
		} : s);
		updateIdea(idea.id, { steps: updated });
	};
	const handleAddStep = () => {
		if (!newStepText.trim()) return;
		const newStep = {
			id: crypto.randomUUID(),
			text: newStepText.trim(),
			minutes: Number(newStepMinutes),
			done: false
		};
		const updated = [...idea.steps, newStep];
		const totalMinutes = updated.reduce((sum, s) => sum + s.minutes, 0);
		updateIdea(idea.id, {
			steps: updated,
			minutes: totalMinutes
		});
		setNewStepText("");
		toast.success("Passo adicionado ao checklist!");
	};
	const handleDeleteStep = (index) => {
		if (idea.steps.length <= 1) {
			toast.error("Mantenha pelo menos um passo para orientação.");
			return;
		}
		const updated = idea.steps.filter((_, i) => i !== index);
		const totalMinutes = updated.reduce((sum, s) => sum + s.minutes, 0);
		updateIdea(idea.id, {
			steps: updated,
			minutes: totalMinutes
		});
		toast.success("Passo removido.");
	};
	const handleMoveStep = (fromIndex, toIndex) => {
		if (toIndex < 0 || toIndex >= idea.steps.length) return;
		const reordered = [...idea.steps];
		const [moved] = reordered.splice(fromIndex, 1);
		if (!moved) return;
		reordered.splice(toIndex, 0, moved);
		updateIdea(idea.id, {
			steps: reordered,
			immediate: reordered[0]?.text ?? idea.immediate
		});
	};
	const handleSuggestStepsAi = () => {
		const aiSteps = generateAiSteps(idea.title, idea.summary, idea.sector, "estruturado");
		const existingTexts = new Set(idea.steps.map((s) => s.text.toLowerCase()));
		const newFiltered = aiSteps.filter((s) => !existingTexts.has(s.text.toLowerCase()));
		if (newFiltered.length === 0) {
			toast.info("A IA analisou seus passos e você já tem um plano consistente.");
			return;
		}
		const updated = [...idea.steps, ...newFiltered.slice(0, 2)];
		const totalMinutes = updated.reduce((sum, s) => sum + s.minutes, 0);
		updateIdea(idea.id, {
			steps: updated,
			minutes: totalMinutes
		});
		toast.success("A IA adicionou 2 passos estratégicos ao seu plano ✨");
	};
	const handleSavePivot = () => {
		if (!pivotReason.trim()) {
			toast.error("Informe o motivo da mudança de rota para registrar o aprendizado.");
			return;
		}
		const updatedPivots = [{
			id: crypto.randomUUID(),
			date: localDate(),
			type: pivotType,
			previousScope: idea.scope || "Escopo inicial indefinido",
			newScope: newScope.trim() || idea.scope || "",
			reason: pivotReason.trim()
		}, ...idea.pivots ?? []];
		updateIdea(idea.id, {
			scope: newScope.trim(),
			pivots: updatedPivots
		});
		setPivotReason("");
		setShowPivotForm(false);
		toast.success("Mudança de rota registrada no histórico!");
	};
	const handleAddNote = () => {
		if (!noteText.trim()) return;
		const updatedNotes = [{
			id: crypto.randomUUID(),
			createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit"
			}),
			text: noteText.trim()
		}, ...idea.notes ?? []];
		updateIdea(idea.id, { notes: updatedNotes });
		setNoteText("");
		toast.success("Anotação registrada no diário de bordo!");
	};
	const handleDeleteNote = (id) => {
		const updated = (idea.notes ?? []).filter((n) => n.id !== id);
		updateIdea(idea.id, { notes: updated });
		toast.success("Anotação removida.");
	};
	const subIdeas = idea ? getSubIdeas(data.ideas, idea.id, true) : [];
	const activeSubIdeas = subIdeas.filter((s) => !s.archived);
	const projectStats = idea ? getProjectStats(idea, data.ideas) : {
		totalSub: 0,
		completedSub: 0,
		percent: 0,
		totalMinutes: 0,
		dedicatedMinutes: 0
	};
	const parentIdea = idea ? getParentIdea(data.ideas, idea) : void 0;
	const handleCreateSubIdea = () => {
		if (!subIdeaTitle.trim()) {
			toast.error("Informe o título do módulo ou sub-ideia.");
			return;
		}
		const newSubIdea = {
			id: crypto.randomUUID(),
			title: subIdeaTitle.trim(),
			summary: subIdeaSummary.trim() || `Módulo especializado do projeto ${idea.title}`,
			sector: idea.sector,
			stage: 0,
			minutes: Number(subIdeaMinutes) || 60,
			dedicated: 0,
			priority: subIdeaPriority,
			parentId: idea.id,
			steps: [
				{
					id: crypto.randomUUID(),
					text: `Definir resultado e escopo de “${subIdeaTitle.trim()}”`,
					minutes: 15,
					done: false
				},
				{
					id: crypto.randomUUID(),
					text: `Implementar a entrega principal do módulo`,
					minutes: Math.max(15, (Number(subIdeaMinutes) || 60) - 30),
					done: false
				},
				{
					id: crypto.randomUUID(),
					text: `Testar e validar no projeto geral`,
					minutes: 15,
					done: false
				}
			],
			immediate: `Definir resultado e escopo de “${subIdeaTitle.trim()}”`,
			clarity: "Módulo de projeto estruturado com foco em entrega incremental.",
			pivots: [],
			notes: []
		};
		setData((prev) => ({
			...prev,
			ideas: [newSubIdea, ...prev.ideas.map((i) => i.id === idea.id ? {
				...i,
				isProject: true
			} : i)]
		}));
		setSubIdeaTitle("");
		setSubIdeaSummary("");
		setShowSubIdeaForm(false);
		toast.success("Módulo adicionado ao projeto! 🚀");
	};
	const handleGenerateAiSubModules = async () => {
		setIsGeneratingSubAi(true);
		try {
			const res = await generateProjectModulesWithGemini(idea.title, idea.summary, idea.sector);
			const newSubIdeas = res.modules.map((m) => ({
				id: crypto.randomUUID(),
				title: m.title,
				summary: m.summary,
				sector: idea.sector,
				stage: 0,
				minutes: m.minutes,
				dedicated: 0,
				priority: "Normal",
				parentId: idea.id,
				steps: [
					{
						id: crypto.randomUUID(),
						text: `Planejar estrutura de ${m.title}`,
						minutes: 15,
						done: false
					},
					{
						id: crypto.randomUUID(),
						text: `Construir implementação prática`,
						minutes: Math.max(15, m.minutes - 30),
						done: false
					},
					{
						id: crypto.randomUUID(),
						text: `Revisar e integrar ao projeto macro`,
						minutes: 15,
						done: false
					}
				],
				immediate: `Planejar estrutura de ${m.title}`,
				clarity: "Módulo inteligente desenhado para decompor a complexidade da ideia.",
				pivots: [],
				notes: []
			}));
			setData((prev) => ({
				...prev,
				ideas: [...newSubIdeas, ...prev.ideas.map((i) => i.id === idea.id ? {
					...i,
					isProject: true
				} : i)]
			}));
			if (res.usedGemini) toast.success(`Google Gemini gerou ${newSubIdeas.length} módulos personalizados para seu projeto! ✨`);
			else toast.success(`Motor Local gerou ${newSubIdeas.length} módulos para seu projeto! ✨`);
		} catch {
			const newSubIdeas = generateSubModulesAi(idea.title, idea.summary, idea.sector).map((m) => ({
				id: crypto.randomUUID(),
				title: m.title,
				summary: m.summary,
				sector: idea.sector,
				stage: 0,
				minutes: m.minutes,
				dedicated: 0,
				priority: "Normal",
				parentId: idea.id,
				steps: [
					{
						id: crypto.randomUUID(),
						text: `Planejar estrutura de ${m.title}`,
						minutes: 15,
						done: false
					},
					{
						id: crypto.randomUUID(),
						text: `Construir implementação prática`,
						minutes: Math.max(15, m.minutes - 30),
						done: false
					},
					{
						id: crypto.randomUUID(),
						text: `Revisar e integrar ao projeto macro`,
						minutes: 15,
						done: false
					}
				],
				immediate: `Planejar estrutura de ${m.title}`,
				clarity: "Módulo inteligente desenhado para decompor a complexidade da ideia.",
				pivots: [],
				notes: []
			}));
			setData((prev) => ({
				...prev,
				ideas: [...newSubIdeas, ...prev.ideas.map((i) => i.id === idea.id ? {
					...i,
					isProject: true
				} : i)]
			}));
			toast.info("Módulos gerados pelo motor cognitivo local.");
		} finally {
			setIsGeneratingSubAi(false);
		}
	};
	const handleUnlinkSubIdea = (subId) => {
		setData((prev) => ({
			...prev,
			ideas: prev.ideas.map((i) => i.id === subId ? {
				...i,
				parentId: void 0
			} : i)
		}));
		toast.success("Módulo desvinculado. Agora é uma ideia individual.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open: Boolean(ideaId),
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
			className: "max-h-[94vh]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-body max-w-4xl mx-auto w-full",
				children: [
					parentIdea && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between p-2.5 rounded-lg bg-primary/10 border border-primary/25 text-xs text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 truncate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
									size: 14,
									className: "shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground shrink-0",
									children: "Módulo pertencente ao projeto:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "truncate font-semibold",
									children: parentIdea.title
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-6 text-xs text-primary hover:text-primary-foreground px-2 gap-1 shrink-0",
							onClick: () => {
								setCurrentIdeaId(parentIdea.id);
								setTab("overview");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ver Projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 12 })]
						})]
					}),
					idea.archived && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 p-3 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-between text-xs text-amber",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { size: 14 }), "Esta ideia está arquivada. Ela fica guardada no seu histórico sem poluir o funil ativo."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-7 text-xs border-amber/40 text-amber hover:bg-amber/20 gap-1",
							onClick: () => {
								updateIdea(idea.id, {
									archived: false,
									archivedAt: void 0
								});
								toast.success("Ideia restaurada para o funil ativo! ✨");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { size: 12 }), "Restaurar Ideia"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sheet-eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 15 }), idea.isProject || activeSubIdeas.length > 0 ? "PROJETO MACRO & MÓDULOS" : "DASHBOARD DE REALIZAÇÃO"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: idea.isProject ? "secondary" : "ghost",
									size: "sm",
									className: "h-7 text-xs gap-1.5",
									onClick: () => {
										const newIsProj = !idea.isProject;
										updateIdea(idea.id, { isProject: newIsProj });
										toast.success(newIsProj ? "Ideia configurada como Projeto Macro (com suporte a módulos) 📁" : "Projeto Macro desativado.");
									},
									title: "Projetos Macro permitem decompor ideias complexas em múltiplos módulos (ex: Front-end, Back-end)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
										size: 13,
										className: idea.isProject ? "text-primary" : ""
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: idea.isProject ? "Projeto Macro" : "Tornar Projeto" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: `h-7 text-xs gap-1.5 ${idea.archived ? "text-amber" : "text-muted-foreground hover:text-foreground"}`,
									onClick: () => {
										const newArchived = !idea.archived;
										updateIdea(idea.id, {
											archived: newArchived,
											archivedAt: newArchived ? localDate() : void 0
										});
										toast.success(newArchived ? "Ideia arquivada com sucesso." : "Ideia restaurada com sucesso.");
									},
									title: idea.archived ? "Restaurar para o funil ativo" : "Arquivar esta ideia",
									children: [idea.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { size: 13 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: idea.archived ? "Desarquivar" : "Arquivar"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `sector-tag tone-${stageTones[idea.stage]}`,
									children: [
										stageNames[idea.stage],
										" (",
										completionPercent,
										"%)"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 mt-2.5 flex-wrap",
						children: [
							idea.workspace === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] bg-violet/15 text-violet border border-violet/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 11 }), "Workspace Empresarial"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] bg-secondary/80 text-muted-foreground border border-border/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 11 }), "Workspace Pessoal"]
							}),
							idea.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] bg-cyan/15 text-cyan border border-cyan/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { size: 11 }), idea.department]
							}),
							idea.assignedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] bg-primary/15 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 11 }),
									"Responsável: ",
									idea.assignedTo
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
						className: "sheet-title mt-2",
						children: idea.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
						className: "mt-2 text-sm text-muted-foreground leading-relaxed",
						children: idea.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto py-2.5 my-4 border-b border-border/70 scrollbar-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "overview" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("overview"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { size: 13 }), "Visão Geral"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "steps" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("steps"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, { size: 13 }),
									"Passos (",
									completedStepsCount,
									"/",
									totalStepsCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "subideas" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("subideas"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
										size: 13,
										className: activeSubIdeas.length > 0 ? "text-primary" : ""
									}),
									"Ideias do Projeto (",
									activeSubIdeas.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "pivots" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("pivots"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitFork, { size: 13 }),
									"Mudança de Rota (",
									idea.pivots?.length ?? 0,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "notes" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("notes"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 13 }),
									"Diário & Notas (",
									idea.notes?.length ?? 0,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "calendar" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("calendar"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 13 }), "Calendário & Agenda"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: tab === "coach" ? "default" : "ghost",
								size: "sm",
								className: "h-8 text-xs gap-1.5 shrink-0",
								onClick: () => setTab("coach"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { size: 13 }), "IA Coach"]
							})
						]
					}),
					tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-lg bg-card/80 border border-border flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground uppercase font-semibold tracking-wider",
											children: "Progresso das Etapas"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-3xl font-display font-medium text-foreground",
												children: [completionPercent, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"(",
													completedStepsCount,
													" de ",
													totalStepsCount,
													" passos)"
												]
											})]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
											value: completedStepsCount,
											max: Math.max(1, totalStepsCount),
											className: "mt-4"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-lg bg-card/80 border border-border flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground uppercase font-semibold tracking-wider",
											children: "Tempo de Foco"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-3xl font-display font-medium text-primary",
												children: formatMinutes(idea.dedicated)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"de ",
													formatMinutes(idea.minutes),
													" estimados"
												]
											})]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
												size: 13,
												className: "text-primary"
											}), idea.dedicated >= idea.minutes ? "Meta de tempo atingida!" : `Faltam cerca de ${formatMinutes(Math.max(0, idea.minutes - idea.dedicated))}`]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-lg bg-card/80 border border-border flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground uppercase font-semibold tracking-wider",
											children: "Estágio Atual"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex items-center gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-display font-semibold text-foreground",
												children: stageNames[idea.stage]
											})
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex items-center gap-1",
											children: stageNames.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-2 flex-1 rounded-full ${i <= idea.stage ? "bg-primary" : "bg-secondary"} transition-colors`,
												title: `Estágio ${i + 1}: ${stageNames[i]}`
											}, i))
										})]
									})
								]
							}),
							mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg bg-card/50 border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground block mb-3",
									children: "Comparativo de Minutos (Dedicado vs Previsto)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-36 w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: timeData,
											layout: "vertical",
											margin: {
												top: 5,
												right: 20,
												left: 20,
												bottom: 5
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													type: "number",
													unit: "m",
													stroke: "var(--muted-foreground)",
													fontSize: 11
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
													contentStyle: {
														backgroundColor: "var(--card)",
														borderColor: "var(--border)",
														fontSize: "12px"
													},
													formatter: (value) => [`${value} minutos`, "Duração"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "minutos",
													radius: [
														0,
														4,
														4,
														0
													],
													children: timeData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.fill }, `cell-${index}`))
												})
											]
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-border/70 bg-card/70 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
										size: 14,
										className: "text-violet"
									}), "Contexto de Workspace & Atribuição"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-muted-foreground block mb-1",
											children: "Espaço / Workspace"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "text-field text-xs py-1.5 w-full",
											value: idea.workspace ?? "personal",
											onChange: (e) => {
												const newWs = e.target.value;
												updateIdea(idea.id, { workspace: newWs });
												toast.success(newWs === "business" ? "Movido para o Workspace da Empresa! 🏢" : "Movido para o Espaço Pessoal 👤");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "personal",
												children: "👤 Espaço Pessoal"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "business",
												children: "🏢 Workspace Empresarial"
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-muted-foreground block mb-1",
											children: "Setor / Departamento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "text-field text-xs py-1.5 w-full",
											value: idea.sector,
											onChange: (e) => {
												const newSecId = e.target.value;
												const secObj = [...data.sectors, ...data.companyWorkspace?.sectors ?? defaultCompanySectors].find((s) => s.id === newSecId);
												updateIdea(idea.id, {
													sector: newSecId,
													department: secObj ? secObj.name : void 0
												});
												toast.success("Setor atualizado!");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
												label: "Setores Pessoais",
												children: data.sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s.id,
													children: s.name
												}, s.id))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
												label: "Departamentos da Empresa",
												children: (data.companyWorkspace?.sectors ?? defaultCompanySectors).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s.id,
													children: s.name
												}, `biz-${s.id}`))
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-muted-foreground block mb-1",
											children: "Responsável na Equipe"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "text-field text-xs py-1.5 w-full",
											value: idea.assignedTo ?? "",
											onChange: (e) => {
												const newResp = e.target.value || void 0;
												updateIdea(idea.id, { assignedTo: newResp });
												toast.success(newResp ? `Atribuído a ${newResp}` : "Atribuição removida");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Nenhum (Livre)"
											}), (data.companyWorkspace?.members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: m.name,
												children: [
													m.name,
													" (",
													m.role,
													")"
												]
											}, m.id))]
										})] })
									]
								})]
							}),
							(idea.isProject || activeSubIdeas.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { size: 14 }),
												"Estrutura do Projeto Macro (",
												projectStats.totalSub,
												" módulos)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-6 text-xs text-primary px-2 gap-1",
											onClick: () => setTab("subideas"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gerenciar Módulos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 12 })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											projectStats.completedSub,
											" de ",
											projectStats.totalSub,
											" módulos realizados"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-foreground font-semibold",
											children: [projectStats.percent, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
										value: projectStats.percent,
										max: 100
									}),
									activeSubIdeas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1",
										children: activeSubIdeas.slice(0, 4).map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setCurrentIdeaId(sub.id),
											className: "p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/50 text-left transition-all cursor-pointer flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-medium text-foreground truncate block",
													children: sub.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-muted-foreground",
													children: [
														stageNames[sub.stage],
														" · ",
														formatMinutes(sub.minutes)
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												size: 12,
												className: "text-muted-foreground shrink-0"
											})]
										}, sub.id))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-border/80 bg-card/60 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 h-6 rounded-md bg-amber/15 text-amber border border-amber/30 text-xs font-bold flex items-center justify-center shrink-0",
											children: "5P"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
											children: [isBusinessIdea ? "Alinhamento Estratégico (5 Porquês da Empresa)" : "Propósito Raiz: Técnica dos 5 Porquês", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground font-normal",
												children: [
													"(",
													(idea.fiveWhys || []).filter((w) => w.trim()).length,
													"/5 respondidos)"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: isBusinessIdea ? "Métricas de negócio, ROI, dor do cliente e viabilidade que orientam esta iniciativa." : "A motivação profunda e os obstáculos que guiam o plano de ação desta realização."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10 cursor-pointer",
											onClick: () => setEditingFiveWhys(!editingFiveWhys),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingFiveWhys ? "Fechar Edição" : idea.fiveWhys?.length ? "Editar Porquês" : "Definir 5 Porquês" })]
										})
									})]
								}), editingFiveWhys ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 pt-2 border-t border-border/60 animate-in fade-in-50 duration-200",
									children: [currentWhysQuestions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-[11px] font-medium text-foreground block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-primary mr-1",
												children: [q.step, "º Por quê:"]
											}), q.question]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: localFiveWhys[idx] || "",
											onChange: (e) => {
												const updated = [...localFiveWhys];
												updated[idx] = e.target.value;
												setLocalFiveWhys(updated);
											},
											placeholder: q.placeholder,
											className: "w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
										})]
									}, q.step)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center pt-1 flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											disabled: isSuggestingWhysDetail,
											className: "h-7 text-[11px] gap-1 text-primary border-primary/30 cursor-pointer",
											onClick: handleSuggestWhysInDetail,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
												size: 11,
												className: isSuggestingWhysDetail ? "animate-spin" : ""
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSuggestingWhysDetail ? "Sugerindo..." : "Sugerir com IA" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											size: "sm",
											className: "h-7 text-xs px-3 cursor-pointer",
											onClick: handleSaveFiveWhysInDetail,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												size: 12,
												className: "mr-1"
											}), "Salvar 5 Porquês"]
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 pt-1",
									children: idea.fiveWhys && idea.fiveWhys.some((w) => w.trim()) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 gap-2",
										children: idea.fiveWhys.map((why, idx) => {
											const q = currentWhysQuestions[idx];
											if (!why.trim()) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-semibold text-primary uppercase tracking-wider block mb-0.5",
													children: [
														idx + 1,
														"º Por quê: ",
														q?.question
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-foreground/90 text-xs leading-relaxed",
													children: why
												})]
											}, idx);
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-3 text-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground",
										children: "Nenhum porquê registrado ainda. Clique em “Definir 5 Porquês” para registrar a raiz da ideia!"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "detail-fields",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: idea.sector,
									onChange: (e) => updateIdea(idea.id, { sector: e.target.value }),
									children: data.sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.name
									}, s.id))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Prioridade", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: idea.priority,
									onChange: (e) => updateIdea(idea.id, { priority: e.target.value }),
									children: [
										"Urgente",
										"Importante",
										"Normal"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "immediate-action",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), "PRÓXIMA AÇÃO RECOMENDADA · 15 MIN"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: idea.immediate })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-lg border border-border/70 bg-card/60 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-muted-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitFork, {
											size: 13,
											className: "text-primary"
										}), "Escopo Atual Definido"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-6 text-[11px] text-primary px-2",
										onClick: () => setTab("pivots"),
										children: "Editar / Mudar Rota"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-foreground leading-relaxed",
									children: idea.scope || "Nenhum escopo formal delimitado ainda. Defina os limites na aba Mudança de Rota."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sheet-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "primary-action gap-2",
									onClick: () => {
										onClose();
										onFocus(idea);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 16 }), "Começar sessão de foco agora"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "gap-2",
									onClick: () => {
										updateIdea(idea.id, {
											day: localDate(),
											block: "Manhã"
										});
										toast.success("Ideia adicionada ao seu dia (Manhã)");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { size: 16 }), "Planejar para hoje"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border flex items-center justify-between",
								children: [idea.stage < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: "text-primary gap-1.5",
									onClick: () => {
										const next = idea.stage + 1;
										updateIdea(idea.id, { stage: next });
										toast.success(`Avançado para ${stageNames[next]}! 🚀`);
									},
									children: [
										"Avançar para ",
										stageNames[idea.stage + 1],
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 15 })
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-green flex items-center gap-2 text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 18 }), "Esta ideia é uma Realidade concluída!"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "text-destructive hover:bg-destructive/10",
									"aria-label": "Excluir ideia",
									onClick: () => {
										if (window.confirm("Excluir esta ideia definitivamente?")) {
											setData((p) => ({
												...p,
												ideas: p.ideas.filter((i) => i.id !== idea.id)
											}));
											onClose();
											toast.success("Ideia removida.");
										}
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
								})]
							})
						]
					}),
					tab === "steps" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-sm",
									children: "Checklist de Realização"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Marque os passos à medida que executa ou adicione novos passos."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-8 text-xs gap-1.5",
									onClick: handleSuggestStepsAi,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										size: 13,
										className: "text-primary"
									}), "Sugerir passos com IA"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: idea.steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									draggable: true,
									onDragStart: () => setDraggedStepIdx(index),
									onDragOver: (e) => e.preventDefault(),
									onDrop: () => {
										if (draggedStepIdx !== null && draggedStepIdx !== index) {
											handleMoveStep(draggedStepIdx, index);
											setDraggedStepIdx(null);
										}
									},
									className: `flex items-start gap-2.5 p-3 rounded-lg border transition-all ${draggedStepIdx === index ? "opacity-50 border-primary border-dashed scale-[0.99]" : step.done ? "bg-secondary/40 border-border/50 text-muted-foreground" : "bg-card border-border hover:border-border-highlight"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-0.5 shrink-0 pt-0.5 select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground",
												title: "Arraste para cima ou para baixo para reordenar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { size: 13 })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: index === 0,
													onClick: () => handleMoveStep(index, index - 1),
													className: "text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer",
													title: "Mover passo para cima",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 11 })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: index === idea.steps.length - 1,
													onClick: () => handleMoveStep(index, index + 1),
													className: "text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer",
													title: "Mover passo para baixo",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 11 })
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "check-box cursor-pointer shrink-0 mt-0.5",
											onClick: () => handleToggleStep(index),
											title: step.done ? "Marcar como não feito" : "Marcar como concluído",
											children: step.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												size: 14,
												className: "text-primary"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 min-w-0",
											children: editingStepIndex === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 2,
													className: "text-xs bg-background border border-primary px-2 py-1.5 rounded w-full text-foreground resize-none leading-relaxed break-words",
													defaultValue: step.text,
													autoFocus: true,
													onBlur: (e) => {
														const updated = idea.steps.map((s, i) => i === index ? {
															...s,
															text: e.target.value
														} : s);
														updateIdea(idea.id, { steps: updated });
														setEditingStepIndex(null);
													}
												})
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs block cursor-pointer select-none leading-relaxed break-words ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`,
												onClick: () => handleToggleStep(index),
												children: step.text
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted-foreground font-mono shrink-0 pt-0.5",
											children: [step.minutes, "m"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-7 w-7 text-muted-foreground hover:text-foreground shrink-0",
											title: "Editar texto",
											onClick: () => setEditingStepIndex(editingStepIndex === index ? null : index),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 12 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-7 w-7 text-muted-foreground hover:text-destructive shrink-0",
											title: "Excluir passo",
											onClick: () => handleDeleteStep(index),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
										})
									]
								}, step.id ?? index))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-lg border border-dashed border-border bg-card/40 mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground block mb-2",
									children: "Adicionar Novo Passo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										className: "flex-1 bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground resize-none leading-relaxed break-words",
										placeholder: "Ex: Agendar reunião de alinhamento com 2 pessoas...",
										value: newStepText,
										onChange: (e) => setNewStepText(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "w-24 bg-background border border-border rounded px-2 h-8 text-xs",
											value: newStepMinutes,
											onChange: (e) => setNewStepMinutes(Number(e.target.value)),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 10,
													children: "10 min"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 15,
													children: "15 min"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 25,
													children: "25 min"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 30,
													children: "30 min"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 45,
													children: "45 min"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 60,
													children: "1h"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "h-8 text-xs gap-1",
											onClick: handleAddStep,
											disabled: !newStepText.trim(),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), "Adicionar"]
										})]
									})]
								})]
							})
						]
					}),
					tab === "subideas" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-semibold text-sm flex items-center gap-2 text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
												size: 16,
												className: "text-primary"
											}), "Estrutura de Módulos do Projeto"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: "Projetos complexos podem conter várias ideias e frentes de desenvolvimento (ex: front-end, back-end, marketing)."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												disabled: isGeneratingSubAi,
												className: "h-8 text-xs gap-1.5",
												onClick: handleGenerateAiSubModules,
												title: "Sugerir ideias e frentes com IA para este projeto",
												children: isGeneratingSubAi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
													size: 13,
													className: "text-primary animate-spin"
												}), "Planejando com IA..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
													size: 13,
													className: "text-primary"
												}), "Sugerir Ideias com IA ✨"] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "h-8 text-xs gap-1.5",
												onClick: () => setShowSubIdeaForm(!showSubIdeaForm),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), showSubIdeaForm ? "Cancelar" : "+ Nova Ideia no Projeto"]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg bg-card/80 border border-border/70",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground uppercase font-semibold",
													children: "Total de Ideias"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "block text-2xl font-display font-medium text-foreground mt-1",
													children: projectStats.totalSub
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg bg-card/80 border border-border/70",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground uppercase font-semibold",
													children: "Realizadas"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "block text-2xl font-display font-medium text-green mt-1",
													children: projectStats.completedSub
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg bg-card/80 border border-border/70",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground uppercase font-semibold",
													children: "Progresso Geral"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
													className: "block text-2xl font-display font-medium text-primary mt-1",
													children: [projectStats.percent, "%"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg bg-card/80 border border-border/70",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground uppercase font-semibold",
													children: "Tempo Total"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "block text-2xl font-display font-medium text-foreground mt-1",
													children: formatMinutes(projectStats.totalMinutes)
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs text-muted-foreground mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Taxa de conclusão agregada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [projectStats.percent, "%"] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
										value: projectStats.percent,
										max: 100,
										className: "w-full h-2"
									})] })
								]
							}),
							showSubIdeaForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-primary/40 bg-card space-y-3.5 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-primary flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), "Adicionar Nova Ideia a este Projeto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground block mb-1",
										children: "Título da Ideia *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "text-field text-xs",
										placeholder: "Ex.: Front-end da loja, API de pagamentos, Campanha de marketing...",
										value: subIdeaTitle,
										onChange: (e) => setSubIdeaTitle(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground block mb-1",
										children: "Objetivo / O que essa ideia resolve"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										className: "text-field text-xs resize-none",
										placeholder: "Ex.: Desenvolver os layouts, vitrine e carrinho de compras responsivo...",
										value: subIdeaSummary,
										onChange: (e) => setSubIdeaSummary(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted-foreground",
											children: ["Prioridade", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "mt-1",
												value: subIdeaPriority,
												onChange: (e) => setSubIdeaPriority(e.target.value),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Normal",
														children: "Normal"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Importante",
														children: "Importante"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Urgente",
														children: "Urgente"
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted-foreground",
											children: ["Tempo Estimado", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "mt-1",
												value: subIdeaMinutes,
												onChange: (e) => setSubIdeaMinutes(Number(e.target.value)),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 30,
														children: "30 min"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 60,
														children: "1h"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 90,
														children: "1h 30min"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 120,
														children: "2h"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 180,
														children: "3h"
													})
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-8 text-xs",
											onClick: () => setShowSubIdeaForm(false),
											children: "Cancelar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "h-8 text-xs gap-1",
											onClick: handleCreateSubIdea,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }), "Criar Ideia no Projeto"]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider",
										children: [
											"Ideias deste Projeto (",
											subIdeas.length,
											")"
										]
									}), subIdeas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "Clique em uma ideia para abrir e executar seus passos no funil"
									})]
								}), subIdeas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-8 rounded-xl border border-dashed border-border/80 text-center space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
											size: 32,
											className: "mx-auto text-muted-foreground/60"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "max-w-md mx-auto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-semibold text-sm text-foreground",
												children: "Nenhuma ideia adicionada ainda neste projeto"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-1 leading-relaxed",
												children: "Quebre o escopo deste projeto em ideias menores e focadas (como Front-end, Back-end, Marketing, etc.) para acelerar a execução."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-center gap-2 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "h-8 text-xs gap-1.5",
												onClick: () => setShowSubIdeaForm(true),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 13 }), "Criar Primeira Ideia"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "h-8 text-xs gap-1.5",
												onClick: handleGenerateAiSubModules,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
													size: 13,
													className: "text-primary"
												}), "Sugerir Ideias com IA"]
											})]
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 gap-3",
									children: subIdeas.map((sub) => {
										const subCompleted = sub.steps.filter((s) => s.done).length;
										const subTotal = sub.steps.length;
										const subPercent = subTotal > 0 ? Math.round(subCompleted / subTotal * 100) : 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `p-4 rounded-xl border transition-all ${sub.archived ? "bg-secondary/30 border-border/50 opacity-70" : "bg-card border-border hover:border-primary/40"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-start justify-between gap-2 mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: `sector-tag tone-${stageTones[sub.stage]}`,
																children: [
																	stageNames[sub.stage],
																	" (",
																	subPercent,
																	"%)"
																]
															}),
															sub.archived && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] bg-amber/20 text-amber px-1.5 py-0.5 rounded font-medium",
																children: "Arquivado"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-xs text-muted-foreground flex items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 12 }), formatMinutes(sub.minutes)]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																variant: "outline",
																size: "sm",
																className: "h-7 text-xs gap-1 text-primary hover:bg-primary/10",
																onClick: () => {
																	setCurrentIdeaId(sub.id);
																	setTab("overview");
																},
																title: "Abrir painel e checklist desta ideia",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Abrir Ideia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 12 })]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																variant: "ghost",
																size: "sm",
																className: "h-7 text-xs text-muted-foreground hover:text-foreground",
																onClick: () => handleUnlinkSubIdea(sub.id),
																title: "Desvincular ideia do projeto (tornar ideia avulsa)",
																children: "Desvincular"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																variant: "ghost",
																size: "sm",
																className: "h-7 text-xs text-muted-foreground hover:text-amber",
																onClick: () => {
																	updateIdea(sub.id, { archived: !sub.archived });
																	toast.success(sub.archived ? "Ideia restaurada!" : "Ideia arquivada!");
																},
																title: sub.archived ? "Restaurar ideia" : "Arquivar ideia",
																children: sub.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { size: 12 })
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-semibold text-sm text-foreground",
													children: sub.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mt-1 leading-relaxed",
													children: sub.summary
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"Checklist: ",
														subCompleted,
														" de ",
														subTotal,
														" passos"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [subPercent, "%"] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
													value: subCompleted,
													max: Math.max(1, subTotal),
													className: "mt-1"
												})
											]
										}, sub.id);
									})
								})]
							})
						]
					}),
					tab === "pivots" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg bg-card border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-semibold text-sm flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
											size: 16,
											className: "text-primary"
										}), "Definição Atual de Escopo"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7 text-xs gap-1",
										onClick: () => setShowPivotForm(!showPivotForm),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitFork, { size: 13 }), showPivotForm ? "Fechar Formulário" : "+ Registrar Mudança de Rota"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: idea.scope || "Nenhum escopo delimitado ainda. Defina os limites abaixo."
								})]
							}),
							showPivotForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg border border-primary/40 bg-primary/5 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-semibold text-primary flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), "Novo Registro de Mudança de Rota / Pivô"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted-foreground",
											children: ["Tipo de Mudança", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "mt-1",
												value: pivotType,
												onChange: (e) => setPivotType(e.target.value),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Redução de Escopo",
														children: "Redução de Escopo (Simplificar para entregar rápido)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Expansão de Escopo",
														children: "Expansão de Escopo (Novas ambições e escala)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Mudança de Rota",
														children: "Mudança de Rota (Pivô de público, canal ou produto)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Pausa Estratégica",
														children: "Pausa Estratégica (Congelar temporariamente)"
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted-foreground",
											children: ["Novo Escopo do Projeto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "text-field mt-1 text-xs",
												placeholder: "Ex.: Focar apenas na versão web inicial...",
												value: newScope,
												onChange: (e) => setNewScope(e.target.value)
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted-foreground block",
										children: ["Motivo da Mudança (Por que decidimos mudar de rumo?) *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "text-field mt-1 text-xs resize-none",
											rows: 2,
											placeholder: "Ex: Percebemos que 80% do valor estava na funcionalidade de busca e o restante estava gerando atrito...",
											value: pivotReason,
											onChange: (e) => setPivotReason(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-8 text-xs",
											onClick: () => setShowPivotForm(false),
											children: "Cancelar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "h-8 text-xs gap-1.5 primary-action",
											onClick: handleSavePivot,
											disabled: !pivotReason.trim(),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), "Salvar Mudança de Rota"]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { size: 13 }),
											"Histórico de Pivôs e Ajustes de Escopo (",
											idea.pivots?.length ?? 0,
											")"
										]
									}),
									(!idea.pivots || idea.pivots.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg",
										children: "Nenhuma mudança de rota registrada ainda. Se precisar adaptar o projeto, registre aqui para manter a clareza do porquê o rumo mudou."
									}),
									idea.pivots?.map((pivot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-lg border border-border bg-card/70 space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20",
													children: pivot.type
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground",
													children: pivot.date
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground block text-xs",
												children: "Motivo:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground mt-0.5",
												children: pivot.reason
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2 border-t border-border/50 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Escopo Anterior:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-foreground/80 line-clamp-2",
													children: pivot.previousScope
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary font-medium",
													children: "Novo Escopo:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-foreground line-clamp-2",
													children: pivot.newScope
												})] })]
											})
										]
									}, pivot.id))
								]
							})
						]
					}),
					tab === "notes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm",
								children: "Diário de Bordo & Insights"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Registre aprendizados, conversas, links de referência e anotações do dia a dia."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg border border-border bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "w-full bg-transparent border-0 resize-none text-xs text-foreground placeholder:text-muted-foreground outline-none",
									rows: 3,
									placeholder: "Escreva um aprendizado, link ou nota rápida...",
									value: noteText,
									onChange: (e) => setNoteText(e.target.value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end mt-2 pt-2 border-t border-border/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-7 text-xs gap-1",
										onClick: handleAddNote,
										disabled: !noteText.trim(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 13 }), "Adicionar Nota"]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [(!idea.notes || idea.notes.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg",
									children: "Nenhuma anotação registrada ainda."
								}), idea.notes?.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg border border-border/70 bg-card/60 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: note.createdAt
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-5 w-5 text-muted-foreground hover:text-destructive",
											onClick: () => handleDeleteNote(note.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground leading-relaxed whitespace-pre-wrap",
										children: note.text
									})]
								}, note.id))]
							})
						]
					}),
					tab === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-lg bg-card border border-border space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold text-sm flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
										size: 16,
										className: "text-primary"
									}), "Agendamento e Prazos"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Conecte esta ideia ao seu calendário pessoal para garantir espaço na sua rotina."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted-foreground",
										children: ["Data Planejada de Execução", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											className: "text-field mt-1 text-xs",
											value: idea.day ?? "",
											onChange: (e) => updateIdea(idea.id, { day: e.target.value || void 0 })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted-foreground",
										children: ["Bloco do Dia", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "mt-1",
											value: idea.block ?? "Manhã",
											onChange: (e) => updateIdea(idea.id, { block: e.target.value }),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Manhã",
													children: "Manhã"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Tarde",
													children: "Tarde"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Noite",
													children: "Noite"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground block",
									children: ["Prazo Limite / Meta de Conclusão (Opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "text-field mt-1 text-xs",
										value: idea.targetDate ?? "",
										onChange: (e) => updateIdea(idea.id, { targetDate: e.target.value || void 0 })
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-primary block",
									children: "Sincronizar com seu Calendário Externo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Crie um evento na sua agenda com os passos e o resumo desta ideia já preenchidos."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "text-xs gap-1.5",
										onClick: () => {
											const url = createGoogleCalendarUrl(idea);
											window.open(url, "_blank");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 13 }), "Abrir no Google Agenda"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "text-xs gap-1.5",
										onClick: () => {
											downloadIcsFile(idea);
											toast.success("Arquivo .ics gerado com sucesso!");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 13 }), "Baixar arquivo de agenda (.ics)"]
									})]
								})
							]
						})]
					}),
					tab === "coach" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg border border-primary/30 bg-card space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-primary font-semibold text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { size: 16 }), "Diagnóstico de Fricção Mental"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-foreground leading-relaxed",
									children: coaching.frictionDiagnosis
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg border border-amber/30 bg-amber/5 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-amber font-semibold text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 15 }), "Próxima Ação de Alto Impacto"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-foreground leading-relaxed",
									children: coaching.recommendedAction
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg border border-violet/30 bg-violet/5 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-violet font-semibold text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 15 }), "Pergunta Provocativa para Clareza"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-foreground font-medium italic",
									children: [
										"\"",
										coaching.coachingQuestion,
										"\""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full primary-action gap-2",
									onClick: () => {
										onClose();
										window.dispatchEvent(new CustomEvent("ideaflow:mentor", { detail: { idea } }));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), "Conversar com o Mentor IA sobre esta ideia (100% Gratuito)"]
								})
							})
						]
					})
				]
			})
		})
	});
}
//#endregion
export { IdeaDetail as a, DrawerTitle as i, DrawerContent as n, suggestFiveWhysWithAi as o, DrawerDescription as r, Drawer$1 as t };
