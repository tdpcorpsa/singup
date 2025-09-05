// src/app/registro-exitoso/page.tsx
import { redirect } from "next/navigation";
import RedirectView from "./redirect-view";

type SP = Record<string, string | string[] | undefined>;

export default async function RegistroExitoso({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const toBool = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] === "true" : v === "true";

  const yaExiste = toBool(sp.yaExiste);
  const nuevo = toBool(sp.nuevo);

  if (!yaExiste && !nuevo) {
    redirect("/");
  }

  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL ?? "/";

  return <RedirectView yaExiste={yaExiste} loginUrl={loginUrl} />;
}
