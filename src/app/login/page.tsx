"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function TecsupLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const adminEmails = [
    "admin@tecsup.edu.pe",
    "gestion@tecsup.edu.pe",
    "jose.maldonado.p@tecsup.edu.pe"
  ];

  const isAdmin = (email: string | null): boolean => {
    return !!email && adminEmails.includes(email);
  };

  const obtenerMensajeError = (codigo: string): string => {
    switch (codigo) {
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrecta.';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta nuevamente más tarde.';
      case 'auth/popup-closed-by-user':
        return 'Se cerró el inicio de sesión con Google.';
      default:
        return 'Ocurrió un error al iniciar sesión.';
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!isAdmin(email)) {
        await auth.signOut();
        setError('No tienes permisos de administrador para acceder.');
        return;
      }

      toast.success("¡Bienvenido!", { autoClose: 2000 });
      setTimeout(() => {
        router.push('/dashboard');
      }, 2200);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setError(obtenerMensajeError((err as { code: string }).code));
      } else {
        setError("Error desconocido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[120vh] flex items-center justify-center bg-[url('/logo-tec8.jpg')] bg-cover bg-center">
      <ToastContainer />
      <div className="flex w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Columna Izquierda - Imagen */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#B3E5FC] to-[#81D4FA] items-center justify-center p-10">
          <Image
            src="/logo-tec3.png"
            alt="Ilustración Tecsup"
            width={480}
            height={480}
            className="drop-shadow-lg mx-auto"
          />
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center -translate-y-10">
          <form
            onSubmit={(e) => e.preventDefault()}
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="text-center mb-8">
              <Image
                src="/logo-tec1.png"
                alt="Ilustración Tecsup"
                width={200}
                height={200}
                className="drop-shadow-lg mx-auto mb-10"
              />
              <h2 className="text-3xl font-bold text-slate-700 mb-4">
                Te damos la bienvenida a la plataforma
              </h2>
              <p className="text-slate-600 text-xl mb-4">Iniciar sesión</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            {/* Botón de Google */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="mx-auto w-78 flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl hover:bg-slate-50 transition-transform hover:scale-[1.02]"
            >
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              {isLoading ? "Conectando..." : "Continuar con Google"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
