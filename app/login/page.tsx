"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Schema Zod
const loginSchema = z.object({
  cpfCnpj: z
    .string()
    .refine((v) => {
      const n = v.replace(/\D/g, "");
      return n.length === 11 || n.length === 14;
    }, "CPF ou CNPJ inválido"),
  senha: z.string().min(1, "Informe sua senha"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // 🔥 MÁSCARA CORRIGIDA
  function aplicarMascara(valor: string) {
    const digitos = valor.replace(/\D/g, "");

    if (digitos.length <= 11) {
      // CPF
      return digitos
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // CNPJ
    return digitos
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  const onSubmit = async (data: LoginData) => {
    setError("");

    const somenteNumeros = data.cpfCnpj.replace(/\D/g, "");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf_cnpj: somenteNumeros,
          senha: data.senha,
        }),
      });

      const respBody = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(respBody.usuario));
        router.push("/dashboard");
      } else {
        setError(respBody.error || "Credenciais inválidas.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>KRE BANK</h1>
        <h2>Acesse sua conta</h2>

        <label>
          <span>CPF / CNPJ</span>
          <input
            type="text"
            {...register("cpfCnpj")}
            onChange={(e) => {
              const masked = aplicarMascara(e.target.value);
              setValue("cpfCnpj", masked, { shouldValidate: true });
            }}
            maxLength={18}
            placeholder="Digite seu CPF ou CNPJ"
          />
          {errors.cpfCnpj && (
            <p className="erro">{errors.cpfCnpj.message}</p>
          )}
        </label>

        <label>
          <span>Senha</span>
          <input
            type="password"
            {...register("senha")}
            placeholder="Digite sua senha"
          />
          {errors.senha && <p className="erro">{errors.senha.message}</p>}
        </label>

        {error && <p className="erro">{error}</p>}

        <button type="submit" className="btn-entrar" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        <p className="criar-conta">
          Novo por aqui? <a href="/register">Criar conta</a>
        </p>
      </form>

      <style jsx>{`
        body {
          background-color: #f9f6f3;
          font-family: "Poppins", sans-serif;
          margin: 0;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f8f7f5;
        }

        .login-card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          width: 360px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        h1 {
          font-size: 28px;
          color: #f27f0d;
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
          font-size: 14px;
          font-weight: 500;
          color: #222;
          margin-bottom: 6px;
          display: block;
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
          border-color: #f27f0d;
          outline: none;
          box-shadow: 0 0 4px rgba(242, 127, 13, 0.2);
        }

        .erro {
          color: red;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .btn-entrar {
          background-color: #f27f0d;
          color: #fff;
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        .btn-entrar:hover {
          background-color: #d96f07;
        }

        .criar-conta {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .criar-conta a {
          color: #f27f0d;
          text-decoration: none;
          font-weight: bold;
        }

        .criar-conta a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
