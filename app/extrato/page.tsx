"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css"; // Header e footer globais

export default function ExtratoPage() {
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const router = useRouter();

  const transacoes = [
    {
      data: "25/07/2024 14:30",
      descricao: "João da Silva\njoao.silva@email.com",
      tipo: "PIX Recebido",
      valor: "+ R$ 50,00",
    },
    {
      data: "25/07/2024 10:15",
      descricao: "Supermercado ABC\n12.345.678/0001-90",
      tipo: "PIX Enviado",
      valor: "- R$ 120,00",
    },
    {
      data: "24/07/2024 20:05",
      descricao: "Maria Oliveira\n(11) 98765-4321",
      tipo: "PIX Enviado",
      valor: "- R$ 75,50",
    },
    {
      data: "24/07/2024 09:00",
      descricao: "Empresa XYZ\nPagamento Salário",
      tipo: "PIX Recebido",
      valor: "+ R$ 2.500,00",
    },
    {
      data: "23/07/2024 18:45",
      descricao: "Netflix\nAssinatura Mensal",
      tipo: "PIX Enviado",
      valor: "- R$ 39,90",
    },
  ];

  const saldoDisponivel = 1234.56;
  const entradasHoje = 85.9;
  const saidasHoje = 120.0;

  const exportarCSV = () => {
    const csvHeader = "Data,Descrição,Tipo,Valor\n";
    const csvRows = transacoes
      .map(
        (t) =>
          `${t.data},"${t.descricao.replace(/\n/g, " - ")}",${t.tipo},${t.valor}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extrato_pix.csv";
    link.click();
  };

  return (
    <div className="dashboard">
      {/* HEADER GLOBAL */}
      <header className="dashboard-header">
        <div className="logo">
          <div className="icon">🏦</div>
          <h2>KRE BANK</h2>
        </div>
        <button className="logout-btn" onClick={() => router.push("/dashboard")}>
          Voltar
        </button>
      </header>

      <main className="extrato-container">
        <div className="extrato-card">
          <h1>Meu Extrato</h1>

          <div className="saldo-box">
            <button onClick={exportarCSV} className="btn-exportar">
              ⬇️ Exportar CSV
            </button>

            <h3>Saldo Disponível</h3>
            <h2>
              {mostrarSaldo
                ? `R$ ${saldoDisponivel.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`
                : "••••••"}
              <button
                className="mostrar-saldo"
                onClick={() => setMostrarSaldo(!mostrarSaldo)}
              >
                {mostrarSaldo ? "🙈" : "👁️"}
              </button>
            </h2>

            <p>
              <strong>Entradas de Hoje:</strong> + R${" "}
              {entradasHoje.toFixed(2).replace(".", ",")}
            </p>
            <p>
              <strong>Saídas de Hoje:</strong> - R${" "}
              {saidasHoje.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <h2>Histórico de Transações</h2>

          <div className="tabela-transacoes">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t, i) => (
                  <tr key={i}>
                    <td>{t.data}</td>
                    <td style={{ whiteSpace: "pre-line" }}>{t.descricao}</td>
                    <td>{t.tipo}</td>
                    <td>{t.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER GLOBAL */}
      <footer className="footer">
        <p>Desenvolvido por K10 e Rembold</p>
      </footer>

      {/* ===== ESTILO LOCAL ===== */}
      <style jsx>{`
        .extrato-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px;
          background: #f8f7f5;
          min-height: 100vh;
        }

        .extrato-card {
          background: #fff;
          padding: 30px 40px;
          border-radius: 15px;
          width: 100%;
          max-width: 900px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        h1 {
          font-size: 26px;
          margin-bottom: 25px;
          color: #181411;
        }

        .saldo-box {
          margin-bottom: 30px;
        }

        .saldo-box h2 {
          font-size: 22px;
          color: #f27f0d;
        }

        .mostrar-saldo {
          margin-left: 10px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }

        .btn-exportar {
          background-color: #f27f0d;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 15px;
        }

        .btn-exportar:hover {
          opacity: 0.9;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th,
        td {
          padding: 10px;
          border-bottom: 1px solid #eee;
          text-align: left;
          font-size: 14px;
          color: #333;
        }

        th {
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #f0eae4;
        }

        tr:hover {
          background: #fff7f0;
        }
      `}</style>
    </div>
  );
}
