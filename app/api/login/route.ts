import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cpf_cnpj, senha } = await req.json();

  const res = await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf_cnpj, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json(data);

  response.cookies.set("token", data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 2 * 60 * 60, // 2 horas em segundos
  });

  return response;
}
