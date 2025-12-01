describe("Fluxo completo PIX - Login -> Chaves -> Criar E-mail -> Dashboard -> Extrato", () => {
  const cpf = "11111111111";     
  const senha = "123456";        
  const email = "remetente@kre.com"; 

  it("Deve realizar o fluxo completo", () => {

    // === LOGIN ===
    cy.visit("/login");

    cy.get('input[placeholder="Digite seu CPF ou CNPJ"]').type(cpf);
    cy.get('input[placeholder="Digite sua senha"]').type(senha);
    cy.contains("button", "Entrar").click();

    cy.url().should("include", "/dashboard");


    // === IR PARA CHAVES ===
    cy.contains(".card h3", "Minhas Chaves").click();
    cy.url().should("include", "/chaves");


    // === CRIAR CHAVE DE E-MAIL ===
    cy.contains("button", "Adicionar nova chave").click();

    // Selecionar tipo E = Email
    cy.get("select").select("E");

    // Input deve habilitar para digitar o e-mail
    cy.get('input[type="text"]')
      .should("not.be.disabled")
      .type(email);

    // Salvar chave
    cy.contains("button", "Salvar").click();

    // Mensagem de sucesso
    cy.contains("Chave criada com sucesso!").should("exist");


    // === VOLTAR PARA DASHBOARD ===
    cy.contains("button", "Voltar").click();
    cy.url().should("include", "/dashboard");


    // === IR PARA EXTRATO ===
    cy.contains(".card h3", "Extrato").click();
    cy.url().should("include", "/extrato");

    cy.contains("Extrato").should("exist");
    cy.get("table").should("exist");
  });
});
