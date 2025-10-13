'use client';
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, MapPin, Calendar, Download, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnaliticasView() {
  const [timeRange, setTimeRange] = useState('7dias');

  const metricsData = [
    {
      title: "Usuarios Activos",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue",
      description: "vs. período anterior"
    },
    {
      title: "Rutas Generadas",
      value: "15,234",
      change: "+8.3%",
      trend: "up",
      icon: MapPin,
      color: "green",
      description: "Total en el período"
    },
    {
      title: "Tiempo Promedio",
      value: "5.4 min",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "purple",
      description: "Mejora en eficiencia"
    },
    {
      title: "Tasa de Uso",
      value: "87.3%",
      change: "+5.7%",
      trend: "up",
      icon: TrendingUp,
      color: "orange",
      description: "Usuarios diarios activos"
    }
  ];

  const hourlyData = [
    { hour: '6am', users: 45 },
    { hour: '7am', users: 120 },
    { hour: '8am', users: 380 },
    { hour: '9am', users: 520 },
    { hour: '10am', users: 450 },
    { hour: '11am', users: 480 },
    { hour: '12pm', users: 650 },
    { hour: '1pm', users: 720 },
    { hour: '2pm', users: 580 },
    { hour: '3pm', users: 490 },
    { hour: '4pm', users: 420 },
    { hour: '5pm', users: 380 },
    { hour: '6pm', users: 280 },
    { hour: '7pm', users: 150 }
  ];

  const topRoutes = [
    { route: "Biblioteca → Lab. Robótica", uses: 1247, percentage: 100 },
    { route: "Cafetería → Aula 301", uses: 892, percentage: 71 },
    { route: "Entrada → Auditorio", uses: 756, percentage: 61 },
    { route: "Gimnasio → Lab. Electrónica", uses: 678, percentage: 54 },
    { route: "Estacionamiento → Biblioteca", uses: 523, percentage: 42 }
  ];

  const weekData = [
    { day: 'Lun', value: 85 },
    { day: 'Mar', value: 92 },
    { day: 'Mié', value: 78 },
    { day: 'Jue', value: 88 },
    { day: 'Vie', value: 95 },
    { day: 'Sáb', value: 45 },
    { day: 'Dom', value: 28 }
  ];

  const maxUsers = Math.max(...hourlyData.map(d => d.users));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Analíticas y Reportes
          </h1>
          <p className="text-slate-600 mt-1">Monitorea el rendimiento y uso del sistema</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1] bg-white"
          >
            <option value="24horas">Últimas 24 horas</option>
            <option value="7dias">Últimos 7 días</option>
            <option value="30dias">Últimos 30 días</option>
            <option value="90dias">Últimos 90 días</option>
          </select>
          <button className="flex items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-5 h-5 mr-2 text-slate-600" />
            Actualizar
          </button>
          <button className="flex items-center px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#00B9F1]/30">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric.color}-500 rounded-xl flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {metric.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {metric.change}
              </div>
            </div>
            <h3 className="text-sm text-slate-600 mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</p>
            <p className="text-xs text-slate-500">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Activity Chart */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#00B9F1]" />
              Actividad por Hora
            </h3>
            <span className="text-sm text-slate-500">Hoy</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer hover:bg-slate-200 transition-colors"
                     style={{ height: `${(data.users / maxUsers) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00B9F1] to-cyan-400 rounded-t-lg"
                       style={{ height: `${(data.users / maxUsers) * 100}%` }}></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.users} usuarios
                  </div>
                </div>
                <span className="text-xs text-slate-600 font-medium">{data.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Rutas Más Usadas
          </h3>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700 font-medium">{route.route}</span>
                  <span className="text-sm font-bold text-[#00B9F1]">{route.uses}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00B9F1] to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${route.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Comparison and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Actividad Semanal
          </h3>
          <div className="h-48 flex items-end justify-between gap-3">
            {weekData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full group">
                  <div 
                    className="w-full bg-gradient-to-t from-[#00B9F1] to-cyan-400 rounded-t-xl cursor-pointer hover:from-[#0099CC] hover:to-cyan-500 transition-all"
                    style={{ height: `${data.value * 2}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.value}% uso
                    </div>
                  </div>
                </div>
                <span className="text-sm text-slate-700 font-medium">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Insights Clave
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Incremento en Uso</h4>
                  <p className="text-sm text-green-700">El uso del sistema aumentó un 12.5% esta semana, principalmente en horario de almuerzo.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Hora Pico</h4>
                  <p className="text-sm text-blue-700">El mayor tráfico se registra entre 1pm-2pm con 720 usuarios activos simultáneamente.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-1">Ruta Popular</h4>
                  <p className="text-sm text-purple-700">La ruta Biblioteca-Robótica es la más usada con 1,247 generaciones esta semana.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Estadísticas Adicionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-[#00B9F1] mb-2">98.7%</div>
            <div className="text-sm text-slate-600">Precisión GPS</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-[#00B9F1] mb-2">47/50</div>
            <div className="text-sm text-slate-600">Beacons Activos</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-[#00B9F1] mb-2">156</div>
            <div className="text-sm text-slate-600">Zonas Mapeadas</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-[#00B9F1] mb-2">5.4 min</div>
            <div className="text-sm text-slate-600">Tiempo Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
}