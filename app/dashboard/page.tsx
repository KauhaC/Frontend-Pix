"use client";

import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function DashboardPage() {
  const { user, atualizarUsuario } = useAuth();
  const router = useRouter();

  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [saldo, setSaldo] = useState<number>(0);

  const API = "http://localhost:4000";


  useEffect(() => {
    async function carregarUsuario() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setSaldo(Number(data.saldo));
        atualizarUsuario(data);

      } catch (e) {
        console.error("Erro ao buscar saldo:", e);
        router.push("/login");
      }
    }

    carregarUsuario();
  }, []);


  const logout = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Erro ao deslogar:", e);
  } finally {
    localStorage.removeItem("user");
    router.push("/login");
  }
};


  // Formatador de moeda
  function formatarBRL(v: number) {
    return v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  }

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
          <h3>Olá, {user?.nome ?? "Usuário"}</h3>

          <h3>
            Saldo:{" "}
            {mostrarSaldo
              ? `R$ ${formatarBRL(saldo)}`
              : "••••••"}
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

          <div
            className="card"
            onClick={() => router.push("/extrato")}
            style={{ cursor: "pointer" }}
          >
            <div className="icon">🧾</div>
            <h3>Extrato</h3>
            <p>Consulte suas transações</p>
          </div>

          <div
            className="card active"
            onClick={() => router.push("/transferencia")}
            style={{ cursor: "pointer" }}
          >
            <div className="icon">💸</div>
            <h3>PIX</h3>
            <p>Envie e receba dinheiro</p>
          </div>

          <div
            className="card"
            onClick={() => router.push("/chaves")}
            style={{ cursor: "pointer" }}
          >
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
