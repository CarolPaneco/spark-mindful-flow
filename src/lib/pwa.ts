export async function registerOffline() {
  if (!('serviceWorker' in navigator)) return;
  const refused = !import.meta.env.PROD || window.self !== window.top || new URLSearchParams(location.search).get('sw') === 'off';
  if (refused) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter(r => [r.active, r.waiting, r.installing].some(worker => worker && new URL(worker.scriptURL).pathname === '/sw.js')).map(r => r.unregister()));
    return;
  }
  try {
    const { registerSW } = await import('virtual:pwa-register');
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        void updateSW(true);
      },
      onRegisterError: error => console.error('Offline registration failed', error),
    });
  } catch (error) {
    console.error('Offline registration failed', error);
  }
}