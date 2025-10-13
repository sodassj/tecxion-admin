'use client';
import React, { useState } from 'react';
import { Clock, Calendar, Plus, Edit2, Trash2, Users, BookOpen, Filter, Search } from 'lucide-react';

export default function HorariosView() {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [searchTerm, setSearchTerm] = useState('');

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const horarios = [
    {
      id: 1,
      curso: "Programación Avanzada",
      docente: "Dr. Carlos Mendoza",
      aula: "Lab. Computación 301",
      horario: "08:00 - 10:00",
      dia: "Lunes",
      estudiantes: 35,
      color: "blue"
    },
    {
      id: 2,
      curso: "Sistemas de Control",
      docente: "Ing. María Torres",
      aula: "Aula 205",
      horario: "10:00 - 12:00",
      dia: "Lunes",
      estudiantes: 28,
      color: "green"
    },
    {
      id: 3,
      curso: "Electrónica Digital",
      docente: "Ing. Jorge Ramírez",
      aula: "Lab. Electrónica",
      horario: "14:00 - 16:00",
      dia: "Lunes",
      estudiantes: 32,
      color: "purple"
    },
    {
      id: 4,
      curso: "Robótica Industrial",
      docente: "Dr. Luis Paredes",
      aula: "Lab. Robótica",
      horario: "16:00 - 18:00",
      dia: "Lunes",
      estudiantes: 25,
      color: "orange"
    },
    {
      id: 5,
      curso: "Mecatrónica Aplicada",
      docente: "Ing. Ana Gutiérrez",
      aula: "Taller 102",
      horario: "08:00 - 10:00",
      dia: "Martes",
      estudiantes: 30,
      color: "pink"
    },
    {
      id: 6,
      curso: "Base de Datos",
      docente: "Ing. Pedro Sánchez",
      aula: "Lab. Computación 302",
      horario: "10:00 - 12:00",
      dia: "Martes",
      estudiantes: 40,
      color: "cyan"
    }
  ];

  const horasDelDia = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const stats = [
    { label: "Clases Hoy", value: "24", icon: BookOpen, color: "bg-blue-500" },
    { label: "Aulas Activas", value: "18", icon: Calendar, color: "bg-green-500" },
    { label: "Estudiantes", value: "847", icon: Users, color: "bg-purple-500" },
    { label: "Docentes", value: "45", icon: Users, color: "bg-orange-500" }
  ];

  const horariosDelDia = horarios.filter(h => h.dia === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Gestión de Horarios
          </h1>
          <p className="text-slate-600 mt-1">Administra los horarios de clases y actividades</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#00B9F1]/30">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Clase
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Day Selector */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {dias.map((dia) => (
              <button
                key={dia}
                onClick={() => setSelectedDay(dia)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedDay === dia
                    ? 'bg-[#00B9F1] text-white shadow-lg shadow-[#00B9F1]/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar clase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#00B9F1]" />
          Horario de {selectedDay}
        </h3>
        
        {horariosDelDia.length > 0 ? (
          <div className="space-y-4">
            {horariosDelDia.map((clase) => (
              <div key={clase.id} className={`p-6 bg-${clase.color}-50 border-l-4 border-${clase.color}-500 rounded-xl hover:shadow-lg transition-all`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-800">{clase.curso}</h4>
                      <span className={`px-3 py-1 bg-${clase.color}-100 text-${clase.color}-700 text-xs font-semibold rounded-full`}>
                        {clase.horario}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{clase.docente}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>{clase.aula}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{clase.estudiantes} estudiantes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-600 hover:text-[#00B9F1] hover:bg-[#00B9F1]/10 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No hay clases programadas para este día</p>
            <button className="mt-4 px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all">
              Agregar Primera Clase
            </button>
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-[#00B9F1]" />
          Vista Semanal
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-3 text-sm font-semibold text-slate-600">Hora</th>
                {dias.map((dia) => (
                  <th key={dia} className="text-center p-3 text-sm font-semibold text-slate-600">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horasDelDia.map((hora, index) => (
                <tr key={hora} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="p-3 text-sm font-medium text-slate-700">{hora}</td>
                  {dias.map((dia) => {
                    const claseEnHora = horarios.find(h => 
                      h.dia === dia && h.horario.startsWith(hora)
                    );
                    return (
                      <td key={`${dia}-${hora}`} className="p-2">
                        {claseEnHora ? (
                          <div className={`p-2 bg-${claseEnHora.color}-100 border border-${claseEnHora.color}-300 rounded-lg text-xs`}>
                            <p className="font-semibold text-slate-800 truncate">{claseEnHora.curso}</p>
                            <p className="text-slate-600 truncate">{claseEnHora.aula}</p>
                          </div>
                        ) : (
                          <div className="h-16"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}