import { i as __toESM } from "../_runtime.mjs";
import { c as formatMinutes, i as createGoogleCalendarUrl, v as localDate } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { Bt as CalendarCheck, Lt as CalendarRange, M as Play, Mt as ChevronLeft, _ as Sparkles, h as Sun, j as Plus, jt as ChevronRight, m as Sunset, n as X, pt as ExternalLink, z as Moon, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFlow, t as Button } from "./ai-assistant-3aCui_AD.mjs";
import { a as IdeaDetail } from "./idea-detail-De8DGVyi.mjs";
import { t as FocusTimer } from "./focus-timer-BQa0LN4H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hoje-DjQQ5LJF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blocks = [
	{
		name: "Manhã",
		icon: Sun,
		tone: "amber"
	},
	{
		name: "Tarde",
		icon: Sunset,
		tone: "pink"
	},
	{
		name: "Noite",
		icon: Moon,
		tone: "cyan"
	}
];
function Today() {
	const { data, updateIdea } = useFlow();
	const [viewMode, setViewMode] = (0, import_react.useState)("blocks");
	const [date, setDate] = (0, import_react.useState)("");
	const [dateText, setDateText] = (0, import_react.useState)("Hoje é um bom dia para começar.");
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [calendarMonth, setCalendarMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth());
	const [calendarYear, setCalendarYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	(0, import_react.useEffect)(() => {
		const todayStr = localDate();
		setDate(todayStr);
		setDateText((/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
			weekday: "long",
			day: "numeric",
			month: "long"
		}));
	}, []);
	const isBusiness = data.workspaceMode === "business";
	const workspaceIdeas = data.ideas.filter((i) => isBusiness ? i.workspace === "business" : i.workspace !== "business");
	const scheduled = date ? workspaceIdeas.filter((i) => !i.archived && i.day === date) : [];
	const ready = workspaceIdeas.filter((i) => !i.archived && i.stage > 0 && i.stage < 4 && i.day !== date);
	const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
	const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
	const monthName = new Date(calendarYear, calendarMonth, 1).toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric"
	});
	const handlePrevMonth = () => {
		if (calendarMonth === 0) {
			setCalendarMonth(11);
			setCalendarYear((y) => y - 1);
		} else setCalendarMonth((m) => m - 1);
	};
	const handleNextMonth = () => {
		if (calendarMonth === 11) {
			setCalendarMonth(0);
			setCalendarYear((y) => y + 1);
		} else setCalendarMonth((m) => m + 1);
	};
	const handleReschedulePending = () => {
		const todayStr = localDate();
		const overdue = data.ideas.filter((i) => !i.archived && i.day && i.day < todayStr && i.stage < 4);
		if (overdue.length === 0) {
			toast.info("Nenhuma ideia pendente de dias anteriores.");
			return;
		}
		overdue.forEach((i) => {
			updateIdea(i.id, { day: todayStr });
		});
		toast.success(`${overdue.length} ideia(s) reagendada(s) para hoje!`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-heading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Meu dia, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "com intenção." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "page-subtitle capitalize",
				children: dateText
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "segmented p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: `h-8 text-xs gap-1.5 ${viewMode === "blocks" ? "selected" : ""}`,
						onClick: () => setViewMode("blocks"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 13 }), "Blocos do Dia"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: `h-8 text-xs gap-1.5 ${viewMode === "calendar" ? "selected" : ""}`,
						onClick: () => setViewMode("calendar"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { size: 13 }), "Calendário Mensal"]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "day-metrics",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-primary",
					children: formatMinutes(scheduled.reduce((n, i) => n + i.minutes, 0))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Tempo planejado (",
					date === localDate() ? "Hoje" : date,
					")"
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-green",
					children: formatMinutes(scheduled.reduce((n, i) => n + i.dedicated, 0))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tempo dedicado às ideias" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: scheduled.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ideias programadas" })] })
			]
		}),
		viewMode === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "p-5 rounded-xl border border-border bg-card space-y-4 mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
							className: "text-primary",
							size: 20
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-medium text-lg capitalize",
							children: monthName
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 text-xs",
								onClick: () => {
									const now = /* @__PURE__ */ new Date();
									setCalendarMonth(now.getMonth());
									setCalendarYear(now.getFullYear());
									setDate(localDate());
								},
								children: "Mês Atual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								onClick: handlePrevMonth,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								onClick: handleNextMonth,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-7 gap-1 text-center font-mono text-xs text-muted-foreground pb-1 border-b border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dom" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Seg" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ter" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Qua" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Qui" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sáb" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-7 gap-1.5",
					children: [Array.from({ length: firstDayOfMonth }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 rounded-md bg-secondary/15 opacity-30" }, `empty-${i}`)), Array.from({ length: daysInMonth }, (_, i) => {
						const dayNum = i + 1;
						const formattedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
						const isSelected = date === formattedDate;
						const isToday = formattedDate === localDate();
						const dayIdeas = data.ideas.filter((idea) => !idea.archived && idea.day === formattedDate);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setDate(formattedDate),
							className: `h-16 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all ${isSelected ? "border-primary bg-primary/10 shadow-sm" : isToday ? "border-primary/50 bg-secondary/40" : "border-border/60 bg-card hover:border-border hover:bg-secondary/30"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-mono font-medium ${isToday ? "text-primary font-bold" : isSelected ? "text-primary" : "text-foreground"}`,
									children: dayNum
								}), isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-primary font-semibold",
									children: "Hoje"
								})]
							}), dayIdeas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-mono px-1 rounded bg-primary/20 text-primary font-semibold",
									children: [
										dayIdeas.length,
										" ",
										dayIdeas.length === 1 ? "ideia" : "ideias"
									]
								})
							})]
						}, formattedDate);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								size: 14,
								className: "text-primary"
							}),
							"Dia selecionado no calendário:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: date || "Nenhum"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground",
						onClick: handleReschedulePending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { size: 13 }), "Reagendar pendentes do passado para hoje"]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "day-blocks",
			children: blocks.map((block) => {
				const blockIdeas = scheduled.filter((i) => i.block === block.name);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `day-block-heading tone-${block.tone}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(block.icon, {
								className: `text-${block.tone}`,
								size: 20
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: block.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: formatMinutes(blockIdeas.reduce((n, i) => n + i.minutes, 0)) })
						]
					}),
					blockIdeas.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "scheduled-item",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "h-auto p-0 whitespace-normal text-left",
								onClick: () => setDetail(i.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: i.title })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									formatMinutes(i.minutes),
									" planejados · ",
									formatMinutes(i.dedicated),
									" dedicados"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "schedule-controls",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										"aria-label": `Horário: ${i.title}`,
										value: i.block,
										onChange: (e) => updateIdea(i.id, { block: e.target.value }),
										children: blocks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: b.name }, b.name))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "text-primary",
										"aria-label": `Focar em ${i.title}`,
										title: "Começar sessão de foco",
										onClick: () => setFocus(i),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "text-muted-foreground hover:text-primary",
										title: "Abrir no Google Agenda",
										onClick: () => window.open(createGoogleCalendarUrl(i), "_blank"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 14 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "ml-auto",
										"aria-label": `Remover do dia: ${i.title}`,
										title: "Remover deste dia",
										onClick: () => updateIdea(i.id, {
											day: void 0,
											block: void 0
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
									})
								]
							})
						]
					}, i.id)),
					!blockIdeas.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "day-empty",
						children: "Espaço livre para o que importa."
					})
				] }, block.name);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "ready-ideas",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "section-heading",
						children: "Ideias prontas no funil"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [ready.length, " ideias aguardando execução"]
					})]
				}),
				ready.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ready-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: i.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						data.sectors.find((s) => s.id === i.sector)?.name,
						" · ",
						formatMinutes(i.minutes)
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							disabled: !date,
							onClick: () => {
								updateIdea(i.id, {
									day: date,
									block: "Manhã"
								});
								toast.success(`Ideia agendada para ${date === localDate() ? "hoje" : date}!`);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 13 }),
								"Agendar para ",
								date === localDate() ? "hoje" : date
							]
						})
					})]
				}, i.id)),
				!ready.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "day-empty",
					children: "Tudo no lugar. Suas ideias já têm espaço hoje."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusTimer, {
			idea: focus,
			onClose: () => setFocus(null)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaDetail, {
			ideaId: detail,
			onClose: () => setDetail(null),
			onFocus: setFocus
		})
	] });
}
//#endregion
export { Today as component };
