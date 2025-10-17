'use client';
import React, { useState } from 'react';
import { Users, Search, Filter, UserPlus, MoreVertical, Mail, Phone, MapPin, Shield, Activity, Download, Edit2, Trash2 } from 'lucide-react';

export default function UsuariosView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');

  const usuarios = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      email: "carlos.mendoza@tecsup.edu.pe",
      telefono: "+51 987 654 321",
      rol: "Estudiante",
      carrera: "Ingeniería Mecatrónica",
      estado: "Activo",
      ultimaConexion: "Hace 5 min",
      rutasGeneradas: 127,
      avatar: "CM"
    },
    {
      id: 2,
      nombre: "María Torres",
      email: "maria.torres@tecsup.edu.pe",
      telefono: "+51 987 654 322",
      rol: "Docente",
      carrera: "Ingeniería Industrial",
      estado: "Activo",
      ultimaConexion: "Hace 15 min",
      rutasGeneradas: 89,
      avatar: "MT"
    },
    {
      id: 3,
      nombre: "Jorge Ramírez",
      email: "jorge.ramirez@tecsup.edu.pe",
      telefono: "+51 987 654 323",
      rol: "Estudiante",
      carrera: "Electrónica",
      estado: "Inactivo",
      ultimaConexion: "Hace 2 días",
      rutasGeneradas: 45,
      avatar: "JR"
    },
    {
      id: 4,
      nombre: "Ana Gutiérrez",
      email: "ana.gutierrez@tecsup.edu.pe",
      telefono: "+51 987 654 324",
      rol: "Administrador",
      carrera: "TI",
      estado: "Activo",
      ultimaConexion: "Hace 1 hora",
      rutasGeneradas: 234,
      avatar: "AG"
    },
    {
      id: 5,
      nombre: "Luis Paredes",
      email: "luis.paredes@tecsup.edu.pe",
      telefono: "+51 987 654 325",
      rol: "Estudiante",
      carrera: "Automatización",
      estado: "Activo",
      ultimaConexion: "Hace 30 min",
      rutasGeneradas: 78,
      avatar: "LP"
    }
  ];

  const stats = [
    { label: "Total Usuarios", value: "1,247", icon: Users, color: "bg-blue-500" },
    { label: "Activos Hoy", value: "342", icon: Activity, color: "bg-green-500" },
    { label: "Estudiantes", value: "1,089", icon: Shield, color: "bg-purple-500" },
    { label: "Docentes", value: "158", icon: Shield, color: "bg-orange-500" }
  ];

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || usuario.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Gestión de Usuarios
          </h1>
          <p className="text-slate-600 mt-1">Administra y monitorea todos los usuarios del sistema</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#00B9F1]/30">
          <UserPlus className="w-5 h-5 mr-2" />
          Nuevo Usuario
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

      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1] bg-white"
            >
              <option value="todos">Todos los roles</option>
              <option value="Estudiante">Estudiantes</option>
              <option value="Docente">Docentes</option>
              <option value="Administrador">Administradores</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5 mr-2 text-slate-600" />
              Filtros
            </button>
            <button className="flex items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              <Download className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rol / Carrera</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actividad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00B9F1] to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {usuario.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-800">{usuario.nombre}</div>
                        <div className="text-sm text-slate-500">{usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                        {usuario.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-4 h-4 mr-2 text-slate-400" />
                        {usuario.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                        usuario.rol === 'Administrador' ? 'bg-red-100 text-red-800' :
                        usuario.rol === 'Docente' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.rol}
                      </span>
                      <span className="text-sm text-slate-600 mt-1">{usuario.carrera}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                        usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          usuario.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                        {usuario.estado}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">{usuario.ultimaConexion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-600">{usuario.rutasGeneradas} rutas</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 hover:text-[#00B9F1] hover:bg-[#00B9F1]/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Mostrando <span className="font-medium">1-5</span> de <span className="font-medium">1,247</span> usuarios
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-colors">
              Anterior
            </button>
            <button className="px-4 py-2 bg-[#00B9F1] text-white rounded-lg text-sm font-medium hover:bg-[#0099CC] transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}