"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectView({
  yaExiste,
  loginUrl,
}: {
  yaExiste: boolean;
  loginUrl: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(loginUrl);
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [router, loginUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">¡Registro Exitoso!</h1>
        {yaExiste ? (
          <p>
            Este usuario ya estaba registrado. Serás redirigido en{" "}
            <strong>5 segundos</strong>.
          </p>
        ) : (
          <p>
            Tu cuenta fue creada correctamente. Serás redirigido en{" "}
            <strong>5 segundos</strong>.
          </p>
        )}
        <p className="mt-4 text-sm text-gray-500">
          Si no eres redirigido automáticamente,{" "}
          <a
            href={loginUrl}
            className="text-red-600 underline hover:text-red-800"
          >
            haz clic aquí
          </a>.
        </p>
      </div>
    </main>
  );
}
