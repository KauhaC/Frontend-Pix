"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function DashboardPage() {
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const saldo = 5000.0; // valor do saldo (pode vir de props, API etc.)
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) setInfo(data);
        else setError(data.error);
      })
      .catch(() => setError("Erro ao conectar com servidor"));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <div className="icon">🏦</div>
          <h2>KRE BANK</h2>
        </div>
        <button className="logout-btn" onClick={logout}>
          Sair
        </button>
      </header>

      <section className="user-info">
        <img
          src="https://i.pravatar.cc/100"
          alt="Avatar"
          className="avatar"
        />
        <div className="saldo-wrapper">
          <h3>Olá, Pedro</h3>

          <h3>
            Saldo:{" "}
            {mostrarSaldo ? (
              `R$ ${saldo.toLocaleString("pt-BR", {minimumFractionDigits: 2,})}`) : ("••••••")}
            <button
              type="button"
              className="mostrar-saldo"
              onClick={() => setMostrarSaldo(!mostrarSaldo)}
              style={{ marginLeft: "8px" }}
            >
              {mostrarSaldo ? "🙈" : "👁️"}
            </button>
          </h3>
        </div>



      </section>

      <main className="main-content">
        <h1>O que você gostaria de fazer?</h1>
        <div className="cards">

          <div className="card"
            onClick={() => router.push("/extrato")}
            style={{ cursor: "pointer" }}
          >
            <div className="icon">🧾</div>
            <h3>Extrato</h3>
            <p>Consulte suas transações</p>
          </div>

          {/* === CARD PIX CLICÁVEL === */}
          <div
            className="card active"
            onClick={() => router.push("/transferencia")}
            style={{ cursor: "pointer" }}
          >
            <div className="icon">💸</div>
            <h3>PIX</h3>
            <p>Envie e receba dinheiro</p>
          </div>

          <div className="card">
            <div className="icon">🔑</div>
            <h3>Minhas Chaves</h3>
            <p>Gerencie suas chaves</p>
          </div>

        </div>
      </main>

      <footer className="footer">
        <p>Desenvolvido por K10 e Rembold</p>
      </footer>
    </div>
  );
}
