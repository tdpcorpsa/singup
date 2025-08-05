import { NextResponse } from "next/server";

const allowedDnis = ["12345678", "87654321", "11111111"];

export async function POST(req: Request) {
  const { dni } = await req.json();
  const valid = allowedDnis.includes(dni);
  return NextResponse.json({ valid });
}