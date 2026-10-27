import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { F as Pause, M as Play, a as Volume2, et as Headphones, i as VolumeX, k as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFlow, t as Button } from "./ai-assistant-3aCui_AD.mjs";
import { i as DrawerTitle, n as DrawerContent, r as DrawerDescription, t as Drawer$1 } from "./idea-detail-De8DGVyi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/focus-timer-BQa0LN4H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FocusTimer({ idea, onClose }) {
	const { setData } = useFlow();
	const [mode, setMode] = (0, import_react.useState)("focus");
	const [seconds, setSeconds] = (0, import_react.useState)(1500);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [sound, setSound] = (0, import_react.useState)(true);
	const end = (0, import_react.useRef)(0);
	const audio = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (idea) {
			setSeconds(1500);
			setMode("focus");
			setRunning(false);
		}
	}, [idea?.id]);
	(0, import_react.useEffect)(() => {
		if (!running || !idea) return;
		const timer = window.setInterval(() => {
			const remaining = Math.max(0, Math.ceil((end.current - Date.now()) / 1e3));
			setSeconds(remaining);
			if (remaining === 0) {
				setRunning(false);
				if (mode === "focus") setData((p) => ({
					...p,
					ideas: p.ideas.map((i) => i.id === idea.id ? {
						...i,
						dedicated: i.dedicated + 25
					} : i)
				}));
				if (sound && audio.current) {
					const context = audio.current;
					[
						523.25,
						659.25,
						783.99
					].forEach((freq, i) => {
						const oscillator = context.createOscillator();
						const gain = context.createGain();
						oscillator.type = "sine";
						oscillator.frequency.value = freq;
						oscillator.connect(gain);
						gain.connect(context.destination);
						const start = context.currentTime + i * .25;
						gain.gain.setValueAtTime(0, start);
						gain.gain.linearRampToValueAtTime(.12, start + .05);
						gain.gain.exponentialRampToValueAtTime(.001, start + 1);
						oscillator.start(start);
						oscillator.stop(start + 1);
					});
				}
				toast.success(mode === "focus" ? "Foco concluído! 25 minutos adicionados à sua ideia." : "Pausa concluída. Vamos para o próximo passo?");
			}
		}, 250);
		return () => clearInterval(timer);
	}, [
		running,
		idea,
		mode,
		sound,
		setData
	]);
	const toggle = () => {
		if (!running && seconds > 0) {
			end.current = Date.now() + seconds * 1e3;
			if (sound) try {
				audio.current ??= new AudioContext();
				audio.current.resume();
			} catch {}
		}
		setRunning((r) => seconds > 0 ? !r : false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open: !!idea,
		onOpenChange: (open) => {
			if (!open && (!running || window.confirm("Encerrar esta sessão de foco?"))) {
				setRunning(false);
				onClose();
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet-body focus-sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sheet-eyebrow justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { size: 16 }), "SEU MOMENTO DE FOCO"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
					className: "text-center text-xl mt-3",
					children: idea?.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
					className: "text-center mt-2",
					children: "Uma coisa de cada vez. Você está avançando."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "segmented mt-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: mode === "focus" ? "selected" : "",
						onClick: () => {
							setMode("focus");
							setRunning(false);
							setSeconds(1500);
						},
						children: "Foco · 25 min"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: mode === "break" ? "selected" : "",
						onClick: () => {
							setMode("break");
							setRunning(false);
							setSeconds(300);
						},
						children: "Pausa · 5 min"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "timer-ring",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 240 240",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							className: "timer-track",
							cx: "120",
							cy: "120",
							r: "108"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							className: "timer-progress",
							cx: "120",
							cy: "120",
							r: "108",
							pathLength: "100",
							strokeDasharray: `${seconds / (mode === "focus" ? 1500 : 300) * 100} 100`
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						String(Math.floor(seconds / 60)).padStart(2, "0"),
						":",
						String(seconds % 60).padStart(2, "0")
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: running ? "EM HIPERFOCO" : seconds === 0 ? "CONCLUÍDO" : "RESPIRA. E COMEÇA." })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Reiniciar timer",
							onClick: () => {
								setRunning(false);
								setSeconds(mode === "focus" ? 1500 : 300);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "primary-action px-10",
							onClick: toggle,
							children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), running ? "Pausar" : "Iniciar foco"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": sound ? "Desativar som" : "Ativar som",
							onClick: () => setSound((s) => !s),
							children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {})
						})
					]
				})
			]
		}) })
	});
}
//#endregion
export { FocusTimer as t };
