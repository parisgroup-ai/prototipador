<!-- pg-frota:inicio v13 -->
## Regras da Paris Group (frota v13)

Bloco gerado por `pg-devkit regras` de `packages/baseline/regras-frota.md`. Toda IA segue este bloco. Edite a fonte. As regras mais específicas do produto prevalecem.

### Ao começar a sessão
1. Rode `pg-devkit --version`. Se não existir, instale você mesmo. O token fica só no ambiente, nunca em argumento, arquivo ou chat:
   ```sh
   rc="$(mktemp)"; printf '%s\n' '@parisgroup-ai:registry=https://npm.pkg.github.com' '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' > "$rc"
   NODE_AUTH_TOKEN="$(gh auth token)" NPM_CONFIG_USERCONFIG="$rc" npm i -g @parisgroup-ai/pg-devkit; rm -f "$rc"
   ```
   Nunca use `npx pg-devkit` nem um pacote `pg-devkit` sem escopo: esse nome não é nosso.
2. Depois rode `pg-devkit doctor`. Nunca peça comandos ao humano. A única exceção: erro E401 ou E403 de pacote. Aí peça uma vez: "Rode `gh auth refresh -h github.com -s read:packages` e me avise."
3. Leia a caixa de entrada: `pg-devkit caixa`.
4. Se algo falhar (sem rede, sem `gh`, sem cota), não pare a tarefa. Siga este arquivo e avise numa linha no fim.
5. Padrão Paris v1 (11 itens, com a nota no Mission Control): `pg-devkit padrao` mostra o que falta neste repo.
6. **PRs antes de funcionalidade nova (obrigatório).** Antes do primeiro passo de uma funcionalidade nova, rode `gh pr list` e resolva antes os PRs abertos que esperam revisão, correção, conflito ou merge. Exceção: uma sessão nos PRs e outra na funcionalidade, as duas se falando (quem está em qual PR e arquivo). Produção parada passa na frente.

### Dono e rota (regras 1 e 2)
- Dono é medido: quem fez 1/3 ou mais dos commits da branch padrão em 90 dias, sem robô nem pin (a `rota` calcula). `donos:` no `devkit.config.yaml` é opcional e vence. CODEOWNERS e times do GitHub não valem. Sem dono: vale o time `leads`.
- Robô e agente nunca entram em `donos:`.
- Antes de subir, rode `pg-devkit rota`. Ela responde DIRETO, PR, ISSUE ou PULAR_E_AVISAR, e para quem. Sem o dono na sessão, some `--agente-sozinho`; algo que não se desfaz, `--irreversivel`; pedido sem código, `--tipo pedido`.
- O dono, ou a IA dele, vai direto na branch padrão depois dos gates. Quem não é dono abre PR, e só o dono ou a IA dele faz o merge. Pedido sem código vira issue.
- Revisão: no PR de produto, o dono aprova. Os sócios (`leads`) só revisam repo de todos (omnichannel, platform, pg-platform, pg-devkit, infra), produto tier 1 no MC e as pastas de segurança, dinheiro e dado de cliente (login, permissão, segredo, `.github/`, cobrança, pagamento, banco, migration), que o `.github/CODEOWNERS` dá a `@parisgroup-ai/leads` abaixo da linha `*`. Fora disso, não peça revisão a eles.
- A proteção do servidor vence: se ela exige PR, abra o PR.
- Antes do push: `git pull --rebase`. Nunca `--force`. Nunca pule os hooks, de nenhum jeito (`--no-verify`, `-n`, `HUSKY=0`, `SKIP=`, `core.hooksPath`). Hook lento ou falhando: conserte, ou `pg-devkit caixa abrir`. Nunca `gh run cancel`: o CI de outra sessão não se cancela.
- Revert puro sempre vai direto, pelos gates normais, nunca com checagem mais forte (`--tipo revert`).

