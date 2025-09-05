//src/app/registro-exitoso/page.tsx
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    yaExiste?: string;
    nuevo?: string;
  };
};

export default function RegistroExitoso({ searchParams }: Props) {
  const yaExiste = searchParams.yaExiste === "true";
  const nuevo = searchParams.nuevo === "true";

  // Si no viene ningún flag válido, vuelve al inicio desde el servidor
  if (!yaExiste && !nuevo) {
    redirect("/");
  }

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
