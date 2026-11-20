# Automação de Testes de Interface com Cypress — Automation Test Store

Suíte de testes automatizados de interface para o e-commerce de demonstração [Automation Test Store](https://automationteststore.com/), desenvolvida para a Atividade 14.

- **24 testes funcionais** cobrindo os 16 requisitos (RF-01 a RF-16) dos 5 módulos
- **2 testes que reproduzem defeitos reais** encontrados na aplicação
- Execução em resolução **desktop (1280x800)** e **mobile (375x812)**
- Evidências, relatório de execução e registro de defeitos incluídos

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Execução

| Comando | O que faz |
|---|---|
| `npm test` | Executa a suíte completa (headless), incluindo os testes de defeitos |
| `npm run test:funcionais` | Executa apenas os 24 testes funcionais (módulos 01 a 05) |
| `npm run test:defeitos` | Executa apenas os testes que reproduzem defeitos (falha esperada) |
| `npm run cy:open` | Abre o Cypress em modo interativo |

O endereço-base (`https://automationteststore.com`) está configurado em `cypress.config.js`. Cada teste é independente: o Cypress limpa cookies entre os testes, então o carrinho começa sempre vazio.

## Estrutura

```
cypress/
├── e2e/
│   ├── navegacao/navegacao.cy.js            # Módulo 01 (RF-01 a RF-04)
│   ├── catalogo/catalogo.cy.js              # Módulo 02 (RF-05 a RF-08)
│   ├── carrinho/carrinho.cy.js              # Módulo 03 (RF-09 a RF-12)
│   ├── formularios/formularios.cy.js        # Módulo 04 (RF-13 e RF-14)
│   ├── responsividade/responsividade.cy.js  # Módulo 05 (RF-15 e RF-16)
│   └── defeitos/defeitos.cy.js              # Reproduz defeitos (D-01 e D-02)
└── support/e2e.js
docs/
├── relatorio-de-execucao.md                 # Resultado, métricas e limitações
└── registro-de-defeitos.md                  # Defeitos encontrados
evidencias/
├── execucao.log                             # Saída do Cypress (testes funcionais)
├── execucao-defeitos.log                    # Saída do Cypress (testes de defeitos)
├── screenshots/                             # Capturas de tela por requisito
└── videos/                                  # Vídeo de cada arquivo de teste
```

## Testes implementados

| Módulo | Requisito | Teste | Categoria |
|---|---|---|---|
| 01 Navegação | RF-01 | Navega da home para a categoria Skincare pelo menu | Positivo |
| 01 | RF-02 | Categoria exibe produtos e subcategorias correspondentes (todos os produtos de Shoes pertencem ao caminho 68_69) | Positivo |
| 01 | RF-03 | Retorna à home pelo breadcrumb e pelo logotipo | Positivo |
| 01 | RF-03 | Retorna à página anterior pelo histórico | Positivo |
| 01 | RF-04 | Item de menu da categoria atual recebe o estado `current` | Estado da interface |
| 01 | RF-04 | Ordenar por nome altera a ordem dos produtos | Estado da interface |
| 02 Catálogo | RF-05 | Listagem exibe nome, imagem e preço de cada produto | Positivo |
| 02 | RF-06 | Navega da listagem para os detalhes e volta | Positivo |
| 02 | RF-07 | Busca por produto existente retorna só resultados correspondentes | Positivo |
| 02 | RF-07 | Busca por produto inexistente exibe mensagem informativa | Negativo |
| 02 | RF-08 | Nome e preço de um produto em promoção iguais na listagem, nos detalhes e no carrinho | Consistência |
| 03 Carrinho | RF-09 | Adiciona produto pela página de detalhes e atualiza contador e total | Positivo |
| 03 | RF-09 | Adiciona produto direto da listagem da home | Positivo |
| 03 | RF-10 | Atualiza a quantidade de um produto | Estado da interface |
| 03 | RF-11 | Recalcula linha, Sub-Total, Total (com frete) e total do topo após alteração | Consistência |
| 03 | RF-12 | Remove produto e exibe a mensagem de carrinho vazio | Estado da interface |
| 03 | RF-12 | Produto sem estoque não oferece botão de adicionar ao carrinho | Negativo |
| 04 Formulários | RF-13 | Formulário de contato vazio informa os campos obrigatórios | Negativo |
| 04 | RF-13 | E-mail inválido é rejeitado com mensagem de orientação | Negativo |
| 04 | RF-14 | Envio válido exibe a mensagem de confirmação | Positivo |
| 04 | RF-14 | Login inválido exibe mensagem de erro | Negativo |
| 05 Responsividade | RF-15 | Elementos de navegação disponíveis no desktop | Responsividade |
| 05 | RF-15 | Elementos de navegação disponíveis no mobile (menu recolhido, lista "Go to...", busca após abrir o menu) | Responsividade |
| 05 | RF-16 | Localiza produto pela busca e usa o carrinho no mobile | Responsividade |

Distribuição: 10 positivos, 5 negativos, 4 de estado/comportamento da interface, 3 de responsividade e 2 de consistência (mínimos exigidos: 6, 4, 3, 2 e 1).

## Boas práticas aplicadas

- Seletores baseados em `id`, `name` e classes estáveis do HTML da aplicação (ex.: `#filter_keyword`, `#cart_update`, `input[name="quantity[50]"]`), levantados a partir do HTML real das páginas.
- Nenhuma espera fixa (`cy.wait(<tempo>)`): o Cypress repete as assertions até o limite de tempo.
- Cada teste tem assertions de resultado (texto, URL, valores numéricos, estado de classes e visibilidade), não apenas cliques.
- `retries` de 1 tentativa na execução em linha de comando, por causa da lentidão ocasional do site público.

## Resultados

Resumo da execução de 20/11/2026 (detalhes em `docs/relatorio-de-execucao.md`):

- Testes funcionais: **24 aprovados, 0 reprovados**
- Testes de defeitos: **2 reprovados, como esperado** (D-01 e D-02, descritos em `docs/registro-de-defeitos.md`)

## Observação

O teste RF-14 envia o formulário de contato do site de demonstração a cada execução, com dados fictícios.