### Gates (regra 3)
- Nada chega à produção sem um portão automático antes. Mudança arriscada (migration, RLS, auth, dinheiro, contrato público, gates, `donos:`) ganha checagem automática mais forte; pessoa a mais, só a da regra 2.
- Migration só pelo script do repo que faz lint, ensaio e registro. Segredo nunca entra no código. Feature nova declara `Rollout:` no commit.
- Escreveu migration: rode duas vezes no banco local (tem que ser idempotente) e rode os E2E que o seletor de impacto escolher, antes do PR ou do push.
- Teste instável vira issue e nunca é apagado.
- Commit só de docs não faz deploy.
- Actions custam por minuto e cada push na branch principal roda a suíte inteira. Trabalhe local: commits pequenos, gates locais, e **um push no fim do bloco** (ou no `/session-close`), não um por commit. PR fica em rascunho até acabar.
- Label de E2E completo (`trigger:full-e2e`, `run-e2e`) só com o PR pronto ou a pedido do dono.
- Script ou agente na API do GitHub: leia `/rate_limit` antes, até 300 chamadas REST por execução, e prefira `git clone --filter=blob:none --sparse` para ler arquivos.

### Agente sozinho (regra 4)
- Sem o dono na sessão (daemon, `claude -p`, nuvem), siga a política de decisão escrita do produto.
- Nunca faça sozinho o que não se desfaz: re-parear ou deslogar WhatsApp, envio em massa, verba, apagar dados, trocar chave, env ou DNS, afrouxar um gate ou mudar `donos:`. Avise o dono por uma issue na caixa, sem esperar resposta: `pg-devkit caixa abrir "<o que foi>"` mostra o comando pronto, sem duplicar e com os donos marcados. Pule a tarefa e siga. Nunca acorde ninguém.

### Atualização e máquina (regras 5 e 7)
- Atualizações de versão são do zelador. O Dependabot pode abrir PR para alerta de segurança npm com `open-pull-requests-limit: 0`. Nunca rode `npm install` para atualizar pacotes na sessão.
- A sessão nunca altera arquivo gerenciado que está no git (worktree, VPS, repo de outro dono). Só lê e avisa numa linha.
- `estado: congelado` e `congelados:` travam atualizações. Segurança sempre passa.

### Regras na raiz (regra 6)
- Este `AGENTS.md` é a fonte única. `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/pg.mdc` e `.github/copilot-instructions.md` só apontam para cá.
- Limite de 24 KB por `AGENTS.md`, na raiz e nas subpastas. O excesso vai para `docs/`, com link.
- Regra que protege o produto mora aqui, não na memória de uma IA. O repo vence a regra pessoal.
- Fora do padrão: `excecoes:` no `devkit.config.yaml`, com `regra`, `motivo` e `link` da ADR.

### Pedir para cima (regra 8)
Problema na plataforma vira issue (ou PR) no repo dono do assunto:

| Assunto | Repo |
|---|---|
| pacote `@parisgroup-ai/x` | pg-platform, se lá existir `packages/x`; senão, o repo de mesmo nome |
| skill e CLI | pg-devkit |
| hospedagem, segredos, LiteLLM, Keycloak | infra |
| tela ou dado do Mission Control | platform |
| na dúvida | pg-devkit |

Mande só uma reprodução mínima e o link do repo de origem. Nunca código, dado, print ou nome de cliente.

### Caixa de entrada e avisos (regra 9)
- O que a Paris precisa deste projeto vira issue aqui, com a etiqueta `paris:caixa` (precisa do dono). `pg-devkit caixa` mostra as issues e os PRs que esperam você; os de merge seu (`--prioridade`) vêm antes de trabalho novo.
- Pedido: `pg-devkit caixa abrir "<o que foi>" [--para <repo>]`.
- Chame o dono na hora só por produção parada, dinheiro saindo, decisão pendente ou segurança, uma vez por dia por assunto. Parceiro e cliente recebem pela caixa.
- Paris Chat: um assunto por mensagem, o pedido na 1ª linha, até 3 linhas e 400 caracteres; o detalhe vai no PR ou na issue, com link. O `paris-chat team send` recusa o resto.

### Agentes, Mission Control e Vordin (regras 10 a 12)
- Todo repo da parisgroup-ai aparece no Mission Control. Se o `pg-devkit doctor` disser que não, avise numa linha: os leads já têm a tarefa.
- Todo agente e serviço, em qualquer conta (Railway, VPS, conta pessoal), fica no `.pgdk/agents.yaml` e manda batimento, com o slug do produto dono, e resultado ao Mission Control pelo contrato HTTP. Sem token, nada é enviado. Teste local nunca grava no MC. MC fora do ar nunca trava o agente.
- Entrega só conta como verificada se quem confere não é o próprio agente.
- O Vordin é o CRM único. Vai para lá só lead ou cliente em negociação real; prospecção fria e o cliente do cliente ficam no produto. Antes de mandar mensagem, consulte "não contatar". Número oficial de WhatsApp nunca é pareado em Baileys.
- Site e anúncio entram pelo `/api/leads/intake` do Vordin.
- Adoção é medida por projeto, nunca por pessoa.

