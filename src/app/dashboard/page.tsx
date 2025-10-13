import DashboardClient from './DashboardClient';
import { Users, Navigation, Map, TrendingUp, Activity, MapPin, Shield, Wifi, Settings, BookOpen, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardClient>
      <DashboardContent />
    </DashboardClient>
  );
}

function DashboardContent() {
  const stats = [
    {
      title: "Usuarios Activos",
      value: "342",
      icon: Users,
      bgColor: "bg-[#00B9F1]/20",
      change: "+12%"
    },
    {
      title: "Rutas Generadas Hoy",
      value: "1,847",
      icon: Navigation,
      bgColor: "bg-emerald-500/20",
      change: "+8%"
    },
    {
      title: "Zonas Mapeadas",
      value: "156",
      icon: Map,
      bgColor: "bg-purple-500/20",
      change: "+3%"
    },
    {
      title: "Precisión GPS",
      value: "98.7%",
      icon: TrendingUp,
      bgColor: "bg-orange-500/20",
      change: "+0.5%"
    }
  ];

  const recentActivities = [
    { icon: MapPin, text: "Nueva zona añadida: Laboratorio de Robótica", time: "Hace 5 min", color: "text-[#00B9F1]" },
    { icon: Users, text: "142 estudiantes navegando actualmente", time: "Hace 8 min", color: "text-green-500" },
    { icon: Navigation, text: "Ruta optimizada: Biblioteca → Aula 301", time: "Hace 12 min", color: "text-purple-500" },
    { icon: Shield, text: "Sistema de backup activado", time: "Hace 15 min", color: "text-yellow-500" },
    { icon: Wifi, text: "Beacons calibrados en Edificio A", time: "Hace 22 min", color: "text-cyan-500" }
  ];

  return (
    <div>
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-[#00B9F1]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#00B9F1]" />
              Actividad del Sistema
            </h3>
            <button className="text-sm text-[#00B9F1] hover:text-[#0099CC] transition-colors">
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform border border-slate-200">
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium">{activity.text}</p>
                  <p className="text-slate-500 text-sm">{activity.time}</p>
                </div>
                <div className="w-2 h-2 bg-[#00B9F1] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de control rápido */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Control Rápido
          </h3>
          <div className="space-y-4">
            <button className="w-full p-4 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] flex items-center justify-center group">
              <MapPin className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Calibrar Beacons
            </button>
            <button className="w-full p-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center group">
              <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Gestionar Horarios
            </button>
            <button className="w-full p-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center group">
              <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Generar Reporte
            </button>
            
            {/* Mapa en miniatura */}
            <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Vista del Campus</h4>
              <div className="relative h-32 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B9F1]/10 to-purple-500/10"></div>
                <div className="absolute top-2 left-2 w-2 h-2 bg-[#00B9F1] rounded-full animate-ping"></div>
                <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>
                <div className="absolute bottom-3 left-6 w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 right-3 w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}