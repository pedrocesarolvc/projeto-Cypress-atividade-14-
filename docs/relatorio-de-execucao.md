# Relatório de execução

**Projeto:** Automação de testes de interface — Automation Test Store
**Data da execução:** 20/11/2026
**Ferramenta:** Cypress 13.17.0, navegador Electron 118 (headless), Node 20, GitHub Actions (ubuntu-latest)
**Aplicação:** https://automationteststore.com/

## Resumo

| Conjunto | Testes | Aprovados | Reprovados |
|---|---|---|---|
| Funcionais (módulos 01 a 05) | 24 | 24 | 0 |
| Reprodução de defeitos | 2 | 0 | 2 (esperado) |

Duração da suíte funcional: cerca de 2 minutos (`evidencias/execucao.log`).

## Resultado por módulo

| Módulo | Arquivo | Testes | Aprovados |
|---|---|---|---|
| 01 Navegação | `navegacao/navegacao.cy.js` | 6 | 6 |
| 02 Catálogo | `catalogo/catalogo.cy.js` | 5 | 5 |
| 03 Carrinho | `carrinho/carrinho.cy.js` | 6 | 6 |
| 04 Formulários | `formularios/formularios.cy.js` | 4 | 4 |
| 05 Responsividade | `responsividade/responsividade.cy.js` | 3 | 3 |
| Defeitos | `defeitos/defeitos.cy.js` | 2 | 0 (D-01 e D-02 confirmados) |

## Cobertura dos requisitos

Todos os requisitos RF-01 a RF-16 possuem ao menos um teste. A tabela completa está no `README.md`.

| Categoria exigida | Mínimo | Implementados |
|---|---|---|
| Positivos | 6 | 10 |
| Negativos | 4 | 5 |
| Comportamento e estados da interface | 3 | 4 |
| Responsividade | 2 | 3 |
| Consistência de informações | 1 | 2 |
| **Total** | **16** | **24** |

## Evidências

- Capturas de tela dos cenários positivos, negativos, desktop e mobile: `evidencias/screenshots/`
- Vídeos da execução de cada arquivo de teste: `evidencias/videos/`
- Saída completa do Cypress: `evidencias/execucao.log` e `evidencias/execucao-defeitos.log`
- Evidências dos defeitos: `evidencias/screenshots/defeitos.cy.js/`

## Falhas e execuções intermitentes

- Durante o desenvolvimento, uma execução teve uma falha intermitente no teste "retorna à página anterior pelo histórico": o carregamento de uma página de produto ficou aguardando o evento de load do site público. O teste passou na segunda tentativa automática (`retries`), sem alteração de código. Na execução final dos 24 testes não houve nova tentativa.
- Não foram encontradas falhas nos testes funcionais na execução final.

## Defeitos

Foram registrados 2 defeitos reais e 1 observação cosmética em `docs/registro-de-defeitos.md`.

## Limitações

- Os testes dependem de um site público de demonstração. Produtos, preços e disponibilidade podem mudar, e a lentidão ocasional do site pode causar falhas intermitentes.
- Os testes usam produtos específicos (ids 50 e 51, "BeneFit Girl Meets Pearl" e a categoria Skincare). Se esses dados forem alterados no site, os testes precisarão de ajuste.
- A responsividade mobile é simulada por viewport (375x812) no Electron, não em dispositivo real nem em outros navegadores.
- O teste RF-14 envia uma mensagem real ao formulário de contato do site de demonstração a cada execução.
- O fluxo de checkout e de cadastro de usuário está fora do escopo da atividade e não foi automatizado.
- A ordenação por nome (RF-04) depende da ordenação do servidor; foi validada na categoria Skincare.
