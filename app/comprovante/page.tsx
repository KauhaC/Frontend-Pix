"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transfer = {
  id?: string;
  destinatario: string;
  chavePix: string;
  valor: string;
  descricao?: string;
  data?: string;
};

export default function ComprovantePage() {
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastTransfer");
      if (!raw) {
        setMessage("Nenhum comprovante encontrado. Faça uma transferência primeiro.");
        return;
      }
      const parsed = JSON.parse(raw) as Transfer;
      // Se não houver id/data, cria alguns valores padrão
      const now = new Date();
      const defaultTransfer: Transfer = {
        id: parsed.id || `TRX-${now.getTime()}`,
        data: parsed.data || now.toISOString(),
        destinatario: parsed.destinatario || parsed.chavePix || "—",
        chavePix: parsed.chavePix || "—",
        valor: parsed.valor || "0.00",
        descricao: parsed.descricao || "",
      };
      setTransfer(defaultTransfer);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao ler comprovante.");
    }
  }, []);

  function formatCurrency(value: string) {
    // tenta converter para number e formatar BRL
    const num = Number(value.toString().replace(",", "."));
    if (isNaN(num)) return value;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  }

  function downloadCSV() {
    if (!transfer) return;
    // CSV header + values
    const headers = ["id", "data", "destinatario", "chavePix", "valor", "descricao"];
    const row = [
      transfer.id || "",
      transfer.data || "",
      transfer.destinatario || "",
      transfer.chavePix || "",
      transfer.valor || "",
      transfer.descricao || "",
    ];

    // Escape values containing commas, quotes or newlines
    const escape = (v: string) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      if (/[",\r\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csv = headers.join(",") + "\n" + row.map(escape).join(",");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `comprovante-${ts}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="comprovante-page">
      <div className="comprovante-card">
        <header className="header">
          <div className="logo">
            <div className="icon">🏦</div>
            <h1>KRE BANK</h1>
          </div>
        </header>

        <main className="main">
          <h2>Comprovante de Transferência</h2>

          {message && (
            <div className="empty">
              <p>{message}</p>
              <div className="actions">
                <button onClick={() => router.push("/transferencia")} className="btn-primary">
                  Ir para Transferência
                </button>
              </div>
            </div>
          )}

          {transfer && (
            <div className="details">
              <div className="row">
                <div className="label">ID da transação</div>
                <div className="value">{transfer.id}</div>
              </div>

              <div className="row">
                <div className="label">Data</div>
                <div className="value">{formatDate(transfer.data)}</div>
              </div>

              <div className="row">
                <div className="label">Nome do destinatário</div>
                <div className="value">{transfer.destinatario}</div>
              </div>

              <div className="row">
                <div className="label">Chave PIX</div>
                <div className="value">{transfer.chavePix}</div>
              </div>

              <div className="row">
                <div className="label">Valor</div>
                <div className="value">{formatCurrency(transfer.valor)}</div>
              </div>

              <div className="row">
                <div className="label">Descrição</div>
                <div className="value">{transfer.descricao || "—"}</div>
              </div>

              <div className="actions">
                <button className="btn-primary" onClick={downloadCSV}>
                  Baixar comprovante (CSV)
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    // opcional: limpar comprovante do localStorage
                    // localStorage.removeItem("lastTransfer");
                    router.push("/dashboard");
                  }}
                >
                  Voltar ao painel
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        :global(body) {
          margin: 0;
          background-color: #f9f6f3;
          font-family: "Poppins", sans-serif;
          color: #181411;
        }

        .comprovante-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .comprovante-card {
          width: 760px;
          max-width: 96%;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .header {
          padding: 18px 28px;
          border-bottom: 1px solid #f0eae4;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo .icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #f27f0d;
        }

        .logo h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .main {
          padding: 36px 48px;
        }

        .main h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 800;
          text-align: center;
        }

        .details {
          margin-top: 22px;
        }

        .row {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 14px 16px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #faf6f3;
          margin-bottom: 12px;
        }

        .label {
          min-width: 180px;
          color: #7a6b5a;
          font-size: 14px;
        }

        .value {
          flex: 1;
          font-weight: 600;
          color: #181411;
        }

        .actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 18px;
        }

        .btn-primary {
          background: #ff7b00;
          color: white;
          border: none;
          padding: 11px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
        }

        .btn-primary:hover {
          background: #e76e00;
        }

        .btn-secondary {
          background: transparent;
          color: #555;
          border: 1px solid #eee;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
        }

        .empty {
          text-align: center;
          padding: 30px 0;
        }

        @media (max-width: 720px) {
          .comprovante-card {
            width: 100%;
          }
          .row {
            flex-direction: column;
            align-items: flex-start;
          }
          .label {
            min-width: auto;
            margin-bottom: 6px;
          }
        }
      `}</style>
    </div>
  );
}
