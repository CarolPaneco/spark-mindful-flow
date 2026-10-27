import { i as __toESM } from "../_runtime.mjs";
import { C as stageTones, S as stageNames, a as defaultCompanySectors, c as formatMinutes, f as getFiveWhysQuestions, o as detectSectorFromTitle, u as generateSubModulesAi, w as suggestFiveWhysOffline } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { At as ChevronUp, D as Search, Jt as ArrowRight, K as LoaderCircle, Nt as ChevronDown, Ot as CircleCheck, Pt as Check, Tt as Circle, Vt as Building2, Wt as Bot, Y as LayoutList, Zt as Archive, _ as Sparkles, bt as Columns3, d as Trash2, j as Plus, lt as Flame, ot as FolderTree, rt as GripVertical, st as FolderPlus, t as Zap } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFlow, a as DialogTitle, f as getActiveGeminiKey, i as DialogDescription, n as Dialog, r as DialogContent, t as Button, u as generateProjectModulesWithAi } from "./ai-assistant-3aCui_AD.mjs";
import { a as IdeaDetail, i as DrawerTitle, n as DrawerContent, o as suggestFiveWhysWithAi, r as DrawerDescription, t as Drawer$1 } from "./idea-detail-De8DGVyi.mjs";
import { t as FocusTimer } from "./focus-timer-BQa0LN4H.mjs";
import { t as IdeaCard } from "./idea-card-DWCdOy6O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bs2Zk3cR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CreateProjectSheet({ open, onClose, onOpenProject }) {
	const { data, setData } = useFlow();
	const isBusiness = data.workspaceMode === "business";
	const currentWhysQuestions = getFiveWhysQuestions(isBusiness);
	const activeSectors = isBusiness ? data.companyWorkspace?.sectors ?? defaultCompanySectors : data.sectors;
	data.companyWorkspace?.members;
	const [title, setTitle] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [sector, setSector] = (0, import_react.useState)(activeSectors[0]?.id ?? "tech");
	const [sectorManuallyChanged, setSectorManuallyChanged] = (0, import_react.useState)(false);
	const [priority, setPriority] = (0, import_react.useState)("Importante");
	const [scope, setScope] = (0, import_react.useState)("");
	const [targetDate, setTargetDate] = (0, import_react.useState)("");
	const [isGeneratingAi, setIsGeneratingAi] = (0, import_react.useState)(false);
	const [draggedIndex, setDraggedIndex] = (0, import_react.useState)(null);
	const [fiveWhys, setFiveWhys] = (0, import_react.useState)([
		"",
		"",
		"",
		"",
		""
	]);
	const [showFiveWhys, setShowFiveWhys] = (0, import_react.useState)(false);
	const [suggestingWhys, setSuggestingWhys] = (0, import_react.useState)(false);
	const [isDesktop, setIsDesktop] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return window.innerWidth >= 769;
	});
	(0, import_react.useEffect)(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 769);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const hasGeminiKey = Boolean(getActiveGeminiKey());
	const handleTitleChange = (newTitle) => {
		setTitle(newTitle);
		if (!sectorManuallyChanged && newTitle.trim().length > 3) {
			const detected = detectSectorFromTitle(newTitle, activeSectors);
			if (detected && detected !== sector) setSector(detected);
		}
	};
	const [subIdeas, setSubIdeas] = (0, import_react.useState)([{
		id: "sub-1",
		title: "Frente 1: Planejamento & Orçamento",
		summary: "Levantar referências, materiais e estimar recursos necessários",
		minutes: 60,
		priority: "Importante"
	}, {
		id: "sub-2",
		title: "Frente 2: Execução do Núcleo Principal",
		summary: "Mão na massa na entrega essencial do projeto",
		minutes: 120,
		priority: "Normal"
	}]);
	const resetForm = () => {
		setTitle("");
		setSummary("");
		setSector(data.sectors[0]?.id ?? "personal");
		setSectorManuallyChanged(false);
		setPriority("Importante");
		setScope("");
		setTargetDate("");
		setIsGeneratingAi(false);
		setFiveWhys([
			"",
			"",
			"",
			"",
			""
		]);
		setShowFiveWhys(false);
		setSubIdeas([{
			id: "sub-1",
			title: "Frente 1: Planejamento & Orçamento",
			summary: "Levantar referências, materiais e estimar recursos necessários",
			minutes: 60,
			priority: "Importante"
		}, {
			id: "sub-2",
			title: "Frente 2: Execução do Núcleo Principal",
			summary: "Mão na massa na entrega essencial do projeto",
			minutes: 120,
			priority: "Normal"
		}]);
	};
	const handleAddSubIdea = () => {
		const nextNum = subIdeas.length + 1;
		setSubIdeas((prev) => [...prev, {
			id: crypto.randomUUID(),
			title: `Frente ${nextNum}: Nova ideia do projeto`,
			summary: "Descreva o objetivo desta frente dentro do projeto",
			minutes: 60,
			priority: "Normal"
		}]);
	};
	const handleUpdateSubIdea = (id, patch) => {
		setSubIdeas((prev) => prev.map((s) => s.id === id ? {
			...s,
			...patch
		} : s));
	};
	const handleDeleteSubIdea = (id) => {
		setSubIdeas((prev) => prev.filter((s) => s.id !== id));
	};
	const handleMoveSubIdea = (fromIndex, toIndex) => {
		if (toIndex < 0 || toIndex >= subIdeas.length) return;
		const reordered = [...subIdeas];
		const [moved] = reordered.splice(fromIndex, 1);
		if (!moved) return;
		reordered.splice(toIndex, 0, moved);
		setSubIdeas(reordered);
	};
	const handleSuggestWhys = async () => {
		if (!title.trim() && !summary.trim()) {
			toast.info("Dê um título ao projeto primeiro para sugerirmos os 5 porquês.");
			return;
		}
		setSuggestingWhys(true);
		try {
			const suggestions = await suggestFiveWhysWithAi(`${title}. ${summary}`);
			if (suggestions && suggestions.length > 0) {
				setFiveWhys(suggestions);
				setShowFiveWhys(true);
				toast.success("5 Porquês gerados com IA! Você pode editar as respostas.");
			}
		} catch {
			const offline = suggestFiveWhysOffline(`${title}. ${summary}`, isBusiness);
			setFiveWhys(offline);
			setShowFiveWhys(true);
			toast.success(isBusiness ? "Perguntas estratégicas do projeto preenchidas pela IA! 🏢" : "5 Porquês sugeridos com sucesso!");
		} finally {
			setSuggestingWhys(false);
		}
	};
	const handleGenerateAiModules = async () => {
		if (!title.trim()) {
			toast.info("Dê um título ao projeto primeiro para a IA sugerir as melhores ideias/frentes.");
			return;
		}
		setIsGeneratingAi(true);
		try {
			const result = await generateProjectModulesWithAi(title, summary, sector, fiveWhys);
			const formatted = result.modules.map((m) => ({
				id: crypto.randomUUID(),
				title: m.title,
				summary: m.summary,
				minutes: m.minutes,
				priority: "Normal"
			}));
			setSubIdeas(formatted);
			if (result.provider === "groq") toast.success(`Groq LLaMA 3.3 gerou ${formatted.length} frentes personalizadas para “${title}”! ⚡`);
			else if (result.provider === "gemini") toast.success(`Google Gemini gerou ${formatted.length} frentes personalizadas para “${title}”! ✨`);
			else toast.success(`Motor Local Inteligente gerou ${formatted.length} frentes para seu projeto! ✨`);
		} catch (err) {
			const fallback = generateSubModulesAi(title, summary, sector, fiveWhys);
			setSubIdeas(fallback.map((m) => ({
				id: crypto.randomUUID(),
				title: m.title,
				summary: m.summary,
				minutes: m.minutes,
				priority: "Normal"
			})));
			toast.info("Ideias geradas pelo motor cognitivo local.");
		} finally {
			setIsGeneratingAi(false);
		}
	};
	const handleCreateProject = () => {
		if (!title.trim()) {
			toast.error("Informe o nome do projeto.");
			return;
		}
		const projectId = crypto.randomUUID();
		const childIdeas = subIdeas.filter((s) => s.title.trim().length > 0).map((sub, index) => {
			const duration = Number(sub.minutes) || 60;
			return {
				id: crypto.randomUUID(),
				title: sub.title.trim(),
				summary: sub.summary.trim() || `Frente de desenvolvimento do projeto ${title.trim()}`,
				sector,
				priority: sub.priority,
				stage: 0,
				parentId: projectId,
				workspace: isBusiness ? "business" : "personal",
				companyId: isBusiness && data.companyWorkspace?.id ? data.companyWorkspace.id : void 0,
				department: isBusiness ? activeSectors.find((s) => s.id === sector)?.name ?? sector : void 0,
				minutes: duration,
				dedicated: 0,
				scope: `Escopo específico da frente: ${sub.title.trim()}`,
				steps: [
					{
						id: crypto.randomUUID(),
						text: `Definir entrega principal de “${sub.title.trim()}”`,
						minutes: 15,
						done: false
					},
					{
						id: crypto.randomUUID(),
						text: `Construir primeira versão funcional da frente`,
						minutes: Math.max(15, duration - 30),
						done: false
					},
					{
						id: crypto.randomUUID(),
						text: `Validar e integrar ao projeto macro ${title.trim()}`,
						minutes: 15,
						done: false
					}
				],
				immediate: `Definir entrega principal de “${sub.title.trim()}”`,
				clarity: `Frente ${index + 1} estruturada dentro do projeto.`,
				pivots: [],
				notes: []
			};
		});
		const projectDuration = childIdeas.reduce((sum, c) => sum + c.minutes, 60);
		const projectIdea = {
			id: projectId,
			title: title.trim(),
			summary: summary.trim() || `Projeto macro contendo ${childIdeas.length} frentes de desenvolvimento integradas.`,
			sector,
			priority,
			stage: 0,
			isProject: true,
			workspace: isBusiness ? "business" : "personal",
			companyId: isBusiness && data.companyWorkspace?.id ? data.companyWorkspace.id : void 0,
			department: isBusiness ? activeSectors.find((s) => s.id === sector)?.name ?? sector : void 0,
			fiveWhys: fiveWhys.filter((w) => w.trim()).length > 0 ? fiveWhys : void 0,
			scope: scope.trim() || "Projeto estruturado com frentes modulares para execução clara e sem sobrecarga.",
			targetDate: targetDate || void 0,
			minutes: projectDuration,
			dedicated: 0,
			steps: [
				{
					id: crypto.randomUUID(),
					text: `Revisar o escopo e prioridades das ${childIdeas.length} frentes do projeto`,
					minutes: 15,
					done: false
				},
				{
					id: crypto.randomUUID(),
					text: `Avançar o primeiro módulo prioritário no funil`,
					minutes: 30,
					done: false
				},
				{
					id: crypto.randomUUID(),
					text: `Alinhar entregas e verificar integração entre os módulos`,
					minutes: 15,
					done: false
				}
			],
			immediate: `Revisar o escopo e prioridades das ${childIdeas.length} frentes do projeto`,
			clarity: "Projetos organizados em frentes tornam o grande objetivo palpável e leve.",
			pivots: [],
			notes: []
		};
		setData((prev) => ({
			...prev,
			ideas: [
				projectIdea,
				...childIdeas,
				...prev.ideas
			]
		}));
		toast.success(`Projeto “${title.trim()}” criado com ${childIdeas.length} ideias dentro! 🚀`);
		resetForm();
		onClose();
		if (onOpenProject) setTimeout(() => onOpenProject(projectId), 100);
	};
	const totalEstimatedMinutes = subIdeas.reduce((acc, curr) => acc + (Number(curr.minutes) || 0), 0);
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sheet-body max-w-4xl mx-auto w-full p-2 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sheet-eyebrow text-violet",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { size: 15 }), "NOVO PROJETO MACRO · ESTRUTURA ORGANIZADA"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs bg-violet/15 text-violet border border-violet/30 px-2 py-0.5 rounded font-medium",
					children: "Multi-Ideias"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "sheet-title text-2xl sm:text-3xl font-display font-bold text-foreground mt-2",
				children: "Criar Novo Projeto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
					className: "text-sm text-muted-foreground leading-relaxed flex-1",
					children: "Projetos permitem organizar um escopo maior contendo várias ideias ou módulos dentro (ex: Reforma da Cozinha, Site de Vendas, Encontro de Família)."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${hasGeminiKey ? "bg-green/10 border-green/30 text-green" : "bg-primary/10 border-primary/30 text-primary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { size: 12 }), hasGeminiKey ? "Gemini AI Conectado ✨" : "Motor Cognitivo Local (100% Offline)"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 p-4 rounded-xl border border-border/80 bg-card/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1",
								children: "Nome do Projeto *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "text-field text-sm font-display font-medium",
								placeholder: "Ex.: Reformar minha cozinha / Fazer um bolo de cenoura...",
								value: title,
								onChange: (e) => handleTitleChange(e.target.value),
								autoFocus: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1",
								children: "Objetivo / Resumo Geral"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								className: "text-field text-xs resize-none",
								placeholder: "Ex.: Trocar piso e armários sob medida, instalar iluminação em LED e criar espaço acolhedor...",
								value: summary,
								onChange: (e) => setSummary(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted-foreground",
										children: ["Setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "mt-1",
											value: sector,
											onChange: (e) => {
												setSector(e.target.value);
												setSectorManuallyChanged(true);
											},
											children: activeSectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s.id,
												children: s.name
											}, s.id))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted-foreground",
										children: ["Prioridade", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "mt-1",
											value: priority,
											onChange: (e) => setPriority(e.target.value),
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
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted-foreground",
										children: ["Prazo Alvo (Opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											className: "text-field mt-1 text-xs",
											value: targetDate,
											onChange: (e) => setTargetDate(e.target.value)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1",
								children: "Definição de Escopo (O que está incluído neste projeto?)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								className: "text-field text-xs resize-none",
								placeholder: "Ex.: Inclui planejamento financeiro, alvenaria, armários e pintura. Não inclui eletros novos na primeira fase.",
								value: scope,
								onChange: (e) => setScope(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-secondary/35 p-3.5 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 h-6 rounded-md bg-amber/15 text-amber border border-amber/30 text-xs font-bold flex items-center justify-center shrink-0",
											children: "5P"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
											children: [isBusiness ? "5 Porquês Corporativos do Projeto" : "Técnica dos 5 Porquês do Projeto", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10.5px] font-medium px-1.5 py-0.2 rounded-full bg-secondary text-primary border border-primary/25",
												children: [fiveWhys.filter((w) => w.trim()).length, "/5 preenchidos"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: isBusiness ? "Alinhe a meta estratégica, ROI e recursos para a IA sugerir frentes de trabalho da equipe." : "Defina o propósito raiz para a IA sugerir frentes de trabalho cirúrgicas."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [title.trim().length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											disabled: suggestingWhys,
											className: "h-7 text-[11px] px-2.5 gap-1 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer shadow-xs active:scale-95",
											onClick: handleSuggestWhys,
											title: "Usar IA para sugerir os 5 porquês do projeto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
												size: 11,
												className: suggestingWhys ? "animate-spin" : ""
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: suggestingWhys ? "Pensando..." : "Sugerir com IA" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer",
											onClick: () => setShowFiveWhys(!showFiveWhys),
											children: showFiveWhys ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ocultar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {
												size: 14,
												className: "ml-1"
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Abrir Perguntas (",
												fiveWhys.filter((w) => w.trim()).length,
												"/5)"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
												size: 14,
												className: "ml-1"
											})] })
										})]
									})]
								}), showFiveWhys && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3.5 space-y-3 pt-3 border-t border-border/60 animate-in fade-in-50 duration-200",
									children: [currentWhysQuestions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium text-foreground flex items-center justify-between",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-primary mr-1",
												children: [q.step, "º Por quê:"]
											}), q.question] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: fiveWhys[idx] || "",
											onChange: (e) => {
												const updated = [...fiveWhys];
												updated[idx] = e.target.value;
												setFiveWhys(updated);
											},
											placeholder: q.placeholder,
											className: "w-full text-xs bg-background/80 border border-border rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
										})]
									}, q.step)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-[10px] text-muted-foreground pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡 Dica: Ao responder os 5 porquês, a geração das frentes do projeto abaixo fica super alinhada." }), fiveWhys.some((w) => w.trim()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setFiveWhys([
												"",
												"",
												"",
												"",
												""
											]),
											className: "text-muted-foreground hover:text-pink transition-colors cursor-pointer",
											children: "Limpar respostas"
										})]
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 p-4 rounded-xl border border-primary/30 bg-primary/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold text-sm flex items-center gap-2 text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
											size: 16,
											className: "text-primary"
										}),
										"Ideias & Frentes dentro deste Projeto (",
										subIdeas.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Estas são as ideias modulares que compõem o escopo do seu projeto."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										disabled: isGeneratingAi,
										className: "h-8 text-xs gap-1.5 border-primary/40 bg-card hover:bg-primary/10",
										onClick: handleGenerateAiModules,
										title: "A IA analisa o nome do projeto e sugere frentes coerentes com o contexto real",
										children: isGeneratingAi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											size: 13,
											className: "text-primary animate-spin"
										}), "Planejando com IA..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
											size: 13,
											className: "text-primary"
										}), "Sugerir com IA ✨"] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 text-xs gap-1",
										onClick: handleAddSubIdea,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 13 }), "+ Adicionar Ideia"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 max-h-72 overflow-y-auto pr-1",
								children: subIdeas.map((sub, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									draggable: true,
									onDragStart: () => setDraggedIndex(index),
									onDragOver: (e) => e.preventDefault(),
									onDrop: () => {
										if (draggedIndex !== null && draggedIndex !== index) {
											handleMoveSubIdea(draggedIndex, index);
											setDraggedIndex(null);
										}
									},
									className: `p-3.5 rounded-lg border bg-card space-y-2 shadow-xs text-xs transition-all ${draggedIndex === index ? "opacity-50 border-primary border-dashed scale-[0.98]" : "border-border/80 hover:border-border"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-0.5 select-none",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground",
															title: "Arraste para cima ou para baixo para reordenar",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { size: 14 })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															disabled: index === 0,
															onClick: () => handleMoveSubIdea(index, index - 1),
															className: "text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer",
															title: "Mover frente para cima",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 12 })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															disabled: index === subIdeas.length - 1,
															onClick: () => handleMoveSubIdea(index, index + 1),
															className: "text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer",
															title: "Mover frente para baixo",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 12 })
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-primary font-bold text-xs flex items-center gap-1.5 ml-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[10px]",
														children: String(index + 1).padStart(2, "0")
													}), "Ideia / Frente"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "bg-secondary/40 border border-border/60 rounded px-2 py-0.5 text-[11px] text-foreground cursor-pointer",
													value: sub.minutes,
													onChange: (e) => handleUpdateSubIdea(sub.id, { minutes: Number(e.target.value) }),
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
															children: "1h 30m"
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
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-6 w-6 text-muted-foreground hover:text-destructive",
													onClick: () => handleDeleteSubIdea(sub.id),
													title: "Remover esta ideia do projeto",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1.5 font-medium",
											placeholder: "Título da ideia (ex: Front-end da loja)...",
											value: sub.title,
											onChange: (e) => handleUpdateSubIdea(sub.id, { title: e.target.value })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1 text-muted-foreground",
											placeholder: "O que esta ideia entrega (ex: Catálogo visual e carrinho de compras)...",
											value: sub.summary,
											onChange: (e) => handleUpdateSubIdea(sub.id, { summary: e.target.value })
										})
									]
								}, sub.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Total de ideias no projeto: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: subIdeas.length })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Tempo total previsto: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatMinutes(totalEstimatedMinutes) })] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-1/3 h-11 text-xs",
							onClick: () => {
								resetForm();
								onClose();
							},
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "primary-action flex-1 gap-2 text-xs font-medium",
							disabled: !title.trim(),
							onClick: handleCreateProject,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
								"Criar Projeto com ",
								subIdeas.length,
								" ",
								subIdeas.length === 1 ? "ideia" : "ideias"
							]
						})]
					})
				]
			})
		]
	});
	if (isDesktop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (isOpen) => {
			if (!isOpen) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-5xl w-[94vw] max-h-[92vh] overflow-y-auto p-6 sm:p-10 rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Criar Novo Projeto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Formulário para estruturação e criação de projeto macro com múltiplas ideias."
				}),
				content
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange: (isOpen) => {
			if (!isOpen) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, {
			className: "max-h-[94vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
					className: "sr-only",
					children: "Criar Novo Projeto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
					className: "sr-only",
					children: "Formulário para estruturação e criação de projeto macro com múltiplas ideias."
				}),
				content
			]
		})
	});
}
function Index() {
	const { data, setData } = useFlow();
	const [sector, setSector] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("board");
	const [scopeFilter, setScopeFilter] = (0, import_react.useState)("all");
	const [showArchived, setShowArchived] = (0, import_react.useState)(false);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [mobileStage, setMobileStage] = (0, import_react.useState)(0);
	const [createProjectOpen, setCreateProjectOpen] = (0, import_react.useState)(false);
	const board = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleCreateProject = () => setCreateProjectOpen(true);
		window.addEventListener("ideaflow:create-project", handleCreateProject);
		return () => {
			window.removeEventListener("ideaflow:create-project", handleCreateProject);
		};
	}, []);
	const capture = () => window.dispatchEvent(new Event("ideaflow:capture"));
	const isBusinessMode = data.workspaceMode === "business";
	const company = data.companyWorkspace;
	const activeSectors = isBusinessMode && company ? company.sectors : data.sectors;
	const workspaceIdeas = data.ideas.filter((i) => {
		if (isBusinessMode) {
			if (i.workspace !== "business") return false;
			if (company?.id && i.companyId && i.companyId !== company.id) return false;
			return true;
		}
		return i.workspace !== "business";
	});
	const activeIdeas = workspaceIdeas.filter((i) => !i.archived);
	const archivedCount = workspaceIdeas.filter((i) => i.archived).length;
	const complexProjectsCount = activeIdeas.filter((i) => i.isProject || workspaceIdeas.some((sub) => sub.parentId === i.id)).length;
	const ideas = workspaceIdeas.filter((i) => {
		if (showArchived ? !i.archived : i.archived) return false;
		if (sector !== "all" && i.sector !== sector) return false;
		if (scopeFilter === "projects" && !i.isProject) return false;
		if (scopeFilter === "standalone" && (i.isProject || i.parentId)) return false;
		return `${i.title} ${i.summary} ${i.department ?? ""} ${i.assignedTo ?? ""}`.toLocaleLowerCase().includes(search.toLocaleLowerCase());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-heading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-8 -left-8 w-56 h-28 bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold mb-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-ping" }),
							isBusinessMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								size: 12,
								className: "text-violet"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								size: 11,
								className: "floating-spark text-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tracking-wide uppercase text-[10px]",
								children: isBusinessMode ? `Workspace Empresarial · ${company?.name ?? "Organização"}` : "Fluxo Criativo Pessoal"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: isBusinessMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Sua empresa, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "motion-heading-gradient",
						children: "em sincronia."
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Suas ideias, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "motion-heading-gradient",
						children: "em movimento."
					})] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "page-subtitle",
						children: isBusinessMode ? "Gestão de iniciativas por departamentos: Tecnologia, Marketing, Testes/QA, Qualidade e Operações." : "Crie ideias individuais ou estruture projetos completos com frentes e módulos organizados."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "action-buttons flex items-center gap-2 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					"aria-label": "Novo projeto",
					variant: "outline",
					className: "border-violet/40 bg-violet/10 text-violet hover:bg-violet/20 hover:text-violet gap-1.5 h-9 sm:h-[43px] px-3 sm:px-3.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer",
					onClick: () => setCreateProjectOpen(true),
					title: "Criar um novo projeto estruturado com ideias dentro",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, {
						size: 16,
						className: "text-violet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Projeto" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					"aria-label": "Nova ideia",
					className: "new-idea gap-1.5 cursor-pointer h-9 sm:h-[43px] px-3.5 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl active:scale-95 transition-all shadow-xs",
					onClick: capture,
					title: "Capturar uma nova ideia rápida",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ideia" })]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "stats-bar flex items-center gap-3 sm:gap-6 my-6 py-2.5 px-3.5 sm:px-4 rounded-xl glass-panel border border-border/60 overflow-x-auto scrollbar-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-1 rounded-md bg-cyan/15 text-cyan border border-cyan/25",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 13 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeIdeas.length }), " ativas"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "stats-divider shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-1 rounded-md bg-violet/15 text-violet border border-violet/25",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { size: 13 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: complexProjectsCount }), " macro"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "stats-divider shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-1 rounded-md bg-pink/15 text-pink border border-pink/25",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { size: 13 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeIdeas.filter((i) => i.stage === 2).length }), " em ação"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "stats-divider shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-1 rounded-md bg-green/15 text-green border border-green/25",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 13 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeIdeas.filter((i) => i.stage === 4).length }), " prontas"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "spark-note hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground ml-auto shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						size: 13,
						className: "text-amber animate-pulse"
					}), "Pequenas ações. Grandes realizações."]
				})
			]
		}),
		showArchived && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 p-3.5 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-between text-xs text-amber",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { size: 15 }),
					"Visualizando ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [ideas.length, " ideias arquivadas"] }),
					". Elas ficam fora do seu fluxo ativo para manter sua mente focada."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				className: "h-7 text-xs text-amber hover:bg-amber/20",
				onClick: () => setShowArchived(false),
				children: "Voltar ao funil ativo"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "funnel-toolbar",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "filter-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "segmented p-0.5 border border-border/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: `h-7 px-2.5 text-xs ${scopeFilter === "all" ? "selected" : ""}`,
								onClick: () => setScopeFilter("all"),
								children: "Tudo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: `h-7 px-2.5 text-xs gap-1 ${scopeFilter === "projects" ? "selected text-violet font-semibold" : ""}`,
								onClick: () => setScopeFilter("projects"),
								title: "Filtrar apenas Projetos Macro",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { size: 12 }),
									"Projetos (",
									complexProjectsCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: `h-7 px-2.5 text-xs ${scopeFilter === "standalone" ? "selected" : ""}`,
								onClick: () => setScopeFilter("standalone"),
								title: "Filtrar apenas ideias individuais",
								children: "Avulsas"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "stats-divider hidden sm:inline" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: `filter-button ${sector === "all" ? "selected" : ""}`,
						onClick: () => setSector("all"),
						children: "Todos os setores"
					}),
					activeSectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: `filter-button tone-${s.tone} ${sector === s.id ? "selected" : ""}`,
						onClick: () => setSector(s.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
							className: `text-${s.tone}`,
							fill: "currentColor"
						}), s.name]
					}, s.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: `filter-button ${showArchived ? "selected text-amber border-amber/40 bg-amber/10" : ""}`,
						onClick: () => setShowArchived(!showArchived),
						title: "Alternar entre ideias ativas e arquivadas",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, {
							size: 12,
							className: showArchived ? "text-amber" : ""
						}), showArchived ? "Ver Ativas" : `Arquivadas (${archivedCount})`]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toolbar-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "search-box",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Buscar ideias",
						placeholder: "Buscar ideia…",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "view-switch",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: view === "board" ? "selected" : "",
						size: "icon",
						"aria-label": "Visualização em colunas",
						onClick: () => setView("board"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns3, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: view === "list" ? "selected" : "",
						size: "icon",
						"aria-label": "Visualização em lista",
						onClick: () => setView("list"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutList, {})
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mobile-stages",
			children: stageNames.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				className: `tone-${stageTones[i]} ${mobileStage === i ? "selected" : ""}`,
				onClick: () => {
					setMobileStage(i);
					const column = board.current?.children[i];
					if (column instanceof HTMLElement) board.current?.scrollTo({
						left: column.offsetLeft - 22,
						behavior: "smooth"
					});
				},
				children: [
					String(i + 1).padStart(2, "0"),
					" ",
					name
				]
			}, name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: board,
			className: `kanban ${view === "list" ? "list-view" : ""}`,
			onScroll: (e) => {
				if (window.innerWidth > 700) return;
				const element = e.currentTarget;
				const first = element.children[0];
				if (first instanceof HTMLElement) setMobileStage(Math.min(4, Math.round(element.scrollLeft / (first.offsetWidth + 15))));
			},
			children: stageNames.map((name, stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `kanban-column tone-${stageTones[stage]}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stage-heading",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stage-number",
								children: String(stage + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stage-count",
								children: ideas.filter((i) => i.stage === stage).length
							}),
							stage < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stage-cards",
						children: [ideas.filter((i) => i.stage === stage).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaCard, {
							idea: i,
							onOpen: (idea) => setDetail(idea.id),
							onFocus: setFocus
						}, i.id)), !ideas.some((i) => i.stage === stage) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "empty-column",
							children: showArchived ? "Nenhuma ideia arquivada nesta etapa." : scopeFilter === "projects" ? "Nenhum projeto macro nesta etapa." : "Um novo espaço para avançar."
						})]
					}),
					!showArchived && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "add-stage",
						onClick: capture,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Uma nova possibilidade"]
					})
				]
			}, name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flow-inspiration",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Você não precisa de mais tempo. Só do próximo passo."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaDetail, {
			ideaId: detail,
			onClose: () => setDetail(null),
			onFocus: setFocus
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusTimer, {
			idea: focus,
			onClose: () => setFocus(null)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateProjectSheet, {
			open: createProjectOpen,
			onClose: () => setCreateProjectOpen(false),
			onOpenProject: (id) => setDetail(id)
		})
	] });
}
//#endregion
export { Index as component };
