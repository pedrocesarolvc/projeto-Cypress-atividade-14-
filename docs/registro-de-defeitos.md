# Registro de defeitos

Defeitos encontrados na análise da aplicação https://automationteststore.com/ em 20/11/2026.
Cada defeito possui um teste automatizado em `cypress/e2e/defeitos/defeitos.cy.js`, que descreve o comportamento esperado e falha enquanto o defeito existir.

## D-01 — Item "Home" permanece destacado no menu em todas as páginas

| Campo | Descrição |
|---|---|
| Requisito | RF-04 (estados e comportamentos dos elementos de navegação) |
| Severidade | Baixa (interface) |
| Passos | 1. Acessar `https://automationteststore.com/index.php?rt=product/category&path=36` (categoria Makeup). 2. Observar o menu principal. |
| Resultado esperado | Somente o item da seção atual (Makeup) aparece destacado no menu. |
| Resultado observado | Dois itens ficam destacados ao mesmo tempo: **Home** (link com a classe `active`) e **Makeup** (item com a classe `current`). O mesmo ocorre nas páginas de produto e no carrinho. |
| Teste | `D-01 [RF-04] somente o item da seção atual deve ficar destacado no menu principal` — falha com `expected <a.active.menu_home> not to have class 'active'` |
| Evidência | `evidencias/screenshots/defeitos.cy.js/D-01-menu-com-dois-itens-destacados.png` |

## D-02 — Produto sem estoque pode ser adicionado ao carrinho por URL, sem nenhum aviso

| Campo | Descrição |
|---|---|
| Requisito | RF-12 (comportamento da interface no carrinho) e RF-09 (inclusão no carrinho) |
| Severidade | Média (regra de negócio) |
| Passos | 1. Na categoria Apparel & accessories, identificar o produto "Product with options and stock locations" (id 122), que aparece como **Out of Stock** e sem botão de carrinho. 2. Acessar diretamente `https://automationteststore.com/index.php?rt=checkout/cart&product_id=122`. |
| Resultado esperado | O item não entra no carrinho, ou o carrinho exibe um aviso de falta de estoque. |
| Resultado observado | O produto é adicionado ao carrinho (1 item, total de $21,00, com frete $23,00), sem mensagem de aviso, e o botão **Checkout** permanece habilitado. A interface oculta o botão de adicionar, mas o carrinho aceita o produto quando a URL é acessada diretamente. |
| Teste | `D-02 [RF-12] produto sem estoque não deve entrar no carrinho nem sem aviso quando adicionado por URL` — falha com `item sem estoque aceito sem nenhum aviso: expected false to equal true` |
| Evidência | `evidencias/screenshots/defeitos.cy.js/D-02-produto-sem-estoque-no-carrinho.png` |
| Limitação | Não foi verificado se a finalização da compra bloqueia o pedido, pois o checkout está fora do escopo desta atividade. |

## Observação O-01 (cosmética) — Concordância no contador do carrinho

O contador do topo exibe "1 ITEMS" quando há apenas um item (por exemplo, "1 ITEMS - $29.50"). O esperado seria "1 ITEM". Evidência: `evidencias/screenshots/carrinho/carrinho.cy.js/RF-09-produto-adicionado.png`. Não foi criado teste para essa observação.
