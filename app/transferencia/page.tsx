"use client";

import React, { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import "./transferencia.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";

import {
  formatCPF,
  formatCNPJ,
  formatTelefone,
  formatLivre,
} from "../lib/formatChave";

import ConfirmarModal from "./ConfirmarModal";


const schema = z.object({
  tipoChave: z.enum(["cpf", "cnpj", "email", "telefone", "aleatoria"]),
  chavePix: z.string().min(1, "Informe a chave PIX"),
  valor: z
    .string()
    .refine((v) => Number(v) > 0, "O valor deve ser maior que 0"),
  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type DestinatarioInfo = {
  nome: string;
  documento: string;
  cidade?: string;
  usuario_id?: number;
};

type ChaveItem = {
  chave: string;
  tipo: string;
};

export default function TransferenciaPage(): JSX.Element {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoChave: "cpf",
      chavePix: "",
      valor: "",
      descricao: "",
    },
  });

  const tipoChave = watch("tipoChave");
  const chavePix = watch("chavePix");

  const [destinatario, setDestinatario] = useState<DestinatarioInfo | null>(
    null
  );
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [chaveOrigem, setChaveOrigem] = useState<string | null>(null);

  const API_URL = "http://localhost:4000";
  const token = Cookies.get("token");

  useEffect(() => {
    async function fetchMinhasChaves() {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/chaves`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data: ChaveItem[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setChaveOrigem(data[0].chave);
        }
      } catch (e) {
        console.error("Erro ao buscar chaves:", e);
      }
    }
    fetchMinhasChaves();
  }, [token]);


  const handleChaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (tipoChave === "cpf") value = formatCPF(value);
    else if (tipoChave === "cnpj") value = formatCNPJ(value);
    else if (tipoChave === "telefone") value = formatTelefone(value);
    else value = formatLivre(value);

    setValue("chavePix", value);
  };

  useEffect(() => {
    if (!chavePix || chavePix.length < 3) {
      setDestinatario(null);
      setErro("");
      return;
    }

    const handle = setTimeout(async () => {
      if (!token) return;

      try {
        const res = await fetch(
          `${API_URL}/transacoes/verificar-chave?chave=${encodeURIComponent(
            chavePix
          )}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setDestinatario({
            nome: data.nome,
            documento: data.documento,
            cidade: data.cidade ?? "",
            usuario_id: data.usuario_id,
          });
          setErro("");
        } else {
          setDestinatario(null);
          setErro(data.error || "Chave não encontrada");
        }
      } catch (err) {
        console.error(err);
        setErro("Erro ao consultar chave");
        setDestinatario(null);
      }
    }, 500);

    return () => clearTimeout(handle);
  }, [chavePix, token]);

  const enviarPix = async (dados: FormData) => {
    setErro("");
    setMensagem("");

    if (!token) {
      setErro("Você precisa estar logado para enviar PIX.");
      return;
    }

    if (!destinatario) {
      setErro("Chave inválida.");
      return;
    }

    if (!chaveOrigem) {
      setErro("Cadastre uma chave PIX antes de enviar.");
      return;
    }

    const rawUser = localStorage.getItem("user");
    let meuUsuarioId = null;
    if (rawUser) meuUsuarioId = JSON.parse(rawUser)?.id ?? null;

    if (destinatario.usuario_id === meuUsuarioId) {
      setErro("Você não pode enviar PIX para si mesmo.");
      return;
    }

    const valorNum = Number(dados.valor);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/transacoes/enviar`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chave_origem: chaveOrigem,
          chave_destino: dados.chavePix,
          valor: valorNum,
          mensagem: dados.descricao,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem("Transferência realizada com sucesso!");
        setTimeout(() => {
          router.push(`/comprovante/${data.id}`);
        }, 1200);
      } else {
        setErro(data.error || "Erro ao enviar PIX.");
      }
    } catch (err) {
      console.error("Erro enviar pix:", err);
      setErro("Erro ao processar transferência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transferencia-page">
      {/* Header */}
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

      <div className="transferencia-container">
        <form className="transferencia-card" onSubmit={handleSubmit(enviarPix)}>
          <h2>Transferência PIX</h2>

          {/* Tipo chave */}
          <label>
            <span>Tipo de Chave PIX</span>
            <select
              {...register("tipoChave")}
              onChange={(e) => {
                setValue("tipoChave", e.target.value as any);
                setValue("chavePix", "");
                setDestinatario(null);
              }}
              required
            >
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
              <option value="email">E-mail</option>
              <option value="telefone">Telefone</option>
              <option value="aleatoria">Chave aleatória</option>
            </select>
          </label>

          {/* Chave */}
          <label>
            <span>Chave PIX</span>
            <input
              type="text"
              {...register("chavePix")}
              value={chavePix}
              onChange={handleChaveChange}
              placeholder={
                tipoChave === "cpf"
                  ? "000.000.000-00"
                  : tipoChave === "cnpj"
                  ? "00.000.000/0000-00"
                  : tipoChave === "telefone"
                  ? "(00) 00000-0000"
                  : tipoChave === "email"
                  ? "email@exemplo.com"
                  : "Chave aleatória"
              }
            />
            {errors.chavePix && (
              <p className="erro">{errors.chavePix.message}</p>
            )}
          </label>

          {/* DESTINATÁRIO */}
          {destinatario && (
            <div className="destinatario-info">
              <p style={{ fontWeight: 600 }}>Enviar para:</p>
              <p>{destinatario.nome}</p>
              <p style={{ color: "#666" }}>{destinatario.documento}</p>
              {destinatario.cidade && (
                <p style={{ color: "#666" }}>{destinatario.cidade}</p>
              )}
            </div>
          )}

          {erro && <p className="erro">{erro}</p>}
          {mensagem && <p className="sucesso">{mensagem}</p>}

          {/* Valor */}
          <label>
            <span>Valor</span>
            <input type="number" step="0.01" {...register("valor")} />
            {errors.valor && <p className="erro">{errors.valor.message}</p>}
          </label>

          {/* Descrição */}
          <label>
            <span>Descrição</span>
            <input type="text" {...register("descricao")} placeholder="Opcional" />
          </label>

          <button
            type="button"
            className="btn-confirmar"
            disabled={!destinatario || loading}
            onClick={() => setModalAberto(true)}
          >
            Avançar
          </button>

         
        </form>
      </div>

      <footer className="footer">
        <p>Desenvolvido por K10 e Rembold</p>
      </footer>

      <ConfirmarModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleSubmit((d) => {
          setModalAberto(false);
          enviarPix(d);
        })}
        destinatario={
          destinatario
            ? {
                nome: destinatario.nome,
                cpf_cnpj: destinatario.documento,
                banco: "KRE BANK",
              }
            : null
        }
        valor={watch("valor")}
        descricao={watch("descricao") || ""}
      />
    </div>
  );
}
