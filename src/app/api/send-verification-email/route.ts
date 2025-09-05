import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { ciphers: "SSLv3" },
});

export async function POST(req: Request) {
  const { username, nombres, apellidos, mail, clave } = await req.json();

  const token = jwt.sign(
    { username, nombres, apellidos, mail, password: clave },
    process.env.JWT_SECRET as string,
    { expiresIn: "10m" }
  );

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `Registro <${process.env.EMAIL_USER}>`,
    to: mail,
    subject: "Verifica tu correo",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verificación de correo</h2>
        <p style="color: #555; font-size: 15px;">
          Hola <strong>${nombres} ${apellidos}</strong>,
        </p>
        <p style="color: #555; font-size: 15px;">
          Gracias por registrarte. Para activar tu cuenta necesitamos que confirmes tu dirección de correo.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #dc2626; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
            Verificar correo
          </a>
        </div>
        <p style="color: #555; font-size: 14px;">
          Este enlace expirará en 10 minutos. Si no solicitaste este registro, puedes ignorar este mensaje.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} TDP CORP S.A. Todos los derechos reservados.
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
