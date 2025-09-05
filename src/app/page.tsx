//src/app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react"; 

export default function Home() {
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");  const [mail, setMail] = useState("");
  const [mailValid, setMailValid] = useState(false);
  const [clave, setClave] = useState("");
  const [claveValid, setClaveValid] = useState(false);
  const [confirmarClave, setConfirmarClave] = useState("");
  const [confirmarClaveValid, setConfirmarClaveValid] = useState(false);
  const [, setMailSent] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showUsernameErrorPopup, setShowUsernameErrorPopup] = useState(false); // Nuevo estado para el popup de error de DNI
  const [mailError, setMailError] = useState("");
  const [claveError, setClaveError] = useState("");
  const [confirmarClaveError, setConfirmarClaveError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  
  useEffect(() => {
    const usernameTrimmed = username.trim();

    if (usernameTrimmed === "") {
      setUsernameError("");
      return;
    }

    if (usernameTrimmed.length < 8) {
      setUsernameError("La identificación debe tener al menos 8 caracteres.");
    } else {
      setUsernameError("");
    }
  }, [username]);

  const handleUsernameCheck = async () => {
    if (usernameError) return;
    setIsSearching(true);

    const res = await fetch(`/api/check-dni`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni: username })
    });
    const data = await res.json();

    if (data?.data?.ESTADO === "ACTIVO") {
      if (data.data?.mail && data.data.mail.trim() !== "") {
        setUsernameValid(false);
        setShowUsernameErrorPopup(true);
        setIsSearching(false);
        return;
      }

      const nombreParts = data.data.NOMBRE.trim().split(" ").filter(Boolean);
      const posiblesApellidos = nombreParts.slice(0, 2).join(" ");
      const posiblesNombres = nombreParts.slice(2).join(" ");
      setNombres(posiblesNombres);
      setApellidos(posiblesApellidos);
      setUsernameValid(true);
    } else {
      setUsernameValid(false);
      setNombres("");
      setApellidos("");
      setShowUsernameErrorPopup(true);
    }

    setIsSearching(false);
  };


  const handleResetForm = () => {
    setUsername("");
    setUsernameValid(false);
    setNombres("");
    setApellidos("");
    setMail("");
    setMailValid(false);
    setClave("");
    setClaveValid(false);
    setConfirmarClave("");
    setConfirmarClaveValid(false);
    setMailSent(false);
    setFormValid(false);
  };

  const handleSendMail = async () => {
    if (mailError || claveError || confirmarClaveError || !formValid) return;

    setIsLoading(true);
    const res = await fetch("/api/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        mail,
        clave,
        nombres,
        apellidos
      })
    });

    setIsLoading(false);
    if (res.ok) {
      setMailSent(true);
      setShowPopup(true);
      handleResetForm();
    }
  };
  
  useEffect(() => {
    // Mail formato simple regex
    const mailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (mail && !mailRegex.test(mail)) {
      setMailError("Ingresa un correo válido.");
      setMailValid(false);
    } else if (mail) {
      setMailError("");
      setMailValid(true);
    } else {
      setMailError("");
      setMailValid(false);
    }

    // Clave mínimo 6 caracteres
    if (clave && clave.length < 6) {
      setClaveError("Clave mínima de 6 caracteres.");
      setClaveValid(false);
    } else if (clave) {
      setClaveError("");
      setClaveValid(true);
    } else {
      setClaveError("");
      setClaveValid(false);
    }

    // Confirmar clave - asegurarse de que la validación sea correcta
    if (confirmarClave && clave !== confirmarClave) {
      setConfirmarClaveError("Las claves no coinciden.");
      setConfirmarClaveValid(false);
    } else if (confirmarClave && clave === confirmarClave && clave.length >= 6) {
      setConfirmarClaveError("");
      setConfirmarClaveValid(true);
      // Asegurarse de que la clave principal también se marque como válida
      setClaveValid(true);
    } else {
      setConfirmarClaveError("");
      setConfirmarClaveValid(false);
    }
  }, [mail, clave, confirmarClave]);

  useEffect(() => {
    if (
      usernameValid &&
      nombres.trim() &&
      apellidos.trim() &&
      mail.trim() &&
      mailValid &&
      clave &&
      claveValid &&
      confirmarClave &&
      confirmarClaveValid
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [
    usernameValid,
    nombres,
    apellidos,
    mail,
    mailValid,
    clave,
    claveValid,
    confirmarClave,
    confirmarClaveValid
  ]);

  return (
    <div className="max-w-2xl mx-auto min-h-screen"> {/* Cambiado de max-w-md a max-w-2xl para hacerlo más ancho */}


      <div className="p-6 space-y-6"> {/* Aumentado el padding */}
        <div className="relative">
          <label className="text-gray-500 text-sm font-normal">DNI</label>
          <div className="flex items-center">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={usernameValid || isSearching}
              className={`w-full py-1 border-b-2 ${usernameError ? 'border-red-500' : usernameValid ? 'border-green-600' : 'border-gray-300'} focus:outline-none`}
            />
            <button
              onClick={handleUsernameCheck}
              disabled={isSearching || usernameValid || !!usernameError || username.trim().length < 8}
              className={`absolute right-0 text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors ${(isSearching || usernameValid || !!usernameError || username.trim().length < 8) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
          {usernameError && (
            <p className="text-red-500 text-sm mt-1">{usernameError}</p>
          )}
        </div>

      <div>
        <label className="text-gray-500 text-sm font-normal">Nombres</label>
        <input
          type="text"
          value={nombres}
          readOnly
          className={`w-full py-1 border-b-2 ${nombres ? 'border-green-600' : 'border-gray-300'} focus:outline-none`}
        />
      </div>

      <div>
        <label className="text-gray-500 text-sm font-normal">Apellidos</label>
        <input
          type="text"
          value={apellidos}
          readOnly
          className={`w-full py-1 border-b-2 ${apellidos ? 'border-green-600' : 'border-gray-300'} focus:outline-none`}
        />
      </div>

        <div>
          <label className="text-gray-500 text-sm font-normal">Correo</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            disabled={!usernameValid || isSearching}
            className={`w-full py-1 border-b-2 ${mailError ? 'border-red-500' : mailValid ? 'border-green-600' : 'border-gray-300'} focus:outline-none`}
          />
          {mailError && <p className="text-red-500 text-sm mt-1">{mailError}</p>}
        </div>

        <div>
          <label className="text-gray-500 text-sm font-normal">Clave</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            disabled={!usernameValid || isSearching}
            className={`w-full py-1 border-b-2 ${claveError ? 'border-red-500' : claveValid ? 'border-green-600' : 'border-gray-300'} focus:outline-none`}
          />
          {claveError && <p className="text-red-500 text-sm mt-1">{claveError}</p>}
        </div>

        <div>
          <label className="text-gray-500 text-sm font-normal">Confirmar clave</label>
          <input
            type="password"
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
            disabled={!usernameValid || isSearching}
            className={`w-full py-1 border-b-2 ${confirmarClaveError ? 'border-red-500' : confirmarClaveValid ? 'border-green-600' : 'border-gray-300'} focus:outline-none`}
          />
          {confirmarClaveError && <p className="text-red-500 text-sm mt-1">{confirmarClaveError}</p>}
        </div>

        <div className="pt-4"> 
          <button
            type="button"
            onClick={handleSendMail}
            disabled={!formValid}
            className={`w-full py-3 text-white font-normal text-lg rounded-md ${formValid ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-300'}`}
          >
            SOLICITAR
          </button>

          <button
            type="button"
            onClick={handleResetForm}
            className="w-full py-3 mt-4 border border-gray-300 text-gray-500 font-normal text-lg rounded-md hover:bg-gray-50"
          >
            REINICIAR FORMULARIO
          </button>
        </div>
      </div>
      
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

      {showUsernameErrorPopup && (
        <div className="fixed inset-0 bg-opacity-1 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 shadow-lg text-center">
            <p className="text-red-600 font-semibold">DNI no válido o trabajador no activo</p>
            <button
              onClick={() => setShowUsernameErrorPopup(false)}
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
