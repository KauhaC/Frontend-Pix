"use client";

import { useState } from "react";

export function useBuscarDestinatario() {
  const [destinatario, setDestinatario] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function buscar(chave: string) {
    setLoading(true);
    setErro("");
    setDestinatario(null);

    try {
      const res = await fetch(`http://localhost:4000/chaves/${chave}`);

      if (!res.ok) {
        setErro("Chave PIX não encontrada");
        return;
      }

      const data = await res.json();
      setDestinatario(data);

    } catch {
      setErro("Erro ao buscar chave PIX");
    }

    setLoading(false);
  }

  return { destinatario, buscar, loading, erro };
}
