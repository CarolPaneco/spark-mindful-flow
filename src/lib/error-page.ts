export function renderErrorPage(error?: unknown): string {
  const errorMessage = error instanceof Error
    ? (error.stack || `${error.name}: ${error.message}`)
    : typeof error === 'string'
      ? error
      : error != null
        ? JSON.stringify(error, null, 2)
        : '';

  const detailsHtml = errorMessage
    ? `
      <div style="margin-top: 1.5rem; text-align: left; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 1rem; width: 100%; box-sizing: border-box;">
        <div style="font-size: 0.75rem; font-weight: 600; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Detalhes do Erro
        </div>
        <pre style="margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.75rem; color: #fca5a5; white-space: pre-wrap; word-break: break-word; max-height: 160px; overflow-y: auto;">${escapeHtml(errorMessage)}</pre>
      </div>`
    : '';

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Ideaflow — Erro ao carregar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: #090D16;
        color: #F1F5F9;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
        box-sizing: border-box;
      }
      .card {
        max-width: 32rem;
        width: 100%;
        text-align: center;
        padding: 2.25rem 2rem;
        background: #0F172A;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      }
      .badge {
        display: inline-block;
        padding: 0.35rem 0.85rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        background: rgba(99, 102, 241, 0.15);
        color: #A5B4FC;
        border: 1px solid rgba(99, 102, 241, 0.3);
        margin-bottom: 1rem;
      }
      h1 { font-size: 1.35rem; margin: 0 0 0.5rem; color: #FFFFFF; font-weight: 700; }
      p { color: #94A3B8; margin: 0 0 1.5rem; font-size: 0.925rem; line-height: 1.5; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        font: inherit;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        transition: all 0.15s ease-in-out;
      }
      .primary { background: #6366F1; color: #FFFFFF; }
      .primary:hover { background: #4F46E5; }
      .secondary { background: rgba(255, 255, 255, 0.06); color: #E2E8F0; border-color: rgba(255, 255, 255, 0.12); }
      .secondary:hover { background: rgba(255, 255, 255, 0.1); }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">Ideaflow</div>
      <h1>Ops! A página não pôde ser carregada</h1>
      <p>Ocorreu um imprevisto na renderização do aplicativo. Tente recarregar ou voltar à página inicial.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Ir para o Início</a>
      </div>
      ${detailsHtml}
    </div>
  </body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
