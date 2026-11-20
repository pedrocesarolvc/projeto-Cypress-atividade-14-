// Módulo 01 - Navegação e organização da interface (RF-01 a RF-04)
describe("Módulo 01 - Navegação e organização da interface", () => {
  const categoria = (path) => `/index.php?rt=product/category&path=${path}`;

  it("RF-01 [positivo] navega da página inicial para a categoria Skincare pelo menu", () => {
    cy.visit("/");
    cy.get("ul.categorymenu").should("be.visible");

    cy.get('ul.categorymenu a[href$="path=43"]').first().click();

    cy.url().should("include", "path=43");
    cy.get("h1.heading1 .maintext").should("contain.text", "Skincare");
    cy.get("ul.breadcrumb").should("contain.text", "Skincare");
    cy.screenshot("RF-01-navegacao-categoria");
  });

  it("RF-02 [positivo] categoria exibe produtos e subcategorias correspondentes", () => {
    cy.visit(categoria("68"));
    cy.get("h1.heading1 .maintext").should("contain.text", "Apparel & accessories");
    cy.get(".thumbnails.grid > div").should("have.length.greaterThan", 0);
    cy.get('ul.thumbnails.row a[href*="path=68_"]').should("have.length.at.least", 2);

    // Subcategoria Shoes: todos os produtos listados devem pertencer ao caminho 68_69
    cy.get('ul.thumbnails.row a[href$="path=68_69"]').first().click();
    cy.url().should("include", "path=68_69");
    cy.get("h1.heading1 .maintext").should("contain.text", "Shoes");
    cy.get(".thumbnails.grid .prdocutname")
      .should("have.length.greaterThan", 0)
      .each(($a) => {
        expect($a.attr("href")).to.include("path=68_69");
      });
    cy.screenshot("RF-02-subcategoria-shoes");
  });

  it("RF-03 [positivo] retorna à página inicial pelo breadcrumb e pelo logotipo", () => {
    cy.visit(categoria("43"));
    cy.get("ul.breadcrumb a").contains("Home").click();
    cy.location("pathname").should("eq", "/");
    cy.get("h1.heading1, .heading1").should("exist");

    cy.visit(categoria("36"));
    cy.get("a.logo").first().click();
    cy.location("pathname").should("eq", "/");
    cy.get("ul.categorymenu").should("be.visible");
  });

  it("RF-03 [positivo] retorna à página anterior pelo histórico do navegador", () => {
    cy.visit(categoria("43"));
    cy.get(".thumbnails.grid .prdocutname").first().click();
    cy.url().should("include", "rt=product/product");

    cy.go("back");

    cy.url().should("include", "rt=product/category");
    cy.url().should("include", "path=43");
    cy.get("h1.heading1 .maintext").should("contain.text", "Skincare");
  });

  it("RF-04 [estado da interface] item de menu da categoria atual recebe o estado 'current'", () => {
    cy.visit("/");
    cy.get('ul.categorymenu > li.current').should("not.exist");

    cy.get('ul.categorymenu a[href$="path=36"]').first().click();

    cy.get("ul.categorymenu > li.current")
      .should("have.length", 1)
      .and("contain.text", "Makeup");
    cy.get('ul.categorymenu > li.current a[href$="path=43"]').should("not.exist");
  });

  it("RF-04 [estado da interface] ordenar por nome altera a ordem dos produtos listados", () => {
    cy.visit(categoria("43"));
    cy.get("#sort").select("Name A - Z");

    cy.url().should("include", "sort=pd.name-ASC");
    cy.get("#sort").find("option:selected").should("contain.text", "Name A - Z");
    cy.get(".thumbnails.grid .prdocutname").then(($links) => {
      const nomes = [...$links].map((a) => a.textContent.trim().toLowerCase());
      expect(nomes.length).to.be.greaterThan(1);
      const ordenados = [...nomes].sort((a, b) => a.localeCompare(b));
      expect(nomes).to.deep.eq(ordenados);
    });
  });
});
