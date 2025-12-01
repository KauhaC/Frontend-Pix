declare namespace Cypress {
  interface Chainable {
    login(cpf: string, senha: string): Chainable<void>;
  }
}
