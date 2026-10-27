import { c as formatMinutes, h as getSubIdeas, p as getParentIdea } from "./ideaflow-CpldvHc4.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { M as Play, Pt as Check, Tt as Circle, Zt as Archive, _t as CornerDownRight, mt as Ellipsis, ot as FolderTree, qt as ArrowUpRight, s as User, t as Zap, wt as Clock3 } from "../_libs/lucide-react.mjs";
import { _ as useFlow, t as Button } from "./ai-assistant-3aCui_AD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/idea-card-DWCdOy6O.js
var import_jsx_runtime = require_jsx_runtime();
function IdeaCard({ idea, onOpen, onFocus }) {
	const { data } = useFlow();
	const sector = data.workspaceMode === "business" ? data.companyWorkspace?.sectors.find((s) => s.id === idea.sector) ?? data.sectors.find((s) => s.id === idea.sector) : data.sectors.find((s) => s.id === idea.sector) ?? data.companyWorkspace?.sectors.find((s) => s.id === idea.sector);
	const completed = idea.steps.filter((s) => s.done).length;
	const percent = idea.steps.length ? Math.round(completed / idea.steps.length * 100) : 0;
	const subIdeas = getSubIdeas(data.ideas, idea.id, false);
	const parent = getParentIdea(data.ideas, idea);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `idea-card tone-${sector?.tone ?? "cyan"} ${idea.stage === 4 ? "realized" : ""} animate-in fade-in-50 duration-300 slide-in-from-bottom-1`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "sector-tag transition-all duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
								size: 7,
								fill: "currentColor"
							}), sector?.name ?? idea.department ?? "Sem setor"]
						}),
						idea.assignedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium",
							title: `Responsável: ${idea.assignedTo}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 10 }), idea.assignedTo.split(" ")[0]]
						}),
						idea.isProject && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { size: 11 }), subIdeas.length > 0 ? `${subIdeas.length} módulos` : "Projeto Macro"]
						}),
						parent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] bg-secondary/80 text-muted-foreground border border-border/80 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium",
							title: `Módulo do projeto: ${parent.title}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownRight, {
								size: 10,
								className: "text-primary"
							}), "Módulo"]
						}),
						idea.archived && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] bg-amber/20 text-amber border border-amber/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { size: 10 }), "Arquivada"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "card-menu shrink-0 cursor-pointer",
					"aria-label": `Detalhes: ${idea.title}`,
					onClick: () => onOpen(idea),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => onOpen(idea),
				className: "card-title group cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "group-hover:text-primary transition-colors",
					children: idea.title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "card-summary",
				children: idea.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
						size: 13,
						className: "text-primary/70"
					}), formatMinutes(idea.minutes)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `priority px-2 py-0.5 rounded-full text-[10.5px] font-semibold flex items-center gap-1 ${idea.priority === "Urgente" ? "text-pink bg-pink/10 border border-pink/25 shadow-xs" : idea.priority === "Importante" ? "text-amber bg-amber/10 border border-amber/25 shadow-xs" : "text-muted-foreground bg-secondary/60 border border-border/60"}`,
					children: [idea.priority === "Normal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
						size: 6,
						fill: "currentColor"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
						size: 11,
						className: idea.priority === "Urgente" ? "animate-pulse" : ""
					}), idea.priority]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-progress",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: idea.stage === 4 ? "Você fez acontecer" : idea.isProject && subIdeas.length > 0 ? "Módulos concluídos" : "Pequenos passos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: idea.isProject && subIdeas.length > 0 ? `${subIdeas.filter((s) => s.stage === 4).length}/${subIdeas.length}` : `${completed}/${idea.steps.length}` })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", {
					value: idea.isProject && subIdeas.length > 0 ? Math.round(subIdeas.filter((s) => s.stage === 4).length / subIdeas.length * 100) : percent,
					max: 100,
					"aria-label": `${percent}% concluído`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-footer",
				children: [idea.stage === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-green flex items-center gap-1.5 font-semibold text-xs py-1 px-2 rounded-full bg-green/10 border border-green/25 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						size: 14,
						className: "stroke-[2.5]"
					}), "Realizado"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "focus-button hover:bg-primary/10 rounded-lg px-2 cursor-pointer transition-all active:scale-95",
					onClick: () => onFocus(idea),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						size: 12,
						fill: "currentColor",
						className: "text-primary"
					}), "Começar foco"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": `Abrir ${idea.title}`,
					className: "arrow-button cursor-pointer",
					onClick: () => onOpen(idea),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})
				})]
			})
		]
	});
}
//#endregion
export { IdeaCard as t };
