'use client';
import React, { useState } from 'react';
import { Users, Search, Filter, UserPlus, MoreVertical, Mail, Phone, MapPin, Shield, Activity, Download, Edit2, Trash2, MessageSquare, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function UsuariosView() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'feedback'>('usuarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterFeedbackType, setFilterFeedbackType] = useState('todos');
  const [filterFeedbackStatus, setFilterFeedbackStatus] = useState('todos');

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

  const feedbackData = [
    {
      id: 1,
      tipo: 'error',
      usuario: 'Carlos Mendoza',
      email: 'carlos.mendoza@tecsup.edu.pe',
      avatar: 'CM',
      fecha: '2025-01-15 10:30',
      calificacion: 3,
      comentario: 'La ruta a Lab 301 no se carga correctamente en el mapa. He intentado varias veces y siempre muestra un error de "coordenadas no disponibles".',
      estado: 'pendiente',
      prioridad: 'alta'
    },
    {
      id: 2,
      tipo: 'sugerencia',
      usuario: 'María Torres',
      email: 'maria.torres@tecsup.edu.pe',
      avatar: 'MT',
      fecha: '2025-01-15 09:15',
      calificacion: 5,
      comentario: 'Sería genial poder guardar rutas favoritas para acceso rápido. Como docente, siempre voy a los mismos salones y esto me ahorraría mucho tiempo.',
      estado: 'en_revision',
      prioridad: 'media'
    },
    {
      id: 3,
      tipo: 'comentario',
      usuario: 'Jorge Ramírez',
      email: 'jorge.ramirez@tecsup.edu.pe',
      avatar: 'JR',
      fecha: '2025-01-14 16:45',
      calificacion: 4,
      comentario: 'La app es muy útil para encontrar las aulas, pero el tiempo de carga inicial es un poco lento. ¿Podrían optimizarlo?',
      estado: 'resuelto',
      prioridad: 'baja'
    },
    {
      id: 4,
      tipo: 'error',
      usuario: 'Luis Paredes',
      email: 'luis.paredes@tecsup.edu.pe',
      avatar: 'LP',
      fecha: '2025-01-14 14:20',
      calificacion: 2,
      comentario: 'No puedo iniciar sesión con mi cuenta institucional. Me dice "credenciales inválidas" aunque estoy seguro de que son correctas.',
      estado: 'pendiente',
      prioridad: 'alta'
    },
    {
      id: 5,
      tipo: 'sugerencia',
      usuario: 'Ana Gutiérrez',
      email: 'ana.gutierrez@tecsup.edu.pe',
      avatar: 'AG',
      fecha: '2025-01-13 11:00',
      calificacion: 5,
      comentario: 'Me encantaría que hubiera notificaciones push cuando estoy cerca de mi próxima clase. Sería súper útil para no llegar tarde.',
      estado: 'en_revision',
      prioridad: 'media'
    },
    {
      id: 6,
      tipo: 'comentario',
      usuario: 'Carlos Mendoza',
      email: 'carlos.mendoza@tecsup.edu.pe',
      avatar: 'CM',
      fecha: '2025-01-12 15:30',
      calificacion: 5,
      comentario: 'Excelente aplicación. Me ha ayudado mucho a encontrar las aulas en mi primer semestre. ¡Gracias al equipo de desarrollo!',
      estado: 'resuelto',
      prioridad: 'baja'
    }
  ];

  const stats = [
    { label: "Total Usuarios", value: "1,247", icon: Users, color: "bg-blue-500" },
    { label: "Activos Hoy", value: "342", icon: Activity, color: "bg-green-500" },
    { label: "Estudiantes", value: "1,089", icon: Shield, color: "bg-purple-500" },
    { label: "Docentes", value: "158", icon: Shield, color: "bg-orange-500" }
  ];

  const feedbackStats = [
    { label: "Total Feedback", value: feedbackData.length.toString(), icon: MessageSquare, color: "bg-blue-500" },
    { label: "Pendientes", value: feedbackData.filter(f => f.estado === 'pendiente').length.toString(), icon: Clock, color: "bg-orange-500" },
    { label: "En Revisión", value: feedbackData.filter(f => f.estado === 'en_revision').length.toString(), icon: AlertCircle, color: "bg-yellow-500" },
    { label: "Resueltos", value: feedbackData.filter(f => f.estado === 'resuelto').length.toString(), icon: CheckCircle, color: "bg-green-500" }
  ];

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || usuario.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comentario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterFeedbackType === 'todos' || feedback.tipo === filterFeedbackType;
    const matchesStatus = filterFeedbackStatus === 'todos' || feedback.estado === filterFeedbackStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (tipo: string) => {
    const colors = {
      error: 'bg-red-100 text-red-700 border-red-200',
      sugerencia: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      comentario: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusColor = (estado: string) => {
    const colors = {
      pendiente: 'bg-orange-100 text-orange-700',
      en_revision: 'bg-blue-100 text-blue-700',
      resuelto: 'bg-green-100 text-green-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (prioridad: string) => {
    const colors = {
      alta: 'bg-red-500',
      media: 'bg-yellow-500',
      baja: 'bg-green-500'
    };
    return colors[prioridad as keyof typeof colors] || 'bg-gray-500';
  };

  const promedioCalificacion = (feedbackData.reduce((acc, f) => acc + f.calificacion, 0) / feedbackData.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Gestión de Usuarios
          </h1>
          <p className="text-slate-600 mt-1">Administra usuarios y revisa el feedback del sistema</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#00B9F1]/30">
          <UserPlus className="w-5 h-5 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'usuarios'
              ? 'bg-[#00B9F1] text-white shadow-lg shadow-[#00B9F1]/30'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5" />
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all relative ${
            activeTab === 'feedback'
              ? 'bg-[#00B9F1] text-white shadow-lg shadow-[#00B9F1]/30'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Feedback
          {feedbackData.filter(f => f.estado === 'pendiente').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {feedbackData.filter(f => f.estado === 'pendiente').length}
            </span>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(activeTab === 'usuarios' ? stats : feedbackStats).map((stat, index) => (
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

      {activeTab === 'usuarios' ? (
        <>
          {/* Filters and Search - Usuarios */}
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
        </>
      ) : (
        <>
          {/* Filters and Search - Feedback */}
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterFeedbackType}
                  onChange={(e) => setFilterFeedbackType(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1] bg-white"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="error">Errores</option>
                  <option value="sugerencia">Sugerencias</option>
                  <option value="comentario">Comentarios</option>
                </select>
                <select
                  value={filterFeedbackStatus}
                  onChange={(e) => setFilterFeedbackStatus(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B9F1] bg-white"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="resuelto">Resueltos</option>
                </select>
                <button className="flex items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                  <Download className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Rating Overview */}
          <div className="bg-gradient-to-br from-[#00B9F1] to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Calificación Promedio</h3>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold">{promedioCalificacion}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(parseFloat(promedioCalificacion))
                            ? 'fill-yellow-300 text-yellow-300'
                            : 'text-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/80 mt-2">Basado en {feedbackData.length} evaluaciones</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-2">Distribución</p>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = feedbackData.filter(f => f.calificacion === rating).length;
                    const percentage = (count / feedbackData.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs w-8">{rating}★</span>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00B9F1] to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {feedback.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{feedback.usuario}</p>
                      <p className="text-sm text-slate-500">{feedback.fecha}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(feedback.prioridad)}`} />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(feedback.tipo)}`}>
                      {feedback.tipo}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(feedback.estado)}`}>
                      {feedback.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.calificacion
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700">{feedback.comentario}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-[#00B9F1] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0099CC] transition-all flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Resuelto
                  </button>
                  <button className="px-4 py-2 border-2 border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Responder
                  </button>
                  <button className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Mostrando <span className="font-medium">1-{filteredFeedback.length}</span> de <span className="font-medium">{feedbackData.length}</span> comentarios
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
        </>
      )}
    </div>
  );
}