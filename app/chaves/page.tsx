"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./chaves.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";

const schema = z.object({
  tipo: z.enum(["E", "T", "C", "A"]),
  valor: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Chave = {
  chave: string;
  tipo: "E" | "T" | "C" | "A";
};

export default function ChavesPage() {
  const router = useRouter();
  const API = "http://localhost:4000";

  const token = Cookies.get("token");

  console.log("TOKEN:", token);

  const [chaves, setChaves] = useState<Chave[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: "E",
      valor: "",
    },
  });

  const tipo = watch("tipo");
  const valor = watch("valor") || "";


  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/chaves`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao buscar chaves");
        setChaves([]);
      } else {
        setChaves(data);
      }
    } catch (e) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  function copiar(text: string) {
    navigator.clipboard.writeText(text);
    setSuccess("Chave copiada!");
    setTimeout(() => setSuccess(""), 2000);
  }

  async function remover(chave: string) {
    if (!confirm(`Deseja remover a chave: ${chave}?`)) return;

    setError(""); setSuccess("");

    try {
      const res = await fetch(`${API}/chaves/${encodeURIComponent(chave)}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao remover chave");
        return;
      }

      setSuccess("Chave removida com sucesso!");
      setTimeout(carregar, 400);

    } catch (err) {
      setError("Erro de conexão");
    }
  }

  function gerarAleatoriaClient() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return "kreb-" + Math.random().toString(36).substring(2, 12);
  }

  const onSubmit = async (dados: FormData) => {
    setError("");
    setSuccess("");

    let chaveParaEnviar = dados.valor?.trim();

    if (dados.tipo === "E") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(String(chaveParaEnviar))) {
        setError("E-mail inválido.");
        return;
      }
    }

    if (dados.tipo === "T") {
      const d = String(chaveParaEnviar).replace(/\D/g, "");
      if (d.length !== 11) {
        setError("Telefone deve ter 11 dígitos.");
        return;
      }
      chaveParaEnviar = d;
    }

    if (dados.tipo === "A") {
      chaveParaEnviar = gerarAleatoriaClient();
    }

    if (dados.tipo === "C") {
      chaveParaEnviar = undefined as any;
    }

    try {
      const res = await fetch(`${API}/chaves`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: dados.tipo,
          chave: chaveParaEnviar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar chave");
        return;
      }

      setSuccess("Chave criada com sucesso!");
      setShowAdd(false);
      reset();
      carregar();

    } catch {
      setError("Erro de conexão");
    }
  };

  return (
    <div className="chaves-page">
      <header className="dashboard-header">
        <div className="logo">
          <div className="icon">🏦</div>
          <h2>KRE BANK</h2>
        </div>
        <button className="logout-btn voltar-btn" onClick={() => router.push("/dashboard")}>
          ← Voltar
        </button>
      </header>

      <main className="chaves-container">
        <h1>Minhas Chaves PIX</h1>

        <div className="chaves-actions">
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            Adicionar nova chave
          </button>
        </div>

        {loading && <div className="loader">Carregando...</div>}
        {error && <div className="erro">{error}</div>}
        {success && <div className="sucesso">{success}</div>}

        <div className="lista-chaves">
          {chaves.length === 0 ? (
            <div className="vazio">Nenhuma chave cadastrada</div>
          ) : (
            chaves.map((c) => (
              <div className="card-chave" key={c.chave}>
                <div className="tipo">
                  {c.tipo === "E"
                    ? "Email"
                    : c.tipo === "T"
                    ? "Telefone"
                    : c.tipo === "C"
                    ? "CPF/CNPJ"
                    : "Aleatória"}
                </div>

                <div className="valor">
                  {c.tipo === "T"
                    ? c.chave.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
                    : c.chave}
                </div>

                <div className="acoes">
                  <button onClick={() => copiar(c.chave)} className="btn-small">
                    Copiar
                  </button>
                  <button onClick={() => remover(c.chave)} className="btn-small danger">
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* === MODAL === */}
      {showAdd && (
        <div className="modal">
          <div className="modal-card">
            <h3>Adicionar nova chave</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Tipo</label>
              <select
                {...register("tipo")}
                onChange={(e) => {
                  setValue("tipo", e.target.value as any);
                  setValue("valor", "");
                }}
              >
                <option value="E">Email</option>
                <option value="T">Telefone</option>
                <option value="C">CPF/CNPJ (usar meu CPF)</option>
                <option value="A">Aleatória</option>
              </select>

              <label>Valor</label>

              {tipo === "C" ? (
                <input disabled value="Será usado seu CPF/CNPJ cadastrado" />
              ) : tipo === "A" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input disabled value={valor || "(Será gerada automaticamente)"} />
                  <button
                    type="button"
                    onClick={() => setValue("valor", gerarAleatoriaClient())}
                    className="btn-small"
                  >
                    Gerar
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  {...register("valor")}
                  value={valor}
                  onChange={(e) => setValue("valor", e.target.value)}
                  placeholder={
                    tipo === "E" ? "email@exemplo.com" : "11999998888"
                  }
                />
              )}

              {errors.valor && (
                <p className="erro">{String(errors.valor.message)}</p>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn-primary" type="submit">
                  Salvar
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">Desenvolvido por K10 e Rembold</footer>
    </div>
  );
}
