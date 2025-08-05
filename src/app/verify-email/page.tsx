//app/verify-email/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");

          setTimeout(() => {
            router.push("/registro-exitoso");
          }, 2000);
        } else {
          setStatus("error");
        }
      } catch  {
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, router]);

  if (status === "verifying") return <p>Verificando...</p>;
  if (status === "error") return <p>Error: Token inválido o expirado</p>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">¡Registro Exitoso!</h1>
        <p>Redirigiendo...</p>
      </div>
    </div>
  );
}
