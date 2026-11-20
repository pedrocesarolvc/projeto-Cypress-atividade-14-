// Erros de JavaScript do próprio site (scripts de terceiros, analytics etc.)
// não devem derrubar os testes de interface.
Cypress.on("uncaught:exception", () => false);
