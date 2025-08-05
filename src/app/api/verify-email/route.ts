import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface Usuario {
  dni: string;
  nombreCompleto: string;
  email: string;
  hashedPassword: string;
}

const fakeDB: Usuario[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, message: "Token inválido" }, { status: 400 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      dni: string;
      nombreCompleto: string;
      email: string;
      hashedPassword: string;
    };

    fakeDB.push({
      dni: payload.dni,
      nombreCompleto: payload.nombreCompleto,
      email: payload.email,
      hashedPassword: payload.hashedPassword,
    });

    console.log("Usuario registrado:", fakeDB);

    return NextResponse.json({ success: true, data: payload });
  } catch {
    return NextResponse.json({ success: false, message: "Token inválido o expirado" }, { status: 400 });
  }
}
