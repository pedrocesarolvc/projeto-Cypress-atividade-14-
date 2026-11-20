// Módulo 03 - Gerenciamento do carrinho (RF-09 a RF-12)
describe("Módulo 03 - Gerenciamento do carrinho", () => {
  const produto = (id) => `/index.php?rt=product/product&product_id=${id}`;
  const carrinho = "/index.php?rt=checkout/cart";
  const paraNumero = (txt) => parseFloat(txt.replace(/[^0-9.]/g, ""));
  // contador (quantidade de itens) e total exibidos no topo do site
  const contadorTopo = () => cy.get(".topcart .label");
  const totalTopo = () => cy.get(".topcart .cart_total");

  it("RF-09 [positivo] adiciona produto pela página de detalhes e atualiza o carrinho", () => {
    cy.visit(produto(50));
    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("0"));

    cy.get("a.cart").click();

    cy.url().should("include", "rt=checkout/cart");
    cy.get("h1.heading1 .maintext").should("contain.text", "Shopping Cart");
    cy.contains(".product-list tr", "Skinsheen Bronzer Stick").within(() => {
      cy.get('input[name="quantity[50]"]').should("have.value", "1");
    });
    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("1"));
    totalTopo().should(($t) => expect(paraNumero($t.text())).to.eq(29.5));
    cy.screenshot("RF-09-produto-adicionado");
  });

  it("RF-09 [positivo] adiciona produto direto da listagem da página inicial", () => {
    cy.visit("/");
    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("0"));

    cy.get('.productcart[data-id="50"]').first().click();

    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("1"));
    totalTopo().should(($t) => expect(paraNumero($t.text())).to.eq(29.5));

    cy.visit(carrinho);
    cy.get(".product-list").should("contain.text", "Skinsheen Bronzer Stick");
  });

  it("RF-10 [positivo] atualiza a quantidade de um produto no carrinho", () => {
    cy.visit(produto(50));
    cy.get("a.cart").click();
    cy.url().should("include", "rt=checkout/cart");

    cy.get('input[name="quantity[50]"]').clear().type("3");
    cy.get("#cart_update").click();

    cy.get('input[name="quantity[50]"]').should("have.value", "3");
    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("3"));
    cy.screenshot("RF-10-quantidade-atualizada");
  });

  it("RF-11 [consistência] recalcula subtotais e total após alterar a quantidade", () => {
    cy.visit(produto(50));
    cy.get("a.cart").click();
    cy.visit(produto(51));
    cy.get("a.cart").click();
    cy.url().should("include", "rt=checkout/cart");

    cy.get('input[name="quantity[50]"]').clear().type("3");
    cy.get("#cart_update").click();

    // linha do produto 50: 3 x preço unitário
    cy.contains(".product-list tr", "Skinsheen Bronzer Stick").within(() => {
      cy.get("td").eq(3).invoke("text").then((unit) => {
        cy.get("td").eq(5).should(($t) => {
          expect(paraNumero($t.text())).to.be.closeTo(paraNumero(unit) * 3, 0.001);
        });
      });
    });
    // linha do produto 51 permanece com 1 unidade
    cy.contains(".product-list tr", "BeneFit Girl Meets Pearl").within(() => {
      cy.get('input[name="quantity[51]"]').should("have.value", "1");
      cy.get("td").eq(5).should(($t) => expect(paraNumero($t.text())).to.eq(19));
    });
    // quadro de totais: Sub-Total = 3 x 29.50 + 19.00 e Total = Sub-Total + frete
    const valorDaLinha = (rotulo) =>
      cy.contains("#totals_table tr", rotulo).find("td").last().invoke("text").then(paraNumero);
    valorDaLinha("Sub-Total").should("be.closeTo", 107.5, 0.001);
    valorDaLinha("Sub-Total").then((subtotal) => {
      valorDaLinha("Flat Shipping Rate").then((frete) => {
        // linha "Total:" (texto exato, para não confundir com "Sub-Total:")
        cy.contains("#totals_table td", /^\s*Total:\s*$/).parent("tr").find("td").last().should(($t) => {
          expect(paraNumero($t.text())).to.be.closeTo(subtotal + frete, 0.001);
        });
      });
    });
    // total do topo = 3 x 29.50 + 19.00
    totalTopo().should(($t) => expect(paraNumero($t.text())).to.be.closeTo(107.5, 0.001));
    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("4"));
    cy.screenshot("RF-11-recalculo-total");
  });

  it("RF-12 [positivo] remove produto e exibe a mensagem de carrinho vazio", () => {
    cy.visit(produto(50));
    cy.get("a.cart").click();
    cy.url().should("include", "rt=checkout/cart");

    cy.get('a[href*="remove=50"]').click();

    cy.get(".contentpanel").should("contain.text", "Your shopping cart is empty!");
    cy.get(".product-list").should("not.exist");
    contadorTopo().should(($l) => expect($l.text().trim()).to.eq("0"));
    cy.get(".contentpanel a[title='Continue']").should("be.visible");
    cy.screenshot("RF-12-carrinho-vazio");
  });

  it("RF-12 [negativo] produto sem estoque não oferece botão de adicionar ao carrinho", () => {
    cy.visit("/index.php?rt=product/category&path=68");

    cy.get(".thumbnails.grid > div")
      .filter(":has(.nostock)")
      .should("have.length.at.least", 1)
      .each(($tile) => {
        expect($tile.find(".nostock").text()).to.match(/Out of Stock/i);
        expect($tile.find(".productcart").length, "botão de carrinho").to.eq(0);
      });
    cy.screenshot("RF-12-produto-sem-estoque");
  });
});
