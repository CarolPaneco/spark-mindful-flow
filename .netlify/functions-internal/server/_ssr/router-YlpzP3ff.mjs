import { i as __toESM } from "../_runtime.mjs";
import { S as stageNames, a as defaultCompanySectors, b as planIdea, c as formatMinutes, f as getFiveWhysQuestions, l as generateAiSteps, w as suggestFiveWhysOffline, y as palettes } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as Heart, A as RefreshCw, At as ChevronUp, B as Mic, C as Share2, Ct as Clock, E as Send, Et as CircleX, H as LogOut, Ht as Briefcase, I as PanelLeftOpen, J as Lightbulb, Jt as ArrowRight, K as LoaderCircle, Kt as AudioLines, L as PanelLeftClose, N as Pencil, Nt as ChevronDown, O as Scissors, Ot as CircleCheck, P as PencilLine, Pt as Check, Qt as ArchiveRestore, R as Palette, St as Cloud, U as LogIn, V as Mail, Vt as Building2, W as Lock, Wt as Bot, X as Layers, Xt as ArrowLeft, Yt as ArrowRightLeft, Z as KeyRound, Zt as Archive, _ as Sparkles, b as Shield, c as Upload, d as Trash2, dt as Eye, f as Target, ft as EyeOff, g as Square, gt as DollarSign, h as Sun, ht as Download, it as Grid2x2, j as Plus, jt as ChevronRight, kt as CircleAlert, lt as Flame, n as X, o as Users, ot as FolderTree, p as Tag, pt as ExternalLink, qt as ArrowUpRight, r as WandSparkles, rt as GripVertical, s as User, t as Zap, vt as Copy, w as Shapes, x as ShieldCheck, y as SlidersHorizontal, yt as Compass, z as Moon, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { _ as useFlow, a as DialogTitle$1, c as callAiServer, g as upsertUserProfile, i as DialogDescription$1, l as cn, m as supabase, n as Dialog$1, o as FlowProvider, p as planIdeaWithAi, r as DialogContent$1, s as askMentorAi, t as Button } from "./ai-assistant-3aCui_AD.mjs";
import { a as IdeaDetail, i as DrawerTitle, n as DrawerContent, o as suggestFiveWhysWithAi, r as DrawerDescription, t as Drawer$1 } from "./idea-detail-De8DGVyi.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-YlpzP3ff.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-VQ3HlB-A.css";
function CaptureSheet({ open, onClose }) {
	const { data, setData } = useFlow();
	const [tab, setTab] = (0, import_react.useState)("voice");
	const [text, setText] = (0, import_react.useState)("");
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [draggedStepIndex, setDraggedStepIndex] = (0, import_react.useState)(null);
	const [fiveWhys, setFiveWhys] = (0, import_react.useState)([
		"",
		"",
		"",
		"",
		""
	]);
	const [showFiveWhys, setShowFiveWhys] = (0, import_react.useState)(false);
	const [suggestingWhys, setSuggestingWhys] = (0, import_react.useState)(false);
	const recognition = (0, import_react.useRef)(null);
	const isBusinessMode = (data.workspaceMode ?? "personal") === "business";
	const currentWhysQuestions = getFiveWhysQuestions(isBusinessMode);
	const [isDesktop, setIsDesktop] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return window.innerWidth >= 769;
	});
	(0, import_react.useEffect)(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 769);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) {
			recognition.current?.abort();
			setRecording(false);
			setDraft(null);
			setText("");
			setFiveWhys([
				"",
				"",
				"",
				"",
				""
			]);
			setShowFiveWhys(false);
		}
		return () => {
			recognition.current?.abort();
		};
	}, [open]);
	const record = () => {
		if (recording) {
			recognition.current?.stop();
			setRecording(false);
			return;
		}
		const speechWindow = window;
		const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
		if (!Constructor) {
			toast.error("Este navegador não oferece transcrição de voz. Use o rascunho rápido.");
			return;
		}
		const instance = new Constructor();
		instance.lang = "pt-BR";
		instance.continuous = true;
		instance.interimResults = false;
		instance.onresult = (event) => {
			let transcript = "";
			for (let i = 0; i < event.results.length; i++) transcript += `${event.results[i]?.[0]?.transcript ?? ""} `;
			setText(transcript.trim());
		};
		instance.onerror = (event) => {
			setRecording(false);
			toast.error(event.error === "not-allowed" ? "Permita o acesso ao microfone para gravar." : "Não foi possível transcrever. O reconhecimento de voz pode precisar de internet.");
		};
		instance.onend = () => setRecording(false);
		recognition.current = instance;
		try {
			instance.start();
			setRecording(true);
		} catch {
			toast.error("O microfone não está disponível agora.");
		}
	};
	const handleUpdateStepText = (index, newText) => {
		if (!draft) return;
		const updated = draft.steps.map((s, i) => i === index ? {
			...s,
			text: newText
		} : s);
		const immediate = index === 0 ? newText : draft.immediate;
		setDraft({
			...draft,
			steps: updated,
			immediate
		});
	};
	const handleUpdateStepMinutes = (index, newMinutes) => {
		if (!draft) return;
		const updated = draft.steps.map((s, i) => i === index ? {
			...s,
			minutes: newMinutes
		} : s);
		const totalMinutes = updated.reduce((acc, curr) => acc + curr.minutes, 0);
		setDraft({
			...draft,
			steps: updated,
			minutes: totalMinutes
		});
	};
	const handleDeleteStep = (index) => {
		if (!draft || draft.steps.length <= 1) {
			toast.error("Mantenha pelo menos um passo para orientar a ação.");
			return;
		}
		const updated = draft.steps.filter((_, i) => i !== index);
		const totalMinutes = updated.reduce((acc, curr) => acc + curr.minutes, 0);
		const immediate = updated[0]?.text ?? draft.immediate;
		setDraft({
			...draft,
			steps: updated,
			minutes: totalMinutes,
			immediate
		});
	};
	const handleAddStep = () => {
		if (!draft) return;
		const newStep = {
			id: crypto.randomUUID(),
			text: "Novo passo para avançar a ideia",
			minutes: 15,
			done: false
		};
		const updated = [...draft.steps, newStep];
		const totalMinutes = updated.reduce((acc, curr) => acc + curr.minutes, 0);
		setDraft({
			...draft,
			steps: updated,
			minutes: totalMinutes
		});
	};
	const handleMoveStep = (fromIndex, toIndex) => {
		if (!draft || toIndex < 0 || toIndex >= draft.steps.length) return;
		const reordered = [...draft.steps];
		const [moved] = reordered.splice(fromIndex, 1);
		if (!moved) return;
		reordered.splice(toIndex, 0, moved);
		setDraft({
			...draft,
			steps: reordered,
			immediate: reordered[0]?.text ?? draft.immediate
		});
	};
	const handleRegenerateWithAi = async (style) => {
		if (!draft) return;
		setGenerating(true);
		try {
			const promptStyle = style === "mvp" ? "Gere 3 a 4 passos de MVP enxuto para testar a ideia rapidamente no mundo real" : style === "rapido" ? "Gere 3 micro-passos rápidos de 10 a 15 minutos cada" : style === "expansao" ? "Gere passos de expansão, métricas e distribuição" : "Gere um plano estruturado e profissional com 4 a 5 passos encadeados";
			const result = await callAiServer({
				action: "plan",
				rawText: `Ideia: "${draft.title}". Detalhes: "${draft.summary}". Estilo solicitado: ${promptStyle}.`,
				sectors: activeSectors,
				fiveWhys: draft.fiveWhys || fiveWhys
			});
			if (result && result.success && result.parsed?.steps?.length > 0) {
				const steps = result.parsed.steps.map((s, idx) => ({
					id: crypto.randomUUID(),
					text: s.text || `Passo ${idx + 1}`,
					minutes: Number(s.minutes) || (style === "rapido" ? 10 : 20),
					done: false
				}));
				const totalMinutes = steps.reduce((acc, curr) => acc + curr.minutes, 0);
				setDraft({
					...draft,
					steps,
					minutes: totalMinutes,
					immediate: steps[0]?.text ?? draft.immediate
				});
				const tokenMsg = result.tokensUsed?.totalTokens ? ` (${result.tokensUsed.totalTokens} tokens)` : "";
				toast.success(`Passos redesenhados com IA (${result.provider === "gemini" ? "Gemini" : "Groq"})${tokenMsg} 🚀`);
				return;
			}
		} catch {} finally {
			setGenerating(false);
		}
		const newSteps = generateAiSteps(draft.title, draft.summary, draft.sector, style, draft.fiveWhys || fiveWhys);
		const totalMinutes = newSteps.reduce((acc, curr) => acc + curr.minutes, 0);
		setDraft({
			...draft,
			steps: newSteps,
			minutes: totalMinutes,
			immediate: newSteps[0]?.text ?? draft.immediate
		});
		toast.info({
			mvp: "Plano MVP contextualizado gerado pelo motor local 🛡️",
			rapido: "Micro-passos rápidos de 10 min gerados 🛡️",
			estruturado: "Plano estruturado gerado pelo motor local 🛡️",
			expansao: "Plano de expansão gerado pelo motor local 🛡️"
		}[style]);
	};
	const handleSuggestWhys = async () => {
		if (!text.trim()) {
			toast.info("Escreva algo sobre sua ideia primeiro para sugerirmos os 5 porquês.");
			return;
		}
		setSuggestingWhys(true);
		try {
			const suggestions = await suggestFiveWhysWithAi(text);
			if (suggestions && suggestions.length > 0) {
				setFiveWhys(suggestions);
				setShowFiveWhys(true);
				toast.success("5 Porquês gerados com IA! Você pode editar as respostas.");
			}
		} catch {
			const offline = suggestFiveWhysOffline(text, isBusinessMode);
			setFiveWhys(offline);
			setShowFiveWhys(true);
			toast.success(isBusinessMode ? "Perguntas estratégicas preenchidas pelo motor local da empresa! 🏢" : "5 Porquês reflexivos gerados pelo motor local!");
		} finally {
			setSuggestingWhys(false);
		}
	};
	const isBusiness = data.workspaceMode === "business";
	const activeSectors = isBusiness ? data.companyWorkspace?.sectors ?? defaultCompanySectors : data.sectors;
	const companyMembers = data.companyWorkspace?.members ?? [];
	const handleGenerateDraft = async () => {
		if (!text.trim() || recording || generating) return;
		setGenerating(true);
		try {
			const result = await planIdeaWithAi(text, activeSectors, fiveWhys);
			const { idea, provider } = result;
			setDraft({
				...idea,
				workspace: isBusiness ? "business" : "personal",
				assignedTo: isBusiness ? companyMembers[0]?.name ?? void 0 : void 0
			});
			if (provider === "groq") {
				const tokenInfo = result.tokensUsed?.totalTokens ? ` (${result.tokensUsed.totalTokens} tokens gastos)` : "";
				toast.success(`Plano desenhado com Groq (${result.model || "LLaMA 3.3"})${tokenInfo} 🚀`);
			} else if (provider === "gemini") {
				const tokenInfo = result.tokensUsed?.totalTokens ? ` (${result.tokensUsed.totalTokens} tokens gastos)` : "";
				toast.success(`Plano desenhado pelo Google Gemini (${result.model || "Flash"})${tokenInfo} ✨`);
			} else if (result.error && (result.error.toLowerCase().includes("firewall") || result.error.toLowerCase().includes("fetch") || result.error.toLowerCase().includes("bloqueou") || result.error.toLowerCase().includes("indisponível") || result.error.toLowerCase().includes("indisponivel"))) toast.warning("⚠️ Sua rede corporativa bloqueou o acesso à IA na nuvem. Os passos foram desenhados pelo Motor Heurístico com base no seu contexto!", { duration: 6500 });
			else toast.info("Plano desenhado pelo Motor Heurístico Local contextualizado 🛡️");
		} catch {
			const offline = planIdea(text, activeSectors, fiveWhys);
			setDraft({
				...offline,
				workspace: isBusiness ? "business" : "personal",
				assignedTo: isBusiness ? companyMembers[0]?.name ?? void 0 : void 0
			});
			toast.warning("⚠️ Rede corporativa offline para IA externa. Plano contextualizado gerado pelo motor local 🛡️", { duration: 6500 });
		} finally {
			setGenerating(false);
		}
	};
	const save = () => {
		if (!draft) return;
		const finalIdea = {
			...draft,
			workspace: isBusiness ? "business" : "personal",
			companyId: isBusiness && data.companyWorkspace?.id ? data.companyWorkspace.id : void 0,
			department: isBusiness ? activeSectors.find((s) => s.id === draft.sector)?.name ?? draft.sector : void 0
		};
		setData((p) => ({
			...p,
			ideas: [finalIdea, ...p.ideas]
		}));
		toast.success(isBusiness ? "Iniciativa registrada no Workspace da Empresa! 🏢" : "Uma nova faísca no seu funil ✨");
		onClose();
	};
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sheet-body max-w-4xl mx-auto w-full p-2 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-eyebrow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 15 }), "TODA REALIZAÇÃO COMEÇA AQUI"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "sheet-title text-2xl sm:text-3xl font-display font-bold text-foreground",
				children: draft ? "Personalize o plano da sua ideia." : "O que está na sua cabeça?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: draft ? "A IA gerou estes passos iniciais. Você pode editar, apagar ou adicionar novos como preferir." : "Solte a ideia livremente. Nosso assistente encontra o primeiro passo executável."
			}),
			!draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 p-2.5 rounded-lg border border-violet/30 bg-violet/5 flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Quer criar um ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Projeto com várias ideias dentro" }),
						"?"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "h-7 text-xs text-violet font-semibold hover:bg-violet/10 px-2 gap-1 cursor-pointer",
						onClick: () => {
							onClose();
							window.dispatchEvent(new Event("ideaflow:create-project"));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Criar Projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 12 })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "segmented mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: tab === "voice" ? "selected" : "",
						onClick: () => setTab("voice"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 16 }), "Gravar áudio"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: tab === "text" ? "selected" : "",
						onClick: () => {
							recognition.current?.stop();
							setRecording(false);
							setTab("text");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilLine, { size: 16 }), "Rascunho rápido"]
					})]
				}),
				tab === "voice" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "voice-area",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `waveform ${recording ? "recording" : ""}`,
							children: Array.from({ length: 27 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `wave-${i % 6}` }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: `record-button ${recording ? "recording" : ""}`,
							onClick: record,
							"aria-label": recording ? "Parar gravação" : "Começar gravação",
							children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { fill: "currentColor" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-4",
							children: recording ? "Ouvindo sua ideia…" : "Toque para começar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "voice-note",
							children: "A transcrição depende do navegador e pode precisar de internet."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					"aria-label": "Sua ideia",
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Exemplo: E se eu criasse um produto digital para organizar projetos de marcenaria e hobbies...",
					className: "idea-input",
					rows: tab === "voice" ? 3 : 5
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 rounded-xl border border-border/80 bg-secondary/35 p-3.5 transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 h-6 rounded-md bg-amber/15 text-amber border border-amber/30 text-xs font-bold flex items-center justify-center shrink-0",
								children: "5P"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
								children: [isBusinessMode ? "5 Porquês Corporativos (Alinhamento Estratégico)" : "Técnica dos 5 Porquês", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10.5px] font-medium px-1.5 py-0.2 rounded-full bg-secondary text-primary border border-primary/25",
									children: [fiveWhys.filter((w) => w.trim()).length, "/5 preenchidos"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: isBusinessMode ? "Responda para a IA calcular impacto no negócio, ROI, setor responsável e um plano ágil de entrega." : "Responda para a IA entender o contexto e a raiz da ideia, gerando passos muito mais precisos."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [text.trim().length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								disabled: suggestingWhys,
								className: "h-7 text-[11px] px-2.5 gap-1 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer shadow-xs active:scale-95",
								onClick: handleSuggestWhys,
								title: "Usar IA para sugerir respostas inteligentes para os 5 porquês",
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡 Dica: Você pode responder quantos quiser. Cada resposta adiciona profundidade ao raciocínio da IA." }), fiveWhys.some((w) => w.trim()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center text-xs text-muted-foreground mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-500 dark:text-emerald-400 font-medium",
							children: "IA Oficial Integrada (Groq LLaMA 3.3 · Gratuita) ⚡"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [text.length, " caracteres"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "primary-action w-full gap-2",
					disabled: !text.trim() || recording || generating,
					onClick: handleGenerateDraft,
					children: generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, {
						size: 16,
						className: "animate-spin text-primary"
					}), "A IA está cruzando os 5 Porquês e desenhando os passos..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 17 }),
						"Entender ideia e criar passos com IA",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
					] })
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 mt-4",
				children: [
					draft.fiveWhys && draft.fiveWhys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl border border-primary/25 bg-primary/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-semibold text-primary mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 13 }), isBusinessMode ? "Alinhamento Estratégico Aplicado (5 Porquês)" : "Contexto Raiz Aplicado (5 Porquês)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: [draft.fiveWhys.length, " respostas registradas"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1 mt-2 text-xs",
							children: draft.fiveWhys.map((why, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1.5 text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-primary font-bold shrink-0",
									children: [idx + 1, "º"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground leading-relaxed",
									children: why
								})]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground font-medium mb-1 block",
						children: "Título da Ideia"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "draft-title resize-none w-full leading-snug break-words",
						rows: 2,
						"aria-label": "Título da ideia",
						value: draft.title,
						onChange: (e) => setDraft({
							...draft,
							title: e.target.value
						}),
						placeholder: "Título claro e cativante..."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground font-medium mb-1 block",
						children: "Resumo / Intenção"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "text-field resize-none text-xs leading-relaxed break-words",
						rows: 2,
						value: draft.summary,
						onChange: (e) => setDraft({
							...draft,
							summary: e.target.value
						}),
						placeholder: "Resumo da intenção e do valor dessa realização..."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "detail-fields",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [isBusiness ? "Departamento / Setor" : "Setor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: draft.sector,
								onChange: (e) => {
									const newSector = e.target.value;
									setDraft({
										...draft,
										sector: newSector,
										steps: generateAiSteps(draft.title, draft.summary, newSector, "estruturado")
									});
								},
								children: activeSectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))
							})] }),
							isBusiness && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Responsável na Equipe", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: draft.assignedTo ?? "",
								onChange: (e) => setDraft({
									...draft,
									assignedTo: e.target.value || void 0
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Não atribuído"
								}), companyMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: m.name,
									children: [
										m.name,
										" (",
										m.role,
										")"
									]
								}, m.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Prioridade", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: draft.priority,
								onChange: (e) => setDraft({
									...draft,
									priority: e.target.value
								}),
								children: [
									"Urgente",
									"Importante",
									"Normal"
								].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground font-medium mb-1 block",
						children: "Vincular a um Projeto Existente (Opcional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "text-xs",
						value: draft.parentId ?? "",
						onChange: (e) => {
							const val = e.target.value;
							setDraft({
								...draft,
								parentId: val || void 0,
								sector: val ? data.ideas.find((i) => i.id === val)?.sector ?? draft.sector : draft.sector
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Nenhum (Ideia independente / avulsa)"
						}), data.ideas.filter((i) => !i.archived && (i.isProject || data.ideas.some((sub) => sub.parentId === i.id))).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: p.id,
							children: ["📁 ", p.title]
						}, p.id))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground font-medium mb-1 block",
						children: "Definição do Escopo (O que está incluído no projeto agora?)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "text-field resize-none text-xs leading-relaxed break-words",
						rows: 2,
						value: draft.scope ?? "",
						onChange: (e) => setDraft({
							...draft,
							scope: e.target.value
						}),
						placeholder: "Ex.: Versão 1.0 focada apenas no cadastro básico e exportação em PDF..."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "immediate-action",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), "AÇÃO IMEDIATA · 15 MIN"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							className: "w-full bg-transparent border-0 border-b border-amber/30 focus:border-amber text-xs text-foreground mt-2 resize-none outline-none leading-relaxed break-words",
							value: draft.immediate,
							onChange: (e) => setDraft({
								...draft,
								immediate: e.target.value
							}),
							placeholder: "Qual a primeira micro-ação de 15 minutos?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/70 p-4 bg-card/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold text-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
										size: 15,
										className: "text-primary"
									}), "Seu plano inicial (Personalizável)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										draft.steps.length,
										" passos · ",
										formatMinutes(draft.minutes),
										" totais"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground mr-1 hidden sm:inline",
											children: "IA:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 text-xs px-2 gap-1",
											title: "Gerar passos enxutos para validação rápida",
											onClick: () => handleRegenerateWithAi("mvp"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, {
												size: 12,
												className: "text-primary"
											}), "MVP"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 text-xs px-2 gap-1",
											title: "Gerar plano completo estruturado",
											onClick: () => handleRegenerateWithAi("estruturado"),
											children: "Completo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 text-xs px-2 gap-1",
											title: "Gerar micro-passos rápidos",
											onClick: () => handleRegenerateWithAi("rapido"),
											children: "10min"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 max-h-72 overflow-y-auto pr-1",
								children: draft.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									draggable: true,
									onDragStart: () => setDraggedStepIndex(i),
									onDragOver: (e) => e.preventDefault(),
									onDrop: () => {
										if (draggedStepIndex !== null && draggedStepIndex !== i) {
											handleMoveStep(draggedStepIndex, i);
											setDraggedStepIndex(null);
										}
									},
									className: `flex items-start gap-2 p-2.5 rounded-lg bg-background/90 border text-xs transition-all ${draggedStepIndex === i ? "opacity-50 border-primary border-dashed scale-[0.98]" : "border-border/60 hover:border-border"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-0.5 shrink-0 pt-0.5 select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground",
												title: "Arraste para cima ou para baixo para reordenar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { size: 14 })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: i === 0,
													onClick: () => handleMoveStep(i, i - 1),
													className: "text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer",
													title: "Mover para cima",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 11 })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: i === draft.steps.length - 1,
													onClick: () => handleMoveStep(i, i + 1),
													className: "text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none p-0.5 rounded cursor-pointer",
													title: "Mover para baixo",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 11 })
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-primary font-bold text-xs min-w-5 pt-1 select-none",
											children: String(i + 1).padStart(2, "0")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											className: "flex-1 bg-transparent border-0 border-b border-transparent focus:border-primary/60 px-1 py-1 text-xs text-foreground outline-none resize-none leading-relaxed break-words",
											value: s.text,
											onChange: (e) => handleUpdateStepText(i, e.target.value),
											placeholder: "Descreva o passo..."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 shrink-0 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												size: 12,
												className: "text-muted-foreground"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "bg-transparent border border-border/60 rounded px-1.5 py-0.5 text-[11px] text-foreground cursor-pointer",
												value: s.minutes,
												onChange: (e) => handleUpdateStepMinutes(i, Number(e.target.value)),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 10,
														children: "10m"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 15,
														children: "15m"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 20,
														children: "20m"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 25,
														children: "25m"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 30,
														children: "30m"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 45,
														children: "45m"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 60,
														children: "60m"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 mt-0.5",
											title: "Excluir este passo",
											onClick: () => handleDeleteStep(i),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
										})
									]
								}, s.id ?? i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "w-full mt-3 h-8 text-xs border-dashed gap-1 text-muted-foreground hover:text-foreground",
								onClick: handleAddStep,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 13 }), "Adicionar passo personalizado"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "clarity-tip",
						children: ["✦ ", draft.clarity]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "primary-action w-full",
							disabled: !draft.title.trim(),
							onClick: save,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), "Salvar no meu funil de ideias"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "w-full h-9 text-xs",
							onClick: () => setDraft(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
								size: 13,
								className: "mr-1.5"
							}), "Voltar ao rascunho anterior"]
						})]
					})
				]
			})
		]
	});
	if (isDesktop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "max-w-5xl w-[94vw] max-h-[92vh] overflow-y-auto p-6 sm:p-10 rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
					className: "sr-only",
					children: draft ? "Personalize o plano da sua ideia." : "O que está na sua cabeça?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
					className: "sr-only",
					children: "Formulário para captura e planejamento de nova ideia ou faísca."
				}),
				content
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, {
			className: "max-h-[92vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
					className: "sr-only",
					children: draft ? "Personalize o plano da sua ideia." : "O que está na sua cabeça?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
					className: "sr-only",
					children: "Formulário para captura e planejamento de nova ideia ou faísca."
				}),
				content
			]
		})
	});
}
/**
* Renderizador de Markdown elegante e de alta performance para o Mentor IA.
* Converte asteriscos (**negrito**, *itálico*), listas numeradas, listas com marcadores
* e títulos em elementos visuais limpos e agradáveis de ler.
*/
function FormattedMessage({ content, className = "" }) {
	if (!content) return null;
	const lines = content.split("\n");
	const renderInline = (text) => {
		const parts = [];
		let remaining = text;
		let key = 0;
		while (remaining.length > 0) {
			const boldMatch = remaining.match(/^([\s\S]*?)\*\*(.+?)\*\*([\s\S]*)$/);
			const codeMatch = remaining.match(/^([\s\S]*?)`([^`]+)`([\s\S]*)$/);
			const italicMatch = remaining.match(/^([\s\S]*?)\*([^*]+)\*([\s\S]*)$/);
			let bestMatch = null;
			let earliestIndex = Infinity;
			if (boldMatch && boldMatch[1] !== void 0 && boldMatch[1].length < earliestIndex) {
				earliestIndex = boldMatch[1].length;
				bestMatch = {
					type: "bold",
					match: boldMatch
				};
			}
			if (codeMatch && codeMatch[1] !== void 0 && codeMatch[1].length < earliestIndex) {
				earliestIndex = codeMatch[1].length;
				bestMatch = {
					type: "code",
					match: codeMatch
				};
			}
			if (italicMatch && italicMatch[1] !== void 0 && italicMatch[1].length < earliestIndex) {
				earliestIndex = italicMatch[1].length;
				bestMatch = {
					type: "italic",
					match: italicMatch
				};
			}
			if (bestMatch) {
				const pre = bestMatch.match[1] || "";
				const tokenContent = bestMatch.match[2] || "";
				const post = bestMatch.match[3] || "";
				if (pre) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pre }, key++));
				if (bestMatch.type === "bold") parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "font-semibold text-foreground",
					children: renderInline(tokenContent)
				}, key++));
				else if (bestMatch.type === "code") parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px] border border-primary/20",
					children: tokenContent
				}, key++));
				else if (bestMatch.type === "italic") parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "italic text-foreground/90",
					children: renderInline(tokenContent)
				}, key++));
				remaining = post;
			} else {
				parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: remaining }, key++));
				break;
			}
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `space-y-2 leading-relaxed ${className}`,
		children: lines.map((rawLine, idx) => {
			const line = rawLine.trim();
			if (!line) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5" }, idx);
			if (line.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-bold text-xs sm:text-sm text-foreground pt-1.5 pb-0.5 border-b border-border/40",
				children: renderInline(line.replace(/^###\s+/, ""))
			}, idx);
			if (line.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-sm text-foreground pt-2 pb-1 border-b border-border/50",
				children: renderInline(line.replace(/^##\s+/, ""))
			}, idx);
			if (line.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-bold text-base text-foreground pt-2 pb-1 text-primary border-b border-primary/30",
				children: renderInline(line.replace(/^#\s+/, ""))
			}, idx);
			const stepMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);
			if (stepMatch && stepMatch[1] && stepMatch[2]) {
				const stepNum = stepMatch[1];
				const stepText = stepMatch[2];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2.5 py-1 px-2.5 rounded-lg bg-secondary/40 border border-border/40 my-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/25 rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 select-none",
						children: stepNum
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 text-xs text-foreground/95",
						children: renderInline(stepText)
					})]
				}, idx);
			}
			if (line.match(/^[-*•]\s+/)) {
				const bulletText = line.replace(/^[-*•]\s+/, "");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 pl-1 py-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 text-xs text-foreground/90",
						children: renderInline(bulletText)
					})]
				}, idx);
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-foreground/90 leading-relaxed",
				children: renderInline(line)
			}, idx);
		})
	});
}
function AiChatSheet({ open, onClose, initialIdea }) {
	const { data } = useFlow();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [inputText, setInputText] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [selectedIdeaId, setSelectedIdeaId] = (0, import_react.useState)("all");
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (initialIdea) setSelectedIdeaId(initialIdea.id);
	}, [initialIdea]);
	(0, import_react.useEffect)(() => {
		if (open && messages.length === 0) {
			const welcome = {
				id: "welcome",
				sender: "assistant",
				text: initialIdea ? `Olá! Estou focado na sua ideia **"${initialIdea.title}"**. Como posso te ajudar a avançar com ela hoje?` : `Olá! Sou seu **Mentor Ideaflow** com inteligência integrada estilo ChatGPT. Estou aqui para conversar, analisar seus funis, sugerir passos práticos e planejar projetos com você. O que gostaria de explorar hoje?`,
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit"
				}),
				provider: "chatgpt"
			};
			setMessages([welcome]);
		}
	}, [open, initialIdea]);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, loading]);
	const activeIdea = selectedIdeaId === "all" ? void 0 : data.ideas.find((i) => i.id === selectedIdeaId);
	const handleSendMessage = async (textToSend) => {
		const text = textToSend ?? inputText;
		if (!text.trim() || loading) return;
		const userMsg = {
			id: crypto.randomUUID(),
			sender: "user",
			text: text.trim(),
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setMessages((prev) => [...prev, userMsg]);
		setInputText("");
		setLoading(true);
		try {
			const history = messages.filter((m) => m.id !== "welcome").slice(-10).map((m) => ({
				role: m.sender === "user" ? "user" : "model",
				text: m.text
			}));
			const result = await askMentorAi({
				message: text.trim(),
				...activeIdea ? { contextIdea: activeIdea } : {},
				allIdeas: data.ideas,
				sectors: data.sectors,
				history
			});
			const aiMsg = {
				id: crypto.randomUUID(),
				sender: "assistant",
				text: result.reply,
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit"
				}),
				provider: result.provider,
				model: result.model,
				tokensUsed: result.tokensUsed
			};
			setMessages((prev) => [...prev, aiMsg]);
		} catch {
			const errorMsg = {
				id: crypto.randomUUID(),
				sender: "assistant",
				text: "Desculpe, ocorreu um erro momentâneo ao processar sua resposta. Pode tentar novamente?",
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit"
				}),
				provider: "local"
			};
			setMessages((prev) => [...prev, errorMsg]);
		} finally {
			setLoading(false);
		}
	};
	const quickPrompts = activeIdea ? [
		{
			label: "Destravar esta ideia",
			icon: Zap,
			prompt: `Como posso destravar a ideia "${activeIdea.title}" agora mesmo?`
		},
		{
			label: "Sugerir passos de MVP",
			icon: Target,
			prompt: `Sugira um plano de 4 passos no estilo MVP para a ideia "${activeIdea.title}".`
		},
		{
			label: "Reduzir escopo",
			icon: Scissors,
			prompt: `Como posso simplificar o escopo de "${activeIdea.title}" para lançar mais rápido?`
		},
		{
			label: "Estratégia de monetização",
			icon: DollarSign,
			prompt: `Quais as melhores formas de monetizar a ideia "${activeIdea.title}"?`
		}
	] : [
		{
			label: "Qual focar hoje?",
			icon: Target,
			prompt: "Com base no meu funil de ideias, qual projeto devo priorizar hoje?"
		},
		{
			label: "Diagnóstico do funil",
			icon: Lightbulb,
			prompt: "Analise o status geral das minhas ideias e me diga onde está o maior gargalo."
		},
		{
			label: "Acolhimento & Desabafo",
			icon: Heart,
			prompt: "Estou me sentindo desanimado(a) e sobrecarregado(a) hoje. Pode me ouvir e me ajudar com gentileza?"
		},
		{
			label: "Técnica anti-procrastinação",
			icon: Zap,
			prompt: "Estou com dificuldade de começar a executar. Qual exercício prático de 5 minutos você me recomenda?"
		},
		{
			label: "Como validar rápido?",
			icon: Compass,
			prompt: "Qual o método mais rápido para validar uma ideia antes de gastar semanas construindo?"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange: (v) => {
			if (!v) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
			className: "max-h-[92vh]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-body max-w-2xl mx-auto w-full flex flex-col h-[85vh]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pb-3 border-b border-border space-y-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-primary/10 text-primary border border-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 18 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
									className: "sheet-title text-xl m-0",
									children: "Mentor Ideaflow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 mt-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-medium flex items-center gap-1.5 text-green",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-green animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IA Oficial Integrada (Groq LLaMA 3.3 70B · Gratuita) ⚡" })]
									})
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer",
								title: "Limpar conversa",
								onClick: () => setMessages([]),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2.5 flex items-center gap-2 border-b border-border/60 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground shrink-0 font-medium",
							children: "Foco da IA:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "bg-secondary/40 border border-border/80 rounded px-2.5 py-1 text-xs text-foreground cursor-pointer flex-1",
							value: selectedIdeaId,
							onChange: (e) => setSelectedIdeaId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "all",
								children: [
									"Visão Geral de Todo o Funil (",
									data.ideas.length,
									" ideias)"
								]
							}), data.ideas.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: i.id,
								children: ["Ideia: ", i.title]
							}, i.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: scrollRef,
						className: "flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs",
						children: [messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`,
							children: [
								msg.sender === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { size: 13 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `max-w-[85%] rounded-xl p-3 leading-relaxed ${msg.sender === "user" ? "bg-primary text-primary-foreground font-medium rounded-tr-none whitespace-pre-wrap" : "bg-card border border-border text-foreground rounded-tl-none shadow-xs"}`,
									children: [msg.sender === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormattedMessage, { content: msg.text }) : msg.text, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex items-center gap-1.5 mt-2 text-[9px] ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`,
										children: [
											msg.sender === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: msg.provider === "gemini" ? "text-cyan font-semibold flex items-center gap-1" : msg.provider === "groq" ? "text-violet font-semibold flex items-center gap-1" : "text-amber-500 font-semibold flex items-center gap-1",
												children: [
													msg.provider === "gemini" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"✨ Google Gemini (",
														msg.model || "Flash",
														")",
														msg.tokensUsed ? ` · ${msg.tokensUsed.totalTokens} tokens` : ""
													] }),
													msg.provider === "groq" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"🚀 Groq (",
														msg.model || "LLaMA 3.3",
														")",
														msg.tokensUsed ? ` · ${msg.tokensUsed.totalTokens} tokens` : ""
													] }),
													msg.provider === "local" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🛡️ Motor Heurístico Local (Offline)" }),
													msg.provider === "chatgpt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✨ IA Integrada" })
												]
											}),
											msg.sender === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: msg.timestamp })
										]
									})]
								}),
								msg.sender === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0 mt-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 13 })
								})
							]
						}, msg.id)), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground py-2 italic animate-pulse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, {
								size: 14,
								className: "animate-spin text-primary"
							}), "O Mentor está pensando e formulando sua resposta..."]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-border/50",
						children: quickPrompts.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-7 text-[11px] gap-1 shrink-0 bg-card/60 hover:bg-secondary border-border/70 cursor-pointer",
							onClick: () => handleSendMessage(q.prompt),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(q.icon, {
								size: 11,
								className: "text-primary"
							}), q.label]
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								handleSendMessage();
							},
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: inputText,
								onChange: (e) => setInputText(e.target.value),
								placeholder: "Pergunte ao Mentor ou converse sobre suas ideias...",
								className: "flex-1 bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary",
								disabled: loading
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "icon",
								disabled: loading || !inputText.trim(),
								className: "h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer active:scale-95",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 14 })
							})]
						})
					})
				]
			})
		})
	});
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function ProfileSidebar({ open, onClose, onOpenIdea }) {
	const { data, setData, user, signOut, isSyncing, syncWithCloud, requestSwitchWorkspace, joinCompanyByCode, openPinModal, openCompanyAccessModal, pendingRequests, approveRequest, rejectRequest, companies: userCompanies, switchCompany } = useFlow();
	const [activeTab, setActiveTab] = (0, import_react.useState)("personal");
	const [editingPersonal, setEditingPersonal] = (0, import_react.useState)(false);
	const [editingCompany, setEditingCompany] = (0, import_react.useState)(false);
	const [joinCodeInput, setJoinCodeInput] = (0, import_react.useState)("");
	const [showJoinCompany, setShowJoinCompany] = (0, import_react.useState)(false);
	const profile = data.profile ?? {
		name: "Explorador Ideaflow",
		role: "Criador & Desenvolvedor",
		bio: "Transformando ideias em realidade, um passo consciente de cada vez.",
		streak: 5
	};
	const [name, setName] = (0, import_react.useState)(profile.name);
	const [role, setRole] = (0, import_react.useState)(profile.role);
	const [bio, setBio] = (0, import_react.useState)(profile.bio ?? "");
	const validCompanies = userCompanies && userCompanies.length > 0 ? userCompanies.filter((c) => c.id && c.id !== "company-acme-corp" && c.shareCode !== "ACME-2026") : data.companyWorkspace && data.companyWorkspace.id && data.companyWorkspace.id !== "company-acme-corp" && data.companyWorkspace.shareCode !== "ACME-2026" ? [data.companyWorkspace] : [];
	const hasCompany = validCompanies.length > 0;
	const company = hasCompany ? data.companyWorkspace ?? validCompanies[0] : null;
	const isBusinessMode = data.workspaceMode === "business";
	const [companyName, setCompanyName] = (0, import_react.useState)(company?.name ?? "");
	const [companyIndustry, setCompanyIndustry] = (0, import_react.useState)(company?.industry ?? "");
	const [companyMission, setCompanyMission] = (0, import_react.useState)(company?.mission ?? "");
	const [showAddSector, setShowAddSector] = (0, import_react.useState)(false);
	const [newSectorName, setNewSectorName] = (0, import_react.useState)("");
	const [newSectorTone, setNewSectorTone] = (0, import_react.useState)("cyan");
	const [showAddMember, setShowAddMember] = (0, import_react.useState)(false);
	const [newMemberName, setNewMemberName] = (0, import_react.useState)("");
	const [newMemberRole, setNewMemberRole] = (0, import_react.useState)("");
	const [newMemberEmail, setNewMemberEmail] = (0, import_react.useState)("");
	const [newMemberDept, setNewMemberDept] = (0, import_react.useState)(company?.sectors?.[0]?.name ?? "Tecnologia & Dev");
	(0, import_react.useEffect)(() => {
		if (company) {
			setCompanyName(company.name);
			setCompanyIndustry(company.industry ?? "");
			setCompanyMission(company.mission ?? "");
			setNewMemberDept(company.sectors?.[0]?.name ?? "Tecnologia & Dev");
		}
	}, [company]);
	const handleSaveProfile = () => {
		setData((prev) => ({
			...prev,
			profile: {
				...profile,
				name: name.trim() || "Criador",
				role: role.trim() || "Executor",
				bio: bio.trim()
			}
		}));
		setEditingPersonal(false);
		toast.success("Perfil atualizado com sucesso!");
	};
	const handleSaveCompany = () => {
		if (!company) return;
		const updatedCompany = {
			...company,
			name: companyName.trim() || "Empresa Inovadora",
			industry: companyIndustry.trim(),
			mission: companyMission.trim()
		};
		setData((prev) => {
			const updatedList = (prev.companies && prev.companies.length > 0 ? prev.companies : [updatedCompany]).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
			return {
				...prev,
				companyWorkspace: updatedCompany,
				companies: updatedList
			};
		});
		setEditingCompany(false);
		toast.success("Dados da empresa atualizados com sucesso!");
	};
	const handleAddCompanySector = () => {
		if (!company) return;
		if (!newSectorName.trim()) {
			toast.error("Informe o nome do setor ou departamento.");
			return;
		}
		const newSec = {
			id: `sec-${Date.now()}`,
			name: newSectorName.trim(),
			tone: newSectorTone
		};
		const updatedCompany = {
			...company,
			sectors: [...company.sectors, newSec]
		};
		setData((prev) => {
			const updatedList = (prev.companies && prev.companies.length > 0 ? prev.companies : [updatedCompany]).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
			return {
				...prev,
				companyWorkspace: updatedCompany,
				companies: updatedList
			};
		});
		setNewSectorName("");
		setShowAddSector(false);
		toast.success(`Setor “${newSec.name}” adicionado à empresa! 🏢`);
	};
	const handleRemoveCompanySector = (sectorId) => {
		if (!company) return;
		if (company.sectors.length <= 1) {
			toast.error("A empresa precisa de pelo menos 1 setor.");
			return;
		}
		const updatedCompany = {
			...company,
			sectors: company.sectors.filter((s) => s.id !== sectorId)
		};
		setData((prev) => {
			const updatedList = (prev.companies && prev.companies.length > 0 ? prev.companies : [updatedCompany]).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
			return {
				...prev,
				companyWorkspace: updatedCompany,
				companies: updatedList
			};
		});
		toast.info("Setor removido.");
	};
	const handleAddMember = () => {
		if (!company) return;
		if (!newMemberName.trim()) {
			toast.error("Informe o nome do colaborador.");
			return;
		}
		const newMem = {
			id: `mem-${Date.now()}`,
			name: newMemberName.trim(),
			role: newMemberRole.trim() || "Colaborador",
			email: newMemberEmail.trim() || void 0,
			department: newMemberDept
		};
		const updatedCompany = {
			...company,
			members: [...company.members, newMem]
		};
		setData((prev) => {
			const updatedList = (prev.companies && prev.companies.length > 0 ? prev.companies : [updatedCompany]).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
			return {
				...prev,
				companyWorkspace: updatedCompany,
				companies: updatedList
			};
		});
		setNewMemberName("");
		setNewMemberRole("");
		setNewMemberEmail("");
		setShowAddMember(false);
		toast.success(`Membro ${newMem.name} adicionado à equipe! 👥`);
	};
	const handleRemoveMember = (memberId) => {
		if (!company) return;
		const updatedCompany = {
			...company,
			members: company.members.filter((m) => m.id !== memberId)
		};
		setData((prev) => {
			const updatedList = (prev.companies && prev.companies.length > 0 ? prev.companies : [updatedCompany]).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
			return {
				...prev,
				companyWorkspace: updatedCompany,
				companies: updatedList
			};
		});
		toast.info("Colaborador removido da equipe.");
	};
	const personalIdeas = data.ideas.filter((i) => i.workspace !== "business");
	const businessIdeas = data.ideas.filter((i) => i.workspace === "business");
	const activeIdeas = personalIdeas.filter((i) => !i.archived);
	const archivedIdeas = personalIdeas.filter((i) => i.archived);
	const realizedCount = activeIdeas.filter((i) => i.stage === 4).length;
	const complexProjectsCount = activeIdeas.filter((i) => i.isProject || data.ideas.some((sub) => sub.parentId === i.id)).length;
	const totalDedicatedMinutes = personalIdeas.reduce((sum, i) => sum + i.dedicated, 0);
	const businessRealizedCount = businessIdeas.filter((i) => i.stage === 4).length;
	const businessActiveCount = businessIdeas.filter((i) => !i.archived).length;
	businessIdeas.reduce((sum, i) => sum + i.dedicated, 0);
	const handleUnarchive = (ideaId) => {
		setData((prev) => ({
			...prev,
			ideas: prev.ideas.map((i) => i.id === ideaId ? {
				...i,
				archived: false,
				archivedAt: void 0
			} : i)
		}));
		toast.success("Ideia restaurada para o funil ativo! ✨");
	};
	const handleExportBackup = () => {
		try {
			const json = JSON.stringify(data, null, 2);
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `ideaflow-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Backup exportado com sucesso!");
		} catch {
			toast.error("Não foi possível gerar o arquivo de backup.");
		}
	};
	const handleImportBackup = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const parsed = JSON.parse(event.target?.result);
				if (parsed && Array.isArray(parsed.ideas) && Array.isArray(parsed.sectors)) {
					setData(parsed);
					toast.success("Backup restaurado com êxito!");
					onClose();
				} else toast.error("O arquivo JSON não é um backup compatível do Ideaflow.");
			} catch {
				toast.error("Erro ao ler arquivo JSON.");
			}
		};
		reader.readAsText(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: (isOpen) => !isOpen && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full sm:max-w-md p-0 overflow-y-auto bg-card border-border/80 flex flex-col h-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "p-6 pb-4 border-b border-border/70 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), activeTab === "personal" ? "Perfil Pessoal" : "Área & Workspace Empresarial"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-[10px] px-2 py-0.5 rounded-full font-semibold border ${isBusinessMode ? "bg-violet/15 text-violet border-violet/30" : "bg-primary/15 text-primary border-primary/30"}`,
									children: ["Modo: ", isBusinessMode ? "🏢 Empresa" : "👤 Pessoal"]
								}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-6 text-[11px] text-destructive hover:bg-destructive/10 border-destructive/30 gap-1 px-2 cursor-pointer",
									onClick: async () => {
										onClose();
										await signOut();
										window.dispatchEvent(new CustomEvent("ideaflow:login"));
									},
									title: "Sair da conta e ver tela de entrada",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 11 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sair" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-6 text-[11px] text-primary hover:bg-primary/10 border-primary/30 gap-1 px-2 cursor-pointer",
									onClick: () => {
										onClose();
										window.dispatchEvent(new CustomEvent("ideaflow:login"));
									},
									title: "Abrir tela de entrada / Login",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { size: 11 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
							className: "text-xl font-display font-semibold mt-1",
							children: activeTab === "personal" ? "Meu Perfil Ideaflow" : company?.name || "Workspace Empresarial"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
							className: "text-xs text-muted-foreground",
							children: activeTab === "personal" ? "Suas estatísticas de realização, ideias arquivadas e preferências locais." : "Gerencie os setores (Tech, Mkt, QA, Qualidade), equipe e iniciativas da sua empresa."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 pt-4 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 p-1 rounded-xl bg-secondary/80 border border-border/70 text-xs font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (data.workspaceMode === "business") requestSwitchWorkspace("personal");
								setActiveTab("personal");
							},
							className: `py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === "personal" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
								size: 14,
								className: activeTab === "personal" ? "text-primary" : ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Meu Perfil" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setActiveTab("business");
							},
							className: `py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === "business" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								size: 14,
								className: activeTab === "business" ? "text-violet" : ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Empresa & Setores" })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 space-y-6 flex-1",
					children: [activeTab === "personal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-secondary/40 border border-border/80 flex items-center justify-between gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-1.5 rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 15 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground truncate",
										children: "Workspace Pessoal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Seu funil individual de projetos"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-7 text-xs border-violet/40 text-violet hover:bg-violet/10 gap-1 shrink-0 cursor-pointer",
								onClick: () => {
									requestSwitchWorkspace("business");
									setActiveTab("business");
								},
								title: "Mudar para o Workspace da Empresa",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { size: 12 }), "Ir p/ Empresa"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-secondary/50 border border-border/80 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-2xl border-2 border-primary/40 shadow-sm select-none",
										children: (profile.name?.trim()?.[0] || user?.email?.trim()?.[0] || "U").toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -bottom-1 -right-1 bg-green text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-card shadow-xs",
										children: "Ativo"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 min-w-0",
									children: !editingPersonal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-base text-foreground truncate",
											children: profile.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-primary font-medium mt-0.5",
											children: profile.role
										}),
										profile.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-2 leading-relaxed",
											children: [
												"“",
												profile.bio,
												"”"
											]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2.5 w-full",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] text-muted-foreground block mb-1",
												children: "Seu Nome"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "text-field text-xs py-1.5",
												value: name,
												onChange: (e) => setName(e.target.value),
												placeholder: "Como deseja ser chamado..."
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] text-muted-foreground block mb-1",
												children: "Papel / Foco"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "text-field text-xs py-1.5",
												value: role,
												onChange: (e) => setRole(e.target.value),
												placeholder: "Ex: Empreendedor, Arquiteto..."
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] text-muted-foreground block mb-1",
												children: "Bio / Lema Pessoal"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												rows: 2,
												className: "text-field text-xs py-1.5 resize-none",
												value: bio,
												onChange: (e) => setBio(e.target.value),
												placeholder: "Seu lema ou propósito..."
											})] })
										]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center justify-between border-t border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
											size: 15,
											className: "text-amber animate-pulse"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Streak de Foco:" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-foreground",
											children: [profile.streak, " dias"]
										})
									]
								}), !editingPersonal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-7 text-xs text-primary gap-1 px-2.5 cursor-pointer",
									onClick: () => setEditingPersonal(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 12 }), "Editar Perfil"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-7 text-xs px-2 cursor-pointer",
										onClick: () => {
											setName(profile.name);
											setRole(profile.role);
											setBio(profile.bio ?? "");
											setEditingPersonal(false);
										},
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-7 text-xs gap-1 px-3 cursor-pointer",
										onClick: handleSaveProfile,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 12 }), "Salvar"]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3",
							children: "Métricas de Realização Pessoal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: "Tempo Dedicado"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												size: 14,
												className: "text-primary"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-xl font-display font-medium text-foreground mt-2",
											children: [(totalDedicatedMinutes / 60).toFixed(1), "h"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "horas de foco pessoal"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: "Realizadas"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												size: 14,
												className: "text-green"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-xl font-display font-medium text-green mt-2",
											children: realizedCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "ideias concluídas"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: "No Funil Ativo"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
												size: 14,
												className: "text-cyan"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-xl font-display font-medium text-foreground mt-2",
											children: activeIdeas.length
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "ideias em andamento"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: "Projetos Macro"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, {
										size: 14,
										className: "text-violet"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-xl font-display font-medium text-violet mt-2",
									children: complexProjectsCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: "com sub-módulos"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, {
										size: 15,
										className: "text-amber"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider",
										children: [
											"Ideias Arquivadas (",
											archivedIdeas.length,
											")"
										]
									})]
								})
							}), archivedIdeas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nenhuma ideia arquivada no momento." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] opacity-80",
									children: "Ao arquivar ideias do funil, elas ficam guardadas aqui com segurança."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 max-h-56 overflow-y-auto pr-1",
								children: archivedIdeas.map((idea) => {
									const sector = data.sectors.find((s) => s.id === idea.sector);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-lg border border-border/70 bg-secondary/30 flex items-center justify-between gap-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: "font-medium text-foreground truncate",
												children: idea.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2 mt-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-muted-foreground",
													children: [
														sector?.name ?? "Geral",
														" · ",
														stageNames[idea.stage]
													]
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												size: "sm",
												className: "h-7 text-xs px-2 text-primary gap-1 cursor-pointer",
												onClick: () => {
													onClose();
													onOpenIdea(idea.id);
												},
												title: "Ver detalhes da ideia arquivada",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 12 }), "Ver"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "h-7 text-xs px-2 gap-1 border-amber/40 text-amber hover:bg-amber/10 cursor-pointer",
												onClick: () => handleUnarchive(idea.id),
												title: "Restaurar para o funil ativo",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { size: 12 }), "Restaurar"]
											})]
										})]
									}, idea.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { size: 14 }), "Aparência & Paleta"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-foreground",
										children: "Modo do Tema"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 text-xs gap-1.5 cursor-pointer",
										onClick: () => setData((p) => ({
											...p,
											theme: p.theme === "dark" ? "light" : "dark"
										})),
										children: [data.theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 13 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 13 }), data.theme === "dark" ? "Mudar para Claro" : "Mudar para Escuro"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1.5",
									children: palettes.map((pal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setData((p) => ({
											...p,
											palette: pal
										})),
										className: `text-xs py-1.5 px-2 rounded-md border text-center transition-all cursor-pointer ${data.palette === pal ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:bg-secondary"}`,
										children: pal
									}, pal))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 14 }), "Segurança & Backup Local"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-relaxed",
									children: "O Ideaflow funciona 100% offline. Todos os seus dados ficam salvos exclusivamente no armazenamento do seu navegador."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "flex-1 text-xs gap-1.5 cursor-pointer",
										onClick: handleExportBackup,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 13 }), "Exportar JSON"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: ".json",
											className: "hidden",
											onChange: handleImportBackup
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											size: "sm",
											className: "w-full text-xs gap-1.5 cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 13 }), "Restaurar JSON"] })
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
											size: 14,
											className: "text-primary"
										}), "Segurança do Espaço Pessoal (PIN)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] px-2 py-0.5 rounded-full font-mono bg-primary/10 text-primary border border-primary/25 font-bold",
										children: "4 dígitos ativo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-relaxed",
									children: "Ao alternar do Workspace da Empresa para o Pessoal, sua senha de 4 dígitos é exigida para proteger sua privacidade contra acessos indevidos."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/60 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
												size: 15,
												className: "text-primary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Senha pessoal:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold tracking-widest text-foreground",
												children: "••••"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 text-xs gap-1.5 cursor-pointer ml-auto",
										onClick: () => openPinModal(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Alterar PIN" })
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, {
										size: 14,
										className: "text-primary"
									}), "Sincronização na Nuvem"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] px-2 py-0.5 rounded-full font-mono ${user ? "bg-green/15 text-green border border-green/30" : "bg-secondary text-muted-foreground"}`,
									children: user ? "Conectado" : "Modo Offline"
								})]
							}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-secondary/40 border border-border/80 space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "E-mail:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground font-medium",
										children: user.email
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "flex-1 text-xs gap-1.5 cursor-pointer",
										disabled: isSyncing,
										onClick: () => syncWithCloud(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
											size: 12,
											className: isSyncing ? "animate-spin text-primary" : ""
										}), isSyncing ? "Sincronizando..." : "Sincronizar Agora"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										className: "text-xs text-destructive hover:bg-destructive/10 gap-1 cursor-pointer",
										onClick: async () => {
											await signOut();
											onClose();
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 13 }), "Sair"]
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-[11px] leading-relaxed",
									children: "Conecte sua conta gratuita para acessar suas ideias e projetos em qualquer celular ou computador."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "w-full text-xs primary-action gap-1.5 cursor-pointer",
									onClick: () => {
										onClose();
										window.dispatchEvent(new CustomEvent("ideaflow:login"));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { size: 13 }), "Fazer Login / Criar Conta"]
								})]
							})]
						})
					] }), activeTab === "business" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: !hasCompany || !company ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 rounded-2xl border border-dashed border-violet/40 bg-violet/5 text-center space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-violet/15 text-violet border border-violet/30 flex items-center justify-center mx-auto shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 24 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-base text-foreground",
									children: "Nenhuma Empresa Vinculada"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto",
									children: [
										"Você ainda não possui uma empresa conectada. Crie a sua organização para se tornar o ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Key User" }),
										" ou entre com o código compartilhado fornecido pela sua equipe."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row gap-2.5 pt-2 justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "h-9 text-xs bg-gradient-to-r from-violet-600 to-primary text-white font-semibold cursor-pointer shadow-xs gap-1.5",
									onClick: () => {
										onClose();
										openCompanyAccessModal("create");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), "Criar Minha Empresa (Key User)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-9 text-xs border-violet/40 text-violet hover:bg-violet/10 font-semibold cursor-pointer gap-1.5",
									onClick: () => {
										onClose();
										openCompanyAccessModal("join");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { size: 14 }), "Entrar com Código"]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-violet/30 bg-violet/5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
										size: 16,
										className: "text-violet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider",
										children: [
											"Minhas Empresas (",
											validCompanies.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: validCompanies.length > 1 ? "Alterne entre suas diferentes organizações cadastradas." : "Organização conectada a este usuário."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 text-xs border-violet/40 text-violet hover:bg-violet/15 cursor-pointer px-2 gap-1",
										onClick: () => openCompanyAccessModal("create"),
										title: "Cadastrar outra empresa como Key User",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nova" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 text-xs border-violet/40 text-violet hover:bg-violet/15 cursor-pointer px-2 gap-1",
										onClick: () => openCompanyAccessModal("join"),
										title: "Entrar em outra empresa com código",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar" })]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 pt-1",
								children: validCompanies.map((c) => {
									const isActive = company?.id === c.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${isActive ? "bg-card border-violet/60 shadow-xs ring-1 ring-violet/40" : "bg-background/80 border-border/70 hover:border-violet/40"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-xs text-foreground truncate",
														children: c.name
													}),
													isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet/20 text-violet border border-violet/30 shrink-0",
														children: "✓ Ativa"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground shrink-0",
														children: c.isKeyUser ? "👑 Key User" : "👤 Colaborador"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-[11px] text-muted-foreground mt-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono",
														children: ["#", c.shareCode]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.sectors?.length ?? 0, " setores"] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.members?.length ?? 0, " colaboradores"] })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 flex items-center gap-1.5",
											children: isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-violet px-2.5 py-1",
												children: "Selecionada"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												className: "h-7 text-xs border-primary/30 text-primary hover:bg-primary/10 cursor-pointer px-2.5",
												onClick: async () => {
													if (c.id) {
														await switchCompany(c.id);
														toast.success(`Alternado para ${c.name} 🏢`);
													}
												},
												children: "Alternar"
											})
										})]
									}, c.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-4 rounded-xl border transition-all ${isBusinessMode ? "bg-gradient-to-br from-violet/15 via-primary/10 to-transparent border-violet/40 shadow-xs" : "bg-secondary/40 border-border/80"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-xl bg-violet/20 border border-violet/30 flex items-center justify-center text-violet",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 20 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm text-foreground",
										children: isBusinessMode ? "Workspace Empresarial Ativo" : "Workspace Empresarial Disponível"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: isBusinessMode ? "O funil principal está exibindo os setores e metas da empresa." : "Alterne para focar nos projetos corporativos e setores."
									})] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Status Atual:"
								}), isBusinessMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-8 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1.5 cursor-pointer",
									onClick: () => requestSwitchWorkspace("personal"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Voltar ao Pessoal (PIN)" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "h-8 text-xs bg-gradient-to-r from-violet-600 to-primary text-white font-semibold shadow-xs hover:shadow-violet-500/25 gap-1.5 cursor-pointer",
									onClick: () => requestSwitchWorkspace("business"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ativar Modo Empresa" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-violet/35 bg-violet/5 space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
											size: 14,
											className: "text-violet"
										}), "Compartilhamento & Nuvem da Empresa"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] px-2 py-0.5 rounded-full font-mono bg-green/15 text-green border border-green/30 flex items-center gap-1 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-green animate-pulse" }), "Supabase Nuvem"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-[11px] leading-relaxed",
									children: "Compartilhe este código com outros membros da equipe para que todos trabalhem no mesmo funil, adicionem ideias e acompanhem etapas em tempo real."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 pt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 p-2.5 rounded-lg bg-card border border-border/80 flex items-center justify-between font-mono font-bold text-sm text-foreground shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tracking-wider",
											children: company.shareCode || "ACME-2026"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "text-xs text-primary hover:text-primary/80 font-sans cursor-pointer flex items-center gap-1 font-semibold",
											onClick: () => {
												navigator.clipboard.writeText(company.shareCode || "ACME-2026");
												toast.success("Código de convite copiado para a área de transferência! 📋");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 12 }), "Copiar Código"]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-border/50 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-1 cursor-pointer",
										onClick: () => setShowJoinCompany(!showJoinCompany),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar em outra empresa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											size: 12,
											className: `transition-transform ${showJoinCompany ? "rotate-90" : ""}`
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 text-xs border-violet/40 text-violet hover:bg-violet/10 gap-1 cursor-pointer",
										onClick: () => syncWithCloud(),
										disabled: isSyncing,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
											size: 11,
											className: isSyncing ? "animate-spin" : ""
										}), "Sincronizar Nuvem"]
									})]
								}),
								showJoinCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-background border border-border/80 space-y-2 mt-2 animate-in fade-in-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-medium text-foreground block",
										children: "Código de Convite da Empresa Compartilhada:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1.5 font-mono uppercase",
											placeholder: "Ex: ACME-2026",
											value: joinCodeInput,
											onChange: (e) => setJoinCodeInput(e.target.value)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "h-8 text-xs cursor-pointer shrink-0",
											onClick: async () => {
												if (joinCodeInput.trim()) {
													await joinCompanyByCode(joinCodeInput.trim());
													setJoinCodeInput("");
													setShowJoinCompany(false);
												}
											},
											children: "Conectar"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-secondary/50 border border-border/80 space-y-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, {
										size: 14,
										className: "text-violet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dados da Organização" })]
								}), !editingCompany ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-6 text-xs text-primary gap-1 px-2 cursor-pointer",
									onClick: () => setEditingCompany(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 11 }), "Editar"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-6 text-xs px-2 cursor-pointer",
										onClick: () => {
											setCompanyName(company.name);
											setCompanyIndustry(company.industry ?? "");
											setCompanyMission(company.mission ?? "");
											setEditingCompany(false);
										},
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-6 text-xs px-2.5 gap-1 cursor-pointer",
										onClick: handleSaveCompany,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 11 }), "Salvar"]
									})]
								})]
							}), !editingCompany ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-base text-foreground",
										children: company.name
									}),
									company.industry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-primary font-medium",
										children: company.industry
									}),
									company.mission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground italic leading-relaxed pt-1",
										children: [
											"“",
											company.mission,
											"”"
										]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] text-muted-foreground block mb-1",
										children: "Nome da Empresa"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "text-field text-xs py-1.5",
										value: companyName,
										onChange: (e) => setCompanyName(e.target.value),
										placeholder: "Ex: Acme Inovações S.A."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] text-muted-foreground block mb-1",
										children: "Setor / Indústria"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "text-field text-xs py-1.5",
										value: companyIndustry,
										onChange: (e) => setCompanyIndustry(e.target.value),
										placeholder: "Ex: Tecnologia & Produtos Digitais"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] text-muted-foreground block mb-1",
										children: "Missão / Propósito"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										className: "text-field text-xs py-1.5 resize-none",
										value: companyMission,
										onChange: (e) => setCompanyMission(e.target.value),
										placeholder: "Ex: Entregar tecnologia com máxima estabilidade e foco no cliente..."
									})] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-dashed border-violet/50 bg-violet/5 flex items-center justify-between gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground truncate",
									children: "Precisa trocar ou fundar outra empresa?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Abra o portal para gerar novo código ou conectar outro time."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold shrink-0 cursor-pointer",
								onClick: () => openCompanyAccessModal(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 13,
									className: "mr-1"
								}), "Portal Corporativo"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-violet/30 bg-secondary/40 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
										size: 16,
										className: "text-violet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider",
										children: "Painel do Key User & Aprovações"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: company.keyUserName ? `Key User: ${company.keyUserName}` : "Gestão de acessos à corporação"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] px-2 py-0.5 rounded-full font-mono bg-violet/15 text-violet border border-violet/30 font-bold",
									children: [pendingRequests.length, " pendente(s)"]
								})]
							}), pendingRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Nenhum pedido de entrada aguardando aprovação."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] mt-0.5 opacity-80",
									children: [
										"Quando colaboradores usarem o código ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-primary font-mono",
											children: company.shareCode || "ACME-2026"
										}),
										", suas solicitações aparecerão aqui para sua validação."
									]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 max-h-48 overflow-y-auto pr-1",
								children: pendingRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-lg border border-violet/30 bg-card flex flex-col gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-start justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-foreground",
												children: req.userName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: req.userEmail
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-primary font-medium",
												children: [
													"Setor: ",
													req.department,
													" · ",
													req.role
												]
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2 pt-1 border-t border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-6 text-[11px] text-destructive hover:bg-destructive/10 px-2 cursor-pointer",
											onClick: () => rejectRequest(req.id),
											children: "Recusar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "h-6 text-[11px] bg-green hover:bg-green/90 text-white font-semibold px-2.5 cursor-pointer",
											onClick: () => approveRequest(req),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												size: 12,
												className: "mr-1"
											}), "Aprovar Acesso"]
										})]
									})]
								}, req.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs uppercase font-semibold text-muted-foreground tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
											size: 14,
											className: "text-cyan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Setores da Empresa (",
											company.sectors.length,
											")"
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-6 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1 px-2 cursor-pointer",
										onClick: () => setShowAddSector(!showAddSector),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Novo Setor" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Estruture a empresa por áreas de atuação. O funil e as ideias serão agrupados por estes setores."
								}),
								showAddSector && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground text-xs",
											children: "Adicionar Novo Setor / Departamento"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1.5",
											value: newSectorName,
											onChange: (e) => setNewSectorName(e.target.value),
											placeholder: "Nome do setor (ex: Sucesso do Cliente, Design, Vendas...)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground",
												children: "Tom:"
											}), [
												"cyan",
												"pink",
												"amber",
												"green",
												"violet"
											].map((tone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setNewSectorTone(tone),
												className: `w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${tone === "cyan" ? "bg-cyan-500" : tone === "pink" ? "bg-pink-500" : tone === "amber" ? "bg-amber-500" : tone === "green" ? "bg-emerald-500" : "bg-violet-500"} ${newSectorTone === tone ? "scale-110 ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"}`
											}, tone))]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-2 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												className: "h-7 text-xs px-2 cursor-pointer",
												onClick: () => setShowAddSector(false),
												children: "Cancelar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												className: "h-7 text-xs px-3 cursor-pointer",
												onClick: handleAddCompanySector,
												children: "Adicionar Setor"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5",
									children: company.sectors.map((sec) => {
										const count = businessIdeas.filter((i) => i.sector === sec.id).length;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg border border-border/70 bg-card/60 flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2.5 h-2.5 rounded-full ${sec.tone === "cyan" ? "bg-cyan-500" : sec.tone === "pink" ? "bg-pink-500" : sec.tone === "amber" ? "bg-amber-500" : sec.tone === "green" ? "bg-emerald-500" : "bg-violet-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground truncate",
													children: sec.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full",
													children: [
														count,
														" ",
														count === 1 ? "iniciativa" : "iniciativas"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleRemoveCompanySector(sec.id),
													className: "text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer",
													title: "Remover setor",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
												})]
											})]
										}, sec.id);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs uppercase font-semibold text-muted-foreground tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
											size: 14,
											className: "text-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Equipe & Colaboradores (",
											company.members.length,
											")"
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-6 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1 px-2 cursor-pointer",
										onClick: () => setShowAddMember(!showAddMember),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adicionar" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Membros alocados aos projetos e responsáveis pelas iniciativas da empresa."
								}),
								showAddMember && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground text-xs",
											children: "Novo Membro da Equipe"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1.5",
											value: newMemberName,
											onChange: (e) => setNewMemberName(e.target.value),
											placeholder: "Nome completo (ex: Carlos Mendes)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1.5",
											value: newMemberRole,
											onChange: (e) => setNewMemberRole(e.target.value),
											placeholder: "Cargo (ex: Arquiteto de Software, Especialista em Growth)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "text-field text-xs py-1.5",
											type: "email",
											value: newMemberEmail,
											onChange: (e) => setNewMemberEmail(e.target.value),
											placeholder: "E-mail corporativo (opcional)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-muted-foreground block mb-1",
											children: "Setor Principal:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "text-field text-xs py-1.5",
											value: newMemberDept,
											onChange: (e) => setNewMemberDept(e.target.value),
											children: company.sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s.name,
												children: s.name
											}, s.id))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-2 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												className: "h-7 text-xs px-2 cursor-pointer",
												onClick: () => setShowAddMember(false),
												children: "Cancelar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												className: "h-7 text-xs px-3 cursor-pointer",
												onClick: handleAddMember,
												children: "Salvar Membro"
											})]
										})
									]
								}),
								company.members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-3.5 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground",
									children: "Nenhum colaborador adicionado ainda. Compartilhe o código da empresa para a equipe ingressar ou adicione acima."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: company.members.map((member) => {
										const initials = member.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg border border-border/70 bg-card/60 flex items-center justify-between gap-2.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-8 h-8 rounded-full bg-primary/15 text-primary border border-primary/25 font-bold flex items-center justify-center shrink-0 text-xs",
													children: initials || "U"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "truncate",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: "font-semibold text-foreground truncate",
														children: member.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-muted-foreground truncate",
														children: [
															member.role,
															" ",
															member.department ? `· ${member.department}` : ""
														]
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [member.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground hidden sm:inline",
													title: member.email,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
														size: 12,
														className: "inline mr-1"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleRemoveMember(member.id),
													className: "text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer",
													title: "Remover membro",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
												})]
											})]
										}, member.id);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/70 pt-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 14,
									className: "text-green"
								}), "Métricas do Workspace Corporativo"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Iniciativas da Empresa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-xl font-display font-medium text-foreground mt-2",
											children: businessActiveCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "ativas no funil"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg bg-card border border-border/70 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Entregas Realizadas"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-xl font-display font-medium text-green mt-2",
											children: businessRealizedCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "concluídas com êxito"
										})
									]
								})]
							})]
						})
					] }) })]
				})
			]
		})
	});
}
function AuthModal({ open, onClose, onSuccess, defaultMode = "login" }) {
	const { data, setData, user } = useFlow();
	const [mode, setMode] = (0, import_react.useState)(defaultMode);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [forgotSent, setForgotSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setMode(defaultMode);
			setErrorMessage(null);
			setForgotSent(false);
			if (user?.email && !email) setEmail(user.email);
			setPassword("");
			setConfirmPassword("");
		}
	}, [open, defaultMode]);
	if (!open) return null;
	const hasLength = password.length >= 6;
	const hasLetter = /[a-zA-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const passwordsMatch = password.length > 0 && password === confirmPassword;
	const isPasswordValid = hasLength && hasLetter && hasNumber && passwordsMatch;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		const cleanEmail = email.trim().toLowerCase();
		const cleanPassword = password.trim();
		if (mode === "forgot") {
			if (!cleanEmail) {
				setErrorMessage("Informe o e-mail cadastrado.");
				return;
			}
			setLoading(true);
			try {
				const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, typeof window !== "undefined" ? { redirectTo: `${window.location.origin}/` } : {});
				if (error) throw error;
				setForgotSent(true);
				toast.success("Link de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
			} catch (err) {
				console.error("Erro na recuperação de senha:", err);
				let rawMsg = err?.message || "Falha ao enviar e-mail de recuperação.";
				const lower = String(rawMsg).toLowerCase();
				let userFriendlyMsg = rawMsg;
				if (lower.includes("rate limit") || lower.includes("over_email_send_rate_limit")) userFriendlyMsg = "Limite temporário de envio de e-mails atingido pelo Supabase (máx. 3-4 envios/hora). Aguarde alguns minutos.";
				setErrorMessage(userFriendlyMsg);
				toast.error(userFriendlyMsg, { duration: 6e3 });
			} finally {
				setLoading(false);
			}
			return;
		}
		if (!cleanEmail || !cleanPassword) {
			setErrorMessage("Informe e-mail e senha.");
			return;
		}
		if (mode === "register") {
			if (!name.trim()) {
				setErrorMessage("Informe seu nome completo para o cadastro.");
				return;
			}
			if (!hasLength) {
				setErrorMessage("A senha deve ter no mínimo 6 dígitos.");
				return;
			}
			if (!hasLetter) {
				setErrorMessage("A senha deve conter pelo menos uma letra.");
				return;
			}
			if (!hasNumber) {
				setErrorMessage("A senha deve conter pelo menos um número.");
				return;
			}
			if (!passwordsMatch) {
				setErrorMessage("As duas senhas digitadas não coincidem.");
				return;
			}
		}
		setLoading(true);
		try {
			if (mode === "register") {
				const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
					email: cleanEmail,
					password: cleanPassword,
					options: { data: {
						name: name.trim() || "Criador(a)",
						username: username.trim().toLowerCase() || cleanEmail.split("@")[0]
					} }
				});
				const errLower = (signUpError?.message || "").toLowerCase();
				if (errLower.includes("already registered") || errLower.includes("user already exists") || errLower.includes("email address has already been registered") || Boolean(signUpData?.user && Array.isArray(signUpData.user.identities) && signUpData.user.identities.length === 0)) {
					const msg = "Este e-mail já possui uma conta cadastrada. Por segurança, faça login com sua senha.";
					setErrorMessage(msg);
					toast.warning(msg, { duration: 6e3 });
					setMode("login");
					setPassword("");
					setConfirmPassword("");
					setLoading(false);
					return;
				}
				if (signUpError) throw signUpError;
				let authUser = signUpData?.user;
				if (!signUpData?.session) {
					const loginRes = await supabase.auth.signInWithPassword({
						email: cleanEmail,
						password: cleanPassword
					});
					if (loginRes.data?.user) authUser = loginRes.data.user;
				}
				if (authUser) {
					await upsertUserProfile({
						id: authUser.id,
						name: name.trim() || "Criador(a)",
						username: username.trim().toLowerCase() || cleanEmail.split("@")[0],
						role: "Criador(a)"
					}).catch(console.warn);
					setData((prev) => ({
						...prev,
						workspaceMode: "personal"
					}));
					toast.success("Conta criada com sucesso! ✨");
					localStorage.removeItem("ideaflow_tutorial_completed");
					window.dispatchEvent(new Event("ideaflow:tutorial"));
					if (typeof window !== "undefined") sessionStorage.setItem("ideaflow_session_unlocked", "true");
					if (onSuccess) onSuccess();
					onClose();
				}
			} else {
				const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
					email: cleanEmail,
					password: cleanPassword
				});
				if (signInError) {
					if ((signInError.message || "").toLowerCase().includes("invalid login credentials")) throw new Error("E-mail ou senha incorretos. Verifique suas credenciais.");
					throw signInError;
				}
				if (signInData.user) {
					if (typeof window !== "undefined") {
						sessionStorage.setItem("ideaflow_session_unlocked", "true");
						const cachedPin = localStorage.getItem(`ideaflow_pin_${cleanEmail}`);
						if (cachedPin) localStorage.setItem("ideaflow_personal_pin", cachedPin);
					}
					toast.success("Login realizado com sucesso! Suas ideias e empresas foram carregadas. 🚀");
					if (onSuccess) onSuccess();
					onClose();
				}
			}
		} catch (err) {
			console.error("Erro na autenticação:", err);
			let rawMsg = err?.message || "Falha ao autenticar.";
			const lower = String(rawMsg).toLowerCase();
			let userFriendlyMsg = rawMsg;
			if (lower.includes("rate limit") || lower.includes("over_email_send_rate_limit")) userFriendlyMsg = "Limite temporário de envio de e-mails atingido pelo Supabase. Aguarde alguns minutos.";
			else if (lower.includes("already registered") || lower.includes("user already exists")) {
				userFriendlyMsg = "Este e-mail já possui uma conta cadastrada. Faça login com sua senha.";
				setMode("login");
			} else if (lower.includes("invalid login credentials")) userFriendlyMsg = "E-mail ou senha incorretos.";
			setErrorMessage(userFriendlyMsg);
			toast.error(userFriendlyMsg, { duration: 6e3 });
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#090D16] dark:bg-[#07090E] select-none overflow-y-auto animate-in fade-in duration-200",
		children: [user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0",
			onClick: onClose,
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md max-h-[92dvh] overflow-y-auto p-6 sm:p-8 bg-white dark:bg-card text-slate-900 dark:text-foreground border border-slate-200 dark:border-border rounded-3xl shadow-2xl space-y-4 sm:space-y-5 z-10 animate-in zoom-in-95 duration-200",
			children: [
				user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-secondary dark:hover:bg-secondary/80 text-slate-500 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer z-20 border border-slate-200 dark:border-border",
					"aria-label": "Fechar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-1.5 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white mb-1 shadow-md shadow-cyan-500/25",
							children: mode === "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { size: 24 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-foreground tracking-tight",
							children: mode === "forgot" ? "Recuperar Senha" : mode === "login" ? "Entrar no Ideaflow" : "Criar sua Conta"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed max-w-xs mx-auto font-medium",
							children: mode === "forgot" ? "Digite seu e-mail cadastrado para receber o link de redefinição segura." : mode === "login" ? "Digite seu e-mail e senha cadastrada para acessar seu espaço seguro." : "Crie sua conta única de usuário para acessar seus projetos e fundar empresas no app."
						})
					]
				}),
				mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 p-1 bg-slate-100 dark:bg-secondary rounded-2xl border border-slate-200 dark:border-border text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode("login");
							setErrorMessage(null);
						},
						className: `py-2 rounded-xl text-center transition-all cursor-pointer ${mode === "login" ? "bg-white dark:bg-card text-slate-900 dark:text-foreground shadow-sm font-bold" : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"}`,
						children: "Entrar com Senha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode("register");
							setErrorMessage(null);
						},
						className: `py-2 rounded-xl text-center transition-all cursor-pointer ${mode === "register" ? "bg-white dark:bg-card text-slate-900 dark:text-foreground shadow-sm font-bold" : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"}`,
						children: "Criar Conta"
					})]
				}),
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-xl bg-rose-50 dark:bg-destructive/15 border border-rose-200 dark:border-destructive/30 text-rose-700 dark:text-destructive text-xs flex items-start gap-2.5 animate-in fade-in-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
						size: 16,
						className: "shrink-0 mt-0.5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 font-medium leading-relaxed",
						children: errorMessage
					})]
				}),
				mode === "forgot" && forgotSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-3 animate-in fade-in-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 20 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-sm",
							children: "E-mail de recuperação enviado!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed",
							children: [
								"Enviamos um link seguro para ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-mono",
									children: email
								}),
								". Clique nele para redefinir sua senha."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "w-full text-xs font-semibold cursor-pointer",
							onClick: () => {
								setMode("login");
								setForgotSent(false);
							},
							children: "Voltar ao Login"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-3.5",
					children: [
						mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block",
								children: "Nome Completo *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
									size: 16,
									className: "absolute left-3.5 text-slate-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "Ex: Caroline Martins",
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-3.5 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block",
								children: "Nome de Usuário (@handle)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute left-4 text-slate-400 text-sm font-mono pointer-events-none",
									children: "@"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "caroline",
									value: username,
									onChange: (e) => setUsername(e.target.value),
									className: "w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-9 pr-3.5 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono font-medium"
								})]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block",
								children: "E-mail Corporativo ou Pessoal *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									size: 16,
									className: "absolute left-3.5 text-slate-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									placeholder: "seu@email.com",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-3.5 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
								})]
							})]
						}),
						mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block",
									children: "Senha de Acesso *"
								}), mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setMode("forgot");
										setErrorMessage(null);
									},
									className: "text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer",
									children: "Esqueceu a senha?"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										size: 16,
										className: "absolute left-3.5 text-slate-400"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showPassword ? "text" : "password",
										required: true,
										placeholder: "Sua senha secreta",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-10 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword(!showPassword),
										className: "absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
									})
								]
							})]
						}),
						mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider block",
								children: "Confirmação de Senha *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										size: 16,
										className: "absolute left-3.5 text-slate-400"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showConfirmPassword ? "text" : "password",
										required: true,
										placeholder: "Repita sua senha",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										className: "w-full bg-slate-50 dark:bg-secondary border border-slate-200 dark:border-border rounded-xl pl-10 pr-10 h-11 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowConfirmPassword(!showConfirmPassword),
										className: "absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
										children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-slate-50 dark:bg-secondary/40 rounded-xl border border-slate-200 dark:border-border space-y-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-slate-700 dark:text-foreground mb-1",
								children: "Requisitos de segurança:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-1 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-1 ${hasLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`,
										children: [hasLength ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 12 }), " Mínimo 6 dígitos"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-1 ${hasLetter ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`,
										children: [hasLetter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 12 }), " Pelo menos 1 letra"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-1 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`,
										children: [hasNumber ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 12 }), " Pelo menos 1 número"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-1 ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`,
										children: [passwordsMatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 12 }), " Senhas coincidem"]
									})
								]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: loading || mode === "register" && !isPasswordValid,
							className: "w-full h-12 bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/25 cursor-pointer transition-all active:scale-[0.99] gap-2 mt-2",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								size: 18,
								className: "animate-spin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Processando..." })] }) : mode === "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enviar Link de Recuperação" }) : mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar com Senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Criar Minha Conta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 })] })
						})
					]
				}),
				mode === "forgot" && !forgotSent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center pt-2 border-t border-slate-200 dark:border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setMode("login");
							setErrorMessage(null);
						},
						className: "text-xs text-slate-500 hover:text-slate-800 dark:hover:text-foreground font-semibold inline-flex items-center gap-1 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Voltar para tela de login" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 text-center text-[11px] text-slate-500 dark:text-muted-foreground flex items-center justify-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						size: 14,
						className: "text-emerald-600 dark:text-emerald-400 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Autenticação protegida via Supabase Auth" })]
				}),
				!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-1 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "text-[11px] text-slate-400 dark:text-muted-foreground hover:text-slate-200 dark:hover:text-foreground underline transition-colors cursor-pointer",
						children: "Continuar como visitante (modo offline local)"
					})
				})
			]
		})]
	});
}
var personalTourSteps = [
	{
		target: "funil",
		route: "/",
		title: "O Funil de 5 Estágios",
		badge: "Passo 1 de 5 · O Fluxo Principal",
		description: "Suas ideias não ficam perdidas em listas estáticas. Elas evoluem de forma natural por 5 etapas: Faísca (ideia bruta) ➔ Estrutura ➔ Em Fluxo ➔ Ajustes ➔ Realidade (concluída!).",
		tip: "💡 Dica: Arraste os cards para frente conforme realiza os passos, ou toque em qualquer card para ver o dashboard individual.",
		icon: Layers,
		color: "text-cyan",
		glowColor: "from-cyan/25 to-cyan/5 border-cyan/40"
	},
	{
		target: "hoje",
		route: "/hoje",
		title: "Meu Dia & Blocos de Foco",
		badge: "Passo 2 de 5 · Gestão do Tempo",
		description: "Planeje suas ações do dia divididas em Manhã, Tarde e Noite. Toque em \"Começar Foco\" em qualquer ideia para ativar o cronômetro consciente de 25 minutos sem distrações.",
		tip: "💡 Dica: Foque em apenas 1 ou 2 passos por dia para manter a mente leve e avançar com consistência real.",
		icon: CalendarDays,
		color: "text-green",
		glowColor: "from-green/25 to-green/5 border-green/40"
	},
	{
		target: "setores",
		route: "/setores",
		title: "Seus Setores & Modelos Prontos",
		badge: "Passo 3 de 5 · Primeira Missão",
		description: "Seus universos de realização (Tecnologia, Relacionamento, Saúde, Negócios...). Sua primeira missão é criar ou escolher seu primeiro setor através dos nossos modelos prontos com ideias inspiradoras!",
		tip: "💡 Dica: Você pode criar, alterar cores/nomes ou excluir setores a qualquer momento com total liberdade.",
		icon: Shapes,
		color: "text-violet",
		glowColor: "from-violet/25 to-violet/5 border-violet/40"
	},
	{
		target: "mentor",
		title: "Mentor IA em Tempo Real",
		badge: "Passo 4 de 5 · Copiloto Inteligente",
		description: "Seu copiloto de alta performance e acolhimento humano. Ele estuda seus funis em tempo real, ajuda a destravar procrastinação, sugere planos de MVP e oferece acolhimento emocional quando você precisar.",
		tip: "💡 Dica: Toque no botão brilhante \"Mentor IA\" no topo sempre que quiser conselhos, tirar dúvidas ou desabafar.",
		icon: Sparkles,
		color: "text-amber",
		glowColor: "from-amber/25 to-amber/5 border-amber/40"
	},
	{
		target: "capture",
		title: "Captura Imediata por Voz ou Texto",
		badge: "Passo 5 de 5 · Esvazie a Mente",
		description: "Teve uma faísca ou lembrança? Toque no botão central com microfone para falar ou digitar em 10 segundos. A inteligência artificial estrutura o primeiro micro-passo de 15 minutos para você!",
		tip: "💡 Dica: Tirar da cabeça e colocar no Ideaflow libera sua mente para viver com foco e presença.",
		icon: Mic,
		color: "text-pink",
		glowColor: "from-pink/25 to-pink/5 border-pink/40"
	}
];
var companyTourSteps = [
	{
		target: "funil",
		route: "/",
		title: "Funil Corporativo de Iniciativas",
		badge: "Passo 1 de 5 · Governança & Execução",
		description: "No workspace da empresa, cada card é uma iniciativa estratégica. O time move projetos pelas 5 etapas com transparência total: Faísca ➔ Estrutura ➔ Em Fluxo ➔ Validação & QA ➔ Realidade (entregue ao cliente/mercado).",
		tip: "💡 Dica do Líder: Cada iniciativa possui setor corporativo, responsável designado e prioridade estratégica visíveis para todos.",
		icon: Layers,
		color: "text-cyan",
		glowColor: "from-cyan/25 to-cyan/5 border-cyan/40"
	},
	{
		target: "setores",
		route: "/setores",
		title: "Departamentos & Setores da Empresa",
		badge: "Passo 2 de 5 · Alinhamento Organizacional",
		description: "Estruture a organização por áreas de atuação (Tecnologia & Dev, Qualidade & Produto, Marketing, Operações, QA). O funil e os projetos são filtrados por departamento para evitar sobrecarga.",
		tip: "💡 Dica: Você pode criar novos departamentos ou usar modelos corporativos com iniciativas estruturadas.",
		icon: Shapes,
		color: "text-violet",
		glowColor: "from-violet/25 to-violet/5 border-violet/40"
	},
	{
		target: "funil",
		route: "/",
		title: "Equipe & Responsáveis pelas Entregas",
		badge: "Passo 3 de 5 · Colaboração em Nuvem",
		description: "Colaboradores ingressam na sua empresa usando o código corporativo exclusivo. Atribua responsáveis diretos para cada iniciativa manter clareza de quem entrega o quê.",
		tip: "💡 Dica: Compartilhe o código da empresa com seus colaboradores no menu lateral ou portal da organização.",
		icon: Target,
		color: "text-pink",
		glowColor: "from-pink/25 to-pink/5 border-pink/40"
	},
	{
		target: "funil",
		route: "/",
		title: "Painel do Key User & Governança",
		badge: "Passo 4 de 5 · Gestão & Aprovações",
		description: "Como Key User e líder da organização, novas solicitações de colaboradores chegam para sua validação. Você modera o acesso, gerencia setores e acompanha métricas consolidadas.",
		tip: "💡 Dica: O painel de aprovações fica no topo da barra lateral no modo Empresa.",
		icon: WandSparkles,
		color: "text-amber",
		glowColor: "from-amber/25 to-amber/5 border-amber/40"
	},
	{
		target: "capture",
		title: "5 Porquês Corporativos & Planejamento Ágil",
		badge: "Passo 5 de 5 · Inovação com ROI",
		description: "Ao capturar uma iniciativa, responda as 5 perguntas estratégicas (Impacto no Negócio, Dor do Cliente/Processo, Responsável, ROI e MVP). A IA calcula planos de ação executivos sem burocracia.",
		tip: "💡 Dica: Use o botão de captura por voz ou texto para registrar ideias de novos produtos ou otimizações de processo em segundos.",
		icon: Sparkles,
		color: "text-green",
		glowColor: "from-green/25 to-green/5 border-green/40"
	}
];
function OnboardingTutorial({ open, onClose, isBusiness = false }) {
	const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
	const [spotlightRect, setSpotlightRect] = (0, import_react.useState)(null);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (open) setCurrentStep(0);
	}, [open]);
	const tourSteps = isBusiness ? companyTourSteps : personalTourSteps;
	const step = tourSteps[currentStep];
	const isLast = currentStep === tourSteps.length - 1;
	(0, import_react.useEffect)(() => {
		if (!open || !step) return;
		if (step.route) navigate({ to: step.route });
		const updateSpotlight = () => {
			const el = document.querySelector(`[data-tour="${step.target}"]`);
			if (el) {
				el.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "nearest"
				});
				setSpotlightRect(el.getBoundingClientRect());
			} else setSpotlightRect(null);
		};
		updateSpotlight();
		window.addEventListener("resize", updateSpotlight);
		window.addEventListener("scroll", updateSpotlight, true);
		const timer = setTimeout(updateSpotlight, 150);
		return () => {
			window.removeEventListener("resize", updateSpotlight);
			window.removeEventListener("scroll", updateSpotlight, true);
			clearTimeout(timer);
		};
	}, [
		open,
		currentStep,
		step?.target,
		step?.route,
		navigate
	]);
	if (!open || !step) return null;
	const handleNext = () => {
		if (isLast) {
			localStorage.setItem("ideaflow_tutorial_completed", "true");
			if (isBusiness) toast.success("Tour Corporativo concluído! Sua empresa pronta para inovar e executar com foco 🏢🚀");
			else toast.success("Tour concluído! Bem-vindo(a) ao seu novo espaço de realização ✨");
			onClose();
		} else setCurrentStep((s) => s + 1);
	};
	const handlePrev = () => {
		setCurrentStep((s) => Math.max(0, s - 1));
	};
	const handleSkip = () => {
		localStorage.setItem("ideaflow_tutorial_completed", "true");
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 pointer-events-auto",
		children: [
			spotlightRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out tour-spotlight-active",
				style: {
					top: `${Math.max(0, spotlightRect.top - 8)}px`,
					left: `${Math.max(0, spotlightRect.left - 8)}px`,
					width: `${spotlightRect.width + 16}px`,
					height: `${spotlightRect.height + 16}px`,
					boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.75), 0 0 35px var(--primary)",
					border: "2px solid var(--primary)"
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-slate-950/75 dark:bg-[#05070C]/85 backdrop-blur-xs transition-opacity duration-300 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 pointer-events-auto",
				onClick: handleNext,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed z-50 pointer-events-auto transition-all duration-300 ease-out left-1/2 -translate-x-1/2 bottom-28 sm:bottom-32 w-[92%] max-w-lg",
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 sm:p-7 bg-white dark:bg-[#0F121C] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/90 space-y-5 animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/25",
									children: step.badge
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleSkip,
								className: "text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer",
								title: "Pular tour e começar a usar",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pular Tour" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-12 h-12 rounded-2xl bg-gradient-to-br ${step.glowColor} border flex items-center justify-center ${step.color} shadow-sm shrink-0`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, { size: 24 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight",
										children: step.title
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-foreground/85 leading-relaxed",
									children: step.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-3.5 rounded-xl bg-secondary/50 border border-border/80 text-xs text-muted-foreground leading-relaxed",
									children: step.tip
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex items-center justify-between gap-3 border-t border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5",
								children: tourSteps.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCurrentStep(idx),
									className: `h-2 rounded-full transition-all cursor-pointer ${idx === currentStep ? "w-6 bg-primary" : "w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"}`,
									"aria-label": `Ir para passo ${idx + 1}`
								}, idx))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [currentStep > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrev,
									className: "h-9 px-3 text-xs gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Anterior" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: handleNext,
									className: "h-9 px-4 text-xs font-semibold gap-1.5 primary-action",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isLast ? "Concluir Tour!" : "Próximo" }), isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
								})]
							})]
						})
					]
				})
			})
		]
	});
}
function AppShell({ children }) {
	const { data, setData, user, profile, isSyncing, syncWithCloud, requestSwitchWorkspace, signOut, pendingRequests, companies, switchCompany } = useFlow();
	const [capture, setCapture] = (0, import_react.useState)(false);
	const [aiChatOpen, setAiChatOpen] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [sessionUnlocked, setSessionUnlocked] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return true;
		return sessionStorage.getItem("ideaflow_session_unlocked") === "true";
	});
	const [authOpen, setAuthOpen] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return sessionStorage.getItem("ideaflow_session_unlocked") !== "true";
	});
	const [profileIdeaId, setProfileIdeaId] = (0, import_react.useState)(null);
	const [mentorIdea, setMentorIdea] = (0, import_react.useState)(null);
	const [greeting, setGreeting] = (0, import_react.useState)("Que bom ter você aqui");
	const [online, setOnline] = (0, import_react.useState)(true);
	const [showTutorial, setShowTutorial] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (state) => state.location.pathname });
	const [guestMode, setGuestMode] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("ideaflow_guest_session") === "true";
	});
	const [sidebarCollapsed, setSidebarCollapsed] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("ideaflow_sidebar_collapsed") === "true";
	});
	const toggleSidebar = () => {
		setSidebarCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem("ideaflow_sidebar_collapsed", String(next));
			return next;
		});
	};
	const handleAuthSuccess = () => {
		if (typeof window !== "undefined") sessionStorage.setItem("ideaflow_session_unlocked", "true");
		setSessionUnlocked(true);
		setGuestMode(true);
		setAuthOpen(false);
	};
	const handleAuthClose = () => {
		if (typeof window !== "undefined") sessionStorage.setItem("ideaflow_session_unlocked", "true");
		setSessionUnlocked(true);
		setGuestMode(true);
		setAuthOpen(false);
	};
	const isBusiness = data.workspaceMode === "business";
	data.companyWorkspace;
	const validCompanies = companies && companies.length > 0 ? companies.filter((c) => c.id && c.id !== "company-acme-corp" && c.shareCode !== "ACME-2026") : data.companyWorkspace && data.companyWorkspace.id && data.companyWorkspace.id !== "company-acme-corp" && data.companyWorkspace.shareCode !== "ACME-2026" ? [data.companyWorkspace] : [];
	const navigation = [
		{
			to: "/",
			name: isBusiness ? "Iniciativas" : "Funil",
			icon: Layers
		},
		{
			to: "/hoje",
			name: "Hoje",
			icon: CalendarDays
		},
		{
			to: "/setores",
			name: isBusiness ? "Departamentos" : "Setores",
			icon: isBusiness ? Building2 : Grid2x2
		},
		{
			to: "/ajustes",
			name: "Ajustes",
			icon: SlidersHorizontal
		}
	];
	(0, import_react.useEffect)(() => {
		const hour = (/* @__PURE__ */ new Date()).getHours();
		setGreeting(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite");
		const sync = () => setOnline(navigator.onLine);
		sync();
		window.addEventListener("online", sync);
		window.addEventListener("offline", sync);
		const captureEvent = () => setCapture(true);
		window.addEventListener("ideaflow:capture", captureEvent);
		const mentorEvent = (e) => {
			setMentorIdea(e.detail?.idea ?? null);
			setAiChatOpen(true);
		};
		window.addEventListener("ideaflow:mentor", mentorEvent);
		const profileEvent = () => setProfileOpen(true);
		window.addEventListener("ideaflow:profile", profileEvent);
		const loginEvent = () => setAuthOpen(true);
		window.addEventListener("ideaflow:login", loginEvent);
		const tutorialEvent = () => setShowTutorial(true);
		window.addEventListener("ideaflow:tutorial", tutorialEvent);
		return () => {
			window.removeEventListener("online", sync);
			window.removeEventListener("offline", sync);
			window.removeEventListener("ideaflow:capture", captureEvent);
			window.removeEventListener("ideaflow:mentor", mentorEvent);
			window.removeEventListener("ideaflow:profile", profileEvent);
			window.removeEventListener("ideaflow:login", loginEvent);
			window.removeEventListener("ideaflow:tutorial", tutorialEvent);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user && sessionStorage.getItem("ideaflow_session_unlocked") !== "true") setAuthOpen(true);
	}, [user]);
	const dedicated = data.ideas.reduce((sum, i) => sum + i.dedicated, 0);
	const isAuthorized = Boolean(user || guestMode);
	const userInitial = (((user?.user_metadata)?.name || (user?.user_metadata)?.full_name || data.profile?.name || user?.email?.split("@")[0] || "Usuário").trim()[0] || "U").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-root",
		style: { "--sidebar-width": sidebarCollapsed ? "72px" : "260px" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `desktop-sidebar hidden md:flex flex-col fixed left-0 top-0 bottom-0 border-r border-border bg-card/90 backdrop-blur-2xl z-40 transition-all duration-300 ease-in-out select-none ${sidebarCollapsed ? "w-[72px] p-2.5 justify-between items-center" : "w-[260px] p-4 justify-between"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center ${sidebarCollapsed ? "flex-col gap-2 justify-center" : "justify-between px-2"} pt-1`,
							children: [!sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "wordmark active:scale-95 transition-transform",
								"aria-label": "Ideaflow início",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "brand-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, {})
									}),
									"idea",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "flow" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "brand-dot",
										children: "."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "brand-icon mx-auto mr-0",
								"aria-label": "Ideaflow início",
								title: "Ideaflow início",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { size: 18 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: toggleSidebar,
								className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer",
								title: sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral",
								"aria-label": sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral",
								children: sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCapture(true),
							"data-tour": "capture",
							className: `rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 text-white font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center cursor-pointer group ${sidebarCollapsed ? "w-11 h-11 mx-auto" : "w-full h-11 px-3 gap-2 text-sm"}`,
							title: "Nova Faísca (Capturar Ideia)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								size: 18,
								className: "stroke-[2.5] group-hover:rotate-90 transition-transform duration-200"
							}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nova Faísca" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
								size: 14,
								className: "opacity-80 ml-auto mr-1"
							})] })]
						}),
						!sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-1 rounded-xl bg-secondary/50 border border-border/80 flex items-center justify-between gap-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => requestSwitchWorkspace("personal"),
								className: `flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${(data.workspaceMode ?? "personal") === "personal" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
								title: "Ir para o Espaço Pessoal (exige PIN se estiver na Empresa)",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
									size: 13,
									className: (data.workspaceMode ?? "personal") === "personal" ? "text-primary" : ""
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pessoal" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => requestSwitchWorkspace("business"),
								className: `flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs relative ${data.workspaceMode === "business" ? "bg-violet-600 text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
								title: "Ir para o Workspace da Empresa",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 13 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Empresa" }),
									data.companyWorkspace?.isKeyUser && pendingRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold animate-pulse",
										title: `${pendingRequests.length} pedido(s) pendente(s)`,
										children: pendingRequests.length
									})
								]
							})]
						}), data.workspaceMode === "business" && validCompanies.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 px-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: data.companyWorkspace?.id ?? "",
								onChange: async (e) => {
									const targetId = e.target.value;
									if (targetId && targetId !== data.companyWorkspace?.id) await switchCompany(targetId);
								},
								"aria-label": "Selecionar organização ativa",
								className: "w-full bg-secondary/80 text-foreground border border-violet/40 rounded-lg text-[11px] font-semibold py-1.5 px-2 outline-none cursor-pointer hover:border-violet focus:ring-1 focus:ring-violet truncate",
								children: validCompanies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										"🏢 ",
										c.name,
										" ",
										c.isKeyUser ? "(Key User)" : ""
									]
								}, c.id))
							})
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => requestSwitchWorkspace(data.workspaceMode === "business" ? "personal" : "business"),
							className: `w-11 h-11 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${data.workspaceMode === "business" ? "bg-violet-600 text-white shadow-xs" : "bg-secondary/70 text-muted-foreground hover:text-foreground"}`,
							title: data.workspaceMode === "business" ? "Empresa (Clique para Pessoal)" : "Pessoal (Clique para Empresa)",
							children: [data.workspaceMode === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 18 }), data.companyWorkspace?.isKeyUser && pendingRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse",
								children: pendingRequests.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "space-y-1.5 w-full",
							"aria-label": "Navegação Lateral",
							children: navigation.map((item) => {
								const isActive = path === item.to;
								const tourId = item.to === "/" ? "funil" : item.to === "/hoje" ? "hoje" : item.to === "/setores" ? "setores" : "ajustes";
								const activeCount = item.to === "/" ? data.ideas.filter((i) => !i.archived).length : item.to === "/setores" ? data.sectors.length : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									"data-tour": tourId,
									title: item.name,
									className: `flex items-center rounded-xl font-semibold transition-all group ${sidebarCollapsed ? "w-11 h-11 mx-auto justify-center" : "gap-3 px-3.5 py-2.5 text-sm"} ${isActive ? `bg-primary/12 text-primary font-bold shadow-xs ${!sidebarCollapsed ? "border-l-2 border-primary" : ""}` : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
										size: 19,
										className: `transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`
									}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), activeCount !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground",
										children: activeCount
									})] })]
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setMentorIdea(null);
									setAiChatOpen(true);
								},
								"data-tour": "mentor",
								className: `rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-violet/10 hover:border-primary/50 text-left transition-all active:scale-[0.98] cursor-pointer group ${sidebarCollapsed ? "w-11 h-11 mx-auto flex items-center justify-center p-0" : "w-full p-3"}`,
								title: "Mentor IA Oficial",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-primary font-bold text-xs mb-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										size: 16,
										className: "animate-pulse"
									}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mentor IA Oficial" })]
								}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-tight",
									children: "Tire dúvidas, converse ou analise seus funis em tempo real."
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `w-full pt-4 border-t border-border/80 ${sidebarCollapsed ? "flex flex-col items-center gap-3" : "space-y-3"}`,
					children: [!sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
								size: 15,
								className: "text-amber"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Foco Total:" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "text-foreground font-mono",
							children: [(dedicated / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 }), "h"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						title: `Foco Total: ${(dedicated / 60).toFixed(1)}h`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
							size: 16,
							className: "text-amber"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-mono text-muted-foreground mt-0.5",
							children: [(dedicated / 60).toFixed(0), "h"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center ${sidebarCollapsed ? "flex-col gap-2" : "justify-between pt-1"}`,
						children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center flex-1 mr-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setProfileOpen(true),
								className: `flex items-center rounded-xl hover:bg-secondary/70 transition-colors text-left text-xs text-foreground cursor-pointer group ${sidebarCollapsed ? "p-1" : "gap-2.5 p-1.5 flex-1 min-w-0 truncate"}`,
								title: "Meu Perfil",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs ring-1 ring-border group-hover:ring-primary/50 transition-all select-none",
										children: userInitial
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green border-2 border-background" })]
								}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold truncate",
										children: user.user_metadata?.name || user.email?.split("@")[0]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground truncate",
										children: user.email
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: `rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer ${sidebarCollapsed ? "h-7 w-7 mt-1" : "h-8 w-8"}`,
								title: "Sair da conta e ver tela de entrada",
								onClick: async () => {
									await signOut();
									setAuthOpen(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: sidebarCollapsed ? 14 : 15 })
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAuthOpen(true),
							className: `flex items-center justify-center rounded-xl bg-secondary/80 hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer ${sidebarCollapsed ? "w-9 h-9 p-0" : "gap-2 px-3 py-2 flex-1 mr-2"}`,
							title: "Entrar ou Cadastrar",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {
								size: 15,
								className: "text-primary"
							}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground shrink-0 cursor-pointer",
							title: "Trocar tema",
							onClick: () => setData((p) => ({
								...p,
								theme: p.theme === "dark" ? "light" : "dark"
							})),
							children: data.theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 15 })
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "topbar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "topbar-inner",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: toggleSidebar,
								className: "hidden md:flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer mr-1",
								title: "Expandir menu lateral",
								"aria-label": "Expandir menu lateral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { size: 18 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "wordmark md:hidden active:scale-95 transition-transform",
								"aria-label": "Ideaflow início",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "brand-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, {})
									}),
									"idea",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "flow" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "brand-dot",
										children: "."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden lg:flex items-center gap-2 text-xs text-muted-foreground font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Painel de Realização" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center p-0.5 rounded-full bg-secondary/80 border border-border/80 text-xs shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => requestSwitchWorkspace("personal"),
									className: `px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${(data.workspaceMode ?? "personal") === "personal" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
									title: "Alternar para Espaço Pessoal (exige PIN de 4 dígitos)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
										size: 12,
										className: (data.workspaceMode ?? "personal") === "personal" ? "text-primary" : ""
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Pessoal"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => requestSwitchWorkspace("business"),
									className: `px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs relative ${data.workspaceMode === "business" ? "bg-violet-600 text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
									title: "Alternar para Espaço da Empresa",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 12 }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate max-w-[120px] hidden sm:inline",
											children: data.companyWorkspace?.name ? data.companyWorkspace.name.split(" ")[0] : "Empresa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm:hidden",
											children: "Empresa"
										}),
										data.companyWorkspace?.isKeyUser && pendingRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold animate-pulse",
											title: `${pendingRequests.length} solicitações de adesão`,
											children: pendingRequests.length
										})
									]
								})]
							}),
							data.workspaceMode === "business" && validCompanies.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: data.companyWorkspace?.id ?? "",
								onChange: async (e) => {
									const targetId = e.target.value;
									if (targetId && targetId !== data.companyWorkspace?.id) await switchCompany(targetId);
								},
								"aria-label": "Selecionar organização ativa",
								className: "bg-secondary/90 text-foreground border border-violet/40 rounded-full text-[11px] font-semibold py-1 px-2.5 outline-none cursor-pointer hover:border-violet focus:ring-1 focus:ring-violet shrink-0 max-w-[130px] sm:max-w-[160px] truncate",
								children: validCompanies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: ["🏢 ", c.name]
								}, c.id))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "header-right flex items-center gap-1.5 sm:gap-2.5 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								"data-tour": "mentor",
								className: "h-8 sm:h-9 text-xs sm:text-sm gap-1.5 border-primary/50 bg-gradient-to-r from-primary/20 via-primary/10 to-violet/20 text-primary hover:bg-primary/25 active:scale-95 transition-all shadow-xs hover:shadow-primary/25 px-2.5 sm:px-3.5 rounded-full font-semibold shrink-0 cursor-pointer relative overflow-hidden group",
								onClick: () => {
									setMentorIdea(null);
									setAiChatOpen(true);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										size: 13,
										className: "text-primary animate-pulse"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mentor IA" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "header-streak hidden md:flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
									size: 15,
									className: "text-amber"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground font-medium",
									children: [(dedicated / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 }), "h"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground active:scale-95 shrink-0 cursor-pointer",
								"aria-label": data.theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro",
								title: "Trocar tema",
								onClick: () => setData((p) => ({
									...p,
									theme: p.theme === "dark" ? "light" : "dark"
								})),
								children: data.theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 15 })
							}),
							!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 sm:h-9 text-xs sm:text-sm gap-1.5 border-primary/40 bg-card hover:bg-primary/10 text-foreground active:scale-95 transition-all px-2.5 sm:px-3.5 rounded-full font-semibold shadow-xs shrink-0 cursor-pointer",
								onClick: () => setAuthOpen(true),
								title: "Entrar ou criar conta gratuita para sincronizar ideias",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {
									size: 13,
									className: "text-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-8 sm:h-9 px-2 rounded-full text-xs gap-1.5 text-muted-foreground hover:text-foreground active:scale-95 shrink-0 cursor-pointer",
								onClick: () => syncWithCloud(),
								disabled: isSyncing,
								title: "Sincronizar ideias com Supabase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
									size: 12,
									className: isSyncing ? "animate-spin text-primary" : "text-green"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono hidden md:inline",
									children: user.email?.split("@")[0]
								})]
							}),
							user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setProfileOpen(true),
								className: "avatar-trigger relative rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none ml-0.5 shrink-0",
								title: "Abrir Meu Perfil",
								"aria-label": "Perfil do Usuário",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary via-primary/85 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs ring-1 ring-primary/40 hover:ring-2 hover:ring-primary/80 transition-all select-none",
									children: userInitial
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green border-2 border-background shadow-xs shadow-green animate-pulse" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAuthOpen(true),
								className: "avatar-trigger relative rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none ml-0.5 shrink-0 hidden sm:block",
								title: "Fazer Login / Cadastrar",
								"aria-label": "Perfil do Usuário",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary/70 to-secondary text-foreground font-bold flex items-center justify-center text-sm border border-border/80 hover:ring-2 hover:ring-primary/60 transition-all select-none",
									children: userInitial
								})
							}),
							user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 sm:h-9 text-xs gap-1.5 border-destructive/35 text-destructive hover:bg-destructive/10 active:scale-95 transition-all px-2.5 sm:px-3 rounded-full font-semibold shadow-xs shrink-0 cursor-pointer ml-1",
								onClick: async () => {
									await signOut();
									setAuthOpen(true);
								},
								title: "Sair da conta e ver tela de entrada",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Sair"
								})]
							})
						]
					})]
				})
			}),
			isAuthorized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "main-content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "greeting-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "greeting",
						children: [greeting, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "greeting-spark",
							children: "✦"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "local-status",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }), online ? "Seu espaço, seu ritmo" : "Você está offline"]
					})]
				}), children]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "desktop-bottom-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }), "Suas ideias e dados ficam neste dispositivo"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["MENOS RUÍDO. MAIS REALIZAÇÃO.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 12 })] })]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-30 bg-slate-100 dark:bg-[#07090E]" }),
			isAuthorized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "bottom-nav md:hidden",
				"aria-label": "Navegação principal",
				children: [navigation.map((item, i) => {
					const tourId = item.to === "/" ? "funil" : item.to === "/hoje" ? "hoje" : item.to === "/setores" ? "setores" : "ajustes";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `nav-slot slot-${i}`,
						"data-tour": tourId,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: `nav-item ${path === item.to ? "active" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name })]
							})
						})
					}, item.to);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "capture-fab",
					"aria-label": "Capturar ideia",
					title: "Capturar ideia",
					"data-tour": "capture",
					onClick: () => setCapture(true),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureSheet, {
				open: capture,
				onClose: () => setCapture(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiChatSheet, {
				open: aiChatOpen,
				onClose: () => setAiChatOpen(false),
				initialIdea: mentorIdea
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSidebar, {
				open: profileOpen,
				onClose: () => setProfileOpen(false),
				onOpenIdea: (id) => setProfileIdeaId(id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {
				open: authOpen,
				onClose: handleAuthClose,
				onSuccess: handleAuthSuccess
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingTutorial, {
				open: showTutorial,
				isBusiness,
				onClose: () => {
					setShowTutorial(false);
					localStorage.setItem("ideaflow_tutorial_completed", "true");
				}
			}),
			profileIdeaId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaDetail, {
				ideaId: profileIdeaId,
				onClose: () => setProfileIdeaId(null),
				onFocus: () => setProfileIdeaId(null)
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error("Root error caught:", error);
	const router = useRouter();
	const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Ops! Algo deu errado ao carregar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Ocorreu um imprevisto ao carregar a página."
				}),
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-left overflow-auto max-h-36 text-xs font-mono text-destructive",
					children: errorMessage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								router.invalidate();
								reset();
							},
							className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
							children: "Tentar novamente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								if (typeof window !== "undefined") {
									localStorage.removeItem("ideaflow-v1");
									window.location.href = "/";
								}
							},
							className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
							children: "Restaurar dados iniciais"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
							children: "Página inicial"
						})
					]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
			},
			{ title: "Ideaflow — Gestão de Ideias & Realização" },
			{
				name: "description",
				content: "Dê espaço às suas ideias. Organize seus projetos e transforme intenção em realização com o Ideaflow."
			},
			{
				property: "og:title",
				content: "Ideaflow — Gestão de Ideias & Realização"
			},
			{
				property: "og:description",
				content: "Suas ideias em movimento. Capture, organize e realize no seu ritmo."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#070B1E"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "format-detection",
				content: "telephone=no"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/icons/icon-192.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/icons/icon-192.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FlowProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-center"
		})] })
	});
}
var $$splitComponentImporter$3 = () => import("./routes-Bs2Zk3cR.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Seu funil de ideias · Ideaflow" },
		{
			name: "description",
			content: "Da primeira faísca à realidade: organize suas ideias em cinco etapas e encontre seu próximo passo."
		},
		{
			property: "og:title",
			content: "Seu funil de ideias · Ideaflow"
		},
		{
			property: "og:description",
			content: "Transforme suas ideias em realização, um pequeno passo de cada vez."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./ajustes-C290XOEo.mjs");
var Route$2 = createFileRoute("/ajustes")({
	head: () => ({ meta: [
		{ title: "Ajustes & Backup · Ideaflow" },
		{
			name: "description",
			content: "Personalize as cores do seu espaço, sincronização e proteja suas ideias com backup."
		},
		{
			property: "og:title",
			content: "Ajustes & Backup · Ideaflow"
		},
		{
			property: "og:description",
			content: "Seu espaço do seu jeito. Suas ideias sempre com você."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./hoje-DjQQ5LJF.mjs");
var Route$1 = createFileRoute("/hoje")({
	head: () => ({ meta: [
		{ title: "Meu dia & Calendário · Ideaflow" },
		{
			name: "description",
			content: "Planeje sua rotina por blocos ou pelo calendário interativo e execute o que importa."
		},
		{
			property: "og:title",
			content: "Meu dia & Calendário · Ideaflow"
		},
		{
			property: "og:description",
			content: "Uma rotina com intenção, espaço e foco."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./setores-D7wsIA45.mjs");
var Route = createFileRoute("/setores")({
	head: () => ({ meta: [
		{ title: "Setores & Desempenho · Ideaflow" },
		{
			name: "description",
			content: "Dashboard comparativo dos seus setores e visão detalhada de cada área."
		},
		{
			property: "og:title",
			content: "Setores & Desempenho · Ideaflow"
		},
		{
			property: "og:description",
			content: "Descubra qual área da sua vida está avançando e onde vale a pena colocar mais foco."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	AjustesRoute: Route$2.update({
		id: "/ajustes",
		path: "/ajustes",
		getParentRoute: () => Route$4
	}),
	HojeRoute: Route$1.update({
		id: "/hoje",
		path: "/hoje",
		getParentRoute: () => Route$4
	}),
	SetoresRoute: Route.update({
		id: "/setores",
		path: "/setores",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
