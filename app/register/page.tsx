"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, nome, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Conta criada com sucesso! Você já pode fazer login.");
        setCpf("");
        setNome("");
        setSenha("");
        setConfirmarSenha("");
      } else {
        setError(data.message || "Erro ao criar conta.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleRegister}>
        <h1>KRE BANK</h1>
        <h2>Crie sua conta</h2>

        <label>
          <span>Nome completo</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </label>

        <label>
          <span>CPF</span>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            required
          />
        </label>

        <label>
          <span>Senha</span>
          <div className="senha-wrapper">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
            <button
              type="button"
              className="mostrar-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        <label>
          <span>Confirmar senha</span>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />
        </label>

        {error && <p className="erro">{error}</p>}
        {success && <p className="sucesso">{success}</p>}

        <button type="submit" className="btn-criar">
          Criar conta
        </button>

        <p className="ja-tem-conta">
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </form>

      <div className="register-image">
        <img src="/login-image.png" alt="Imagem de fundo" />
      </div>

      <style jsx>{`
        body {
          background-color: #f9f6f3;
          font-family: "Poppins", sans-serif;
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 50px;
        }

        .register-card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          width: 360px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        h1 {
          font-size: 26px;
          color: #000;
          margin-bottom: 5px;
        }

        h2 {
          font-size: 18px;
          color: #333;
          margin-bottom: 25px;
        }

        label {
          display: block;
          text-align: left;
          margin-bottom: 15px;
        }

        label span {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #222;
          margin-bottom: 6px;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          transition: 0.2s;
        }

        input:focus {
          border-color: #ff7b00;
          outline: none;
          box-shadow: 0 0 4px rgba(255, 123, 0, 0.2);
        }

        .senha-wrapper {
          display: flex;
          align-items: center;
          position: relative;
        }

        .mostrar-senha {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }

        .btn-criar {
          background-color: #ff7b00;
          color: #fff;
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 10px;
        }

        .btn-criar:hover {
          background-color: #e76e00;
        }

        .erro {
          color: red;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .sucesso {
          color: green;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .ja-tem-conta {
          font-size: 14px;
          margin-top: 20px;
          color: #555;
        }

        .ja-tem-conta a {
          color: #ff7b00;
          font-weight: 600;
          text-decoration: none;
        }

        .ja-tem-conta a:hover {
          text-decoration: underline;
        }

        .register-image img {
          width: 350px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .register-container {
            flex-direction: column;
          }

          .register-image img {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
