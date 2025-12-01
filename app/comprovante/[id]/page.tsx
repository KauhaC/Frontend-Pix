"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gerarComprovantePDF } from "../../lib/pdfComprovante";
import "./comprovante.css";

export default function ComprovantePage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState("");

  

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await fetch(`http://localhost:4000/transacoes/${id}`, {
          credentials: "include",
        });

        const data = await resp.json();

        if (resp.ok) {
          setDados(data);
        } else {
          setErro(data.error || "Erro ao carregar dados");
        }
      } catch {
        setErro("Erro ao carregar comprovante");
      }
    };

    carregar();
  }, [id]);

  if (erro) {
    return (
      <div className="comp-page">
        <p className="erro">{erro}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="btn-voltar"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!dados) {
    return <div className="comp-page">Carregando comprovante...</div>;
  }

  // --- baixar CSV ---
  const baixarCSV = () => {
    const conteudo = `
ID,${dados.id}
Valor,${dados.valor}
Data,${dados.data}
Tipo,${dados.tipo}
Status,${dados.status}
Origem,${dados.remetente?.nome}
Destino,${dados.destinatario?.nome}
Chave Origem,${dados.chave_origem}
Chave Destino,${dados.chave_destino}
Mensagem,${dados.mensagem || ""}
`;

    const blob = new Blob([conteudo], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `comprovante_pix_${dados.id}.csv`;
    a.click();
  };

  return (
    <div className="comp-page">
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

      {/* CONTEÚDO DO COMPROVANTE */}
      <div className="comp-container">
        <div className="comp-card">
          <h2>Comprovante de Transferência PIX</h2>

          <div className="linha">
            <span>ID da Transação:</span>
            <strong>{dados.id}</strong>
          </div>

          <div className="linha">
            <span>Data:</span>
            <strong>
              {new Date(dados.data).toLocaleString("pt-BR")}
            </strong>
          </div>

          <div className="linha">
            <span>Valor:</span>
            <strong>R$ {Number(dados.valor).toFixed(2)}</strong>
          </div>

          <div className="linha">
            <span>Status:</span>
            <strong className={dados.status === "SUCESSO" ? "ok" : "erro"}>
              {dados.status}
            </strong>
          </div>

          <hr />

          <h3>Origem</h3>
          <p><strong>{dados.remetente?.nome}</strong></p>
          <p>CPF/CNPJ: {dados.remetente?.cpf_cnpj}</p>
          <p>Cidade: {dados.remetente?.cidade}</p>
          <p>Chave PIX: {dados.chave_origem}</p>

          <hr />

          <h3>Destino</h3>
          <p><strong>{dados.destinatario?.nome}</strong></p>
          <p>CPF/CNPJ: {dados.destinatario?.cpf_cnpj}</p>
          <p>Cidade: {dados.destinatario?.cidade}</p>
          <p>Chave PIX: {dados.chave_destino}</p>

          <hr />

          <h3>Mensagem</h3>
          <p>{dados.mensagem || "Nenhuma mensagem"}</p>

          <button
            className="btn-confirmar"
            onClick={() =>
              gerarComprovantePDF({
                id: dados.id,
                valor: Number(dados.valor),
                nomeOrigem: dados.remetente?.nome,
                nomeDestino: dados.destinatario?.nome,
                chaveOrigem: dados.chave_origem,
                chaveDestino: dados.chave_destino,
                mensagem: dados.mensagem,
                data: new Date(dados.data).toLocaleString("pt-BR")
              })
            }
          >
            Baixar Comprovante (PDF)
          </button>

          <button className="btn-confirmar" onClick={baixarCSV}>
            Baixar CSV
          </button>

          <button
            className="btn-voltar"
            onClick={() => router.push("/dashboard")}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>Desenvolvido por K10 e Rembold</p>
      </footer>
    </div>
  );
}
