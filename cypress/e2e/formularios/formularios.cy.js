// Módulo 04 - Formulários e validação de interface (RF-13 e RF-14)
describe("Módulo 04 - Formulários e validação de interface", () => {
  const contato = "/index.php?rt=content/contact";

  it("RF-13 [negativo] formulário de contato vazio informa os campos obrigatórios", () => {
    cy.visit(contato);
    cy.get("#ContactUsFrm").should("be.visible");

    cy.get('#ContactUsFrm button[title="Submit"]').click();

    cy.url().should("include", "rt=content/contact");
    cy.get("#field_11 .element_error").should("contain.text", "First name: is required field!");
    cy.get("#field_12 .element_error").should("contain.text", "Email: is required field!");
    cy.get("#field_13 .element_error").should("be.visible").and("not.be.empty");
    cy.get(".contentpanel").should("not.contain.text", "successfully sent");
    cy.screenshot("RF-13-contato-campos-obrigatorios");
  });

  it("RF-13 [negativo] e-mail inválido é rejeitado com mensagem de orientação", () => {
    cy.visit(contato);
    cy.get("#ContactUsFrm_first_name").type("Teste QA");
    cy.get("#ContactUsFrm_email").type("emailinvalido");
    cy.get("#ContactUsFrm_enquiry").type("Mensagem de teste automatizado com Cypress.");

    cy.get('#ContactUsFrm button[title="Submit"]').click();

    cy.get("#field_12 .element_error").should(
      "contain.text",
      "E-Mail Address does not appear to be valid!"
    );
    cy.get("#field_11 .element_error").should("not.exist");
    cy.get("#field_13 .element_error").should("not.exist");
    cy.get("#ContactUsFrm_first_name").should("have.value", "Teste QA");
    cy.screenshot("RF-13-contato-email-invalido");
  });

  it("RF-14 [positivo] envio válido exibe a mensagem de confirmação", () => {
    cy.visit(contato);
    cy.get("#ContactUsFrm_first_name").type("Teste QA");
    cy.get("#ContactUsFrm_email").type("teste.qa@example.com");
    cy.get("#ContactUsFrm_enquiry").type(
      "Mensagem automatizada para validar o envio do formulario de contato."
    );

    cy.get('#ContactUsFrm button[title="Submit"]').click();

    cy.get(".contentpanel").should(
      "contain.text",
      "Your enquiry has been successfully sent to the store owner!"
    );
    cy.get("#ContactUsFrm").should("not.exist");
    cy.screenshot("RF-14-contato-confirmacao");
  });

  it("RF-14 [negativo] login com credenciais inválidas exibe mensagem de erro", () => {
    cy.visit("/index.php?rt=account/login");
    cy.get("#loginFrm_loginname").type("usuario_inexistente_qa");
    cy.get("#loginFrm_password").type("senhaerrada123");

    cy.get('#loginFrm button[title="Login"]').click();

    cy.url().should("include", "rt=account/login");
    cy.get(".alert").should("be.visible").and("contain.text", "Incorrect login or password provided");
    cy.screenshot("RF-14-login-invalido");
  });
});
