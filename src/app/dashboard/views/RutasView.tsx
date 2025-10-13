'use client';
import React, { useState } from 'react';
import { MapPin, Navigation, Plus, Edit2, Trash2, Clock, TrendingUp, Users, Search, Filter, Map, Building2, Footprints, Calendar, Zap, Smartphone, RefreshCw, Settings, Save, X } from 'lucide-react';

export default function RutasView() {
  const [selectedEdificio, setSelectedEdificio] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, error
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  type Horario = {
  id: number;
  curso: string;
  aula: string;
  horario: string;
  dia: string;
  estudiantes: number;
};

type Ruta = {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  coordenadasOrigen: { lat: number; lng: number };
  coordenadasDestino: { lat: number; lng: number };
  edificioOrigen: string;
  edificioDestino: string;
  distancia: string;
  tiempoEstimado: string;
  nivel: string;
  categoria: string;
  usosSemanal: number;
  popularidad: number;
  estado: string;
  accesible: boolean;
  prioridad: string;
  horariosAsociados: string[];
  cursosAsociados: string[];
  color: string;
  ultimaActualizacion: string;
  sincronizado: boolean;
};

const [newRuta, setNewRuta] = useState<Ruta>({
  id: 0,
  nombre: '',
  origen: '',
  destino: '',
  coordenadasOrigen: { lat: 0, lng: 0 },
  coordenadasDestino: { lat: 0, lng: 0 },
  edificioOrigen: '',
  edificioDestino: '',
  distancia: '',
  tiempoEstimado: '',
  nivel: '',
  categoria: '',
  usosSemanal: 0,
  popularidad: 0,
  estado: 'Activa',
  accesible: true,
  prioridad: 'media',
  horariosAsociados: [],
  cursosAsociados: [],
  color: 'blue',
  ultimaActualizacion: new Date().toISOString(),
  sincronizado: false
});

const resetNewRuta = () => {
  setNewRuta({
    id: 0,
    nombre: '',
    origen: '',
    destino: '',
    coordenadasOrigen: { lat: 0, lng: 0 },
    coordenadasDestino: { lat: 0, lng: 0 },
    edificioOrigen: '',
    edificioDestino: '',
    distancia: '',
    tiempoEstimado: '',
    nivel: '',
    categoria: '',
    usosSemanal: 0,
    popularidad: 0,
    estado: 'Activa',
    accesible: true,
    prioridad: 'media',
    horariosAsociados: [],
    cursosAsociados: [],
    color: 'blue',
    ultimaActualizacion: new Date().toISOString(),
    sincronizado: false
  });
};

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-500 text-blue-700',
  green: 'bg-green-50 border-green-500 text-green-700',
  purple: 'bg-purple-50 border-purple-500 text-purple-700',
  cyan: 'bg-cyan-50 border-cyan-500 text-cyan-700',
  red: 'bg-red-50 border-red-500 text-red-700',
};


  // Tarea 01: Datos de rutas con campos de administración completos
  const [rutas, setRutas] = useState([
    {
      id: 1,
      nombre: "Entrada Principal → Lab. Mecatrónica",
      origen: "Puerta Principal",
      destino: "Lab. Mecatrónica 301",
      coordenadasOrigen: { lat: -12.0464, lng: -77.0428 },
      coordenadasDestino: { lat: -12.0468, lng: -77.0432 },
      edificioOrigen: "Entrada",
      edificioDestino: "Laboratorios",
      distancia: "180m",
      tiempoEstimado: "3 min",
      nivel: "Piso 3",
      categoria: "Laboratorios",
      usosSemanal: 245,
      popularidad: 92,
      estado: "Activa",
      accesible: true,
      prioridad: "alta",
      horariosAsociados: ["08:00-10:00", "14:00-16:00"],
      cursosAsociados: ["Mecatrónica Aplicada", "Robótica Industrial"],
      color: "blue",
      ultimaActualizacion: new Date().toISOString(),
      sincronizado: true
    },
    {
      id: 2,
      nombre: "Biblioteca → Aula 205",
      origen: "Biblioteca Central",
      destino: "Aula 205",
      coordenadasOrigen: { lat: -12.0465, lng: -77.0429 },
      coordenadasDestino: { lat: -12.0467, lng: -77.0431 },
      edificioOrigen: "Biblioteca",
      edificioDestino: "Aulas",
      distancia: "120m",
      tiempoEstimado: "2 min",
      nivel: "Piso 2",
      categoria: "Aulas",
      usosSemanal: 187,
      popularidad: 78,
      estado: "Activa",
      accesible: true,
      prioridad: "media",
      horariosAsociados: ["10:00-12:00"],
      cursosAsociados: ["Programación Avanzada"],
      color: "green",
      ultimaActualizacion: new Date().toISOString(),
      sincronizado: true
    },
    {
      id: 3,
      nombre: "Cafetería → Lab. Electrónica",
      origen: "Cafetería Principal",
      destino: "Lab. Electrónica",
      coordenadasOrigen: { lat: -12.0466, lng: -77.0430 },
      coordenadasDestino: { lat: -12.0469, lng: -77.0433 },
      edificioOrigen: "Cafetería",
      edificioDestino: "Laboratorios",
      distancia: "210m",
      tiempoEstimado: "4 min",
      nivel: "Piso 1",
      categoria: "Laboratorios",
      usosSemanal: 156,
      popularidad: 65,
      estado: "Activa",
      accesible: false,
      prioridad: "baja",
      horariosAsociados: ["12:00-14:00"],
      cursosAsociados: ["Electrónica Digital"],
      color: "purple",
      ultimaActualizacion: new Date().toISOString(),
      sincronizado: false
    }
  ]);

  // Tarea 02: Horarios de clases para asignación automática
  const [horarios] = useState([
    {
      id: 1,
      curso: "Programación Avanzada",
      aula: "Lab. Computación 301",
      horario: "08:00 - 10:00",
      dia: "Lunes",
      estudiantes: 35
    },
    {
      id: 2,
      curso: "Sistemas de Control",
      aula: "Aula 205",
      horario: "10:00 - 12:00",
      dia: "Lunes",
      estudiantes: 28
    },
    {
      id: 3,
      curso: "Electrónica Digital",
      aula: "Lab. Electrónica",
      horario: "14:00 - 16:00",
      dia: "Lunes",
      estudiantes: 32
    }
  ]);

    // Contador dinámico de rutas asignadas hoy (no sincronizadas)
    const rutasAsignadasHoy = rutas.filter(r => !r.sincronizado).length;
  

  const edificios = ['Todos', 'Laboratorios', 'Aulas', 'Biblioteca', 'Cafetería', 'Admin'];

  const stats = [
    { label: "Rutas Activas", value: rutas.filter(r => r.estado === 'Activa').length.toString(), icon: Navigation, color: "bg-blue-500" },
    { label: "Edificios", value: "12", icon: Building2, color: "bg-green-500" },
    { label: "Sincronizadas", value: rutas.filter(r => r.sincronizado).length.toString(), icon: Smartphone, color: "bg-purple-500" },
    { label: "Asignaciones Auto", value: rutasAsignadasHoy.toString(), icon: Zap, color: "bg-orange-500" }
  ];

  // Tarea 02: Lógica de asignación automática según horarios
  const asignarRutaAutomatica = (horario: Horario) => {
  const edificiosOrigen = ["Entrada Principal", "Biblioteca Central", "Cafetería Principal"];
  const origenAleatorio = edificiosOrigen[Math.floor(Math.random() * edificiosOrigen.length)];
  const nombreRuta = `${origenAleatorio} → ${horario.aula}`;

  if (rutas.some(r => r.nombre === nombreRuta && r.horariosAsociados.includes(horario.horario))) {
    alert(`Ya existe una ruta para este horario: ${nombreRuta}`);
    return null;
  }
  const nuevaRuta = {
    id: rutas.length + 1,
    nombre: `${origenAleatorio} → ${horario.aula}`,
    origen: origenAleatorio,
    destino: horario.aula,
    coordenadasOrigen: { lat: -12.0464 + Math.random() * 0.001, lng: -77.0428 + Math.random() * 0.001 },
    coordenadasDestino: { lat: -12.0464 + Math.random() * 0.001, lng: -77.0428 + Math.random() * 0.001 },
    edificioOrigen: "Entrada",
    edificioDestino: "Aulas",
    distancia: `${Math.floor(Math.random() * 200) + 50}m`,
    tiempoEstimado: `${Math.floor(Math.random() * 5) + 2} min`,
    nivel: "Piso 1",
    categoria: "Aulas",
    usosSemanal: 0,
    popularidad: 0,
    estado: "Activa",
    accesible: true,
    prioridad: "alta",
    horariosAsociados: [horario.horario],
    cursosAsociados: [horario.curso],
    color: "cyan",
    ultimaActualizacion: new Date().toISOString(),
    sincronizado: false
  };

  setRutas([...rutas, nuevaRuta]);
  return nuevaRuta;
};

  // Tarea 03: Función de sincronización con app móvil Flutter
  const sincronizarConFlutter = async () => {
    setSyncStatus('syncing');
    
    // Simular sincronización con API
    try {
      // En producción, esto sería una llamada real a tu API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Datos a enviar a Flutter (formato JSON estándar)
      const datosParaFlutter = {
        rutas: rutas.map(r => ({
          id: r.id,
          nombre: r.nombre,
          origen: {
            nombre: r.origen,
            coordenadas: r.coordenadasOrigen,
            edificio: r.edificioOrigen
          },
          destino: {
            nombre: r.destino,
            coordenadas: r.coordenadasDestino,
            edificio: r.edificioDestino
          },
          distancia: r.distancia,
          tiempoEstimado: r.tiempoEstimado,
          nivel: r.nivel,
          accesible: r.accesible,
          estado: r.estado,
          prioridad: r.prioridad,
          horariosAsociados: r.horariosAsociados,
          cursosAsociados: r.cursosAsociados,
          ultimaActualizacion: r.ultimaActualizacion
        })),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      };

      // Aquí iría tu endpoint real
      // await fetch('/api/sync/rutas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(datosParaFlutter)
      // });

      console.log('Datos sincronizados con Flutter:', datosParaFlutter);
      
      // Actualizar estado de sincronización
      setRutas(rutas.map(r => ({ ...r, sincronizado: true })));
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error en sincronización:', error);
      setSyncStatus('error');
    }
  };

  const rutasFiltradas = rutas.filter(r => {
    const matchSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.destino.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEdificio = selectedEdificio === 'Todos' || r.categoria === selectedEdificio;
    return matchSearch && matchEdificio;
  });

  const getPopularidadColor = (popularidad: number): string => {
    if (popularidad >= 80) return 'text-green-600 bg-green-50';
    if (popularidad >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-slate-600 bg-slate-50';
  };

  const getSyncStatusIcon = () => {
    if (syncStatus === 'syncing') return <RefreshCw className="w-5 h-5 animate-spin" />;
    if (syncStatus === 'error') return <X className="w-5 h-5" />;
    return <Smartphone className="w-5 h-5" />;
  };

  const getSyncStatusColor = () => {
    if (syncStatus === 'syncing') return 'bg-blue-500';
    if (syncStatus === 'error') return 'bg-red-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Navigation className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Gestión de Rutas Campus
          </h1>
          <p className="text-slate-600 mt-1">Sistema de administración y asignación de rutas internas</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={sincronizarConFlutter}
            disabled={syncStatus === 'syncing'}
            className={`flex items-center px-6 py-3 ${getSyncStatusColor()} hover:opacity-90 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg disabled:opacity-50`}
          >
            {getSyncStatusIcon()}
            <span className="ml-2">
              {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'error' ? 'Error' : 'Sincronizar'}
            </span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#00B9F1]/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Ruta
          </button>
        </div>
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <h3 className="text-lg font-bold text-slate-800">Crear Nueva Ruta</h3>

      <div className="space-y-3 mt-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Nombre</label>
          <input
            type="text"
            value={newRuta.nombre}
            onChange={(e) => setNewRuta({ ...newRuta, nombre: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
          />
        </div>
        {/* Origen */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Origen</label>
          <input
            type="text"
            value={newRuta.origen}
            onChange={(e) => setNewRuta({ ...newRuta, origen: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
          />
        </div>
        {/* Destino */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Destino</label>
          <input
            type="text"
            value={newRuta.destino}
            onChange={(e) => setNewRuta({ ...newRuta, destino: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {/* Cancelar */}
        <button
          onClick={() => {
            setShowModal(false);
            resetNewRuta();
          }}
          className="px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Cancelar
        </button>

        {/* Crear */}
        <button
          onClick={() => {
            const nuevaConId = {
              ...newRuta,
              id: rutas.length + 1,
              ultimaActualizacion: new Date().toISOString(),
              coordenadasOrigen: newRuta.coordenadasOrigen.lat !== 0 ? newRuta.coordenadasOrigen : { lat: -12.0464, lng: -77.0428 },
              coordenadasDestino: newRuta.coordenadasDestino.lat !== 0 ? newRuta.coordenadasDestino : { lat: -12.0465, lng: -77.0429 },
              edificioOrigen: newRuta.edificioOrigen || "Entrada",
              edificioDestino: newRuta.edificioDestino || "Aulas",
              distancia: newRuta.distancia || "100m",
              tiempoEstimado: newRuta.tiempoEstimado || "3 min",
              nivel: newRuta.nivel || "Piso 1",
              categoria: newRuta.categoria || "Aulas",
              usosSemanal: newRuta.usosSemanal || 0,
              popularidad: newRuta.popularidad || 0,
              estado: newRuta.estado || "Activa",
              accesible: newRuta.accesible !== undefined ? newRuta.accesible : true,
              prioridad: newRuta.prioridad || "media",
              horariosAsociados: newRuta.horariosAsociados.length > 0 ? newRuta.horariosAsociados : [],
              cursosAsociados: newRuta.cursosAsociados.length > 0 ? newRuta.cursosAsociados : [],
              color: newRuta.color || "blue",
              sincronizado: false
            };

            setRutas([...rutas, nuevaConId]);
            setShowModal(false);

            // Reset formulario
            resetNewRuta();
          }}
          className="px-4 py-2 bg-[#00B9F1] text-white rounded-lg"
        >
          Crear
        </button>
      </div>
    </div>
  </div>
)}

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

      {/* Tarea 02: Panel de Asignación Automática */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-800">Asignación Automática de Rutas</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              El sistema puede asignar rutas automáticamente basándose en los horarios de clases programados
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAsignacionModal(true)}
                className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
              >
                <Zap className="w-4 h-4 mr-2" />
                Asignar desde Horarios
              </button>
              <button className="flex items-center px-4 py-2 bg-white border border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg font-medium transition-all">
                <Settings className="w-4 h-4 mr-2" />
                Configurar Reglas
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg px-4 py-2 border-2 border-orange-300">
            <div className="text-center">
              <p className="text-sm text-slate-600">Asignadas Hoy</p>
              <p className="text-2xl font-bold text-orange-600">{rutasAsignadasHoy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Building Selector */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {edificios.map((edificio) => (
              <button
                key={edificio}
                onClick={() => setSelectedEdificio(edificio)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedEdificio === edificio
                    ? 'bg-[#00B9F1] text-white shadow-lg shadow-[#00B9F1]/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {edificio}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar ruta..."
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

      {/* Routes List */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
          <Map className="w-5 h-5 mr-2 text-[#00B9F1]" />
          Rutas del Campus ({rutasFiltradas.length})
        </h3>
        
        {rutasFiltradas.length > 0 ? (
          <div className="space-y-4">
            {rutasFiltradas.map((ruta) => {
              return (
                <div key={ruta.id} className={`p-6 border-l-4 rounded-xl ${colorClasses[ruta.color] || 'bg-slate-50 border-slate-300'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-800">{ruta.nombre}</h4>
                        <span className={`px-3 py-1 ${colorClasses[ruta.color] || 'bg-slate-100 text-slate-700'} text-xs font-semibold rounded-full`}>
                          {ruta.estado}
                        </span>
                        <span className={`px-3 py-1 ${getPopularidadColor(ruta.popularidad)} text-xs font-semibold rounded-full`}>
                          {ruta.popularidad}% popularidad
                        </span>
                        {ruta.accesible && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                            ♿ Accesible
                          </span>
                        )}
                        {!ruta.sincronizado && (
                          <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Sin sincronizar
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Desde:</span>
                          <span>{ruta.origen}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="font-medium">Hasta:</span>
                          <span>{ruta.destino}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{ruta.tiempoEstimado} • {ruta.distancia}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>{ruta.nivel}</span>
                        </div>
                      </div>

                      {/* Horarios y cursos asociados */}
                      {ruta.horariosAsociados.length > 0 && (
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">Horarios:</span>
                          {ruta.horariosAsociados.map((h, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs">{h}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{ruta.usosSemanal} usos/semana</span>
                        </div>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-xs overflow-hidden">
                          <div 
                            className={`h-full ${ruta.popularidad >= 80 ? 'bg-green-500' : ruta.popularidad >= 60 ? 'bg-orange-500' : 'bg-slate-400'} transition-all`}
                            style={{ width: `${ruta.popularidad}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                 <div className="flex gap-2">
  {/* Ver en mapa */}
  <button className="p-2 text-slate-600 hover:text-[#00B9F1] hover:bg-[#00B9F1]/10 rounded-lg transition-colors" title="Ver en mapa">
    <Map className="w-5 h-5" />
  </button>

  {/* Editar */}
 {/* Modal de edición */}
{showEditModal && selectedRuta && (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <h3 className="text-lg font-bold text-slate-800">Editar Ruta</h3>

      <div className="space-y-3 mt-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nombre</label>
          <input
            type="text"
            value={selectedRuta.nombre}
            onChange={(e) => setSelectedRuta({ ...selectedRuta, nombre: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Origen</label>
          <input
            type="text"
            value={selectedRuta.origen}
            onChange={(e) => setSelectedRuta({ ...selectedRuta, origen: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Destino</label>
          <input
            type="text"
            value={selectedRuta.destino}
            onChange={(e) => setSelectedRuta({ ...selectedRuta, destino: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowEditModal(false);
            setSelectedRuta(null);
          }}
          className="px-4 py-2 bg-slate-100 rounded-lg"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            if (selectedRuta) {
              setRutas(rutas.map(r => r.id === selectedRuta.id ? selectedRuta : r));
            }
            setShowEditModal(false);
            setSelectedRuta(null);
          }}
          className="px-4 py-2 bg-[#00B9F1] text-white rounded-lg"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

<button
  onClick={() => {
    setSelectedRuta(ruta); // selecciona la ruta que quieres editar
    setShowEditModal(true); // abre el modal
  }}
  className="p-2 text-slate-600 hover:text-[#00B9F1] hover:bg-[#00B9F1]/10 rounded-lg transition-colors"
  title="Editar"
>
  <Edit2 className="w-5 h-5" />
</button>


  {/* Eliminar con modal */}
  <button
    onClick={() => {
      setSelectedRuta(ruta);
      setShowDeleteModal(true); // Abre el modal de confirmación
    }}
    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    title="Eliminar"
  >
    <Trash2 className="w-5 h-5" />
  </button>
</div>

{showDeleteModal && selectedRuta && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <h3 className="text-lg font-bold text-slate-800">Confirmar eliminación</h3>
      <p className="mt-2 text-slate-600">¿Deseas eliminar la ruta "{selectedRuta.nombre}"?</p>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            setRutas(rutas.filter(r => r.id !== selectedRuta.id));
            setShowDeleteModal(false);
            setSelectedRuta(null);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Navigation className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No hay rutas disponibles para este filtro</p>
          </div>
        )}
      </div>

      {/* Modal de Asignación Automática */}
      {showAsignacionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-slate-800">Asignación Automática</h3>
                </div>
                <button 
                  onClick={() => setShowAsignacionModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 text-sm mt-2">
                Selecciona los horarios para generar rutas automáticamente
              </p>
            </div>
            <div className="p-6 space-y-3">
              {horarios.map(horario => (
                <div key={horario.id} className="p-4 border border-slate-200 rounded-xl hover:border-[#00B9F1] hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{horario.curso}</p>
                      <p className="text-sm text-slate-600">{horario.aula} • {horario.horario}</p>
                      <p className="text-xs text-slate-500 mt-1">{horario.estudiantes} estudiantes</p>
                    </div>
                    <button
                      onClick={() => {
  const nueva = asignarRutaAutomatica(horario);
  if (nueva) {
    alert(`Ruta creada: ${nueva.nombre}`);
  }
  setShowAsignacionModal(false);
}}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
                    >
                      Asignar Ruta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}