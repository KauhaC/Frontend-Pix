/// <reference types="cypress" />

Cypress.Commands.add("login", (cpf: string, senha: string) => {
  cy.visit("/login");

  cy.get('input[name="cpf_cnpj"]').type(cpf);
  cy.get('input[name="senha"]').type(senha);

  cy.get("button[type=submit]").click();
});
