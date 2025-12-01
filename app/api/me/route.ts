import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";

  const res = await fetch("http://localhost:4000/me", {
    method: "GET",
    headers: {
      Cookie: cookieHeader 
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
