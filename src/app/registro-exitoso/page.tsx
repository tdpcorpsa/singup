"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegistroExitoso() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const yaExiste = searchParams.get("yaExiste") === "true";
  const nuevo = searchParams.get("nuevo") === "true";

  useEffect(() => {
    // Si no viene de un flujo válido, redirige al inicio
    if (!yaExiste && !nuevo) {
      router.replace("/");
    }
  }, [yaExiste, nuevo, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">¡Registro Exitoso!</h1>
        {yaExiste ? (
          <p>Este usuario ya estaba registrado. Puedes iniciar sesión.</p>
        ) : (
          <p>Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.</p>
        )}
      </div>
    </main>
  );
}
