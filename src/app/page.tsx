"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 1500,
  suffix = "",
}) => {
  const [count, setCount] = useState<number>(0);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false); // 👈 Prevenir múltiples animaciones

  // 👇 useCallback para mantener la referencia estable
  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return; // 👈 Solo animar una vez
    hasAnimated.current = true;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]); // 👈 Dependencias estables

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        }
      },
      { threshold: 0.6 }
    );

    const current = counterRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [startAnimation]); // 👈 Ahora startAnimation es estable

  return (
    <div ref={counterRef} className="text-4xl font-bold text-[#00B9F1]">
      {count}
      {suffix}
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    router.push('/login');
    console.log('Navegando a login...');
  };

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header con colores oficiales de Tecsup */}
      <header className="relative z-10">
        {/* Barra superior negra */}
        <div style={{backgroundColor: '#1D1F21'}} className="shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Logo Tecsup */}
                <Image
                  src="/logo-tec1.png"
                  alt="Logo Tecsup"
                  width={140}   
                  height={45}
                  className="h-8 lg:h-11 object-contain"
                />
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-6 text-sm font-medium">
                  <span className="text-white font-semibold">Sistema Administrativo</span>
                </div>
                {/* Botón de Iniciar Sesión */}
                <button
                  onClick={handleLoginClick}
                  className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-[#00B9F1]/20 focus:outline-none"
                  style={{backgroundColor: '#00B9F1'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0099CC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#00B9F1';
                  }}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </span>
                </button>
              </div>
              {/* Menú hamburguesa para móvil */}
              <button
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1D1F21] px-4 py-4 space-y-1">
            <p className="text-white text-sm font-semibold">Sistema Administrativo</p>
            <p
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLoginClick();
              }}
              className="text-[#00B9F1] text-sm font-semibold cursor-pointer hover:underline"
            >
              Iniciar Sesión
            </p>
          </div>
        )}
        
        {/* Barra inferior celeste */}
        <div style={{backgroundColor: '#00B9F1'}} className="shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-white text-sm font-medium">Sistema de Gestión TecXion</span>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-white">
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <div className="flex flex-col justify-center items-center text-center w-full">
            {/* Logo Area */}
            <Image
              src="/tecxion-logo3.png"
              alt="Logo Tecxion"
              width={300}
              height={100}
              className="relative object-contain filter drop-shadow-lg animate-float-gentle max-w-[90vw]"
            />
            
            {/* Title and Subtitle */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Sistema de Gestión
                <span className="block text-[#00B9F1] text-3xl md:text-4xl font-semibold mt-2">
                  Campus Digital
                </span>
              </h1>
             
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Acceso exclusivo para personal autorizado</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Gestión Académica',
                description: 'Administración completa de programas, cursos y registro de estudiantes'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Administración de Personal',
                description: 'Control de recursos humanos, docentes y personal administrativo'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Reportes y Análisis',
                description: 'Generación de informes detallados y análisis de datos institucionales'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Gestión Financiera',
                description: 'Control de presupuestos, facturación y seguimiento de pagos'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: 'Infraestructura',
                description: 'Administración de aulas, laboratorios y recursos del campus'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Seguridad y Acceso',
                description: 'Control de acceso, seguridad del campus y gestión de permisos'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
                     onMouseEnter={(e) => {
                       e.currentTarget.style.borderColor = '#00B9F1';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.borderColor = '#e2e8f0';
                     }}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 rounded-lg text-[#00B9F1] group-hover:bg-[#00B9F1]/10 transition-colors duration-300"
                         style={{backgroundColor: 'rgba(0, 185, 241, 0.1)'}}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className={`rounded-2xl p-8 md:p-12 text-center text-white transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
               style={{backgroundColor: '#00B9F1'}}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Tecnología al Servicio de la Educación
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-3xl mx-auto">
              Nuestro sistema integral permite una gestión eficiente y transparente de todos los procesos administrativos del campus, garantizando la excelencia en la educación técnica.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Seguridad Garantizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Acceso 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Soporte Técnico</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Estadísticas Animadas */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
          <div className="text-center group">
            <div className="mb-3 flex justify-center">
              <div className="text-4xl font-bold text-[#00B9F1]">1°</div>
            </div>
            <p className="text-slate-700 font-bold text-lg">Instituto</p>
            <p className="text-sm text-slate-500">por su calidad, priorizado por Pronabec</p>
          </div>
          
          <div className="text-center group">
            <div className="mb-3 flex justify-center items-center">
              <span className="text-[#00B9F1] font-bold text-lg">+</span>
              <AnimatedCounter end={250} />
            </div>
            <p className="text-slate-700 font-bold text-lg">Becas nuevas</p>
            <p className="text-sm text-slate-500">por periodo académico</p>
          </div>
          
          <div className="text-center group">
            <div className="mb-3 flex justify-center items-center">
              <span className="text-[#00B9F1] font-bold text-lg">+</span>
              <AnimatedCounter end={89} />
            </div>
            <p className="text-slate-700 font-bold text-lg">Beca Ferreyros</p>
            <p className="text-sm text-slate-500">estudiantes beneficiados</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{backgroundColor: '#1D1F21'}} className="text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Tecsup</h3>
              <p className="text-sm leading-relaxed">
                Institución educativa líder en formación técnica y tecnológica, comprometida con la excelencia académica y la innovación.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm">
                <p>Mesa de Ayuda: ext. 1234</p>
                <p>soporte@tecsup.edu.pe</p>
                <p>Horario: Lunes a Viernes 8:00 - 18:00</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-[#00B9F1] transition-colors">Manual de Usuario</a>
                <a href="#" className="block hover:text-[#00B9F1] transition-colors">Políticas de Seguridad</a>
                <a href="#" className="block hover:text-[#00B9F1] transition-colors">Centro de Ayuda</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Tecsup. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}