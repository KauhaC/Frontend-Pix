"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);


  async function login(cpf_cnpj: string, senha: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf_cnpj, senha }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao logar");

    setToken(data.token);
    setUser(data.usuario);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));

    router.push("/dashboard");
  }

  function atualizarUsuario(novoUsuario: any) {
    setUser(novoUsuario);
    localStorage.setItem("user", JSON.stringify(novoUsuario));
  }


  function logout() {
    setToken(null);
    setUser(null);
    localStorage.clear();
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        atualizarUsuario, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
