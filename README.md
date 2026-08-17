# Prototipador

**Prototipador é o Design OS da imersão Paris Group** — um fork literal de [buildermethods/design-os](https://github.com/buildermethods/design-os), com os comandos renomeados para pt-BR e o branding da Paris Group. A estrutura, o processo e as features são exatamente as do upstream.

O Prototipador guia você da ideia ao pacote de handoff: visão do produto → roadmap → dados → estilo → estrutura (shell) → telas por seção → export com componentes React prontos para implementação.

## Como usar

```bash
git clone https://github.com/parisgroup-ai/prototipador meu-produto-prototipo
cd meu-produto-prototipo
npm install
npm run dev   # abre o preview em http://localhost:5173
```

Depois abra a pasta no **Claude Code** e rode `/visao` para começar a definir seu produto. Cada comando é uma conversa: a IA pergunta, você direciona.

## Mapeamento de comandos (upstream → pt-BR)

| Design OS (upstream) | Prototipador | O que faz |
|---|---|---|
| `/product-vision` | `/visao` | Define visão, roadmap e shape de dados em um fluxo |
| `/product-roadmap` | `/roadmap` | Atualiza as seções do produto |
| `/data-shape` | `/dados` | Atualiza entidades e relações |
| `/design-tokens` | `/estilo` | Escolhe cores e tipografia |
| `/design-shell` | `/estrutura` | Desenha navegação e layout (shell) |
| `/shape-section` | `/secao` | Especifica uma seção + gera dados de exemplo e types |
| `/sample-data` | `/dados-exemplo` | Atualiza dados de exemplo e types |
| `/design-screen` | `/tela` | Cria as telas (componentes React) |
| `/screenshot-design` | `/foto` | Captura screenshot de uma tela |
| `/export-product` | `/exportar` | Gera o pacote completo de handoff |

Os artefatos gerados (`product/`, `product-plan/`) mantêm a estrutura original do upstream — só os nomes dos comandos mudaram.

## Créditos e licença

Design OS foi criado por **Brian Casel** @ [Builder Methods](https://buildermethods.com) — documentação original em [buildermethods.com/design-os](https://buildermethods.com/design-os). Este fork mantém a licença MIT do projeto original ([LICENSE](LICENSE), © 2025 CasJam Media LLC / Builder Methods).
