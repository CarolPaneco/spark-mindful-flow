import { i as __toESM } from "../_runtime.mjs";
import { _ as isFlowData, a as defaultCompanySectors, b as planIdea, r as createCustomCompanyWorkspace, u as generateSubModulesAi, x as seedData } from "./ideaflow-CpldvHc4.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { Dt as CirclePlus, E as Send, G as LockOpen, Jt as ArrowRight, Pt as Check, S as ShieldAlert, Vt as Building2, W as Lock, Z as KeyRound, _ as Sparkles, d as Trash2, dt as Eye, ft as EyeOff, n as X, o as Users, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, l as Slot, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-assistant-3aCui_AD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supabase = createClient("https://vhljktzcvqzwssmvbznx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGprdHpjdnF6d3NzbXZiem54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5ODM3NzgsImV4cCI6MjEwNzU1OTc3OH0.038F4A9BrYERvqzSYg-efASctcJxM5qx7fUf5m4fzqE", { auth: {
	persistSession: true,
	autoRefreshToken: true,
	detectSessionInUrl: true
} });
/**
* Converte ideia do Supabase para formato interno do Ideaflow
*/
function rowToIdea(row) {
	let extraMeta = {};
	if (row.summary && typeof row.summary === "string" && row.summary.includes("<!--ideaflow-meta:")) try {
		const match = row.summary.match(/<!--ideaflow-meta:(.*?)-->/);
		if (match && match[1]) extraMeta = JSON.parse(decodeURIComponent(match[1]));
	} catch {}
	const cleanSummary = row.summary && typeof row.summary === "string" ? row.summary.replace(/<!--ideaflow-meta:.*?-->/, "").trim() : "";
	return {
		id: row.id,
		title: row.title,
		summary: cleanSummary,
		sector: row.sector || extraMeta.sector || "personal",
		priority: row.priority || extraMeta.priority || "Normal",
		stage: row.stage ?? 0,
		minutes: row.minutes ?? 60,
		dedicated: row.dedicated ?? 0,
		immediate: row.immediate || "",
		clarity: row.clarity || "",
		scope: row.scope || "",
		steps: Array.isArray(row.steps) ? row.steps : [],
		notes: Array.isArray(row.notes) ? row.notes : [],
		pivots: Array.isArray(row.pivots) ? row.pivots : [],
		parentId: row.parent_id || extraMeta.parentId || void 0,
		isProject: Boolean(row.is_project || extraMeta.isProject),
		archived: Boolean(row.archived || extraMeta.archived),
		archivedAt: row.archived_at || extraMeta.archivedAt || void 0,
		workspace: row.workspace || extraMeta.workspace || (row.company_id ? "business" : "personal"),
		companyId: row.company_id || extraMeta.companyId || void 0,
		assignedTo: row.assigned_to || extraMeta.assignedTo || void 0,
		department: row.department || extraMeta.department || void 0,
		fiveWhys: Array.isArray(row.five_whys) ? row.five_whys : Array.isArray(extraMeta.fiveWhys) ? extraMeta.fiveWhys : void 0
	};
}
/**
* Converte ideia do Ideaflow para linha do Supabase
*/
function ideaToRow(idea, userId, companyId) {
	const meta = {
		workspace: idea.workspace || "personal",
		companyId: idea.companyId || companyId || void 0,
		assignedTo: idea.assignedTo || void 0,
		department: idea.department || void 0,
		fiveWhys: idea.fiveWhys || void 0
	};
	const metaComment = `\n<!--ideaflow-meta:${encodeURIComponent(JSON.stringify(meta))}-->`;
	const cleanSummary = (idea.summary || "").replace(/<!--ideaflow-meta:.*?-->/, "").trim();
	return {
		id: idea.id,
		user_id: userId,
		title: idea.title,
		summary: `${cleanSummary}${metaComment}`,
		sector: idea.sector || "personal",
		priority: idea.priority || "Normal",
		stage: idea.stage ?? 0,
		minutes: idea.minutes ?? 60,
		dedicated: idea.dedicated ?? 0,
		immediate: idea.immediate || "",
		clarity: idea.clarity || "",
		scope: idea.scope || "",
		steps: idea.steps || [],
		notes: idea.notes || [],
		pivots: idea.pivots || [],
		parent_id: idea.parentId || null,
		is_project: Boolean(idea.isProject),
		archived: Boolean(idea.archived),
		archived_at: idea.archivedAt || null,
		workspace: idea.workspace || "personal",
		company_id: idea.companyId || companyId || null,
		assigned_to: idea.assignedTo || null,
		department: idea.department || null,
		five_whys: idea.fiveWhys || [],
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/**
* Carrega todas as ideias do usuário logado no Supabase
*/
async function loadUserIdeasFromSupabase(userId) {
	const { data, error } = await supabase.from("ideas").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
	if (error) {
		console.warn("Erro ao carregar ideias do Supabase:", error);
		throw error;
	}
	return (data || []).map(rowToIdea);
}
/**
* Carrega ideias compartilhadas de uma empresa no Supabase
*/
async function loadCompanyIdeasFromSupabase(companyId) {
	if (!companyId) return [];
	try {
		const { data, error } = await supabase.from("ideas").select("*").eq("company_id", companyId).order("updated_at", { ascending: false });
		if (!error && data && data.length > 0) return data.map(rowToIdea);
		const { data: fallbackData } = await supabase.from("ideas").select("*").ilike("summary", `%${companyId}%`).order("updated_at", { ascending: false });
		return (fallbackData || []).map(rowToIdea);
	} catch (err) {
		console.warn("Aviso ao carregar ideias compartilhadas da empresa:", err);
		return [];
	}
}
/**
* Sincroniza uma lista de ideias com o Supabase com fallback inteligente de schema
*/
async function syncIdeasToSupabase(ideas, userId, companyId) {
	if (!userId || ideas.length === 0) return;
	const rows = ideas.map((idea) => ideaToRow(idea, userId, companyId));
	try {
		const { error } = await supabase.from("ideas").upsert(rows, { onConflict: "id" });
		if (error) {
			if ((error.message || "").toLowerCase().includes("column") || error.code === "42703" || error.code === "PGRST204") {
				const baseRows = rows.map((r) => {
					const { workspace, company_id, assigned_to, department, five_whys, ...base } = r;
					return base;
				});
				const retryRes = await supabase.from("ideas").upsert(baseRows, { onConflict: "id" });
				if (retryRes.error) throw retryRes.error;
				return;
			}
			throw error;
		}
	} catch (err) {
		console.warn("Erro ao sincronizar ideias com Supabase:", err);
		throw err;
	}
}
/**
* Escuta atualizações em tempo real das ideias da empresa
*/
function subscribeToCompanyIdeas(companyId, onUpdate) {
	if (!companyId) return () => {};
	const channel = supabase.channel(`company-ideas-${companyId}`).on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "ideas"
	}, () => {
		onUpdate();
	}).subscribe();
	return () => {
		supabase.removeChannel(channel);
	};
}
/**
* Deleta uma ideia no Supabase
*/
async function deleteIdeaFromSupabase(ideaId, userId) {
	const { error } = await supabase.from("ideas").delete().eq("id", ideaId).eq("user_id", userId);
	if (error) console.warn("Erro ao excluir ideia do Supabase:", error);
}
/**
* Carrega perfil do usuário
*/
async function loadUserProfile(userId) {
	const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
	if (error) return null;
	return data;
}
/**
* Salva perfil do usuário
*/
async function upsertUserProfile(profile) {
	await supabase.from("profiles").upsert(profile, { onConflict: "id" });
}
/**
* Salva a senha de segurança de transição de workspace (Empresa <-> Pessoal) no Supabase
*/
async function saveUserWorkspacePin(userId, pin) {
	const cleanPin = pin ? pin.trim() : "";
	try {
		try {
			const { data: authData, error: authError } = await supabase.auth.updateUser({ data: { workspace_pin: cleanPin } });
			if (authError) console.warn("Aviso Supabase Auth updateUser:", authError.message);
			else if (authData?.user) {}
		} catch (authErr) {
			console.warn("Falha ao atualizar user_metadata no Supabase:", authErr);
		}
		try {
			const { error: profileError } = await supabase.from("profiles").upsert({
				id: userId,
				workspace_pin: cleanPin,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "id" });
			if (profileError) console.warn("Aviso: para persistir também na tabela profiles do Supabase, adicione a coluna: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workspace_pin text;", profileError.message);
		} catch {}
	} catch (err) {
		console.warn("Falha geral ao persistir workspace_pin no Supabase:", err);
	}
}
/**
* Cria ou atualiza uma empresa no Supabase
*/
async function createCompanyInSupabase(company, userId) {
	if (!company.id) return;
	try {
		const payload = {
			id: company.id,
			name: company.name,
			share_code: company.shareCode,
			industry: company.industry,
			mission: company.mission,
			owner_id: userId,
			key_user_name: company.keyUserName || "Key User",
			key_user_email: company.keyUserEmail,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error } = await supabase.from("companies").upsert(payload, { onConflict: "id" });
		if (error) console.warn("Tabela companies do Supabase ainda não inicializada ou erro RLS:", error.message);
		await supabase.from("company_members").upsert({
			id: `mem-${company.id}-${userId}`,
			company_id: company.id,
			user_id: userId,
			name: company.keyUserName || "Key User",
			email: company.keyUserEmail || "admin@empresa.com",
			role: "Key User & Fundador(a)",
			department: "quality",
			is_key_user: true,
			status: "active"
		}, { onConflict: "id" });
	} catch (err) {
		console.warn("Aviso ao registrar empresa no Supabase:", err);
	}
}
/**
* Busca uma empresa pelo código de compartilhamento
*/
async function loadCompanyByCode(shareCode) {
	const cleanCode = shareCode.trim().toUpperCase();
	if (!cleanCode) return null;
	try {
		const { data, error } = await supabase.from("companies").select("*").eq("share_code", cleanCode).single();
		if (!error && data) return {
			id: data.id,
			name: data.name,
			shareCode: data.share_code,
			industry: data.industry,
			mission: data.mission,
			ownerId: data.owner_id,
			keyUserName: data.key_user_name,
			keyUserEmail: data.key_user_email
		};
	} catch (err) {
		console.warn("Erro ao consultar empresa por código:", err);
	}
	return null;
}
/**
* Carrega todas as empresas associadas ao usuário (como Key User/fundador ou membro de equipe)
*/
async function loadUserCompanies(userId, userEmail) {
	if (!userId) return [];
	const companiesMap = /* @__PURE__ */ new Map();
	try {
		const { data: ownedCompanies, error: ownedError } = await supabase.from("companies").select("*").eq("owner_id", userId);
		if (!ownedError && ownedCompanies) ownedCompanies.forEach((comp) => {
			companiesMap.set(comp.id, {
				...comp,
				isOwner: true
			});
		});
		let memberQuery = supabase.from("company_members").select("company_id, is_key_user").eq("status", "active");
		if (userEmail) memberQuery = memberQuery.or(`user_id.eq.${userId},email.eq.${userEmail.trim().toLowerCase()}`);
		else memberQuery = memberQuery.eq("user_id", userId);
		const { data: memberRows, error: memberError } = await memberQuery;
		if (!memberError && memberRows && memberRows.length > 0) {
			const missingCompIds = memberRows.map((m) => m.company_id).filter((id) => id && !companiesMap.has(id));
			if (missingCompIds.length > 0) {
				const { data: compRows, error: compError } = await supabase.from("companies").select("*").in("id", missingCompIds);
				if (!compError && compRows) compRows.forEach((comp) => {
					const memInfo = memberRows.find((m) => m.company_id === comp.id);
					companiesMap.set(comp.id, {
						...comp,
						isOwner: comp.owner_id === userId,
						isMemberKeyUser: Boolean(memInfo?.is_key_user)
					});
				});
			}
		}
		const results = [];
		for (const comp of companiesMap.values()) {
			const { data: allMembersData } = await supabase.from("company_members").select("*").eq("company_id", comp.id);
			const members = (allMembersData || []).map((m) => ({
				id: m.user_id || m.id,
				name: m.name,
				email: m.email,
				role: m.role,
				department: m.department,
				isKeyUser: Boolean(m.is_key_user),
				status: m.status || "active"
			}));
			const isKeyUser = comp.isOwner || comp.owner_id === userId || Boolean(comp.isMemberKeyUser);
			const pendingRequests = isKeyUser ? await loadCompanyJoinRequests(comp.id) : [];
			results.push({
				id: comp.id,
				shareCode: comp.share_code,
				name: comp.name,
				industry: comp.industry || "Tecnologia & Inovação",
				mission: comp.mission || "Construir produtos ágeis e colaborativos.",
				sectors: [
					{
						id: "tech",
						name: "Tecnologia & Dev",
						tone: "cyan"
					},
					{
						id: "marketing",
						name: "Marketing & Growth",
						tone: "pink"
					},
					{
						id: "qa",
						name: "Testes & QA",
						tone: "amber"
					},
					{
						id: "quality",
						name: "Qualidade & Produto",
						tone: "green"
					},
					{
						id: "ops",
						name: "Operações & RH",
						tone: "violet"
					}
				],
				members: members.length > 0 ? members : [{
					id: userId,
					name: comp.key_user_name || "Key User",
					email: comp.key_user_email || userEmail,
					role: "Key User & Fundador(a)",
					department: "quality",
					isKeyUser: true,
					status: "active"
				}],
				ownerId: comp.owner_id,
				keyUserName: comp.key_user_name,
				keyUserEmail: comp.key_user_email,
				isKeyUser,
				pendingRequests
			});
		}
		return results;
	} catch (err) {
		console.warn("Aviso ao carregar empresas do usuário no Supabase:", err);
		return [];
	}
}
/**
* Cria uma solicitação de entrada na empresa (pedido ao Key User)
*/
async function createCompanyJoinRequest(req) {
	try {
		const payload = {
			id: req.id,
			company_id: req.companyId,
			company_code: req.companyCode,
			user_id: req.userId || null,
			user_name: req.userName,
			user_email: req.userEmail,
			department: req.department,
			role: req.role,
			status: req.status,
			created_at: req.createdAt
		};
		const { error } = await supabase.from("company_join_requests").upsert(payload, { onConflict: "id" });
		if (error) console.warn("Aviso ao salvar solicitação de entrada no Supabase:", error.message);
	} catch (err) {
		console.warn("Aviso ao enviar pedido de adesão ao Key User:", err);
	}
}
/**
* Carrega solicitações de entrada pendentes para o Key User
*/
async function loadCompanyJoinRequests(companyId) {
	if (!companyId) return [];
	try {
		const { data, error } = await supabase.from("company_join_requests").select("*").eq("company_id", companyId).eq("status", "pending").order("created_at", { ascending: false });
		if (!error && data) return data.map((r) => ({
			id: r.id,
			companyId: r.company_id,
			companyCode: r.company_code,
			userId: r.user_id,
			userName: r.user_name,
			userEmail: r.user_email,
			department: r.department,
			role: r.role,
			status: r.status,
			createdAt: r.created_at
		}));
	} catch (err) {
		console.warn("Aviso ao carregar pedidos de entrada:", err);
	}
	return [];
}
/**
* Aprova uma solicitação de entrada
*/
async function approveCompanyJoinRequest(requestId, member, companyId) {
	try {
		await supabase.from("company_join_requests").update({ status: "approved" }).eq("id", requestId);
		await supabase.from("company_members").upsert({
			id: `mem-${companyId}-${member.id}`,
			company_id: companyId,
			user_id: member.id,
			name: member.name,
			email: member.email,
			role: member.role,
			department: member.department,
			is_key_user: false,
			status: "active"
		}, { onConflict: "id" });
	} catch (err) {
		console.warn("Aviso ao aprovar solicitação no Supabase:", err);
	}
}
/**
* Rejeita uma solicitação de entrada
*/
async function rejectCompanyJoinRequest(requestId) {
	try {
		await supabase.from("company_join_requests").update({ status: "rejected" }).eq("id", requestId);
	} catch (err) {
		console.warn("Aviso ao rejeitar solicitação:", err);
	}
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function PersonalPinModal({ open, onClose, onSuccess, currentPin = "", onUpdatePin, targetWorkspace = "personal" }) {
	const hasExistingPin = Boolean(currentPin && currentPin.trim().length > 0);
	const [view, setView] = (0, import_react.useState)(hasExistingPin ? "unlock" : "setup");
	const [enteredPin, setEnteredPin] = (0, import_react.useState)("");
	const [newPin, setNewPin] = (0, import_react.useState)("");
	const [confirmPin, setConfirmPin] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [isUnlocked, setIsUnlocked] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setView(hasExistingPin ? "unlock" : "setup");
			setEnteredPin("");
			setNewPin("");
			setConfirmPin("");
			setError(null);
			setIsUnlocked(false);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 150);
		}
	}, [open, hasExistingPin]);
	const isGoingPersonal = targetWorkspace === "personal";
	const handleUnlock = (e) => {
		if (e) e.preventDefault();
		setError(null);
		if (!enteredPin.trim()) {
			setError("Digite sua senha de segurança.");
			return;
		}
		if (enteredPin.trim() === currentPin.trim()) {
			setIsUnlocked(true);
			toast.success(isGoingPersonal ? "Espaço Pessoal desbloqueado com sucesso! 🔓" : "Workspace da Empresa desbloqueado com sucesso! 🏢");
			setTimeout(() => {
				onSuccess();
				onClose();
			}, 350);
		} else {
			setError("Senha incorreta. Tente novamente.");
			toast.error("Senha incorreta de segurança.");
		}
	};
	const handleSavePin = (e) => {
		e.preventDefault();
		setError(null);
		const cleanNew = newPin.trim();
		const cleanConfirm = confirmPin.trim();
		if (!cleanNew) {
			setError("Informe a nova senha de segurança.");
			return;
		}
		if (cleanNew.length < 4) {
			setError("A senha de segurança deve ter pelo menos 4 caracteres.");
			return;
		}
		if (cleanNew !== cleanConfirm) {
			setError("A confirmação da senha não coincide com a senha digitada.");
			return;
		}
		if (onUpdatePin) onUpdatePin(cleanNew);
		toast.success("Senha de segurança de transição salva com sucesso! 🔒");
		setIsUnlocked(true);
		setTimeout(() => {
			onSuccess();
			onClose();
		}, 350);
	};
	const handleContinueWithoutPin = () => {
		toast.info("Transição concluída sem senha de bloqueio. ✨");
		onSuccess();
		onClose();
	};
	const handleRemovePin = () => {
		if (onUpdatePin) onUpdatePin("");
		toast.success("Senha de segurança removida. Agora os espaços alternam livremente.");
		setView("setup");
		setEnteredPin("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (isOpen) => !isOpen && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md p-6 bg-card border-border/90 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-violet/20 border border-primary/30 flex items-center justify-center text-primary shadow-xs",
							children: isUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, {
								size: 24,
								className: "text-green animate-bounce"
							}) : view === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								size: 24,
								className: "text-violet animate-pulse"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
								size: 22,
								className: "text-primary animate-pulse"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-display font-bold text-foreground",
							children: view === "setup" ? "Proteção de Transição de Espaço" : view === "change" ? "Alterar Senha de Segurança" : "Espaço Protegido por Senha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: view === "setup" ? isGoingPersonal ? "Você está alternando para o seu Espaço Pessoal. Se quiser privacidade contra acessos de terceiros, defina uma senha de segurança agora (opcional)." : "Você está alternando para o Workspace da Empresa. Se quiser, defina uma senha de segurança agora (opcional)." : view === "change" ? "Digite a nova senha e confirme para atualizar sua proteção de transição." : isGoingPersonal ? "Você está no Workspace da Empresa. Digite sua senha de segurança para acessar seu Espaço Pessoal." : "Digite sua senha de segurança para acessar o Workspace Corporativo."
						})
					]
				}),
				view === "unlock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleUnlock,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-foreground flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Senha de Segurança:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground font-normal",
									children: ["Transição ", isGoingPersonal ? "Empresa ➔ Pessoal" : "Pessoal ➔ Empresa"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: inputRef,
									type: showPassword ? "text" : "password",
									className: "w-full h-11 px-3.5 pr-10 rounded-xl border border-border/80 bg-secondary/50 text-foreground font-mono text-center tracking-widest text-lg focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all",
									placeholder: "••••",
									value: enteredPin,
									onChange: (e) => {
										setEnteredPin(e.target.value);
										setError(null);
									},
									autoFocus: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer",
									onClick: () => setShowPassword(!showPassword),
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
								})]
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 pt-2 border-t border-border/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: "text-[11px] text-muted-foreground hover:text-primary gap-1 px-1 cursor-pointer",
									onClick: () => {
										setView("change");
										setNewPin("");
										setConfirmPin("");
										setError(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Alterar Senha" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: "text-[11px] text-destructive/80 hover:text-destructive gap-1 px-1 cursor-pointer",
									onClick: handleRemovePin,
									title: "Remover proteção com senha",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remover" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									className: "h-8 text-xs cursor-pointer",
									onClick: onClose,
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "sm",
									className: "h-8 text-xs font-semibold px-4 cursor-pointer gap-1",
									disabled: !enteredPin.trim() || isUnlocked,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Desbloquear" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 13 })]
								})]
							})]
						})
					]
				}),
				view === "setup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSavePin,
						className: "space-y-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-violet/10 border border-violet/25 text-xs text-foreground space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold text-violet flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), "Defina uma senha se desejar proteção"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-relaxed",
									children: "Caso divida este computador ou navegador com colegas de equipe, você pode definir uma senha e verificação de senha para alternar entre os espaços."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground block",
									children: "Nova Senha de Segurança:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: inputRef,
										type: showPassword ? "text" : "password",
										className: "w-full h-10 px-3 pr-10 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none",
										placeholder: "Mínimo 4 caracteres (números ou letras)",
										value: newPin,
										onChange: (e) => {
											setNewPin(e.target.value);
											setError(null);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer",
										onClick: () => setShowPassword(!showPassword),
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 15 })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground block",
									children: "Verificação da Senha (Confirme):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showPassword ? "text" : "password",
									className: "w-full h-10 px-3 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none",
									placeholder: "Digite a mesma senha novamente",
									value: confirmPin,
									onChange: (e) => {
										setConfirmPin(e.target.value);
										setError(null);
									}
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: "w-full sm:w-auto h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
									onClick: handleContinueWithoutPin,
									children: "Continuar sem Senha"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 w-full sm:w-auto justify-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										className: "h-8 text-xs cursor-pointer",
										onClick: onClose,
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										size: "sm",
										className: "h-8 text-xs font-semibold px-4 cursor-pointer gap-1 bg-violet hover:bg-violet/90 text-white",
										disabled: !newPin.trim() || !confirmPin.trim(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Salvar Senha & Alternar" })]
									})]
								})]
							})
						]
					})
				}),
				view === "change" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSavePin,
					className: "space-y-3.5 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block",
								children: "Nova Senha de Segurança:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: inputRef,
									type: showPassword ? "text" : "password",
									className: "w-full h-10 px-3 pr-10 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none",
									placeholder: "Mínimo 4 caracteres",
									value: newPin,
									onChange: (e) => {
										setNewPin(e.target.value);
										setError(null);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer",
									onClick: () => setShowPassword(!showPassword),
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 15 })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block",
								children: "Verificação da Senha (Confirme):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showPassword ? "text" : "password",
								className: "w-full h-10 px-3 rounded-lg border border-border/80 bg-secondary/50 text-foreground text-sm focus:border-primary outline-none",
								placeholder: "Repita a nova senha",
								value: confirmPin,
								onChange: (e) => {
									setConfirmPin(e.target.value);
									setError(null);
								}
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs text-destructive font-medium flex items-center justify-center gap-1.5 animate-in fade-in-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-border/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "h-8 text-xs cursor-pointer",
								onClick: () => setView("unlock"),
								children: "Voltar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "sm",
								className: "h-8 text-xs font-semibold px-4 cursor-pointer gap-1",
								disabled: !newPin.trim() || !confirmPin.trim(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Salvar Nova Senha" })]
							})]
						})
					]
				})
			]
		})
	});
}
function CompanyAccessModal({ open, onOpenChange, onSuccess, initialTab = "join" }) {
	const { data, setData, user, syncWithCloud } = useFlow();
	const [tab, setTab] = (0, import_react.useState)(initialTab);
	(0, import_react.useEffect)(() => {
		if (open && initialTab) setTab(initialTab);
	}, [open, initialTab]);
	const [shareCode, setShareCode] = (0, import_react.useState)("");
	const [userName, setUserName] = (0, import_react.useState)("");
	const [userEmail, setUserEmail] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("tech");
	const [role, setRole] = (0, import_react.useState)("Especialista / Colaborador");
	const [submittingJoin, setSubmittingJoin] = (0, import_react.useState)(false);
	const [newCompanyName, setNewCompanyName] = (0, import_react.useState)("");
	const [newCompanyIndustry, setNewCompanyIndustry] = (0, import_react.useState)("Tecnologia & Inovação");
	const [keyUserName, setKeyUserName] = (0, import_react.useState)("");
	const [submittingCreate, setSubmittingCreate] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) {
			setUserEmail(user.email || "");
			const metaName = user.user_metadata?.name || user.email?.split("@")[0] || "";
			if (!userName && metaName) setUserName(metaName);
			if (!keyUserName && metaName) setKeyUserName(metaName);
		} else if (data.profile?.name) {
			if (!userName) setUserName(data.profile.name);
			if (!keyUserName) setKeyUserName(data.profile.name);
		}
	}, [
		user,
		data.profile,
		open
	]);
	const handleJoinWithCode = async (e) => {
		e.preventDefault();
		const cleanCode = shareCode.trim().toUpperCase();
		if (!cleanCode) {
			toast.error("Informe o código da corporação.");
			return;
		}
		if (!userName.trim()) {
			toast.error("Informe seu nome para que o Key User possa identificar você.");
			return;
		}
		try {
			setSubmittingJoin(true);
			const remoteCompany = await loadCompanyByCode(cleanCode);
			if (!remoteCompany && cleanCode !== "ACME-2026") {
				toast.error(`Código "${cleanCode}" não foi encontrado. Verifique o código com o Key User da sua corporação.`);
				return;
			}
			const companyId = remoteCompany?.id || `comp-${cleanCode.toLowerCase().replace("-", "_")}`;
			const resolvedName = remoteCompany?.name || `Corporação (${cleanCode})`;
			await createCompanyJoinRequest({
				id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				companyId,
				companyCode: cleanCode,
				userId: user?.id,
				userName: userName.trim(),
				userEmail: userEmail.trim() || "colaborador@empresa.com",
				department,
				role: role.trim() || "Colaborador(a)",
				status: "pending",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			const companyIdeas = await loadCompanyIdeasFromSupabase(cleanCode);
			const newJoinedComp = {
				id: companyId,
				shareCode: cleanCode,
				name: resolvedName,
				industry: remoteCompany?.industry || "Tecnologia & Serviços",
				mission: remoteCompany?.mission || "Crescimento e excelência contínua.",
				sectors: defaultCompanySectors,
				members: [{
					id: user?.id || `user-${Date.now()}`,
					name: userName.trim(),
					role: role.trim(),
					email: userEmail.trim(),
					department,
					isKeyUser: false,
					status: "pending"
				}],
				keyUserName: remoteCompany?.keyUserName || "Key User da Empresa",
				isKeyUser: false
			};
			setData((prev) => {
				const existingCompanies = prev.companies || (prev.companyWorkspace ? [prev.companyWorkspace] : []);
				const updatedCompanies = [newJoinedComp, ...existingCompanies.filter((c) => c.id !== newJoinedComp.id)];
				return {
					...prev,
					workspaceMode: "business",
					companies: updatedCompanies,
					companyWorkspace: newJoinedComp,
					activeCompanyId: newJoinedComp.id,
					ideas: [...companyIdeas, ...prev.ideas.filter((i) => !companyIdeas.some((ci) => ci.id === i.id))]
				};
			});
			toast.success(`Pedido de acesso enviado com sucesso ao Key User de "${resolvedName}"! 🎉`, { duration: 4e3 });
			onOpenChange(false);
			onSuccess?.();
		} catch (err) {
			toast.error(`Erro ao conectar: ${err?.message || "Verifique o código e tente novamente."}`);
		} finally {
			setSubmittingJoin(false);
		}
	};
	const handleCreateCompany = async (e) => {
		e.preventDefault();
		if (!newCompanyName.trim()) {
			toast.error("Informe o nome da sua empresa ou startup.");
			return;
		}
		if (!keyUserName.trim()) {
			toast.error("Informe seu nome como Key User / Fundador.");
			return;
		}
		try {
			setSubmittingCreate(true);
			const newWorkspace = createCustomCompanyWorkspace(newCompanyName, newCompanyIndustry, keyUserName, userEmail || user?.email, user?.id);
			if (user?.id) await createCompanyInSupabase(newWorkspace, user.id);
			setData((prev) => {
				const existingCompanies = prev.companies || (prev.companyWorkspace ? [prev.companyWorkspace] : []);
				const updatedCompanies = [newWorkspace, ...existingCompanies.filter((c) => c.id !== newWorkspace.id)];
				return {
					...prev,
					workspaceMode: "business",
					companies: updatedCompanies,
					companyWorkspace: newWorkspace,
					activeCompanyId: newWorkspace.id
				};
			});
			toast.success(`Empresa "${newWorkspace.name}" fundada com sucesso! Seu código é ${newWorkspace.shareCode} 👑`, { duration: 5e3 });
			onOpenChange(false);
			onSuccess?.();
		} catch (err) {
			toast.error(`Falha ao fundar empresa: ${err?.message || "Tente novamente"}`);
		} finally {
			setSubmittingCreate(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-xl p-0 overflow-hidden bg-card border-border shadow-2xl rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 bg-gradient-to-r from-violet-600/15 via-primary/10 to-transparent border-b border-border/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-500 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 24 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-bold tracking-tight text-foreground",
						children: "Portal Corporativo & Áreas de Negócio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Conecte-se com sua equipe ou crie a estrutura da sua própria empresa."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 p-1 bg-secondary/80 rounded-xl mt-5 border border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab("join"),
						className: `py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${tab === "join" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
							size: 14,
							className: tab === "join" ? "text-primary" : ""
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrar com Código" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab("create"),
						className: `py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${tab === "create" ? "bg-violet-600 text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Criar Empresa (Key User)" })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 max-h-[75vh] overflow-y-auto",
				children: [tab === "join" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleJoinWithCode,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
								size: 18,
								className: "text-violet-500 shrink-0 mt-0.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground",
									children: "Acesso por Código de Corporação"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5",
									children: [
										"Digite o código fornecido pelo ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Key User" }),
										" da sua empresa (ex:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-primary font-mono font-bold",
											children: "ACME-2026"
										}),
										") para ingressar no funil corporativo compartilhado."
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-foreground block mb-1.5",
							children: "Código da Empresa / Corporação *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							placeholder: "Ex: ACME-2026",
							value: shareCode,
							onChange: (e) => setShareCode(e.target.value.toUpperCase()),
							className: "w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-violet-500/40"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1.5",
								children: "Seu Nome Completo *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "Seu nome",
								value: userName,
								onChange: (e) => setUserName(e.target.value),
								className: "w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1.5",
								children: "Seu E-mail Profissional"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								placeholder: "voce@empresa.com",
								value: userEmail,
								onChange: (e) => setUserEmail(e.target.value),
								className: "w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1.5",
								children: "Setor de Atuação"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: department,
								onChange: (e) => setDepartment(e.target.value),
								className: "w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "tech",
										children: "Tecnologia & Dev"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "marketing",
										children: "Marketing & Growth"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "qa",
										children: "Testes & QA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "quality",
										children: "Qualidade & Produto"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ops",
										children: "Operações & RH"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1.5",
								children: "Cargo / Função"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Ex: Engenheiro de Software",
								value: role,
								onChange: (e) => setRole(e.target.value),
								className: "w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: submittingJoin,
								className: "w-full h-10 bg-gradient-to-r from-violet-600 to-primary text-white font-semibold text-xs shadow-md hover:shadow-violet-500/25 gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
									size: 14,
									className: submittingJoin ? "animate-spin" : ""
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: submittingJoin ? "Enviando pedido ao Key User..." : "Enviar Pedido ao Key User & Entrar" })]
							})
						})
					]
				}), tab === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreateCompany,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-primary/10 border border-primary/25 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								size: 18,
								className: "text-primary shrink-0 mt-0.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground",
									children: "Fundar Espaço Corporativo (Key User)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5",
									children: [
										"Como ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Key User" }),
										", você será o administrador central da corporação: aprova novos membros, configura setores e compartilha o código exclusivo com sua equipe."
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-foreground block mb-1.5",
							children: "Nome da Empresa / Startup *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							placeholder: "Ex: Acme Inovações, Stark Tech, Lumina Health",
							value: newCompanyName,
							onChange: (e) => setNewCompanyName(e.target.value),
							className: "w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1.5",
								children: "Ramo / Indústria Principal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Ex: SaaS, E-commerce, Logística",
								value: newCompanyIndustry,
								onChange: (e) => setNewCompanyIndustry(e.target.value),
								className: "w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground block mb-1.5",
								children: "Seu Nome (Key User) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "Seu nome completo",
								value: keyUserName,
								onChange: (e) => setKeyUserName(e.target.value),
								className: "w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-secondary/30 border border-border/80 text-xs text-muted-foreground flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Setores Iniciais Inclusos:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Tecnologia · Marketing · QA · Qualidade · Operações"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: submittingCreate,
								className: "w-full h-10 bg-gradient-to-r from-violet-600 to-primary text-white font-semibold text-xs shadow-md hover:shadow-violet-500/25 gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, {
									size: 15,
									className: submittingCreate ? "animate-spin" : ""
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: submittingCreate ? "Fundando empresa e gerando código..." : "Fundar Empresa & Tornar-me Key User" })]
							})
						})
					]
				})]
			})]
		})
	});
}
var FlowContext = (0, import_react.createContext)(null);
function FlowProvider({ children }) {
	const [data, setData] = (0, import_react.useState)(seedData);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [user, setUser] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [isSyncing, setIsSyncing] = (0, import_react.useState)(false);
	const [personalPin, setPersonalPinState] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "";
		return localStorage.getItem("ideaflow_personal_pin") || "";
	});
	const [pinModalOpen, setPinModalOpen] = (0, import_react.useState)(false);
	const [targetWorkspace, setTargetWorkspace] = (0, import_react.useState)("personal");
	const [companyAccessModalOpen, setCompanyAccessModalOpen] = (0, import_react.useState)(false);
	const [companyAccessInitialTab, setCompanyAccessInitialTab] = (0, import_react.useState)("join");
	const [onPinSuccessCallback, setOnPinSuccessCallback] = (0, import_react.useState)(null);
	const [pendingRequests, setPendingRequests] = (0, import_react.useState)([]);
	const refreshPendingRequests = async () => {
		const compId = data.companyWorkspace?.id;
		if (!compId) return;
		try {
			const requests = await loadCompanyJoinRequests(compId);
			setPendingRequests(requests);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		if (data.workspaceMode === "business" && data.companyWorkspace?.isKeyUser) refreshPendingRequests();
	}, [
		data.workspaceMode,
		data.companyWorkspace?.id,
		data.companyWorkspace?.isKeyUser
	]);
	const approveRequest = async (request) => {
		const compId = data.companyWorkspace?.id;
		if (!compId) return;
		const newMember = {
			id: request.userId || `mem-${Date.now()}`,
			name: request.userName,
			email: request.userEmail,
			role: request.role,
			department: request.department,
			isKeyUser: false,
			status: "active"
		};
		try {
			await approveCompanyJoinRequest(request.id, newMember, compId);
			setData((prev) => {
				if (!prev.companyWorkspace) return prev;
				const updatedCompany = {
					...prev.companyWorkspace,
					members: [...prev.companyWorkspace.members || [], newMember],
					pendingRequests: (prev.companyWorkspace.pendingRequests || []).filter((r) => r.id !== request.id)
				};
				const updatedCompanies = (prev.companies || []).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
				return {
					...prev,
					companies: updatedCompanies,
					companyWorkspace: updatedCompany
				};
			});
			setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
			toast.success(`${request.userName} foi aprovado(a) como membro oficial da empresa! 👥`);
		} catch (err) {
			toast.error("Erro ao aprovar solicitação.");
		}
	};
	const rejectRequest = async (requestId) => {
		try {
			await rejectCompanyJoinRequest(requestId);
			setData((prev) => {
				if (!prev.companyWorkspace) return prev;
				const updatedCompany = {
					...prev.companyWorkspace,
					pendingRequests: (prev.companyWorkspace.pendingRequests || []).filter((r) => r.id !== requestId)
				};
				const updatedCompanies = (prev.companies || []).map((c) => c.id === updatedCompany.id ? updatedCompany : c);
				return {
					...prev,
					companies: updatedCompanies,
					companyWorkspace: updatedCompany
				};
			});
			setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
			toast.info("Solicitação de entrada recusada.");
		} catch (err) {
			toast.error("Erro ao rejeitar solicitação.");
		}
	};
	const setPersonalPin = (newPin) => {
		const cleanPin = newPin ? newPin.trim() : "";
		setPersonalPinState(cleanPin);
		if (typeof window !== "undefined") if (cleanPin) {
			localStorage.setItem("ideaflow_personal_pin", cleanPin);
			if (user?.email) localStorage.setItem(`ideaflow_pin_${user.email.toLowerCase()}`, cleanPin);
		} else {
			localStorage.removeItem("ideaflow_personal_pin");
			if (user?.email) localStorage.removeItem(`ideaflow_pin_${user.email.toLowerCase()}`);
		}
		setData((prev) => ({
			...prev,
			profile: {
				...prev.profile ?? {
					name: "Criador",
					role: "Criador",
					streak: 1
				},
				personalPin: cleanPin || void 0
			}
		}));
		if (user?.id) saveUserWorkspacePin(user.id, cleanPin);
	};
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem("ideaflow-v1");
			if (stored) {
				const parsed = JSON.parse(stored);
				if (isFlowData(parsed)) {
					const validCompany = parsed.companyWorkspace?.id === "company-acme-corp" || parsed.companyWorkspace?.shareCode === "ACME-2026" ? void 0 : parsed.companyWorkspace || void 0;
					const validCompanies = (Array.isArray(parsed.companies) ? parsed.companies : []).filter((c) => c && c.id && c.id !== "company-acme-corp" && c.shareCode !== "ACME-2026");
					if (validCompany && !validCompanies.some((c) => c.id === validCompany.id)) validCompanies.unshift(validCompany);
					const activeId = parsed.activeCompanyId || validCompany?.id || validCompanies[0]?.id;
					const activeCompany = validCompanies.find((c) => c.id === activeId) || validCompanies[0] || validCompany;
					const cleanIdeas = (parsed.ideas || []).filter((i) => !i.id.startsWith("demo-") && !i.id.startsWith("biz-") && i.companyId !== "company-acme-corp");
					const cleanSectors = (parsed.sectors || []).filter((s) => s.id !== "wood");
					setData({
						...parsed,
						ideas: cleanIdeas,
						sectors: cleanSectors,
						companies: validCompanies,
						companyWorkspace: activeCompany,
						activeCompanyId: activeCompany?.id,
						workspaceMode: activeCompany ? parsed.workspaceMode ?? "personal" : "personal"
					});
					if (parsed.profile?.personalPin) {
						setPersonalPinState(parsed.profile.personalPin);
						localStorage.setItem("ideaflow_personal_pin", parsed.profile.personalPin);
					}
				}
			}
		} catch {}
		setReady(true);
		import("./pwa-CNta3qVs.mjs").then((m) => m.registerOffline());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		document.documentElement.classList.toggle("light", data.theme === "light");
		document.documentElement.classList.toggle("dark", data.theme === "dark");
		document.documentElement.dataset["palette"] = data.palette;
		try {
			localStorage.setItem("ideaflow-v1", JSON.stringify(data));
		} catch {
			toast.error("Não foi possível salvar. Exporte um backup para proteger suas ideias.");
		}
	}, [data, ready]);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			const currentUser = session?.user ?? null;
			setUser(currentUser);
			if (currentUser) handleUserLoggedIn(currentUser);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			const currentUser = session?.user ?? null;
			setUser(currentUser);
			if (currentUser) handleUserLoggedIn(currentUser);
			else setProfile(null);
		});
		return () => {
			subscription.unsubscribe();
		};
	}, []);
	const handleUserLoggedIn = async (currentUser) => {
		try {
			setIsSyncing(true);
			const userProfile = await loadUserProfile(currentUser.id);
			const authPin = currentUser.user_metadata?.["workspace_pin"];
			const profilePin = userProfile?.workspace_pin;
			const emailBackupPin = currentUser.email ? localStorage.getItem(`ideaflow_pin_${currentUser.email.toLowerCase()}`) : null;
			const remotePin = authPin || profilePin || emailBackupPin || "";
			if (remotePin) {
				setPersonalPinState(remotePin);
				if (typeof window !== "undefined") {
					localStorage.setItem("ideaflow_personal_pin", remotePin);
					if (currentUser.email) localStorage.setItem(`ideaflow_pin_${currentUser.email.toLowerCase()}`, remotePin);
				}
			}
			if (userProfile) {
				setProfile(userProfile);
				setData((prev) => ({
					...prev,
					profile: {
						name: userProfile.name || currentUser.email?.split("@")[0] || "Criador(a)",
						role: userProfile.role || "Criador(a)",
						bio: prev.profile?.bio,
						streak: prev.profile?.streak ?? 1,
						personalPin: remotePin || prev.profile?.personalPin
					}
				}));
			}
			const userCompanies = await loadUserCompanies(currentUser.id, currentUser.email || void 0);
			if (userCompanies.length > 0) {
				let chosenActive;
				setData((prev) => {
					const activeId = prev.activeCompanyId || prev.companyWorkspace?.id;
					chosenActive = userCompanies.find((c) => c.id === activeId) || userCompanies[0];
					return {
						...prev,
						companies: userCompanies,
						companyWorkspace: chosenActive,
						activeCompanyId: chosenActive?.id
					};
				});
				if (chosenActive?.isKeyUser && chosenActive.pendingRequests) setPendingRequests(chosenActive.pendingRequests);
				else setPendingRequests([]);
			} else {
				setData((prev) => ({
					...prev,
					companies: [],
					companyWorkspace: void 0,
					activeCompanyId: void 0,
					workspaceMode: prev.workspaceMode === "business" ? "personal" : prev.workspaceMode
				}));
				setPendingRequests([]);
			}
			const cloudIdeas = await loadUserIdeasFromSupabase(currentUser.id);
			const companyIdeasPromises = userCompanies.map((c) => c.id ? loadCompanyIdeasFromSupabase(c.id) : Promise.resolve([]));
			const companyCloudIdeas = (await Promise.all(companyIdeasPromises)).flat();
			const allLoaded = [...cloudIdeas, ...companyCloudIdeas];
			if (allLoaded.length > 0) setData((prev) => {
				const map = /* @__PURE__ */ new Map();
				prev.ideas.forEach((i) => map.set(i.id, i));
				allLoaded.forEach((i) => map.set(i.id, i));
				return {
					...prev,
					ideas: Array.from(map.values())
				};
			});
		} catch (err) {
			console.warn("Aviso ao sincronizar na inicialização do usuário:", err);
		} finally {
			setIsSyncing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const companyId = data.companyWorkspace?.id;
		if (!companyId) return;
		const unsubscribe = subscribeToCompanyIdeas(companyId, async () => {
			try {
				const freshCompanyIdeas = await loadCompanyIdeasFromSupabase(companyId);
				if (freshCompanyIdeas.length > 0) {
					setData((prev) => {
						const map = /* @__PURE__ */ new Map();
						prev.ideas.forEach((i) => map.set(i.id, i));
						freshCompanyIdeas.forEach((i) => map.set(i.id, i));
						return {
							...prev,
							ideas: Array.from(map.values())
						};
					});
					toast.info("Iniciativas da empresa atualizadas em tempo real via Supabase! ⚡");
				}
			} catch (e) {
				console.warn("Erro ao atualizar realtime da empresa:", e);
			}
		});
		return () => {
			unsubscribe();
		};
	}, [data.companyWorkspace?.id]);
	const syncWithCloud = async () => {
		if (!user) {
			toast.info("Conecte ou crie sua conta gratuita para salvar e compartilhar ideias na nuvem.");
			return;
		}
		try {
			setIsSyncing(true);
			const companyId = data.companyWorkspace?.id;
			await syncIdeasToSupabase(data.ideas, user.id, companyId);
			toast.success("Ideias e iniciativas sincronizadas com a nuvem Supabase!");
		} catch (err) {
			toast.error(`Falha ao sincronizar: ${err?.message || "Erro de conexão"}`);
		} finally {
			setIsSyncing(false);
		}
	};
	const updateIdea = (id, patch) => {
		setData((prev) => {
			const updatedIdeas = prev.ideas.map((i) => i.id === id ? {
				...i,
				...patch
			} : i);
			if (user) {
				const target = updatedIdeas.find((i) => i.id === id);
				if (target) {
					const companyId = prev.companyWorkspace?.id;
					syncIdeasToSupabase([target], user.id, companyId);
				}
			}
			return {
				...prev,
				ideas: updatedIdeas
			};
		});
	};
	const deleteIdea = (id) => {
		setData((prev) => {
			const updatedIdeas = prev.ideas.filter((i) => i.id !== id);
			if (user) deleteIdeaFromSupabase(id, user.id);
			return {
				...prev,
				ideas: updatedIdeas
			};
		});
	};
	const requestSwitchWorkspace = (target) => {
		if (target === data.workspaceMode) return;
		if (target === "business" && (!data.companyWorkspace || !data.companyWorkspace.id)) {
			setCompanyAccessModalOpen(true);
			return;
		}
		setTargetWorkspace(target);
		setOnPinSuccessCallback(() => () => {
			setData((prev) => ({
				...prev,
				workspaceMode: target
			}));
			if (target === "personal") toast.success("Espaço Pessoal desbloqueado! 👤");
			else toast.success(`Workspace da Empresa (${data.companyWorkspace?.name ?? "Empresa"}) ativado! 🏢`);
		});
		setPinModalOpen(true);
	};
	const joinCompanyByCode = async (code) => {
		const cleanCode = code.toUpperCase().trim();
		if (!cleanCode) {
			toast.error("Informe o código da empresa.");
			return false;
		}
		try {
			setIsSyncing(true);
			const remoteCompany = await loadCompanyByCode(cleanCode);
			if (!remoteCompany && cleanCode !== "ACME-2026") {
				toast.error(`Código corporativo "${cleanCode}" não foi encontrado. Verifique com o Key User.`);
				return false;
			}
			const companyId = remoteCompany?.id || `comp-${cleanCode.toLowerCase().replace("-", "_")}`;
			const resolvedName = remoteCompany?.name || `Corporação (${cleanCode})`;
			const companyIdeas = await loadCompanyIdeasFromSupabase(cleanCode);
			const applicantName = (user?.user_metadata)?.name || user?.email?.split("@")[0] || "Colaborador(a)";
			const applicantEmail = user?.email || "colaborador@empresa.com";
			await createCompanyJoinRequest({
				id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				companyId,
				companyCode: cleanCode,
				userId: user?.id,
				userName: applicantName,
				userEmail: applicantEmail,
				department: "tech",
				role: "Colaborador(a)",
				status: "pending",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			const newJoinedCompany = {
				id: companyId,
				shareCode: cleanCode,
				name: resolvedName,
				industry: remoteCompany?.industry || "Tecnologia & Inovação",
				mission: remoteCompany?.mission || "Crescimento e foco em entregas.",
				sectors: defaultCompanySectors,
				members: [{
					id: user?.id || `user-${Date.now()}`,
					name: applicantName,
					role: "Colaborador(a)",
					email: applicantEmail,
					department: "tech",
					isKeyUser: false,
					status: "pending"
				}],
				keyUserName: remoteCompany?.keyUserName || "Key User",
				isKeyUser: false
			};
			setData((prev) => {
				const existingCompanies = prev.companies || (prev.companyWorkspace ? [prev.companyWorkspace] : []);
				const updatedCompanies = [newJoinedCompany, ...existingCompanies.filter((c) => c.id !== newJoinedCompany.id)];
				return {
					...prev,
					workspaceMode: "business",
					companies: updatedCompanies,
					companyWorkspace: newJoinedCompany,
					activeCompanyId: newJoinedCompany.id,
					ideas: [...companyIdeas, ...prev.ideas.filter((i) => !companyIdeas.some((ci) => ci.id === i.id))]
				};
			});
			toast.success(`Pedido de adesão enviado ao Key User de ${resolvedName}! 🏢`);
			return true;
		} catch (err) {
			toast.error(`Não foi possível conectar à empresa: ${err?.message || "Código inválido"}`);
			return false;
		} finally {
			setIsSyncing(false);
		}
	};
	const switchCompany = async (companyId) => {
		const target = (data.companies || (data.companyWorkspace ? [data.companyWorkspace] : [])).find((c) => c.id === companyId);
		if (!target) {
			toast.error("Empresa não encontrada na sua lista.");
			return;
		}
		setData((prev) => ({
			...prev,
			workspaceMode: "business",
			companyWorkspace: target,
			activeCompanyId: target.id
		}));
		if (target.isKeyUser && target.pendingRequests) setPendingRequests(target.pendingRequests);
		else setPendingRequests([]);
		if (target.id) try {
			const freshCompanyIdeas = await loadCompanyIdeasFromSupabase(target.id);
			if (freshCompanyIdeas.length > 0) setData((prev) => {
				const map = /* @__PURE__ */ new Map();
				prev.ideas.forEach((i) => map.set(i.id, i));
				freshCompanyIdeas.forEach((i) => map.set(i.id, i));
				return {
					...prev,
					ideas: Array.from(map.values())
				};
			});
		} catch (err) {
			console.warn("Erro ao carregar ideias da empresa selecionada:", err);
		}
		toast.success(`Alternado para a empresa "${target.name}"! 🏢`);
	};
	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setProfile(null);
		setPendingRequests([]);
		setData((prev) => ({
			...prev,
			ideas: [],
			sectors: [],
			profile: {
				name: "Criador(a)",
				role: "Criador(a)",
				streak: 1
			},
			workspaceMode: "personal",
			companies: [],
			companyWorkspace: void 0,
			activeCompanyId: void 0
		}));
		try {
			sessionStorage.removeItem("ideaflow_session_unlocked");
			localStorage.removeItem("ideaflow-v1");
			localStorage.removeItem("ideaflow_guest_session");
			localStorage.removeItem("ideaflow_personal_pin");
		} catch {}
		toast.info("Sessão encerrada com segurança.");
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("ideaflow:login"));
	};
	const userCompanies = data.companies || (data.companyWorkspace ? [data.companyWorkspace] : []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FlowContext.Provider, {
		value: {
			data,
			setData,
			updateIdea,
			deleteIdea,
			ready,
			user,
			profile,
			signOut,
			syncWithCloud,
			isSyncing,
			personalPin,
			setPersonalPin,
			requestSwitchWorkspace,
			joinCompanyByCode,
			openPinModal: () => setPinModalOpen(true),
			openCompanyAccessModal: (tab = "join") => {
				setCompanyAccessInitialTab(tab);
				setCompanyAccessModalOpen(true);
			},
			pendingRequests,
			approveRequest,
			rejectRequest,
			companies: userCompanies,
			activeCompany: data.companyWorkspace,
			switchCompany
		},
		children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonalPinModal, {
				open: pinModalOpen,
				onClose: () => {
					setPinModalOpen(false);
					setOnPinSuccessCallback(null);
				},
				onSuccess: () => {
					if (onPinSuccessCallback) {
						onPinSuccessCallback();
						setOnPinSuccessCallback(null);
					} else setData((prev) => ({
						...prev,
						workspaceMode: targetWorkspace
					}));
				},
				currentPin: personalPin,
				onUpdatePin: setPersonalPin,
				targetWorkspace
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAccessModal, {
				open: companyAccessModalOpen,
				initialTab: companyAccessInitialTab,
				onOpenChange: setCompanyAccessModalOpen,
				onSuccess: () => {
					setData((prev) => ({
						...prev,
						workspaceMode: "business"
					}));
				}
			})
		]
	});
}
function useFlow() {
	const ctx = (0, import_react.useContext)(FlowContext);
	if (!ctx) throw new Error("useFlow deve ser usado dentro de um FlowProvider");
	return ctx;
}
var PREFERRED_AI_KEY = "ideaflow_preferred_ai";
function cleanApiKey(key) {
	if (!key) return "";
	return key.trim().replace(/^Bearer\s+/i, "").replace(/^["']|["']$/g, "");
}
function getActiveGeminiKey() {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("ideaflow_gemini_key") || localStorage.getItem("ideaflow-gemini-key");
		if (stored && stored.trim()) return cleanApiKey(stored);
	}
	const envKey = typeof process !== "undefined" ? process.env?.["VITE_GEMINI_API_KEY"] || process.env?.["GEMINI_API_KEY"] : "";
	if (typeof envKey === "string" && envKey.trim()) return cleanApiKey(envKey);
	return "";
}
function getActiveGroqKey() {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("ideaflow_groq_key") || localStorage.getItem("ideaflow-groq-key");
		if (stored && stored.trim()) return cleanApiKey(stored);
	}
	const envKey = "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";
	if (envKey.trim()) return cleanApiKey(envKey);
	return "";
}
function getPreferredAiProvider() {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem(PREFERRED_AI_KEY);
		if (stored === "groq" || stored === "gemini") return stored;
	}
	if (getActiveGeminiKey()) return "gemini";
	if (getActiveGroqKey()) return "groq";
	return "gemini";
}
/**
* Dispara uma chamada centralizada ao endpoint de IA no backend (/api/ai ou /api/gemini).
*/
async function callAiServer(payload) {
	const provider = payload.provider || getPreferredAiProvider();
	const apiKey = payload.apiKey || (provider === "gemini" ? getActiveGeminiKey() : getActiveGroqKey());
	for (const ep of ["/api/ai", "/api/gemini"]) try {
		const res = await fetch(ep, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...payload,
				provider,
				apiKey
			})
		});
		if (res.ok) {
			const data = await res.json();
			if (data && (data.success || data.reply || data.parsed || data.modules)) return data;
		}
	} catch {}
	return {
		success: false,
		error: "Servidor de IA indisponível."
	};
}
async function testAiConnection(provider, apiKey) {
	return callAiServer({
		action: "test",
		provider,
		apiKey
	});
}
/**
* Constrói um dossiê analítico aprofundado dos funis atuais do criador.
* Utilizado por Groq, Gemini e pelo Motor Cognitivo Local.
*/
function generateFunnelDossier(allIdeas = [], sectors = [], contextIdea) {
	const active = allIdeas.filter((i) => !i.archived);
	const stages = [
		"Faísca",
		"Estrutura",
		"Em Fluxo",
		"Ajustes",
		"Realidade"
	];
	const byStage = {
		0: active.filter((i) => i.stage === 0),
		1: active.filter((i) => i.stage === 1),
		2: active.filter((i) => i.stage === 2),
		3: active.filter((i) => i.stage === 3),
		4: active.filter((i) => i.stage === 4)
	};
	const urgent = active.filter((i) => i.priority === "Urgente" && i.stage < 4);
	const totalMinutes = active.reduce((s, i) => s + i.minutes, 0);
	const dedicatedMinutes = active.reduce((s, i) => s + i.dedicated, 0);
	let out = `### ESTUDO DO FUNIL EM TEMPO REAL DO CRIADOR:\n`;
	out += `- Total de ideias ativas: ${active.length}\n`;
	out += `- Distribuição por estágios do funil:\n`;
	out += `  • Faísca (ideias brutas/iniciais): ${byStage[0].length} [${byStage[0].map((i) => `"${i.title}"`).join(", ") || "nenhuma"}]\n`;
	out += `  • Estrutura (em planejamento): ${byStage[1].length} [${byStage[1].map((i) => `"${i.title}"`).join(", ") || "nenhuma"}]\n`;
	out += `  • Em Fluxo (em execução ativa): ${byStage[2].length} [${byStage[2].map((i) => `"${i.title}"`).join(", ") || "nenhuma"}]\n`;
	out += `  • Ajustes (refinamento/testes): ${byStage[3].length} [${byStage[3].map((i) => `"${i.title}"`).join(", ") || "nenhuma"}]\n`;
	out += `  • Realidade (concluídas com sucesso): ${byStage[4].length} [${byStage[4].map((i) => `"${i.title}"`).join(", ") || "nenhuma"}]\n`;
	if (urgent.length > 0) out += `- Ideias Urgentes que demandam foco imediato: ${urgent.map((i) => `"${i.title}" (Próximo: ${i.immediate})`).join("; ")}\n`;
	out += `- Foco investido: ${dedicatedMinutes} min de ${totalMinutes} min planejados.\n`;
	if (contextIdea) {
		out += `\n### IDEIA SELECIONADA EM DESTAQUE NO CHAT:\n`;
		out += `- Título: "${contextIdea.title}" (Setor: ${contextIdea.sector}, Prioridade: ${contextIdea.priority}, Estágio: ${stages[contextIdea.stage]})\n`;
		out += `- Resumo: "${contextIdea.summary}"\n`;
		out += `- Escopo: "${contextIdea.scope || "Não informado"}"\n`;
		out += `- Próxima ação imediata: "${contextIdea.immediate}"\n`;
		out += `- Passos:\n${contextIdea.steps.map((st, i) => `  ${i + 1}. [${st.done ? "FEITO" : "PENDENTE"}] ${st.text} (${st.minutes} min)`).join("\n")}\n`;
	} else if (active.length > 0) {
		out += `\n### DOSSIÊ DETALHADO DAS IDEIAS ATIVAS:\n`;
		active.slice(0, 10).forEach((i) => {
			const pending = i.steps.filter((s) => !s.done);
			const done = i.steps.filter((s) => s.done);
			out += `• "${i.title}" | Estágio: ${stages[i.stage]} | Setor: ${i.sector} | Prioridade: ${i.priority}\n`;
			out += `  Resumo: ${i.summary}\n`;
			out += `  Passos: ${done.length}/${i.steps.length} concluídos. Próximo passo: "${i.immediate || pending[0]?.text || "Nenhum"}"\n`;
		});
	}
	return out;
}
/**
* Normaliza o texto em português brasileiro:
* 1. Remove acentuação gráfica
* 2. Limpa pontuações
* 3. Mapeia gírias e abreviações da internet (vc -> você, oq -> o que, pq -> porque, qm -> quem, blz -> beleza...)
*/
function normalizeQuery(text) {
	const raw = text.trim();
	const cleanPunct = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, " ");
	const slangMap = {
		"vc": "voce",
		"vce": "voce",
		"oce": "voce",
		"vcs": "voces",
		"qm": "quem",
		"eh": "e",
		"pq": "porque",
		"pque": "porque",
		"pk": "porque",
		"oq": "o que",
		"oque": "o que",
		"kd": "onde",
		"tb": "tambem",
		"tbm": "tambem",
		"blz": "beleza",
		"flw": "falou",
		"vlw": "valeu",
		"obg": "obrigado",
		"obgd": "obrigado",
		"obgda": "obrigada",
		"td": "tudo",
		"tdo": "tudo",
		"hj": "hoje",
		"q": "que",
		"ia": "ia",
		"ai": "ia",
		"gpt": "chatgpt",
		"app": "aplicativo",
		"dps": "depois",
		"msg": "mensagem"
	};
	const rawTokens = cleanPunct.split(/\s+/).filter(Boolean);
	const mappedTokens = [];
	for (const t of rawTokens) if (slangMap[t]) mappedTokens.push(...slangMap[t].split(" "));
	else mappedTokens.push(t);
	return {
		normalized: mappedTokens.join(" "),
		tokens: mappedTokens,
		raw
	};
}
/**
* Motor de IA Heurística e Cognitiva Oficial do Ideaflow.
* Analisa a fundo o funil real do usuário, cruza os estágios e responde
* diretamente à pergunta feita de forma conversacional, empática e humana (estilo ChatGPT).
*/
function localAiResponse(userMessage, contextIdea, allIdeas, sectors) {
	const { normalized, raw } = normalizeQuery(userMessage);
	const query = userMessage.toLowerCase().trim();
	const activeIdeas = (allIdeas || []).filter((i) => !i.archived);
	const stages = [
		"Faísca",
		"Estrutura",
		"Em Fluxo",
		"Ajustes",
		"Realidade"
	];
	if (normalized.includes("depress") || normalized.includes("deprimid") || normalized.includes("triste") || normalized.includes("chorar") || normalized.includes("choro") || normalized.includes("angusti") || normalized.includes("desesper") || normalized.includes("ansiedad") || normalized.includes("crise") || normalized.includes("panico") || normalized.includes("exausto") || normalized.includes("exausta") || normalized.includes("burnout") || normalized.includes("sem forca") || normalized.includes("sem energia") || normalized.includes("nao aguento") || normalized.includes("vazio") || normalized.includes("sozinho") || normalized.includes("solidao") || normalized.includes("desanimad") || normalized.includes("desistir") || normalized.includes("cansado da vida")) return "Eu sinto muito que você esteja passando por esse momento tão difícil, e quero que saiba que eu te ouço com todo o respeito, carinho e acolhimento do mundo. ❤️‍🩹\n\nAntes de pensar em qualquer plano, processo ou ideia: **você não precisa ser produtivo hoje. Você não precisa dar conta de nada agora.**\n\nA sua vida, o seu bem-estar e o seu coração são infinitamente mais valiosos do que qualquer projeto ou meta no aplicativo. A depressão e o cansaço extremo fazem parecer que estamos sozinhos e que o peso é insuportável — mas esse momento difícil não define quem você é, e **você não precisa carregar isso em silêncio**.\n\n🌿 **O que você pode fazer com gentileza por você agora:**\n• **Respire sem pressa:** Solte os ombros, beba um copo de água fresca e procure um cantinho silencioso e confortável para deitar ou sentar.\n• **Tire todo o peso das cobranças:** Diga para si mesmo(a): *\"Hoje eu só preciso descansar e cuidar de mim\"*. Não se culpe por parar.\n• **Converse com quem te ama:** Mande uma mensagem sincera para um amigo querido, familiar ou parceiro. Falar sobre o que dói alivia a alma.\n• **Apoio profissional e gratuito:** No Brasil, o **CVV (Centro de Valorização da Vida)** oferece escuta amiga, gratuita e 24h por dia. Basta ligar para o número **188** ou acessar [cvv.org.br](https://www.cvv.org.br).\n\nSuas ideias no Ideaflow vão ficar aqui guardadas com carinho, esperando pelo momento em que você estiver bem e descansado(a).\n\nSe você quiser desabafar mais sobre o que está sentindo, estou aqui para te ouvir sem nenhum julgamento. Você quer me contar o que aconteceu?";
	if (normalized.includes("quem e voce") || normalized.includes("quem e vc") || normalized.includes("qm e vc") || normalized.includes("quem e tu") || normalized.includes("quem e o mentor") || normalized.includes("qual o seu nome") || normalized.includes("qual e seu nome") || normalized.includes("qual seu nome") || normalized.includes("o que voce e") || normalized.includes("oque voce e") || normalized.includes("o que e voce") || normalized.includes("o que voce faz") || normalized.includes("oque voce faz") || normalized.includes("como voce funciona") || normalized.includes("como funciona voce") || normalized.includes("como voce me ajuda") || normalized.includes("como me ajuda") || normalized.includes("voce e um robo") || normalized.includes("voce e robo") || normalized.includes("voce e uma ia") || normalized.includes("voce e ia") || normalized.includes("voce e chatgpt") || normalized.includes("voce e o chatgpt") || normalized.includes("quem te criou") || normalized.includes("quem criou voce") || normalized.includes("quem te inventou") || normalized.includes("quem te fez") || normalized.includes("quem fez voce") || normalized.includes("apresente se") || normalized.includes("se apresente") || normalized === "quem e" || normalized === "quem e voce") return "Olá! Eu sou o **Mentor Ideaflow** — sua inteligência artificial oficial e copiloto inteligente integrado aqui no app! 🧠✨\n\nEu funciono exatamente como o seu ChatGPT pessoal para ideias, rotina e projetos:\n\n• **Conversa Aberta e Humana:** Pode me perguntar qualquer coisa, tirar dúvidas de tecnologia, negócios, vida pessoal, pedir conselhos ou apenas trocar uma ideia descontraída.\n• **Estrategista de Funis em Tempo Real:** Acompanho suas ideias nos 5 estágios (*Faísca ➔ Estrutura ➔ Em Fluxo ➔ Ajustes ➔ Realidade*) e te ajudo a priorizar a próxima ação sem se perder.\n• **Destravador de Procrastinação:** Se você estiver com preguiça ou travado, eu quebro seus objetivos em micro-passos leves de 15 minutos para fazer a engrenagem girar.\n• **Acolhimento Real:** Respeito sua energia. Se você estiver cansado(a) ou em um dia difícil, estou aqui para acolher com empatia, sem cobrança de produtividade tóxica.\n\nPode conversar comigo com total naturalidade! Como posso te ajudar ou sobre o que você quer conversar agora?";
	if (/^(oi|oie|ola|opa|e ai|fala ai|salve|hey|hello|bom dia|boa tarde|boa noite|tudo bem|tudo bom|como vai|como voce esta|como voce ta|td bem|blz)[\s!?.]*$/i.test(normalized) || normalized === "oi tudo bem" || normalized === "oi tudo bom" || normalized === "ola tudo bem" || normalized === "ola tudo bom" || normalized.startsWith("oi ") && normalized.length < 30 || normalized.startsWith("ola ") && normalized.length < 30 || normalized.startsWith("opa ") && normalized.length < 25 || normalized.startsWith("bom dia") && normalized.length < 25 || normalized.startsWith("boa tarde") && normalized.length < 25 || normalized.startsWith("boa noite") && normalized.length < 25) {
		const greetingHour = (/* @__PURE__ */ new Date()).getHours();
		const timeGreeting = greetingHour < 12 ? "Bom dia" : greetingHour < 18 ? "Boa tarde" : "Boa noite";
		const activeCount = activeIdeas.length;
		return `Olá! ${timeGreeting}! Tudo ótimo por aqui, e com você? Como está seu dia hoje? 😊\n\nEstou aqui com você como seu mentor e parceiro de conversa. Podemos bater um papo aberto, organizar ideias que estão soltas na sua cabeça, destravar alguma dúvida ou analisar o seu funil${activeCount > 0 ? ` (já estou acompanhando suas **${activeCount} ideia(s)** ativas)` : ""}.\n\nO que está passando pela sua mente agora? Pode falar à vontade! ✨`;
	}
	if (/^(obrigad[oa]|valeu|show|perfeito|maravilha|otimo|top|muito bom|tmj|sensacional|agradeco|boa|legal)[\s!?.]*$/i.test(normalized) || normalized.includes("muito obrigado") || normalized.includes("muito obrigada") || normalized.includes("valeu mesmo") || normalized.includes("valeu amigo")) return "Por nada! Fico muito feliz em caminhar junto com você nessa jornada. Conte sempre comigo! 🌟\n\nSempre que surgir uma nova ideia, um desafio para destravar ou se só quiser pensar junto, é só me chamar aqui no chat. Vamos em frente! 🚀";
	if (normalized.includes("piada") || normalized.includes("me faz rir") || normalized.includes("conta uma piada") || normalized.includes("algo engracado")) return "Aqui vai uma para descontrair: 😂\n\n*Por que os programadores preferem o modo escuro?*\n*Porque a luz atrai bugs!* 🐛💡\n\nE mais uma:\n*O que o café disse para o açúcar na segunda-feira de manhã?*\n*\"Sem você, a vida é amarga demais!\"* ☕\n\nBora dar risada e seguir em frente! O que mais manda por aí?";
	if (normalized.includes("sentido da vida") || normalized.includes("o que e a vida") || normalized.includes("por que existimos") || normalized.includes("porque existimos") || normalized.includes("qual o proposito") || normalized.includes("qual o sentido")) return "Essa é uma das perguntas mais bonitas e profundas da humanidade! 🌌✨\n\nPara mim, o sentido da vida não é algo estático que a gente \"encontra\" pronto jogado pelo caminho, mas sim algo que a gente **constrói ativamente** todos os dias:\n\n1. **Estar presente:** Viver de verdade os momentos com quem amamos e nas coisas simples do cotidiano.\n2. **Criar e materializar:** Tirar ideias da mente e trazer para o mundo real — seja uma conversa sincera, um projeto criativo, uma melhoria na sua casa ou um ato de carinho.\n3. **Evoluir com gentileza:** Aceitar nossas falhas, cuidar da nossa mente e nos tornarmos 1% mais sábios e compreensivos a cada ciclo.\n\nComo dizia Viktor Frankl: *\"Aquele que tem um 'porquê' para viver pode suportar quase qualquer 'como'\"*.\n\nE para você, o que mais traz brilho nos olhos e significado aos seus dias hoje?";
	if (normalized.includes("o que e o ideaflow") || normalized.includes("o que e ideaflow") || normalized.includes("como funciona o ideaflow") || normalized.includes("como funciona o app") || normalized.includes("como funciona o aplicativo") || normalized.includes("como usar o ideaflow") || normalized.includes("como usar o app") || normalized.includes("me explica o ideaflow") || normalized.includes("me explica o app") || normalized.includes("tutorial")) return "O **Ideaflow** é o seu fluxo consciente para transformar ideias soltas em realizações práticas, com leveza e sem ansiedade! 🌊💡\n\nAqui está como o app funciona de forma simples:\n\n1. **Setores (Seus Universos):** Suas ideias são organizadas por áreas de vida (ex: Tecnologia, Negócios, Saúde, Pessoal, Casa). Você pode criar, editar ou excluir setores quando quiser.\n2. **Os 5 Estágios do Funil:**\n   • 🌟 **Faísca:** O lampejo inicial que acabou de surgir na mente.\n   • 📐 **Estrutura:** Quando você define 3 passos concretos de até 25 minutos.\n   • ⚡ **Em Fluxo:** A ideia em execução física ativa.\n   • 🔧 **Ajustes:** Testes finais, acabamento e polimento.\n   • 🏆 **Realidade:** A ideia concluída e entregue com sucesso!\n3. **Aba Hoje & Bloco de Foco (25 min):** Um temporizador Pomodoro integrado para você sentar, focar em uma única ação física sem distrações e avançar.\n4. **Mentor IA Integrado:** Eu mesmo! Seu parceiro para pensar junto, tirar dúvidas e analisar seus funis a qualquer momento.\n\nVocê pode tocar no botão **+** na barra inferior para capturar sua primeira ideia agora mesmo!";
	if (normalized.includes("o que e funil") || normalized.includes("o que e um funil") || normalized.includes("como funciona o funil") || normalized.includes("estagios do funil") || normalized.includes("etapas do funil")) return "Um **Funil de Ideias** é o caminho visual que separa um simples pensamento de uma realização concluída no mundo real! 🎯\n\nGeralmente temos dezenas de pensamentos por dia, mas tentar fazer tudo de uma vez gera paralisia por análise. O funil resolve isso filtrando sua energia em 5 fases sequenciais:\n\n1. **Faísca (Entrada do Funil):** Onde você despeja ideias brutas sem se preocupar com perfeição.\n2. **Estrutura (Filtro & Plano):** Onde você escolhe quais ideias valem a pena e divide em passos curtos.\n3. **Em Fluxo (Gargalo de Ação):** Onde você limita o trabalho em progresso (WIP). O ideal é ter no máximo 1 ou 2 ideias aqui ao mesmo tempo!\n4. **Ajustes (Refinamento):** Onde você lapida detalhes e revisa o resultado.\n5. **Realidade (Saída Realizada):** Ideia entregue e celebrada!\n\nQuer que eu analise como as suas ideias estão distribuídas no seu funil agora?";
	if (normalized.includes("como focar") || normalized.includes("como ter foco") || normalized.includes("como ter disciplina") || normalized.includes("como ser produtivo") || normalized.includes("rotina produtiva") || normalized.includes("como estudar") || normalized.includes("metodo pomodoro") || normalized.includes("dicas de foco")) return "Para ter um foco real e sustentável, o segredo não é força de vontade bruta, mas sim **reduzir o atrito e as distrações**: 🧠⚡\n\nAqui estão 3 técnicas comprovadas pela neurociência:\n\n1. **A Regra da Aba Única:** Feche todas as abas e notificações do celular. Nosso cérebro perde até 23 minutos para voltar ao foco profundo após uma única interrupção.\n2. **Blocos de 25 Minutos (Pomodoro):** Trabalhe intensamente por 25 minutos e descanse 5 minutos longe da tela. O Ideaflow tem esse temporizador na aba **'Hoje'**!\n3. **Micro-passos ridiculamente fáceis:** Quando uma tarefa parece pesada, seu cérebro procrastina para poupar energia. Quebre a tarefa até que o primeiro passo leve apenas 2 minutos para começar.\n\nTopa abrir a aba **'Hoje'** agora e rodar um bloco de 25 minutos focado?";
	if (normalized.includes("estou em duvida") || normalized.includes("nao sei o que escolher") || normalized.includes("nao sei oque escolher") || normalized.includes("o que e melhor") || normalized.includes("qual escolher") || normalized.includes("me ajuda a decidir") || normalized.includes("o que voce escolheria")) return "Tomar decisões pode ser exaustivo, mas aqui está um método rápido para clarear a mente: 🤔💡\n\nFaça essas 3 perguntas para as suas opções:\n\n1. **Qual delas tem o menor custo de reversão?** Se você escolher a Opção A e não der certo, é fácil voltar atrás? Escolha sempre decisões reversíveis primeiro para testar rápido.\n2. **O Teste das 48 Horas:** Imagine que você escolheu uma das opções com 100% de certeza. Como seu estômago e sua respiração reagem nas próximas horas? Alívio ou peso?\n3. **A Regra do Arrependimento de 80 Anos:** Quando você tiver 80 anos olhando para trás, de qual caminho você mais se arrependeria de NÃO ter tentado?\n\nMe conte aqui: quais são as opções que estão disputando espaço na sua mente? Vamos analisar os prós e contras juntos!";
	if (query.includes("estou pensando em") || query.includes("quero criar") || query.includes("quero fazer") || query.includes("tive uma ideia") || query.includes("ideia de") || query.includes("sugestão de projeto") || query.includes("sugestao de projeto") || query.includes("como montar") || query.includes("como criar")) return "Essa ideia parece excelente! Adorei a iniciativa de dar o primeiro passo. 💡✨\n\nPara te ajudar a tirar isso da cabeça e transformar em realidade prática, aqui estão 3 reflexões rápidas:\n\n1. **Quem é o público ou quem mais vai se beneficiar disso?** (Você mesmo, seus clientes, sua família ou sua equipe?)\n2. **Qual é a menor versão possível (o MVP)?** O que você conseguiria colocar no ar ou testar em poucos dias, sem precisar de ferramentas complexas?\n3. **Primeiro micro-passo de 15 minutos:** Qual é a primeira coisa concreta que você pode escrever, pesquisar ou rascunhar ainda hoje?\n\nSe quiser, toque no botão **+** na barra inferior para capturar essa faísca agora no Ideaflow, ou me conte mais detalhes aqui no chat para irmos refinando juntos!";
	const matchedIdea = contextIdea || activeIdeas.find((i) => {
		const titleLower = i.title.toLowerCase();
		if (query.includes(titleLower)) return true;
		return titleLower.split(/\s+/).filter((w) => w.length >= 4).some((w) => query.includes(w));
	});
	if (matchedIdea && (query.includes("passo") || query.includes("etapa") || query.includes("fazer") || query.includes("como") || query.includes("ajud") || query.includes("status") || query.includes("oque") || query.includes("o que") || query.includes("próximo") || query.includes("proximo"))) {
		const doneSteps = matchedIdea.steps.filter((s) => s.done);
		const pendingSteps = matchedIdea.steps.filter((s) => !s.done);
		const nextStep = pendingSteps[0]?.text || matchedIdea.immediate || "Definir o próximo marco de 15 minutos.";
		return `Analisando sua ideia **"${matchedIdea.title}"**:\n\n• **Estágio Atual:** ${stages[matchedIdea.stage]} (Setor: ${matchedIdea.sector} | Prioridade: ${matchedIdea.priority})\n• **Progresso:** ${doneSteps.length} de ${matchedIdea.steps.length} passos concluídos (${matchedIdea.dedicated} min de foco investidos de ${matchedIdea.minutes} min totais).\n` + (matchedIdea.scope ? `• **Escopo Definido:** *"${matchedIdea.scope}"*\n\n` : "\n") + `🎯 **Sua Próxima Ação de Maior Alavancagem:**\n> **"${nextStep}"**\n\n💡 **Diagnóstico do Mentor para essa ideia:**\n` + (matchedIdea.stage === 0 ? `Ela ainda está no estágio de **Faísca**. Para destravar, o segredo não é tentar fazer tudo, mas transformar esse rascunho em 3 passos concretos de até 25 minutos na aba 'Estrutura'.` : matchedIdea.stage === 1 ? `Ela já tem estrutura! O momento agora é puxar essa ideia para a aba **'Hoje'** e abrir um bloco de foco de 15 minutos para fazer a primeira ação física.` : matchedIdea.stage === 2 ? `Esta ideia já está **Em Fluxo**! Faltam apenas ${pendingSteps.length} passo(s) pendentes. Foque em concluir um passo de cada vez para que ela alcance a etapa de Ajustes.` : matchedIdea.stage === 3 ? `Quase lá! Esta ideia está em **Ajustes**. Faça o teste final e mova para **Realidade**!` : `Esta ideia já é uma **Realidade Concluída**! Parabéns pela entrega! 🏆`);
	}
	if (query.includes("funil") || query.includes("status") || query.includes("gargalo") || query.includes("analis") || query.includes("como estão") || query.includes("como estao") || query.includes("visão geral") || query.includes("visao geral") || query.includes("diagnost")) {
		if (activeIdeas.length === 0) return "📊 **Diagnóstico do seu Funil de Ideias:**\n\nSeu funil está atualmente **zerado e limpo**! Isso é perfeito para começar sem ruídos ou dados antigos acumulados.\n\n🎯 **Sua Primeira Missão:**\n1. Vá até a aba **Setores** e crie ou escolha seu primeiro Universo (como Tecnologia, Relacionamento ou Saúde).\n2. Capture sua primeira faísca no botão **+**!\n\nAssim que cadastrar, eu analisarei os estágios e te mostrarei onde colocar sua energia! ✨";
		const stage0 = activeIdeas.filter((i) => i.stage === 0);
		const stage1 = activeIdeas.filter((i) => i.stage === 1);
		const stage2 = activeIdeas.filter((i) => i.stage === 2);
		const stage3 = activeIdeas.filter((i) => i.stage === 3);
		const stage4 = activeIdeas.filter((i) => i.stage === 4);
		const urgentPending = activeIdeas.filter((i) => i.priority === "Urgente" && i.stage < 4);
		const inFlowCount = stage2.length;
		let diagnosis = `📊 **Diagnóstico Aprofundado do seu Funil de Ideias:**\n\n`;
		diagnosis += `Você tem **${activeIdeas.length} ideia(s) ativas** mapeadas no sistema. Veja exatamente como elas estão distribuídas pelas 5 etapas de realização:\n\n`;
		diagnosis += `1. 🌟 **Faísca (${stage0.length}):** ${stage0.length > 0 ? stage0.map((i) => `*${i.title}*`).join(", ") : "Nenhuma ideia acumulada aqui (excelente!)."}\n`;
		diagnosis += `2. 📐 **Estrutura (${stage1.length}):** ${stage1.length > 0 ? stage1.map((i) => `*${i.title}*`).join(", ") : "Nenhuma ideia em planejamento preliminar."}\n`;
		diagnosis += `3. ⚡ **Em Fluxo (${stage2.length}):** ${stage2.length > 0 ? stage2.map((i) => `*${i.title}*`).join(", ") : "Nenhuma em execução ativa no momento."}\n`;
		diagnosis += `4. 🔧 **Ajustes (${stage3.length}):** ${stage3.length > 0 ? stage3.map((i) => `*${i.title}*`).join(", ") : "Nenhuma em fase de testes."}\n`;
		diagnosis += `5. 🏆 **Realidade (${stage4.length}):** ${stage4.length > 0 ? stage4.map((i) => `*${i.title}*`).join(", ") : "Ainda buscando a primeira realização completa!"}\n\n`;
		diagnosis += `🔍 **Análise Crítica de Gargalos & Tração:**\n`;
		if (inFlowCount > 2) diagnosis += `⚠️ **Atenção ao Foco Disperso:** Você tem ${inFlowCount} ideias no estágio 'Em Fluxo' ao mesmo tempo (${stage2.map((i) => `"${i.title}"`).join(", ")}). Quem tenta avançar 3 frentes ao mesmo tempo avança 3x mais devagar. Escolha apenas **1** para levar até 'Realidade' antes de destravar as outras.\n\n`;
		else if (stage0.length > 3) diagnosis += `⚠️ **Excesso de Faíscas Sem Estrutura:** Há ${stage0.length} ideias no rascunho inicial. Escolha a mais empolgante e defina 3 passos práticos para puxá-la para a 'Estrutura'.\n\n`;
		else diagnosis += `✅ **Fluxo Equilibrado:** Seu funil está fluindo de maneira harmoniosa, sem grandes acúmulos.\n\n`;
		if (urgentPending.length > 0) {
			const topUrgent = urgentPending[0];
			diagnosis += `🔥 **Ideia Prioritária Recomendada Hoje:** **"${topUrgent.title}"** (Marcada como Urgente). Próxima ação: *"${topUrgent.immediate}"*.`;
		} else if (stage2.length > 0) {
			const topFlow = stage2[0];
			diagnosis += `🎯 **Ideia Prioritária Recomendada Hoje:** **"${topFlow.title}"** (Já está Em Fluxo). Próxima ação: *"${topFlow.immediate}"*.`;
		} else if (activeIdeas.length > 0) {
			const topIdea = activeIdeas[0];
			diagnosis += `🎯 **Próximo Passo Recomendado:** Avance na ideia **"${topIdea.title}"** executando a ação: *"${topIdea.immediate}"*.`;
		}
		return diagnosis;
	}
	if (query.includes("prioridade") || query.includes("o que fazer hoje") || query.includes("oque fazer hoje") || query.includes("por onde começo") || query.includes("por onde comeco") || query.includes("qual focar") || query.includes("qual escolher") || query.includes("qual comeco")) {
		if (activeIdeas.length === 0) return "Como seu **Mentor Ideaflow**, notei que você ainda não tem ideias cadastradas no funil!\n\nPara começar com o pé direito:\n1. Crie seu primeiro Setor (ex: Tecnologia, Saúde, Vida Pessoal).\n2. Cadastre uma faísca simples que você quer ver realizada esta semana.\nDepois volte aqui que eu te guiarei passo a passo! 🚀";
		const urgent = activeIdeas.find((i) => i.priority === "Urgente" && i.stage < 4);
		const inFlow = activeIdeas.find((i) => i.stage === 2);
		const structured = activeIdeas.find((i) => i.stage === 1);
		const chosen = urgent || inFlow || structured || activeIdeas[0];
		return `🎯 **Sua Prioridade Absoluta Hoje: "${chosen.title}"**\n\nEstudei suas ideias ativas e selecionei esta por um motivo claro:\n• **Critério de Escolha:** ${chosen.priority === "Urgente" ? "Ela possui a etiqueta **Urgente** e precisa de atenção para não virar gargalo." : chosen.stage === 2 ? "Ela já está na fase **Em Fluxo**! Concluir o que já foi iniciado traz 10x mais alívio mental do que começar algo novo." : "Ela está bem estruturada e pronta para o primeiro bloco de execução."}\n• **Setor:** ${chosen.sector} | **Estágio:** ${stages[chosen.stage]}\n• **Ação Imediata de 15 Minutos:**\n  > **"${chosen.immediate}"**\n\n⏱️ **Roteiro de 25 minutos:**\n1. Abra o card de **"${chosen.title}"** no Ideaflow.\n2. Toque em **"Começar foco"** (temporizador de 25 min).\n3. Faça unicamente este passo e marque como concluído.\n\nTopa fazer esse bloco de foco agora?`;
	}
	if (query.includes("procrastin") || query.includes("destrav") || query.includes("bloquei") || query.includes("preguiça") || query.includes("desanim") || query.includes("difícil") || query.includes("dificil")) {
		const focusIdea = matchedIdea || activeIdeas.find((i) => i.stage < 4);
		return `Vamos destravar esse nó agora mesmo${focusIdea ? ` especialmente em **"${focusIdea.title}"**` : ""}! ⚡🧠\n\nA procrastinação quase nunca é preguiça. Ela é uma resposta de defesa do cérebro quando o passo está **vago demais** ou quando temos medo inconsciente de não ficar perfeito.\n\n🔥 **A Regra dos 5 Minutos (Quebra de Atrito Estático):**\n1. **Não tente terminar o projeto hoje.** Comprometa-se apenas a mexer nele por **5 minutos cronometrados**.\n2. **Reduza o passo até ficar ridículo de fácil:** Em vez de "escrever o texto todo" ou "programar a funcionalidade", seu único objetivo é "abrir o arquivo e escrever 2 linhas".\n3. Se após 5 minutos você quiser parar, tem permissão total. Em 85% dos casos, o atrito se quebra e você continua focado com satisfação.\n\n` + (focusIdea ? `🎯 **Sua micro-ação em "${focusIdea.title}":**\n> Execute apenas: *"${focusIdea.immediate}"* durante 10 minutos!\n\n` : "") + `💡 *Lembrete:* Um passo pequeno e feito hoje vale infinitamente mais que um plano genial que só existe na imaginação.`;
	}
	if (normalized.includes("indica um filme") || normalized.includes("indica filme") || normalized.includes("dica de filme") || normalized.includes("indica um livro") || normalized.includes("indica livro") || normalized.includes("dica de livro") || normalized.includes("indica uma serie") || normalized.includes("indica serie") || normalized.includes("dica de serie") || normalized.includes("indica podcast") || normalized.includes("dica de podcast") || normalized.includes("musica para focar") || normalized.includes("musica para estudar")) {
		if (normalized.includes("livro")) return "Aqui estão 3 livros extraordinários que transformam a maneira como pensamos e agimos: 📚✨\n\n1. **Hábitos Atômicos (James Clear):** O melhor guia do mundo sobre como mudanças de 1% diárias constroem resultados inacreditáveis a longo prazo.\n2. **Essencialismo (Greg McKeown):** A arte de dizer não para o trivial e dedicar toda a sua energia unicamente ao que é vital.\n3. **A Coragem de Não Agradar (Ichiro Kishimi):** Uma lição libertadora sobre psicologia adleriana, autoestima e foco no seu próprio círculo de controle.\n\nAlgum desses temas te chama mais a atenção agora?";
		if (normalized.includes("serie") || normalized.includes("filme")) return "Aqui estão excelentes indicações para inspirar e entreter: 🎬🍿\n\n• **Interestelar:** Obra-prima sobre ciência, amor, tempo e a perseverança humana.\n• **A Rede Social:** Um mergulho dinâmico e brilhante na faísca inicial de construção de um projeto global.\n• **Halt and Catch Fire (Série):** Um retrato profundo e apaixonante sobre criadores, tecnologia e a coragem de arriscar.\n\nQuer algo mais leve para relaxar ou algo instigante para pensar?";
		return "Para foco profundo e concentração, recomendo ouvir **Lo-Fi Beats**, **Synthwave Instrumental** ou playlists de **Brown Noise (Ruído Marrom)** no fone de ouvido! 🎧⚡\n\nEles acalmam o sistema límbico e criam uma barreira acústica contra distrações externas. Topa colocar um som e abrir um bloco de foco?";
	}
	if (normalized.includes("com fome") || normalized.includes("com sono") || normalized.includes("com preguica") || normalized.includes("com frio") || normalized.includes("com calor") || normalized.includes("como foi seu dia")) {
		if (normalized.includes("fome")) return "Hora de reabastecer o combustível! 🥪🍎\n\nNão dá para ter clareza mental com o estômago vazio. Faça uma pausa agora, prepare um lanche gostoso, tome uma água fresca e depois volte com a energia renovada. O que você vai comer de bom?";
		if (normalized.includes("sono") || normalized.includes("preguica")) return "O corpo e a mente dão sinais claros quando precisam de uma pausa. 🥱🛋️\n\nSe for sono acumulado, um cochilo de 20 minutos (power nap) ou uma boa noite de descanso faz milagres pela criatividade. Se for apenas preguiça momentânea, lave o rosto com água gelada e dê uma caminhada rápida de 5 minutos para oxigenar o cérebro!\n\nO que acha de dar esse intervalo para você agora?";
		return `Por aqui tudo ótimo, funcionando a todo vapor no processamento para te apoiar! 🚀 E o seu dia, como está sendo até agora?`;
	}
	if (normalized.includes("programacao") || normalized.includes("linguagem") || normalized.includes("python") || normalized.includes("javascript") || normalized.includes("react") || normalized.includes("frontend") || normalized.includes("backend") || normalized.includes("inteligencia artificial") || normalized.includes("chatgpt") || normalized.includes("algoritmo")) return "Esse é um dos meus assuntos favoritos no mundo da tecnologia! 💻🤖\n\nO ecossistema moderno está evoluindo a passos largos. Seja na construção de interfaces com React e TypeScript, na automação com Python, ou na orquestração de modelos de inteligência artificial, o mais importante não é tentar saber todas as bibliotecas de cor, mas sim **dominar os fundamentos e a lógica de resolução de problemas**.\n\nVocê está estudando ou trabalhando em algum projeto técnico agora? Se quiser, pode colar o código ou a dúvida técnica aqui que a gente resolve juntos!";
	if (raw.includes("?") || normalized.startsWith("como ") || normalized.startsWith("qual ") || normalized.startsWith("o que ") || normalized.startsWith("por que ") || normalized.startsWith("porque ") || normalized.startsWith("quando ") || normalized.startsWith("onde ") || normalized.startsWith("quem ")) return `Essa é uma ótima questão para refletirmos! 💡\n\nAnalisando sobre **"${raw.replace(/[?]/g, "").trim()}"**, aqui estão os pontos mais importantes para se levar em consideração:\n\n1. **Clareza de Objetivo:** Antes de qualquer ação, tenha muito nítido qual é o resultado que você quer alcançar e o que pode ser deixado de lado.\n2. **Passo Prático e Realista:** A melhor solução costuma ser a mais simples e viável de colocar em prática hoje, sem inventar complexidades desnecessárias.\n3. **Iteração Rápida:** Em vez de buscar uma resposta 100% perfeita de primeira, teste em pequena escala e ajuste com base no aprendizado.\n\nO que você acha dessa abordagem? Me dê mais detalhes do que você está planejando ou pensando sobre isso para aprofundarmos!`;
	return "Concordo com a reflexão que você trouxe! 💭✨\n\nTrocar ideias sobre esses temas ajuda muito a clarear o pensamento e enxergar novas perspectivas.\n\nQuer aprofundar mais esse ponto de vista, tirar alguma dúvida específica ou prefere direcionar a conversa para alguma ideia ou projeto prático? Estou à sua disposição!";
}
/**
* Planeja uma Ideia utilizando a melhor IA disponível:
* 1. Provedor Remoto Real Ativo (Google Gemini ou Groq) com consumo real de tokens
* 2. Motor Cognitivo Heurístico Local (100% Offline e livre de erros, rotulado explicitamente)
*/
async function planIdeaWithAi(rawText, sectors, fiveWhys) {
	const validWhys = fiveWhys?.filter((w) => typeof w === "string" && w.trim().length > 0) || [];
	const preferred = getPreferredAiProvider();
	const hasGemini = Boolean(getActiveGeminiKey());
	const hasGroq = Boolean(getActiveGroqKey());
	if (hasGemini || hasGroq) {
		const providerToTry = preferred === "groq" && hasGroq ? "groq" : hasGemini ? "gemini" : "groq";
		try {
			const result = await callAiServer({
				action: "plan",
				provider: providerToTry,
				rawText,
				sectors,
				fiveWhys: validWhys
			});
			if (result && result.success && result.parsed) {
				const parsed = result.parsed;
				const matchedSector = sectors.find((s) => s.id === parsed.sectorId) ?? sectors.find((s) => s.id === "personal") ?? sectors[0] ?? {
					id: "personal",
					name: "Pessoal",
					tone: "pink"
				};
				const steps = (parsed.steps || []).map((s, idx) => ({
					id: crypto.randomUUID(),
					text: s.text || `Passo ${idx + 1}`,
					minutes: Number(s.minutes) || 20,
					done: false
				}));
				const totalMinutes = steps.reduce((acc, curr) => acc + curr.minutes, 0);
				const tokensTotal = result.tokensUsed?.totalTokens ?? 0;
				const providerName = result.provider === "gemini" ? "Google Gemini" : "Groq";
				return {
					idea: {
						id: crypto.randomUUID(),
						title: parsed.title || rawText.slice(0, 50),
						summary: parsed.summary || rawText,
						sector: matchedSector.id,
						stage: 0,
						minutes: totalMinutes,
						dedicated: 0,
						priority: [
							"Urgente",
							"Importante",
							"Normal"
						].includes(parsed.priority) ? parsed.priority : "Normal",
						scope: parsed.scope || `Execução da ideia "${parsed.title}".`,
						immediate: parsed.immediate || steps[0]?.text || "Definir o primeiro resultado em uma frase.",
						clarity: parsed.clarity || "Um passo pequeno e concreto vale mais que um plano perfeito.",
						steps,
						pivots: [],
						fiveWhys: validWhys.length > 0 ? validWhys : void 0,
						notes: [{
							id: crypto.randomUUID(),
							createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit"
							}),
							text: `Planejado com IA Real: ${providerName} (${result.model || "LLM"}) • ${tokensTotal} tokens consumidos ⚡`
						}]
					},
					provider: result.provider || providerToTry,
					model: result.model,
					tokensUsed: result.tokensUsed
				};
			}
		} catch (err) {
			console.warn("Falha na IA remota ao planejar:", err);
		}
	}
	const fallback = planIdea(rawText, sectors, validWhys);
	fallback.notes = [{
		id: crypto.randomUUID(),
		createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit"
		}),
		text: "Gerado com Motor Local Heurístico (Offline) 🛡️ — configure uma chave de API em Ajustes para gastar tokens com LLMs reais."
	}];
	return {
		idea: fallback,
		provider: "local",
		isLocalFallback: true
	};
}
/**
* Função principal que consulta a IA para o chat do Mentor:
* 1. Prioriza a Groq (LLaMA 3.3/3.1 - ultra-rápida, gratuita e sem bloqueios de CORS).
* 2. Em seguida tenta o Google Gemini.
* 3. Fallback contínuo e sem falhas para o Motor Cognitivo Oficial do Ideaflow (100% Offline).
*/
async function askMentorAi({ message, contextIdea, allIdeas = [], sectors = [], history = [] }) {
	const contextText = generateFunnelDossier(allIdeas, sectors, contextIdea);
	const preferred = getPreferredAiProvider();
	const hasGemini = Boolean(getActiveGeminiKey());
	const hasGroq = Boolean(getActiveGroqKey());
	if (hasGemini || hasGroq) {
		const providerToTry = preferred === "groq" && hasGroq ? "groq" : hasGemini ? "gemini" : "groq";
		try {
			const result = await callAiServer({
				action: "mentor",
				provider: providerToTry,
				message,
				contextText,
				history
			});
			if (result && result.success && result.reply) return {
				reply: result.reply,
				provider: result.provider || providerToTry,
				model: result.model,
				tokensUsed: result.tokensUsed
			};
		} catch (err) {
			console.warn("Erro ao consultar Mentor IA no servidor:", err?.message);
		}
	}
	return {
		reply: localAiResponse(message, contextIdea, allIdeas, sectors),
		provider: "local",
		isLocalFallback: true
	};
}
/**
* Gera os módulos de um Projeto utilizando a melhor IA disponível:
* 1. Provedor Remoto Real Ativo (Google Gemini ou Groq) com consumo real de tokens
* 2. Motor Cognitivo Heurístico Local (100% Offline e livre de erros)
*/
async function generateProjectModulesWithAi(projectTitle, projectSummary, sector, fiveWhys) {
	const validWhys = fiveWhys?.filter((w) => typeof w === "string" && w.trim().length > 0) || [];
	const preferred = getPreferredAiProvider();
	const hasGemini = Boolean(getActiveGeminiKey());
	const hasGroq = Boolean(getActiveGroqKey());
	if (hasGemini || hasGroq) {
		const providerToTry = preferred === "groq" && hasGroq ? "groq" : hasGemini ? "gemini" : "groq";
		try {
			const result = await callAiServer({
				action: "project",
				provider: providerToTry,
				projectTitle,
				projectSummary,
				sector,
				fiveWhys: validWhys
			});
			if (result && result.success && Array.isArray(result.modules) && result.modules.length > 0) return {
				modules: result.modules,
				provider: result.provider || providerToTry,
				model: result.model,
				tokensUsed: result.tokensUsed
			};
		} catch (err) {
			console.warn("Falha ao gerar módulos via IA remota:", err?.message);
		}
	}
	return {
		modules: generateSubModulesAi(projectTitle, projectSummary, sector, validWhys),
		provider: "local",
		isLocalFallback: true
	};
}
/**
* Decompõe um Projeto Macro em ideias/frentes de desenvolvimento utilizando o Google Gemini AI.
* Se a API estiver indisponível ou sem chave, utiliza o motor heurístico local sem viés tecnológico.
*/
async function generateProjectModulesWithGemini(projectTitle, projectSummary, sector) {
	const geminiKey = getActiveGeminiKey();
	if (geminiKey) {
		try {
			const res = await fetch("/api/gemini", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "project",
					apiKey: geminiKey,
					projectTitle,
					projectSummary,
					sector
				})
			});
			if (res.ok) {
				const data = await res.json();
				if (data.success && Array.isArray(data.modules) && data.modules.length > 0) return {
					modules: data.modules,
					usedGemini: true
				};
			}
		} catch (err) {
			console.warn("Backend /api/gemini indisponível para frentes do projeto, tentando fallback:", err?.message);
		}
		const candidateModels = [
			"gemini-3.5-flash",
			"gemini-3.5-flash-lite",
			"gemini-3.1-flash-lite"
		];
		const prompt = `Você é o Ideaflow AI, um arquiteto prático e experiente de projetos humanos e profissionais.
O usuário está criando o seguinte projeto macro:
Título: "${projectTitle}"
Descrição/Resumo: "${projectSummary || "Sem descrição detalhada"}"
Setor de foco: "${sector || "personal"}"

Sua tarefa: Decomponha esse projeto macro em 3 a 5 ideias/frentes/módulos menores, complementares e altamente realistas para que o projeto saia do papel com ordem e clareza.
ATENÇÃO IMPORTANTE:
- NUNCA invente jargões de tecnologia ou programação (como API, front-end, back-end, deploy) a menos que o projeto seja EXPLICITAMENTE de tecnologia/software!
- Se o projeto for uma reforma de cozinha/casa, as frentes devem ser: Planejamento & Orçamento, Alvenaria/Demolição/Hidráulica, Marcenaria & Bancadas, Pintura & Decoração/Iluminação.
- Se o projeto for culinária/visita à família, as frentes devem ser sobre ingredientes, preparo, transporte e momento do encontro.
- Se for marcenaria, as frentes devem ser projeto/medidas, aparelhamento da madeira, usinagem/encaixes, lixamento/acabamento.
- Se for saúde/exercício, foque em rotina, equipamentos/ambiente, prática inicial e evolução.

Responda EXCLUSIVAMENTE um array JSON de objetos (sem markdown ao redor, apenas o JSON puro):
[
  {
    "title": "Título conciso da frente (ex: Planejamento & Orçamento)",
    "summary": "Resumo prático em 1 frase do que será realizado nesta frente",
    "minutes": 60
  }
]`;
		let lastError = "";
		for (const model of candidateModels) try {
			const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{
						role: "user",
						parts: [{ text: prompt }]
					}],
					generationConfig: {
						temperature: .6,
						responseMimeType: "application/json"
					}
				})
			});
			if (response.ok) {
				const contentStr = (await response.json())?.candidates?.[0]?.content?.parts?.[0]?.text;
				if (contentStr) {
					const modules = JSON.parse(contentStr);
					if (Array.isArray(modules) && modules.length > 0) return {
						modules,
						usedGemini: true
					};
				}
			}
			lastError = (await response.json().catch(() => ({})))?.error?.message || `HTTP ${response.status}`;
			if (response.status === 400 && lastError.toLowerCase().includes("api_key")) break;
			if (response.status === 401 || response.status === 403) break;
		} catch (err) {
			lastError = err?.message || "Falha de conexão com Gemini";
		}
		console.warn("Erro ao chamar Gemini para frentes de projeto, usando motor local inteligente:", lastError);
		return {
			modules: generateSubModulesAi(projectTitle, projectSummary, sector),
			usedGemini: false,
			error: lastError
		};
	}
	return {
		modules: generateSubModulesAi(projectTitle, projectSummary, sector),
		usedGemini: false
	};
}
//#endregion
export { useFlow as _, DialogTitle as a, callAiServer as c, generateProjectModulesWithGemini as d, getActiveGeminiKey as f, upsertUserProfile as g, testAiConnection as h, DialogDescription as i, cn as l, supabase as m, Dialog as n, FlowProvider as o, planIdeaWithAi as p, DialogContent as r, askMentorAi as s, Button as t, generateProjectModulesWithAi as u };