### Relato de trabalho (regra 13)
- Ao começar: `pg-devkit trabalho direcao` e `pg-devkit trabalho relato --fase inicio`.
- Ao fechar: `pg-devkit trabalho relato --fase fim` e `pg-devkit trabalho entrega "<o que entregou>" --prova <link>`.
- Relato sincero, "não para controle, mas sim para tomada de decisão": o que travou, o que foi decidido, o que precisa de um sócio.
- Nunca dado de cliente nem trecho da conversa. Sem entrega: diga o pendente. Conta entrega, não hora.
<!-- pg-frota:fim -->

# Agent Directives for Prototipador

Prototipador is a **product planning and design tool** that helps users define their product vision, sketch out their data shape, design their UI, and prepare export packages for implementation in a separate codebase.

> **Important**: Prototipador is a planning tool, not the end product codebase. The screen designs and components generated here are meant to be exported and integrated into your actual product's codebase.

---

## Understanding Prototipador Context

When working in Prototipador, be aware of two distinct contexts:

### 1. Prototipador Application
The React application that displays and manages planning files. When modifying the Prototipador UI itself:
- Files live in `src/` (components, pages, utilities)
- Uses the Prototipador design system (stone palette, DM Sans, etc.)
- Provides the interface for viewing specs, screen designs, exports, etc.

### 2. Product Design (Screen Designs & Exports)
The product you're planning and designing. When creating screen designs and exports:
- Screen design components live in `src/sections/[section-name]/` and `src/shell/`
- Product definition files live in `product/`
- Exports are packaged to `product-plan/` for integration into a separate codebase
- Follow the design requirements specified in each section's spec

---

## Getting Started — The Planning Flow

Prototipador follows a structured planning sequence:

### 1. Product Vision (`/visao`)
Define your product overview, roadmap sections, and data shape — all in one conversational flow. After answering clarifying questions, all three files are generated automatically.
**Output:** `product/product-overview.md`, `product/product-roadmap.md`, `product/data-shape/data-shape.md`

Use `/roadmap`, `/dados` individually to update those files after initial creation.

### 2. Design System (`/estilo`)
Choose your color palette (from Tailwind) and typography (from Google Fonts). These tokens are applied to all screen designs.
**Output:** `product/design-system/colors.json`, `product/design-system/typography.json`

### 3. Application Shell (`/estrutura`)
Design the persistent navigation and layout that wraps all sections.
**Output:** `product/shell/spec.md`, `src/shell/components/`

### 4. For Each Section:
- `/secao` — Define the specification and generate sample data + types
- `/dados-exemplo` — Update sample data and types (if already created)
- `/tela` — Create screen designs
- `/foto` — Capture screenshots

### 5. Export (`/exportar`)
Generate the complete export package with all components, types, and handoff documentation.
**Output:** `product-plan/`

---

## File Structure

```
product/                           # Product definition (portable)
├── product-overview.md            # Product description, problems/solutions, features
├── product-roadmap.md             # List of sections with titles and descriptions
│
├── data-shape/                    # Product data shape
│   └── data-shape.md              # Entity names, descriptions, and relationships
│
├── design-system/                 # Design tokens
│   ├── colors.json                # { primary, secondary, neutral }
│   └── typography.json            # { heading, body, mono }
│
├── shell/                         # Application shell
│   └── spec.md                    # Shell specification
│
└── sections/
    └── [section-name]/
        ├── spec.md                # Section specification
        ├── data.json              # Sample data for screen designs
        ├── types.ts               # TypeScript interfaces
        └── *.png                  # Screenshots

src/
├── shell/                         # Shell design components
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── MainNav.tsx
│   │   ├── UserMenu.tsx
│   │   └── index.ts
│   └── ShellPreview.tsx
│
└── sections/
    └── [section-name]/
        ├── components/            # Exportable components
        │   ├── [Component].tsx
        │   └── index.ts
        └── [ViewName].tsx         # Preview wrapper

product-plan/                      # Export package (generated)
├── README.md                      # Quick start guide
├── product-overview.md            # Product summary
├── prompts/                       # Ready-to-use prompts for coding agents
│   ├── one-shot-prompt.md         # Prompt for full implementation
│   └── section-prompt.md          # Prompt template for incremental
├── instructions/                  # Implementation instructions
│   ├── one-shot-instructions.md   # All milestones combined
│   └── incremental/               # Milestone-by-milestone instructions
│       ├── 01-shell.md
│       └── [NN]-[section-id].md   # Section-specific instructions
├── design-system/                 # Tokens, colors, fonts
├── data-shapes/                   # UI data contracts (types components expect)
├── shell/                         # Shell components
└── sections/                      # Section components (with tests.md each)
```

