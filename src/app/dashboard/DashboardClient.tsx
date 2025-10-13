'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Navigation, Users, Activity, Bell, Settings, Menu, BarChart3, Clock, ChevronRight, Calendar, User, ChevronLeft, X, LogOut, Wifi, WifiOff } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Tipos personalizados
interface NavigationItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

interface SystemStatus {
  online: boolean;
  activeBeacons: number;
  totalBeacons: number;
}

// Constantes
const COLORS = {
  primary: '#00B9F1',
  dark: '#1D1F21',
  success: '#10b981',
  danger: '#ef4444',
} as const;

const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { name: "Gestión de Rutas", icon: Navigation, href: "/dashboard/views/rutas" },
  { name: "Usuarios", icon: Users, href: "/dashboard/views/usuarios" },
  { name: "Analíticas", icon: Activity, href: "/dashboard/views/analiticas" },
  { name: "Horarios", icon: Clock, href: "/dashboard/views/horarios" },
  { name: "Configuración", icon: Settings, href: "/dashboard/views/config" }
];

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  // Estados
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    online: true,
    activeBeacons: 47,
    totalBeacons: 50
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Efecto para el reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Efecto para autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'Usuario');
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Efecto para movimiento del mouse (throttled)
  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Manejo de cierre de sesión
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  // Funciones de toggle
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Verificar ruta activa
  const isActive = useCallback((href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }, [pathname]);

  // Formateo de fecha
  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [currentTime]);

  // Nombre corto del usuario
  const shortUserName = useMemo(() => {
    if (!userName) return 'Admin';
    const firstName = userName.split(' ')[0];
    return `Admin ${firstName}`;
  }, [userName]);

  // Porcentaje de beacons activos
  const beaconPercentage = useMemo(() => {
    return Math.round((systemStatus.activeBeacons / systemStatus.totalBeacons) * 100);
  }, [systemStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Fondo animado mejorado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[32rem] h-[32rem] bg-gradient-to-r from-[#00B9F1]/5 to-cyan-500/5 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/3 to-pink-500/3 rounded-full blur-3xl transition-all duration-1500 ease-out"
          style={{
            right: `${(100 - mousePosition.x) * 0.15}%`,
            bottom: `${(100 - mousePosition.y) * 0.15}%`,
            transform: 'translate(50%, 50%)',
          }}
        />
      </div>

      {/* Overlay móvil mejorado */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Header superior */}
      <header className="relative z-10">
        {/* Barra superior oscura */}
        <div style={{backgroundColor: COLORS.dark}} className="shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo-tec1.png"
                  alt="Logo Tecsup"
                  className="h-8 lg:h-11 object-contain"
                />
                <button
                  onClick={toggleSidebar}
                  className="hidden lg:flex p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                  aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                  {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notificaciones */}
                <button 
                  className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  aria-label="Notificaciones"
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#00B9F1] rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">{notifications}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#00B9F1] rounded-full animate-ping opacity-75"></div>
                    </>
                  )}
                </button>
                
                {/* Usuario desktop */}
                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Conectado como</p>
                    <p className="text-sm text-white font-medium">{shortUserName}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00B9F1] to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-white/20">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Botón menú móvil */}
                <button
                  onClick={toggleMobileSidebar}
                  className="lg:hidden p-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra azul con fecha */}
        <div style={{backgroundColor: COLORS.primary}} className="shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium capitalize">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar mejorado */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white/90 backdrop-blur-xl border-r border-slate-200/80 z-50 shadow-2xl transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        } w-72`}
      >
        {/* Botón cerrar móvil */}
        <button
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className={`p-6 ${sidebarCollapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center mb-8 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
            {!sidebarCollapsed ? (
              <Image
                src="/tecxion-logo3.png"
                alt="Logo TecXion"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#00B9F1] to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav className="space-y-1" role="navigation" aria-label="Menú principal">
            {NAVIGATION_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    active 
                      ? 'bg-[#00B9F1]/10 text-[#00B9F1] shadow-sm border border-[#00B9F1]/20' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={sidebarCollapsed ? item.name : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${!sidebarCollapsed ? 'mr-3' : ''} transition-transform group-hover:scale-110 ${active ? 'text-[#00B9F1]' : ''}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <div className="w-2 h-2 bg-[#00B9F1] rounded-full animate-pulse ml-2"></div>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                    </>
                  )}
                  {active && sidebarCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00B9F1] rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Estado del sistema (expandido) */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-24 left-4 right-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Estado del Sistema</span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${systemStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-bold ${systemStatus.online ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Beacons Activos</span>
                  <span className="font-semibold">{systemStatus.activeBeacons}/{systemStatus.totalBeacons}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#00B9F1] to-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${beaconPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón cerrar sesión (expandido) */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
              {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </button>
          </div>
        )}

        {/* Estado compacto (colapsado) */}
        {sidebarCollapsed && (
          <>
            <div className="absolute bottom-16 left-2 right-2">
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex justify-center" title="Sistema Online">
                <div className={`w-3 h-3 rounded-full animate-pulse ${systemStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Contenido principal */}
      <div className={`relative z-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-12rem)]">
          {children}
        </main>
        
      </div>
    </div>
  );
}