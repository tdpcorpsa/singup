import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { dni } = await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_TDP_API_BASE_URL;
  const apiRes = await fetch(`${baseUrl}/rest/security/trabajador/check/${dni}`);
  const data = await apiRes.json();

  return NextResponse.json(data);
} 
