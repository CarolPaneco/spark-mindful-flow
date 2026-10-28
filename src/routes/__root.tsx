import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { FlowProvider } from '@/components/flow-provider';
import { AppShell } from '@/components/app-shell';
import { Toaster } from 'sonner';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error('Root error caught:', error);
  const router = useRouter();
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error);

  const isChunkError =
    typeof errorMessage === 'string' &&
    (errorMessage.includes('Failed to fetch dynamically imported module') ||
      errorMessage.includes('error loading dynamically imported module') ||
      errorMessage.includes('dynamically imported module') ||
      errorMessage.includes('Importing a module script failed'));

  // Se for erro de cache de bundle antigo após novo deploy, auto-recarrega a página para obter a versão atual
  useEffect(() => {
    if (typeof window !== 'undefined' && isChunkError) {
      const reloadKey = 'ideaflow_chunk_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    }
  }, [isChunkError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isChunkError ? 'Nova versão do Ideaflow disponível' : 'Ops! Algo deu errado ao carregar'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isChunkError
            ? 'Uma atualização foi aplicada no aplicativo. Clique abaixo para atualizar.'
            : 'Ocorreu um imprevisto ao carregar a página.'}
        </p>

        {errorMessage && !isChunkError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-left overflow-auto max-h-36 text-xs font-mono text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {isChunkError ? (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.location.reload();
              }}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              Atualizar aplicativo agora ⚡
            </button>
          ) : (
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          )}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('ideaflow-v1');
                window.location.href = '/';
              }
            }}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Restaurar dados iniciais
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Página inicial
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
      { title: "Ideaflow — Gestão de Ideias & Realização" },
      { name: "description", content: "Dê espaço às suas ideias. Organize seus projetos e transforme intenção em realização com o Ideaflow." },
      { property: "og:title", content: "Ideaflow — Gestão de Ideias & Realização" },
      { property: "og:description", content: "Suas ideias em movimento. Capture, organize e realize no seu ritmo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#070B1E" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Escuta erro nativo do Vite ao tentar pré-carregar um chunk que foi substituído após novo deploy
  useEffect(() => {
    const handlePreloadError = (event: Event) => {
      event.preventDefault();
      const reloadKey = 'ideaflow_chunk_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    };

    window.addEventListener('vite:preloadError', handlePreloadError);
    return () => {
      window.removeEventListener('vite:preloadError', handlePreloadError);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FlowProvider><AppShell><Outlet /></AppShell><Toaster richColors position="top-center" /></FlowProvider>
    </QueryClientProvider>
  );
}
