import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Importante: false porque usamos STARTTLS, no SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});


export async function POST(req: Request) {
  const { dni, nombreCompleto, email, clave } = await req.json();

  const hashedPassword = await bcrypt.hash(clave, 10);

  const token = jwt.sign(
    {
      dni,
      nombreCompleto,
      email,
      hashedPassword,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "10m" } 
  );

  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `Registro <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifica tu correo",
    html: `<p>Haz clic en el siguiente enlace para verificar tu correo:</p>
           <a href="${verificationUrl}" style="padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;">Verificar Correo</a>`
  });

  return NextResponse.json({ success: true });
}
