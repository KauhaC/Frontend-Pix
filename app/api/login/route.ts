import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

// Usuário fixo apenas para teste
const USER = { email: "teste@exemplo.com", password: "123456" };

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== USER.email || password !== USER.password) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = await signToken({ email });
  return NextResponse.json({ token });
}
