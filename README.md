# Ideaflow — Gestão de Ideias & Realização

**Ideaflow** é uma plataforma completa de produtividade, ideação intencional e realização de projetos. Desenvolvida em arquitetura *offline-first*, garante privacidade absoluta salvando todos os dados no navegador do usuário via `LocalStorage`, com suporte total a PWA (Progressive Web App), timer de foco (Pomodoro), integração com calendários e dashboards analíticos de alto nível.

---

## 🚀 O que há de novo no Ideaflow

### 1. 🤖 Plano Inicial com IA Totalmente Personalizável
- **Geração de Passos com IA**: Ao capturar uma ideia (por texto ou áudio), o sistema gera um plano de ação estratégico contextualizado ao tipo de projeto (tecnologia, negócios, marcenaria/projetos físicos, rotina pessoal).
- **Controle Total**: No próprio drawer de captura, você pode:
  - Editar o texto de qualquer passo diretamente.
  - Alterar a duração estimada em minutos (10m, 15m, 20m, 25m, 30m, 45m, 1h).
  - Adicionar novos passos personalizados com 1 clique.
  - Excluir passos desnecessários.
  - Regenerar o plano com IA em diferentes estilos: **MVP Enxuto**, **Passos Rápidos de 10 min** ou **Plano Completo Estruturado**.
- O primeiro passo sempre mantém a promessa de **Ação Imediata de 15 Minutos** para eliminar a procrastinação inicial.

---

### 2. 🔄 Mudança de Rota, Escopo e Histórico de Motivos (Pivôs)
- **Definição de Escopo**: Delimite o que está dentro e o que está fora do projeto a qualquer momento.
- **Registro de Mudança de Rota**:
  - Tipos: *Redução de Escopo* (simplificar para lançar antes), *Expansão de Escopo*, *Mudança de Direção / Pivô Total* ou *Pausa Estratégica*.
  - **Campo de Motivo**: Registre por que a decisão de mudar de rumo foi tomada (*"Por que decidimos mudar?"*).
  - **Linha do Tempo Visual**: Histórico cronológico completo que guarda a evolução da mentalidade do projeto e os motivos de cada pivô.

---

### 3. 📊 Dashboard Completo da Ideia
Ao abrir qualquer ideia, você tem um painel de controle dividido em abas especializadas:
- **📊 Visão Geral & Métricas**:
  - Gráficos visuais com `recharts` mostrando porcentagem de conclusão, tempo dedicado vs tempo estimado.
  - Barra interativa dos 5 estágios do funil (*Faísca ➜ Estrutura ➜ Em Fluxo ➜ Ajustes ➜ Realidade*).
  - Seletor de prioridade, setor e próximo passo imediato destacado.
- **✅ Passos & Checklist Interativo**:
  - Edição in-place do texto dos passos, exclusão e adição de novas etapas.
  - Botão de **"✨ Sugerir mais passos com IA"** para destravar gargalos.
- **🔄 Mudança de Rota (Pivô)**:
  - Gerenciamento de escopo e histórico de alterações de rumo com justificativas.
- **📝 Diário de Bordo & Anotações**:
  - Feed cronológico de anotações, insights rápidos, links de referências e aprendizados.
- **📅 Calendário & Agendamento**:
  - Data planejada e prazo limite.
  - **Botão "Abrir no Google Agenda"**: gera link oficial do Google Calendar com data, resumo e checklist preenchidos em 1 clique.
  - **Botão "Baixar arquivo (.ics)"**: compatibilidade direta com Apple Calendar, Outlook e celular.
- **🤖 IA Coach & Desbloqueio**:
  - Diagnóstico de fricção mental da fase atual da ideia.
  - Próxima micro-ação recomendada.
  - Pergunta provocativa para clareza mental.

---

### 4. 📈 Dashboards dos Setores (Geral e Individual)
- **Dashboard Comparativo Geral de Setores**:
  - 🚀 **Setor Mais Desenvolvido / Em Destaque**: Identifica automaticamente qual área da sua vida está com maior tração (taxa de conclusão e horas de foco investidas).
  - ⚠️ **Setor em Atraso / Atenção Necessária**: Alerta sobre setores com ideias estagnadas em rascunho sem tempo de foco.
  - **Gráficos Comparativos (Recharts)**:
    - Gráfico de barras comparando **Ideias Totais vs Realizadas** por setor.
    - Gráfico comparativo de **Horas Dedicadas** por setor.
- **Dashboard Individual do Próprio Setor**:
  - Painel detalhado aberto ao clicar em *"Explorar Setor & Dashboard"*.
  - Indicadores de saúde do setor (*Em Alta*, *Equilibrado*, *Em Atraso*).
  - Funil de distribuição dos 5 estágios dentro daquele setor.
  - Lista de ideias do setor com filtros e botão de criação direta.

---

### 5. 📅 Integração com Calendário ("Hoje")
- **Alternador de Visão**:
  - **Visão em Blocos (Manhã, Tarde, Noite)**: Execução intencional do dia a dia com foco nos próximos blocos.
  - **Visão Calendário Mensal Interativo**: Visualização mensal com navegação entre meses, identificação de dias com ideias agendadas e seleção de qualquer data para planejar.
- **Reagendamento Inteligente**:
  - Botão *"Reagendar pendentes do passado para hoje"* para resgatar tarefas não concluídas de dias anteriores.
- **Sincronização**:
  - Acesso direto ao Google Calendar para cada ideia planejada.

---

## 🛠️ Stack Tecnológica

- **Framework**: TanStack Start + TanStack Router
- **UI / Componentes**: React 19, Tailwind CSS v4, Radix UI, Vaul (Drawers), Lucide React, Sonner (Toasts)
- **Gráficos & Métricas**: Recharts
- **Estado Local & Persistência**: React Context API (`FlowProvider`) sincronizado com `localStorage`
- **Empacotador & Servidor**: Vite 8 + Nitro (padrão, sem dependências proprietárias)
- **Testes**: Vitest + React Testing Library

---

## 🚀 Como Rodar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar servidor em desenvolvimento
npm run dev

# 3. Executar os testes unitários
npm test

# 4. Gerar build de produção
npm run build

# 5. Visualizar build de produção
npm run preview
```
