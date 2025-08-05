"use client";
import { useState } from "react";

export default function Home() {
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [dniValid, setDniValid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleDniCheck = async () => {
    const res = await fetch("/api/check-dni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni }),
    });
    const data = await res.json();
    setDniValid(data.valid);
  };

  const handleSendEmail = async () => {
    const res = await fetch("/api/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setEmailSent(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl mb-4">Formulario de Registro</h1>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleDniCheck}
          className="bg-blue-500 text-white px-4 py-2 w-full mb-4"
        >
          Validar DNI
        </button>
        {dniValid && (
          <>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleSendEmail}
              className="bg-green-500 text-white px-4 py-2 w-full mb-4"
            >
              Enviar Correo de Verificación
            </button>
          </>
        )}
        {emailSent && <p>Correo de verificación enviado.</p>}
      </div>
    </main>
  );
}
