// Módulo 02 - Catálogo e apresentação de produtos (RF-05 a RF-08)
describe("Módulo 02 - Catálogo e apresentação de produtos", () => {
  const categoria = (path) => `/index.php?rt=product/category&path=${path}`;
  const paraNumero = (txt) => parseFloat(txt.replace(/[^0-9.]/g, ""));

  it("RF-05 [positivo] listagem exibe nome, imagem e preço de cada produto", () => {
    cy.visit(categoria("43"));

    // os produtos ficam em colunas "col-*"; o grid também contém um <div class="clearfix"> separador
    cy.get('.thumbnails.grid > div[class*="col-"]')
      .should("have.length.greaterThan", 0)
      .each(($tile) => {
        cy.wrap($tile).within(() => {
          cy.get(".prdocutname").invoke("text").should("not.be.empty");
          cy.get(".thumbnail img").should("have.attr", "src").and("not.be.empty");
          cy.get(".pricenew, .oneprice")
            .first()
            .invoke("text")
            .should("match", /^\s*\$\d+\.\d{2}\s*$/);
        });
      });
    cy.screenshot("RF-05-listagem-produtos");
  });

  it("RF-06 [positivo] navega da listagem para os detalhes do produto e volta", () => {
    cy.visit(categoria("43"));
    cy.get(".thumbnails.grid .prdocutname")
      .first()
      .then(($a) => {
        const nome = $a.text().trim();
        cy.wrap($a).click();

        cy.url().should("include", "rt=product/product");
        cy.url().should("match", /product_id=\d+/);
        cy.get("h1.productname .bgnone").should(($h) => {
          expect($h.text().trim()).to.eq(nome);
        });
        cy.get(".productfilneprice").invoke("text").should("match", /\$\d+\.\d{2}/);
        cy.get("#product_quantity").should("have.value", "1");
        cy.screenshot("RF-06-detalhes-produto");
      });

    cy.go("back");
    cy.get("h1.heading1 .maintext").should("contain.text", "Skincare");
  });

  it("RF-07 [positivo] busca por produto existente retorna apenas resultados correspondentes", () => {
    cy.visit("/");
    cy.get("#filter_keyword").type("shirt");
    cy.get(".button-in-search").click();

    cy.url().should("include", "rt=product/search");
    cy.get("h1.heading1 .maintext").should("contain.text", "Search");
    cy.get(".thumbnails.grid .prdocutname")
      .should("have.length.greaterThan", 0)
      .each(($a) => {
        expect($a.text().toLowerCase()).to.include("shirt");
      });
    cy.screenshot("RF-07-busca-existente");
  });

  it("RF-07 [negativo] busca por produto inexistente exibe mensagem informativa", () => {
    cy.visit("/");
    cy.get("#filter_keyword").type("zzzzxxqq");
    cy.get(".button-in-search").click();

    cy.url().should("include", "rt=product/search");
    cy.get(".contentpanel").should(
      "contain.text",
      "There is no product that matches the search criteria."
    );
    cy.get(".thumbnails.grid .prdocutname").should("not.exist");
    cy.screenshot("RF-07-busca-inexistente");
  });

  it("RF-08 [consistência] nome e preço do produto em promoção são iguais na listagem, nos detalhes e no carrinho", () => {
    const nome = "BeneFit Girl Meets Pearl";
    cy.visit("/");

    // Listagem (home)
    cy.contains(".thumbnails > div", nome)
      .first()
      .then(($tile) => {
        const precoListagem = paraNumero($tile.find(".pricenew, .oneprice").first().text());
        const href = $tile.find(".prdocutname").attr("href");
        expect(precoListagem).to.be.greaterThan(0);

        // Detalhes
        cy.visit(href);
        cy.get("h1.productname .bgnone").should(($h) => expect($h.text().trim()).to.eq(nome));
        cy.get(".productfilneprice").should(($p) => {
          expect(paraNumero($p.text())).to.eq(precoListagem);
        });

        // Carrinho
        cy.get("a.cart").click();
        cy.url().should("include", "rt=checkout/cart");
        cy.contains(".product-list tr", nome).within(() => {
          cy.get("td").eq(3).should(($td) => expect(paraNumero($td.text())).to.eq(precoListagem));
          cy.get("td").eq(5).should(($td) => expect(paraNumero($td.text())).to.eq(precoListagem));
        });
        cy.screenshot("RF-08-consistencia-informacoes");
      });
  });
});
