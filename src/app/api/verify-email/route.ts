import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      username: string;
      nombres: string;
      apellidos: string;
      mail: string;
      password: string;
    };

    const userData = {
      username: payload.username,
      password: payload.password,
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      mail: payload.mail,
    };

    const createUserRes = await fetch(
      `${process.env.NEXT_PUBLIC_TDP_API_BASE_URL}/rest/security/usuario/crear`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );

    const responseText = await createUserRes.text();

    let result;
    try {
      result = JSON.parse(responseText);

      if (
        result.status === "failure" &&
        result.error?.includes("Usuario ya existe")
      ) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/registro-exitoso?yaExiste=true`
        );
      }

      if (result.status !== "ok") {
        return NextResponse.json(
          {
            success: false,
            message: "Error al crear usuario",
            error: result.error || result.text || "Respuesta inesperada",
          },
          { status: 500 }
        );
      }
    } catch {
      if (createUserRes.status === 200) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/registro-exitoso?nuevo=true`
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Respuesta no válida del servidor externo",
            raw: responseText,
          },
          { status: 502 }
        );
      }
    }

    // Todo bien
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/registro-exitoso?nuevo=true`
    );
  } catch (err: unknown) {
    console.error("Error verificando token:", err);
    return NextResponse.json(
      { success: false, message: "Token inválido o expirado" },
      { status: 400 }
    );
  }
}
