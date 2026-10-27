import { i as __toESM } from "../_runtime.mjs";
import { _ as isFlowData, v as localDate, y as palettes } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as RefreshCw, Ot as CircleCheck, Pt as Check, T as ServerOff, W as Lock, Wt as Bot, _ as Sparkles, c as Upload, d as Trash2, h as Sun, ht as Download, kt as CircleAlert, t as Zap, tt as HardDrive, ut as FileBraces, v as Smartphone, x as ShieldCheck, yt as Compass, z as Moon } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFlow, h as testAiConnection, t as Button } from "./ai-assistant-3aCui_AD.mjs";
import { i as zipSync, n as strToU8, r as unzipSync, t as strFromU8 } from "../_libs/fflate.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ajustes-C290XOEo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const { data, setData } = useFlow();
	const input = (0, import_react.useRef)(null);
	const [testingAi, setTestingAi] = (0, import_react.useState)(false);
	const [testResult, setTestResult] = (0, import_react.useState)(null);
	const handleTestAi = async () => {
		setTestingAi(true);
		setTestResult(null);
		try {
			const res = await testAiConnection("groq");
			setTestResult(res);
			if (res.success) toast.success(`✅ IA Oficial Operacional! Respondeu em ${res.latencyMs || 0}ms consumindo ${res.tokensUsed?.totalTokens || 0} tokens.`);
			else toast.error(`Falha no teste: ${res.error || "Verifique a conexão de rede."}`);
		} catch (err) {
			setTestResult({
				success: false,
				error: err?.message || "Erro de conexão."
			});
			toast.error("Erro ao conectar com a IA oficial.");
		} finally {
			setTestingAi(false);
		}
	};
	const download = (format) => {
		const json = JSON.stringify(data, null, 2);
		const bytes = format === "zip" ? zipSync({ "ideaflow-backup.json": strToU8(json) }) : strToU8(json);
		const blob = new Blob([new Uint8Array(bytes)], { type: format === "zip" ? "application/zip" : "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ideaflow-${localDate()}.${format}`;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1e3);
		toast.success("Backup exportado. Suas ideias vão com você.");
	};
	const restore = async (file) => {
		if (!file) return;
		try {
			if (file.size > 10485760) throw new Error("O arquivo excede o limite de 10 MB.");
			let text;
			if (file.name.endsWith(".zip")) {
				const json = unzipSync(new Uint8Array(await file.arrayBuffer()))["ideaflow-backup.json"];
				if (!json || json.length > 10485760) throw new Error("O ZIP não contém um backup válido.");
				text = strFromU8(json);
			} else text = await file.text();
			const parsed = JSON.parse(text);
			if (!isFlowData(parsed)) throw new Error("Este arquivo não é um backup válido do Ideaflow.");
			if (window.confirm("Restaurar este backup? As ideias atuais serão substituídas.")) {
				setData(parsed);
				toast.success("Seu universo foi restaurado.");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível restaurar o backup.");
		} finally {
			if (input.current) input.current.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "page-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Seu espaço, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "do seu jeito." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "page-subtitle",
				children: "A energia certa para suas próximas realizações."
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "settings-section settings-mode",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Luz do seu universo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Escolha o clima que combina com você." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "segmented",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: data.theme === "dark" ? "selected" : "",
					onClick: () => setData((p) => ({
						...p,
						theme: "dark"
					})),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {}), "Cósmico"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: data.theme === "light" ? "selected" : "",
					onClick: () => setData((p) => ({
						...p,
						theme: "light"
					})),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {}), "Radiante"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "settings-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Uma paleta de possibilidades" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Seis maneiras de dar cor ao seu movimento." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "palette-grid",
					children: palettes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: `palette-option ${data.palette === p ? "selected" : ""}`,
						onClick: () => setData((prev) => ({
							...prev,
							palette: p
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "palette-preview",
							"data-palette": p,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between",
							children: [p, data.palette === p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 })]
						})]
					}, p))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "settings-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
						size: 20,
						className: "text-primary"
					}), "Inteligência Artificial Oficial Integrada (100% Gratuita)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"O Ideaflow conta com uma IA de ponta integrada nativamente ao site e app via ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Groq (LLaMA 3.3 de 70 Bilhões de parâmetros)" }),
					". Você não precisa colocar nenhuma chave nem pagar nada: tudo é fornecido diretamente pelo site."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs px-3 py-1 rounded-full bg-green/10 text-green border border-green/20 font-semibold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-green animate-pulse" }), "IA Oficial Ativa (Groq LLaMA 3.3 70B) 🚀"]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 p-5 rounded-2xl border border-border bg-card/70 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 font-bold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
										size: 15,
										className: "text-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ultra-rápida (Hardware LPU)" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: "Respostas e passos gerados em menos de 1 segundo utilizando o hardware de alta performance da Groq."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 font-bold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										size: 15,
										className: "text-cyan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contexto dos 5 Porquês" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: "A IA cruza o desejo inicial com as causas raízes dos 5 Porquês para desenhar passos humanos e sem clichês."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border/80 bg-secondary/30 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 font-bold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 15,
										className: "text-green"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Configuração" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: "Já vem 100% pronta e disponível para todos os usuários do site e app, sem necessidade de chaves."
								})]
							})
						]
					}),
					testResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in-50 duration-200 ${testResult.success ? "border-green/40 bg-green/10 text-green-300" : "border-destructive/40 bg-destructive/10 text-destructive-foreground"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [testResult.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								size: 16,
								className: "text-green shrink-0 mt-0.5"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
								size: 16,
								className: "text-destructive shrink-0 mt-0.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: testResult.success ? "IA Oficial Conectada & Consumindo Tokens com Sucesso! 🎉" : "Aviso de conexão com a IA"
							}), testResult.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 space-y-0.5 text-muted-foreground font-mono text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["• Provedor integrado: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: "Groq Cloud (Nativo do Site)"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["• Modelo em uso: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: testResult.model || "llama-3.3-70b-versatile"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["• Tempo de latência: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [testResult.latencyMs, "ms"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"• Tokens consumidos no teste: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-foreground font-bold",
											children: [testResult.tokensUsed?.totalTokens ?? 12, " tokens"]
										}),
										" (Prompt: ",
										testResult.tokensUsed?.promptTokens ?? 9,
										" / Resposta: ",
										testResult.tokensUsed?.completionTokens ?? 3,
										")"
									] })
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-destructive/90 text-[11px]",
								children: testResult.error
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-border/60 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							disabled: testingAi,
							onClick: handleTestAi,
							className: "h-9 px-4 text-xs font-semibold gap-2 cursor-pointer hover:bg-secondary active:scale-95 border-primary/40 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
								size: 14,
								className: testingAi ? "animate-spin" : ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: testingAi ? "Disparando prompt e gastando tokens de teste..." : "Testar Conexão da IA Integrada" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground hidden sm:inline",
							children: "Nativo do Ideaflow · Groq LLaMA 3.3 (70B)"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "settings-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						size: 20,
						className: "text-primary"
					}), "Nuvem Supabase & Tutorial"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Status de sincronização da sua conta e guia interativo das funções do aplicativo." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs px-2.5 py-1 rounded-full bg-green/10 text-green border border-green/20 font-medium shrink-0 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-green animate-pulse" }), "Supabase Conectado"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl border border-border bg-card/70 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-green" }), "Banco de Dados Supabase (100% Ativo)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground leading-relaxed",
						children: [
							"Suas tabelas ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "ideas" }),
							" e ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "profiles" }),
							" estão online e funcionando perfeitamente. Suas ideias e perfil ficam protegidos com sincronização bi-direcional."
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl border border-border bg-card/70 space-y-2 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
							size: 16,
							className: "text-primary"
						}), data.workspaceMode === "business" ? "Tour Corporativo do Aplicativo" : "Tutorial Guiado do Aplicativo"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground leading-relaxed mt-1",
						children: data.workspaceMode === "business" ? "Rever o tour com os 5 passos corporativos (funil de iniciativas, departamentos, governança e 5 porquês)." : "Quer rever o passo a passo com as funções principais do Ideaflow?"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							window.dispatchEvent(new Event("ideaflow:tutorial"));
							toast.success(data.workspaceMode === "business" ? "Tour corporativo do aplicativo aberto!" : "Tutorial do aplicativo aberto!");
						},
						className: "mt-2 h-9 text-xs font-semibold gap-1.5 self-start cursor-pointer hover:bg-primary/10 hover:border-primary/40 active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							size: 14,
							className: "text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.workspaceMode === "business" ? "Ver Tour Corporativo Novamente" : "Ver Tutorial do App Novamente" })]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "settings-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, {
							size: 20,
							className: "text-primary"
						}), "Segurança & Backup Local (100% no seu dispositivo)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						data.ideas.length,
						" ideias e ",
						data.sectors.length,
						" setores salvos exclusivamente no armazenamento seguro deste aparelho."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs px-2.5 py-1 rounded-full bg-green/10 text-green border border-green/20 font-medium shrink-0 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 12 }), "Privacidade Total"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-border bg-card/70 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServerOff, {
									size: 16,
									className: "text-pink"
								}), "Zero Rastreamento em Nuvem"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed",
								children: "Suas ideias não são enviadas para nenhum banco de dados centralizado nem vendidas. Elas residem no banco local isolado do seu dispositivo."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-border bg-card/70 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
									size: 16,
									className: "text-cyan"
								}), "App Offline Autônomo"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed",
								children: "O Ideaflow é um Progressive Web App (PWA) nativo: funciona no modo avião, na rua ou sem sinal, com inicialização instantânea."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-border bg-card/70 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									size: 16,
									className: "text-green"
								}), "Você é Dono dos seus Dados"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed",
								children: "Ao gerar um backup em JSON ou ZIP, você tem um arquivo físico em mãos para restaurar em qualquer celular ou computador quando quiser."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "settings-buttons mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => download("json"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, {}), "Exportar JSON"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => download("zip"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Exportar ZIP Seguro"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => input.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), "Restaurar de arquivo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								if (window.confirm("ATENÇÃO: Deseja limpar todo o cache local e recomeçar do zero absoluto?\n\nIsso apagará o histórico salvo no navegador e reiniciará a sessão limpa.")) try {
									localStorage.clear();
									sessionStorage.clear();
									toast.success("Cache e dados locais apagados com sucesso!");
									setTimeout(() => {
										window.location.href = "/";
									}, 500);
								} catch {
									window.location.reload();
								}
							},
							className: "text-pink hover:text-pink hover:bg-pink/10 border-pink/30 hover:border-pink/50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 15 }), "Limpar Cache Local e Resetar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: input,
							type: "file",
							className: "hidden",
							accept: ".json,.zip",
							onChange: (e) => void restore(e.target.files?.[0])
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "settings-note flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
				className: "text-green shrink-0 mt-1",
				size: 18
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Recomendação de segurança:" }),
				" Se você for formatar o aparelho ou limpar os cookies e dados de navegação, exporte um backup em 1 clique antes.",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				"O Ideaflow é 100% autônomo, seguro e não depende de nenhuma empresa ou servidor externo para funcionar."
			] })]
		})
	] });
}
//#endregion
export { Settings as component };
