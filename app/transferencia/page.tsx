"use client";

import { useState } from "react";

export default function TransferenciaPage() {
  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simula envio ao backend
    setMensagem("Transferência realizada com sucesso!");

    // Cria CSV com os dados
    const csvContent = `Destinatário,Valor,Chave PIX,Descrição,Data\n${destinatario},${valor},${chavePix},${descricao},${new Date().toLocaleString("pt-BR")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `comprovante_pix_${Date.now()}.csv`;
    link.click();

    // Redireciona para o comprovante após 1 segundo
    setTimeout(() => {
      window.location.href = "/comprovante";
    }, 1000);
  };

  return (
    <div className="transferencia-container">
      <form className="transferencia-card" onSubmit={handleSubmit}>
        <h1>KRE BANK</h1>
        <h2>Transferência PIX</h2>

        <label>
          <span>Destinatário</span>
          <input
            type="text"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            placeholder="Nome do destinatário"
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
          <span>Chave PIX</span>
          <input
            type="text"
            value={chavePix}
            onChange={(e) => setChavePix(e.target.value)}
            placeholder="E-mail, CPF ou número"
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

      <style jsx>{`
        body {
          background-color: #f9f6f3;
          font-family: "Poppins", sans-serif;
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .transferencia-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .transferencia-card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        h1 {
          font-size: 26px;
          color: #000;
          margin-bottom: 5px;
        }

        h2 {
          font-size: 18px;
          color: #333;
          margin-bottom: 25px;
        }

        label {
          display: block;
          text-align: left;
          margin-bottom: 15px;
        }

        label span {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #222;
          margin-bottom: 6px;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          transition: 0.2s;
        }

        input:focus {
          border-color: #ff7b00;
          outline: none;
          box-shadow: 0 0 4px rgba(255, 123, 0, 0.2);
        }

        .btn-confirmar {
          background-color: #ff7b00;
          color: #fff;
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-confirmar:hover {
          background-color: #e76e00;
        }

        .sucesso {
          color: green;
          font-size: 14px;
          margin-bottom: 10px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
