//#region node_modules/.nitro/vite/services/ssr/assets/pwa-CNta3qVs.js
async function registerOffline() {
	if (!("serviceWorker" in navigator)) return;
	if (window.self !== window.top || new URLSearchParams(location.search).get("sw") === "off") {
		const registrations = await navigator.serviceWorker.getRegistrations();
		await Promise.all(registrations.filter((r) => [
			r.active,
			r.waiting,
			r.installing
		].some((worker) => worker && new URL(worker.scriptURL).pathname === "/sw.js")).map((r) => r.unregister()));
		return;
	}
	try {
		const { registerSW } = await import("./virtual_pwa-register-f-k30srU.mjs");
		registerSW({
			immediate: true,
			onRegisterError: (error) => console.error("Offline registration failed", error)
		});
	} catch (error) {
		console.error("Offline registration failed", error);
	}
}
//#endregion
export { registerOffline };
