"use client";

import React, { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./extrato.css";
import Cookies from "js-cookie";

type TransacaoItem = {
  id: number;
  data_transferencia: string; 
  valor: number;
  mensagem?: string | null;
  chave_origem: string;
  chave_destino: string;
  tipo: "ENTRADA" | "SAIDA" | "SAÍDA" | "ENVIADO" | "RECEBIDO";
};

type ApiResponse = {
  total: number;
  page: number;
  size: number;
  items: TransacaoItem[];
};

export default function ExtratoPage(): JSX.Element {
  const router = useRouter();
  const API = "http://localhost:4000";
  const token = Cookies.get("token");

  const [items, setItems] = useState<TransacaoItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    fetchTransactions(page, size);
  }, [page, size]);

  async function fetchTransactions(p: number, s: number) {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`${API}/transacoes?page=${p}&size=${s}`, {
        credentials: "include",
      });

      const data: ApiResponse = await res.json();
      if (!res.ok) {
        setErro(data && (data as any).error ? (data as any).error : "Erro ao buscar transações");
        setItems([]);
        setTotal(0);
      } else {
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
      setErro("Erro de conexão ao buscar transações");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / size));

  function formatCurrency(v: number) {
    try {
      return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    } catch {
      return `R$ ${v.toFixed(2)}`;
    }
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="extrato-page">
      <header className="dashboard-header">
        <div className="logo">
          <div className="icon">🏦</div>
          <h2>KRE BANK</h2>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="logout-btn voltar-btn" onClick={() => router.push("/dashboard")}>
            ← Voltar
          </button>
        </div>
      </header>

      <main className="extrato-container">
        <h1>Extrato</h1>

        <div className="extrato-controls">
          <div>
            <label>Linhas por página:&nbsp;
              <select value={size} onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>

          <div className="pagination-info">
            <span>Página {page} / {totalPages}</span>
            <span style={{ marginLeft: 12 }}>Total: {total}</span>
          </div>
        </div>

        {loading ? (
          <div className="loader">Carregando transações...</div>
        ) : erro ? (
          <div className="erro">{erro}</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="extrato-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Mensagem</th>
                    <th>Origem → Destino</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                        Nenhuma transação encontrada
                      </td>
                    </tr>
                  ) : (
                    items.map((t) => (
                      <tr key={t.id}>
                        <td>{formatDate(t.data_transferencia)}</td>
                        <td className={t.tipo === "ENTRADA" || t.tipo === "RECEBIDO" ? "tipo-entrada" : "tipo-saida"}>
                          {t.tipo}
                        </td>
                        <td className={t.tipo === "ENTRADA" || t.tipo === "RECEBIDO" ? "valor-entrada" : "valor-saida"}>
                          {formatCurrency(Number(t.valor))}
                        </td>
                        <td>{t.mensagem ?? "-"}</td>
                        <td className="chaves-col">
                          <div style={{ fontSize: 13 }}>{t.chave_origem}</div>
                          <div style={{ fontSize: 13, color: "#666" }}>→ {t.chave_destino}</div>
                        </td>
                        <td>
                          <button
                            className="btn-small"
                            onClick={() => router.push(`/comprovante/${t.id}`)}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="extrato-footer">
              <div className="pagination-buttons">
                <button className="btn-page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  ← Anterior
                </button>

                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const v = Number(e.target.value || 1);
                    if (!isNaN(v)) setPage(Math.min(Math.max(1, v), totalPages));
                  }}
                  className="page-input"
                />

                <button className="btn-page" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Próxima →
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Desenvolvido por K10 e Rembold</p>
      </footer>
    </div>
  );
}
