"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const schema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  cpf_cnpj: z
    .string()
    .refine((val) => {
      const n = val.replace(/\D/g, "");
      return n.length === 11 || n.length === 14;
    }, "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido"),
  telefone: z
    .string()
    .refine((val) => {
      const n = val.replace(/\D/g, "");
      return n.length >= 10 && n.length <= 11;
    }, "Telefone inválido"),
  rua: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme a senha"),
}).refine((data) => data.senha === data.confirmarSenha, {
  path: ["confirmarSenha"],
  message: "As senhas não coincidem",
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, "$1.$2")
           .replace(/(\d{3})(\d)/, "$1.$2")
           .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      v = v.slice(0, 14);
      v = v.replace(/(\d{2})(\d)/, "$1.$2")
           .replace(/(\d{3})(\d)/, "$1.$2")
           .replace(/(\d{3})(\d)/, "$1/$2")
           .replace(/(\d{4})(\d)/, "$1-$2");
    }
    setValue("cpf_cnpj" as any, v);
  };

  const onTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      v = v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    }
    setValue("telefone" as any, v);
  };

  const onSubmit = async (dados: FormData) => {
    setError(null);
    setSuccess(null);

    
    const payload = {
      nome: dados.nome,
      cpf_cnpj: dados.cpf_cnpj.replace(/\D/g, ""),
      telefone: dados.telefone.replace(/\D/g, ""),
      rua: dados.rua || null,
      bairro: dados.bairro || null,
      cidade: dados.cidade || null,
      senha: dados.senha,
    };

    try {
      const resp = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await resp.json();

      if (!resp.ok) {
        setError(body.error || body.message || "Erro ao criar conta");
        return;
      }

      setSuccess("Conta criada com sucesso! Você será redirecionado para login...");
      setTimeout(() => router.push("/login"), 1300);
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor.");
    }
  };

  const cpfVal = watch("cpf_cnpj") || "";
  const telVal = watch("telefone") || "";

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>KRE BANK</h1>
        <h2>Crie sua conta</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <label>
            <span>Nome completo</span>
            <input {...register("nome")} placeholder="João da Silva" />
            {errors.nome && <p className="erro">{String(errors.nome.message)}</p>}
          </label>

          <label>
            <span>CPF / CNPJ</span>
            <input
              {...register("cpf_cnpj")}
              value={cpfVal}
              onChange={onCpfCnpjChange}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
            {errors.cpf_cnpj && <p className="erro">{String(errors.cpf_cnpj.message)}</p>}
          </label>

          <label>
            <span>Telefone</span>
            <input
              {...register("telefone")}
              value={telVal}
              onChange={onTelefoneChange}
              placeholder="(00) 90000-0000"
            />
            {errors.telefone && <p className="erro">{String(errors.telefone.message)}</p>}
          </label>

          <label>
            <span>Rua (opcional)</span>
            <input {...register("rua")} placeholder="Rua Exemplo, 100" />
          </label>

          <label>
            <span>Bairro (opcional)</span>
            <input {...register("bairro")} placeholder="Centro" />
          </label>

          <label>
            <span>Cidade (opcional)</span>
            <input {...register("cidade")} placeholder="Passo Fundo" />
          </label>

          <label>
            <span>Senha</span>
            <input {...register("senha")} type="password" placeholder="Senha (mín. 6 chars)" />
            {errors.senha && <p className="erro">{String(errors.senha.message)}</p>}
          </label>

          <label>
            <span>Confirmar senha</span>
            <input {...register("confirmarSenha")} type="password" placeholder="Repita a senha" />
            {errors.confirmarSenha && (
              <p className="erro">{String(errors.confirmarSenha.message)}</p>
            )}
          </label>

          {error && <p className="erro geral">{error}</p>}
          {success && <p className="sucesso geral">{success}</p>}

          <button disabled={isSubmitting} className="btn-criar" type="submit">
            {isSubmitting ? "Criando..." : "Criar conta"}
          </button>

          <p className="ja-tem-conta">
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </form>
      </div>

      <style jsx>{`
        .register-container {
          background: #f8f7f5;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
        }

        .register-card {
          background: #fff;
          padding: 32px;
          border-radius: 12px;
          width: 420px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        h1 {
          font-size: 28px;
          color: #f27f0d;
          margin: 0 0 4px 0;
          text-align: center;
        }

        h2 {
          font-size: 16px;
          color: #7a6b5a;
          text-align: center;
          margin-bottom: 18px;
        }

        form .form label {
          display: block;
          margin-bottom: 12px;
        }

        span {
          display: block;
          font-weight: 600;
          color: #181411;
          margin-bottom: 6px;
        }

        input,
        select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e8e1d9;
          font-size: 14px;
          transition: 0.15s;
        }

        input:focus {
          outline: none;
          border-color: #f27f0d;
          box-shadow: 0 0 6px rgba(242, 127, 13, 0.12);
        }

        .erro {
          color: #d93025;
          font-size: 13px;
          margin-top: 6px;
        }

        .sucesso {
          color: #1b7a2d;
          font-size: 14px;
          margin-top: 6px;
        }

        .geral {
          text-align: center;
        }

        .btn-criar {
          margin-top: 10px;
          background: #f27f0d;
          color: #fff;
          border: none;
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-criar:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ja-tem-conta {
          margin-top: 12px;
          text-align: center;
          color: #7a6b5a;
        }

        .ja-tem-conta a {
          color: #f27f0d;
          font-weight: 700;
        }

        @media (max-width: 480px) {
          .register-card {
            width: 100%;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
