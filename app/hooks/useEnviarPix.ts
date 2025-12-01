"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export function useEnviarPix() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function enviarPix({
    chave_origem,
    chave_destino,
    valor,
    mensagem,
  }: {
    chave_origem: string;
    chave_destino: string;
    valor: number;
    mensagem?: string;
  }) {
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const token = Cookies.get("token");

      if (!token) {
        setErro("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:4000/transacoes/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chave_origem,
          chave_destino,
          valor,
          mensagem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao enviar PIX.");
        setLoading(false);
        return;
      }

      setSucesso("PIX enviado com sucesso!");
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return {
    enviarPix,
    loading,
    erro,
    sucesso,
  };
}
