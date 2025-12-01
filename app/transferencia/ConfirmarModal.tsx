"use client";

interface ConfirmarModalProps {
  aberto: boolean;
  onClose: () => void;
  onConfirm: () => void;
  destinatario: {
    nome: string;
    cpf_cnpj: string;
    banco: string;
  } | null;
  valor: string;
  descricao: string;
}

export default function ConfirmarModal({
  aberto,
  onClose,
  onConfirm,
  destinatario,
  valor,
  descricao,
}: ConfirmarModalProps) {
  if (!aberto || !destinatario) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Confirmar Envio</h3>

        <p><strong>Enviar para:</strong></p>
        <p>{destinatario.nome}</p>
        <p>CPF/CNPJ: {destinatario.cpf_cnpj}</p>
        <p>Banco: {destinatario.banco}</p>

        <hr />

        <p><strong>Valor:</strong> R$ {valor}</p>
        {descricao && <p><strong>Descrição:</strong> {descricao}</p>}

        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirmar" onClick={onConfirm}>
            Confirmar PIX
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-card {
          background: white;
          padding: 25px;
          width: 380px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          text-align: center;
        }

        h3 {
          margin-bottom: 10px;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .btn-cancelar {
          background: #a3a3a3;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
        }

        .btn-confirmar {
          background: #f27f0d;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
        }
      `}</style>
    </div>
  );
}
