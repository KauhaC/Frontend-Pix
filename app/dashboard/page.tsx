"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

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

  return (
    <div className="corpo">

      <div className="cabecalho">
        <div className="pessoa">
          <p>Usuario: XYZ</p>
          <p>Email: XYZ</p>
          <p>Conta: XYZ</p>
          <p>Saldo: XYZ</p>

        </div>

        <div className="titulo">
          <h1 id="nomebank">KRE BANK</h1>
        </div>

        <div className="sair">
          <h3>SAIR</h3>
          {error && <p className="text-red-500">{error}</p>}
          {info ? (
            <>
              <p className="mb-2 text-green-600">{info.message}</p>
              <p className="text-gray-700 text-sm">
                Usuário: {info.payload.email}
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            !error && <p>Carregando...</p>
          )}
        </div>
      </div>


      <div className="conteudo">

        <div className="card">
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p><p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p><p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p><p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p><p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <p>teteteteteteteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
        </div>

        <div className="card">

        </div>

        <div className="card">

        </div>
      </div>

      <div className="rodape">
        <p>desenvolvido por k10 e rembold</p>
      </div>

    </div>


  );
}
