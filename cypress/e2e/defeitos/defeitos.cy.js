// Testes que reproduzem possíveis defeitos encontrados na análise da aplicação.
// Cada teste descreve o comportamento ESPERADO; ele falha enquanto o defeito existir.
// Detalhes em docs/registro-de-defeitos.md
describe("Defeitos identificados na aplicação", () => {
  it("D-01 [RF-04] somente o item da seção atual deve ficar destacado no menu principal", () => {
    cy.visit("/index.php?rt=product/category&path=36");
    cy.get("ul.categorymenu > li.current").should("contain.text", "Makeup");
    cy.screenshot("D-01-menu-com-dois-itens-destacados");

    // esperado: "Home" não permanece destacado quando a página atual é a categoria Makeup
    cy.get("ul.categorymenu a.menu_home").should("not.have.class", "active");
  });

  it("D-02 [RF-12] produto sem estoque não deve entrar no carrinho nem sem aviso quando adicionado por URL", () => {
    cy.visit("/index.php?rt=checkout/cart&product_id=122");
    cy.get("h1.heading1 .maintext").should("contain.text", "Shopping Cart");
    cy.screenshot("D-02-produto-sem-estoque-no-carrinho");

    cy.get(".contentpanel").then(($c) => {
      const noCarrinho = $c.text().includes("Product with options and stock locations");
      const temAviso = /out of stock|insufficient|not available|\*\*\*/i.test($c.text()) ||
        Cypress.$("body").find(".alert-error, .alert-danger, .alert-warning").length > 0;
      // esperado: ou o item não entra no carrinho, ou a interface avisa sobre a falta de estoque
      expect(!noCarrinho || temAviso, "item sem estoque aceito sem nenhum aviso").to.eq(true);
    });
  });
});
