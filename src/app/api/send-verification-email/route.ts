import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tu.email.de.prueba@gmail.com",
    pass: "tu-contraseña-o-app-password",
  },
});

export async function POST(req: Request) {
  const { email } = await req.json();
  const token = Math.random().toString(36).substring(2, 15);
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: 'Registro <tu.email.de.prueba@gmail.com>',
    to: email,
    subject: "Verifica tu correo",
    html: `<p>Haz clic en el siguiente enlace para verificar tu correo:</p>
           <a href="${verificationUrl}" style="padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;">Verificar Correo</a>`
  });

  return NextResponse.json({ success: true });
}