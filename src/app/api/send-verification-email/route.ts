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
  tls: {
    ciphers: "SSLv3",
  },
});

export async function POST(req: Request) {
  const { username, nombres, apellidos, mail, clave } = await req.json();

  const token = jwt.sign(
    {
      username,
      nombres,
      apellidos,
      mail,
      password: clave, // en texto plano
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "10m" }
  );

  const verificationUrl = `http://localhost:3000/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `Registro <${process.env.EMAIL_USER}>`,
    to: mail,
    subject: "Verifica tu correo",
    html: `
      <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
      <a href="${verificationUrl}" style="padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;">
        Verificar Correo
      </a>
    `
  });

  return NextResponse.json({ success: true });
}
