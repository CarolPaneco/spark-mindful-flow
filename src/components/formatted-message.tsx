import React from 'react';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

/**
 * Renderizador de Markdown elegante e de alta performance para o Mentor IA.
 * Converte asteriscos (**negrito**, *itálico*), listas numeradas, listas com marcadores
 * e títulos em elementos visuais limpos e agradáveis de ler.
 */
export function FormattedMessage({ content, className = '' }: FormattedMessageProps) {
  if (!content) return null;

  // Quebra o texto em linhas
  const lines = content.split('\n');

  // Função auxiliar para renderizar estilos inline: **negrito**, *itálico*, `código`
  const renderInline = (text: string): React.ReactNode => {
    // Regex para identificar **negrito**, `código` ou *itálico*
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    // Substitui e divide por tokens de formatação
    while (remaining.length > 0) {
      // 1. **Negrito**
      const boldMatch = remaining.match(/^([\s\S]*?)\*\*(.+?)\*\*([\s\S]*)$/);
      // 2. `Código`
      const codeMatch = remaining.match(/^([\s\S]*?)`([^`]+)`([\s\S]*)$/);
      // 3. *Itálico*
      const italicMatch = remaining.match(/^([\s\S]*?)\*([^*]+)\*([\s\S]*)$/);

      // Prioriza a correspondência que começa mais cedo
      let bestMatch: { type: 'bold' | 'code' | 'italic'; match: RegExpMatchArray } | null = null;
      let earliestIndex = Infinity;

      if (boldMatch && boldMatch[1] !== undefined && boldMatch[1].length < earliestIndex) {
        earliestIndex = boldMatch[1].length;
        bestMatch = { type: 'bold', match: boldMatch };
      }
      if (codeMatch && codeMatch[1] !== undefined && codeMatch[1].length < earliestIndex) {
        earliestIndex = codeMatch[1].length;
        bestMatch = { type: 'code', match: codeMatch };
      }
      if (italicMatch && italicMatch[1] !== undefined && italicMatch[1].length < earliestIndex) {
        earliestIndex = italicMatch[1].length;
        bestMatch = { type: 'italic', match: italicMatch };
      }

      if (bestMatch) {
        const pre = bestMatch.match[1] || '';
        const tokenContent = bestMatch.match[2] || '';
        const post = bestMatch.match[3] || '';

        if (pre) {
          parts.push(<span key={key++}>{pre}</span>);
        }

        if (bestMatch.type === 'bold') {
          parts.push(
            <strong key={key++} className="font-semibold text-foreground">
              {renderInline(tokenContent)}
            </strong>
          );
        } else if (bestMatch.type === 'code') {
          parts.push(
            <code
              key={key++}
              className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px] border border-primary/20"
            >
              {tokenContent}
            </code>
          );
        } else if (bestMatch.type === 'italic') {
          parts.push(
            <em key={key++} className="italic text-foreground/90">
              {renderInline(tokenContent)}
            </em>
          );
        }

        remaining = post;
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return <>{parts}</>;
  };

  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();

        // Linha vazia vira um respiro
        if (!line) {
          return <div key={idx} className="h-1.5" />;
        }

        // Títulos Markdown: ### ou ## ou #
        if (line.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="font-bold text-xs sm:text-sm text-foreground pt-1.5 pb-0.5 border-b border-border/40"
            >
              {renderInline(line.replace(/^###\s+/, ''))}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="font-bold text-sm text-foreground pt-2 pb-1 border-b border-border/50"
            >
              {renderInline(line.replace(/^##\s+/, ''))}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2
              key={idx}
              className="font-bold text-base text-foreground pt-2 pb-1 text-primary border-b border-primary/30"
            >
              {renderInline(line.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // Passos numerados: "1. ", "2. ", "3. "
        const stepMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);
        if (stepMatch && stepMatch[1] && stepMatch[2]) {
          const stepNum = stepMatch[1];
          const stepText = stepMatch[2];
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 py-1 px-2.5 rounded-lg bg-secondary/40 border border-border/40 my-1"
            >
              <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/25 rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 select-none">
                {stepNum}
              </span>
              <div className="flex-1 text-xs text-foreground/95">
                {renderInline(stepText)}
              </div>
            </div>
          );
        }

        // Listas com marcadores: "- ", "* ", "• "
        if (line.match(/^[-*•]\s+/)) {
          const bulletText = line.replace(/^[-*•]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
              <div className="flex-1 text-xs text-foreground/90">
                {renderInline(bulletText)}
              </div>
            </div>
          );
        }

        // Linha regular de parágrafo
        return (
          <p key={idx} className="text-xs text-foreground/90 leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

