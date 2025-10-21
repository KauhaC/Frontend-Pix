"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="card">
      <h2>Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {info ? (
        <>
          <p style={{ color: "green" }}>{info.message}</p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Usuário: {info.payload.email}
          </p>
          <button onClick={handleLogout}>Sair</button>
        </>
      ) : (
        !error && <p>Carregando...</p>
      )}
    </div>
  );
}
