describe("Fluxo PIX - Login → Transferência (somente validação, sem enviar)", () => {

  const FRONT = "http://localhost:3000";
  const API = "http://localhost:4000";

  const remetenteCpf = "11111111111";
  const senha = "123456";
  const chaveDestino = "destinatario@kre.com";

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("Login → Transferência → Abre modal de confirmação (sem enviar)", () => {

    // -------------------------------------
    // 1. LOGIN
    // -------------------------------------
    cy.visit(`${FRONT}/login`);

    cy.get("input[placeholder='Digite seu CPF ou CNPJ']").type(remetenteCpf);
    cy.get("input[placeholder='Digite sua senha']").type(senha);

    cy.intercept("POST", "/api/login").as("loginReq");
    cy.contains(/entrar/i).click();

    cy.wait("@loginReq").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/dashboard");


    // -------------------------------------
    // 2. IR PARA A PÁGINA DE TRANSFERÊNCIA
    // -------------------------------------
    cy.contains("PIX").click();
    cy.url().should("include", "/transferencia");


    // Seleciona E-mail
    cy.get("select").select("E-mail");

    // intercept verificar chave
    cy.intercept(
      "GET",
      `${API}/transacoes/verificar-chave*`
    ).as("verificaChave");


    // Preenche chave
    cy.contains("label", "Chave PIX")
      .should("be.visible");

    // Avança
    cy.contains("button", "Avançar").click();
    cy.contains("label", "Chave PIX")
  .parent()                    // pega o container pai
  .find("input")               // encontra o input dentro do container
  .type(chaveDestino, { delay: 0 });

    cy.wait("@verificaChave").its("response.statusCode").should("eq", 200);

    // Valida info do destinatário
    cy.contains(/Enviar para:/i).should("be.visible");
    cy.contains(/nome|destinatário|email/i).should("exist");


    // -------------------------------------
    // 3. VALOR E DESCRIÇÃO
    // -------------------------------------
    cy.get('input[type="number"]').type("10");
    cy.get('input[placeholder="Opcional"]').type("Teste Cypress");


    // -------------------------------------
    // 4. ABRIR APENAS O MODAL (SEM ENVIAR PIX)
    // -------------------------------------
    cy.contains(/confirmar/i).click({ force: true });


    // VERIFICA SE O MODAL APARECEU
    cy.get(".modal-container, .modal, [role='dialog']")
      .should("be.visible");


    cy.contains(/tem certeza|confirma/i).should("exist");

    // MUITO IMPORTANTE: NÃO CLICAR NO "CONFIRMAR" DO MODAL
    // Para não disparar o PIX real


    // -------------------------------------
    // 5. FINALIZA O TESTE
    // -------------------------------------
    cy.log("✔ Modal aberto com sucesso, teste finalizado.");
  });

});
