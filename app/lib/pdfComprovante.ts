import jsPDF from "jspdf";

interface DadosPDF {
  valor: number;
  nomeOrigem: string;
  nomeDestino: string;
  chaveOrigem: string;
  chaveDestino: string;
  mensagem?: string;
  data: string;
  id: number;
}

export function gerarComprovantePDF(dados: DadosPDF) {
  const doc = new jsPDF();
  const corPrincipal = "#f27f0d";

  // ------------------ HEADER ------------------
  doc.setFillColor(corPrincipal);
  doc.rect(0, 0, 210, 30, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#ffffff");
  doc.text("KRE BANK", 10, 20);

  doc.setFontSize(14);
  doc.text("Comprovante de Transferência PIX", 120, 20);

  // ------------------ VALOR EM DESTAQUE ------------------
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(corPrincipal);
  doc.text(`R$ ${dados.valor.toFixed(2)}`, 10, 50);

  doc.setFontSize(12);
  doc.setTextColor("#000000");
  doc.text(`Data: ${dados.data}`, 10, 58);
  doc.text(`ID da Transação: ${dados.id}`, 10, 66);

  // Linha separadora
  doc.setDrawColor(corPrincipal);
  doc.setLineWidth(0.8);
  doc.line(10, 75, 200, 75);

  // ------------------ ORIGEM ------------------
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor("#000000");
  doc.text("Origem", 10, 90);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Nome: ${dados.nomeOrigem}`, 10, 100);
  doc.text(`Chave PIX: ${dados.chaveOrigem}`, 10, 108);

  // ------------------ DESTINO ------------------
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Destino", 10, 130);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Nome: ${dados.nomeDestino}`, 10, 140);
  doc.text(`Chave PIX: ${dados.chaveDestino}`, 10, 148);

  // ------------------ MENSAGEM ------------------
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Mensagem", 10, 170);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    dados.mensagem && dados.mensagem.trim() !== ""
      ? dados.mensagem
      : "Nenhuma mensagem",
    10,
    180
  );

  // ------------------ FOOTER ------------------
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor("#555");

  doc.text("Documento gerado automaticamente pelo KRE BANK ©", 10, 290);

  // ------------------ SALVAR ------------------
  doc.save(`comprovante_pix_${dados.id}.pdf`);
}
