import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token ausente" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verifyToken(token);
    return NextResponse.json({ message: "Acesso autorizado", payload });
  } catch {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }
}