---

## Design Requirements

When creating screen designs, follow these guidelines:

- **Mobile Responsive**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to ensure layouts adapt properly across screen sizes.

- **Light & Dark Mode**: Use `dark:` variants for all colors. Test that all UI elements are visible and readable in both modes.

- **Use Design Tokens**: When design tokens are defined, apply the product's color palette and typography. Otherwise, fall back to `stone` for neutrals and `lime` for accents.

- **Props-Based Components**: All screen design components must accept data and callbacks via props. Never import data directly in exportable components.

- **No Navigation in Section Screen Designs**: Section screen designs should not include navigation chrome. The shell handles all navigation.

---

## Tailwind CSS Directives

These rules apply to both the Prototipador application and all screen designs/components it generates:

- **Tailwind CSS v4**: We always use Tailwind CSS v4 (not v3). Do not reference or create v3 patterns.

- **No tailwind.config.js**: Tailwind CSS v4 does not use a `tailwind.config.js` file. Never reference, create, or modify one.

- **Use Built-in Utility Classes**: Avoid writing custom CSS. Stick to using Tailwind's built-in utility classes for all styling.

- **Use Built-in Colors**: Avoid defining custom colors. Use Tailwind's built-in color utility classes (e.g., `stone-500`, `lime-400`, `red-600`).

---

## The Four Pillars

Prototipador is organized around four main areas:

1. **Product Overview** — The "what" and "why"
   - Product name and description
   - Problems and solutions
   - Key features
   - Sections/roadmap

2. **Data Shape** — The "nouns" of the system
   - Core entity names and descriptions
   - Conceptual relationships between entities
   - Shared vocabulary for consistent naming across sections

3. **Design System** — The "look and feel"
   - Color palette (Tailwind colors)
   - Typography (Google Fonts)

4. **Application Shell** — The persistent chrome
   - Global navigation structure
   - User menu
   - Layout pattern

Plus **Sections** — The individual features, each with spec, data, screen designs.

---

## Design System Scope

Prototipador separates concerns between its own UI and the product being designed:

- **Prototipador UI**: Always uses the stone/lime palette and DM Sans typography
- **Product Screen Designs**: Use the design tokens defined for the product (when available)
- **Shell**: Uses product design tokens to preview the full app experience

---

## Export & Handoff

The `/exportar` command generates a UI design handoff package:

- **Ready-to-use prompts**: Pre-written prompts to copy/paste into coding agents
  - `one-shot-prompt.md`: For full implementation in one session
  - `section-prompt.md`: Template for section-by-section implementation
- **Implementation instructions**: UI-focused guides for each milestone
  - `product-overview.md`: Always provide for context
  - `one-shot-instructions.md`: All milestones combined
  - Incremental instructions in `instructions/incremental/`
- **Test specs**: Each section includes `tests.md` with UI behavior specs
- **Portable components**: Props-based, ready for any React setup
- **Data shapes**: TypeScript interfaces defining what data the components expect

The handoff focuses on UI designs, product requirements, and user flows. Backend architecture, data modeling, and business logic decisions are left to the implementation agent. The prompts guide the agent to ask clarifying questions about tech stack and requirements before building.

---

## Design System (Prototipador Application)

The Prototipador application itself uses a "Refined Utility" aesthetic:

- **Typography**: DM Sans for headings and body, IBM Plex Mono for code
- **Colors**: Stone palette for neutrals (warm grays), lime for accents
- **Layout**: Maximum 800px content width, generous whitespace
- **Cards**: Minimal borders (1px), subtle shadows, generous padding
- **Motion**: Subtle fade-ins (200ms), no bouncy animations
