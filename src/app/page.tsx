"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function Home() {
  const [dni, setDni] = useState("");
  const [dniValid, setDniValid] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [, setEmailSent] = useState(false);
  const [formValid, setFormValid] = useState(false);
const [isSearching, setIsSearching] = useState(false);
const [showPopup, setShowPopup] = useState(false);
const [emailError, setEmailError] = useState("");
const [claveError, setClaveError] = useState("");
const [confirmarClaveError, setConfirmarClaveError] = useState("");
const [isLoading, setIsLoading] = useState(false);

const handleDniCheck = async () => {
  setIsSearching(true);
  const res = await fetch(`/api/check-dni`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni })
  });
  const data = await res.json();

  if (data?.data?.ESTADO === "ACTIVO") {
    setDniValid(true);
    setNombreCompleto(data.data.NOMBRE.trim());
  } else {
    setDniValid(false);
    setNombreCompleto("");
    alert("DNI no válido o trabajador no activo");
  }
  setIsSearching(false);
};


  const handleResetForm = () => {
    setDni("");
    setDniValid(false);
    setNombreCompleto("");
    setEmail("");
    setClave("");
    setConfirmarClave("");
    setEmailSent(false);
    setFormValid(false);
  };

  const handleSendEmail = async () => {
  if (emailError || claveError || confirmarClaveError || !formValid) return;

  setIsLoading(true);
  const res = await fetch("/api/send-verification-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni, nombreCompleto, email, clave })
  });

  setIsLoading(false);
    if (res.ok) 
  setEmailSent(true);
  setShowPopup(true);
  handleResetForm();
};
useEffect(() => {
  // Email formato simple regex
const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (email && !emailRegex.test(email)) {
    setEmailError("Ingresa un correo válido.");
  } else {
    setEmailError("");
  }

  // Clave mínimo 6 caracteres
  if (clave && clave.length < 6) {
    setClaveError("Clave mínima de 6 caracteres.");
  } else {
    setClaveError("");
  }

  // Confirmar clave
  if (confirmarClave && clave !== confirmarClave) {
    setConfirmarClaveError("Las claves no coinciden.");
  } else {
    setConfirmarClaveError("");
  }
}, [email, clave, confirmarClave]);

  useEffect(() => {
    if (
      dniValid &&
      nombreCompleto.trim() &&
      email.trim() &&
      clave &&
      confirmarClave &&
      clave === confirmarClave
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [dniValid, nombreCompleto, email, clave, confirmarClave]);

  return (
    <div className="max-w-md mx-auto p-4">
      <header className="bg-red-600 text-white py-4 px-6 rounded-md flex justify-between items-center">
       
      </header>

      <form className="space-y-4 mt-6" onSubmit={(e) => { e.preventDefault(); handleDniCheck(); }}>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">DNI</label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
disabled={dniValid || isSearching}
className={`w-full border rounded-md px-3 py-2 ${(dniValid || isSearching) ? "bg-gray-100 cursor-not-allowed" : ""}`}

            />
          </div>
<button
  type="submit"
  disabled={isSearching || dniValid}
  className={`p-2 rounded-full border border-red-600 text-red-600 ${!dniValid && !isSearching ? "hover:bg-red-100" : "cursor-not-allowed opacity-50"}`}
>
  {isSearching ? <div className="animate-spin border-2 border-red-600 border-t-transparent rounded-full w-5 h-5"></div> : <Search className="w-5 h-5" />}
</button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombreCompleto}
            readOnly
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />
        </div>

<div>
  <label className="block text-sm font-medium text-gray-700">Correo</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    disabled={!dniValid || isSearching}
    className={`w-full border rounded-md px-3 py-2 ${(!dniValid || isSearching) ? "bg-gray-100 cursor-not-allowed" : ""}`}
  />
  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">Clave</label>
  <input
    type="password"
    value={clave}
    onChange={(e) => setClave(e.target.value)}
    disabled={!dniValid || isSearching}
    className={`w-full border rounded-md px-3 py-2 ${(!dniValid || isSearching) ? "bg-gray-100 cursor-not-allowed" : ""}`}
  />
  {claveError && <p className="text-red-500 text-sm mt-1">{claveError}</p>}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">Confirmar Clave</label>
  <input
    type="password"
    value={confirmarClave}
    onChange={(e) => setConfirmarClave(e.target.value)}
    disabled={!dniValid || isSearching}
    className={`w-full border rounded-md px-3 py-2 ${(!dniValid || isSearching) ? "bg-gray-100 cursor-not-allowed" : ""}`}
  />
  {confirmarClaveError && <p className="text-red-500 text-sm mt-1">{confirmarClaveError}</p>}
</div>


    <button
  type="button"
  onClick={handleSendEmail}
  disabled={!formValid}
  className={`w-full py-2 rounded-md transition ${formValid ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
>
  Solicitar
</button>

<button
  type="button"
  onClick={handleResetForm}
  className="w-full py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
>
  Reiniciar formulario
</button>

      </form>
{showPopup && (
  <div className="fixed inset-0 bg-opacity-1 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-md p-6 shadow-lg text-center">
      <p className="text-green-600 font-semibold">Correo de verificación enviado.</p>
      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Aceptar
      </button>
    </div>
  </div>
)}


{isLoading && (
  <div className="fixed inset-0 bg-opacity-1 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-solid"></div>
  </div>
)}
    </div>
  );
}
