"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./transferencia.css";

export default function TransferenciaPage() {
  const router = useRouter();

  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [tipoChave, setTipoChave] = useState("cpf");
  const [chavePix, setChavePix] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  // === formata automaticamente o campo conforme tipo da chave ===
  const handleChaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (tipoChave === "cpf") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    } else if (tipoChave === "telefone") {
      value = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2")
        .substring(0, 15);
    }
    setChavePix(value);
  };

  // === envia a transferência e gera o CSV ===
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Transferência realizada com sucesso!");

    const csvContent = `Destinatário,Valor,Tipo de Chave,Chave PIX,Descrição,Data\n${destinatario},${valor},${tipoChave},${chavePix},${descricao},${new Date().toLocaleString("pt-BR")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `comprovante_pix_${Date.now()}.csv`;
    link.click();

    setTimeout(() => router.push("/comprovante"), 1000);
  };

  return (
    <div className="transferencia-page">
      {/* === HEADER === */}
      <header className="dashboard-header">
        <div className="logo">
          <div className="icon">🏦</div>
          <h2>KRE BANK</h2>
        </div>
        <button
          className="logout-btn voltar-btn"
          onClick={() => router.push("/dashboard")}
        >
          ← Voltar
        </button>
      </header>

      {/* === FORMULÁRIO === */}
      <div className="transferencia-container">
        <form className="transferencia-card" onSubmit={handleSubmit}>
          <h2>Transferência PIX</h2>

          <label>
            <span>Tipo de Chave PIX</span>
            <select
              value={tipoChave}
              onChange={(e) => {
                setTipoChave(e.target.value);
                setChavePix("");
              }}
              required
            >
              <option value="cpf">CPF</option>
              <option value="email">E-mail</option>
              <option value="telefone">Telefone</option>
              <option value="aleatoria">Chave aleatória</option>
            </select>
          </label>

          <label>
            <span>Chave PIX</span>
            <input
              type="text"
              value={chavePix}
              onChange={handleChaveChange}
              placeholder={
                tipoChave === "cpf"
                  ? "000.000.000-00"
                  : tipoChave === "telefone"
                  ? "(00) 00000-0000"
                  : tipoChave === "email"
                  ? "exemplo@email.com"
                  : "Chave aleatória"
              }
              required
            />
          </label>

          <label>
            <span>Valor</span>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Digite o valor"
              required
            />
          </label>


          <label>
            <span>Descrição</span>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Opcional"
            />
          </label>

          {mensagem && <p className="sucesso">{mensagem}</p>}

          <button type="submit" className="btn-confirmar">
            Confirmar transferência
          </button>
        </form>
      </div>

      {/* === FOOTER === */}
      <footer className="footer">
        <p>Desenvolvido por K10 e Rembold</p>
      </footer>

    </div>
  );
}
