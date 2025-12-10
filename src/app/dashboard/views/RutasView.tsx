'use client';
import React, { useState } from 'react';
import { MapPin, Navigation, Plus, Edit2, Trash2, Clock, Search, Filter, Map, Building2, Calendar, Zap, Smartphone, RefreshCw, Settings, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Aula = {
  id_aula: number;
  nombre_aula: string;
  ubicacion_interna: string | null;
  id_edificio: number | null;
  latitud: number | null;
  longitud: number | null;
};

type Horario = {
  id_horario: number;
  curso: string;
  hora_inicio: string;
  hora_fin: string;
  dia_semana: string;
  id_usuario: number | null;
  id_aula: number | null;
  aula?: Aula;
};

type Ruta = {
  id_ruta: number;
  origen_id: number;
  destino_id: number;
  coordenadas: {
    origen: { lat: number; lng: number };
    destino: { lat: number; lng: number };
  };
  distancia: number | null;
  tiempo_estimado: number | null;
  ruta_optima: string | null;
  id_usuario: number | null;
  origen?: Aula;
  destino?: Aula;
  sincronizado?: boolean;
};

export default function RutasView() {
  
  const [selectedEdificio, setSelectedEdificio] = useState('Todos');
  const edificios = ['Todos', 'Laboratorios', 'Aulas', 'Biblioteca', 'Cafetería', 'Administración'];
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const getCategoria = (aula: Aula) => {
    if (!aula.nombre_aula) return 'Otros';

    const nombre = aula.nombre_aula
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (nombre.includes('lab') || nombre.includes('laboratorio')) return 'Laboratorios';
    if (nombre.includes('salon') || nombre.includes('aula')) return 'Aulas';
    if (nombre.includes('biblioteca')) return 'Biblioteca';
    if (nombre.includes('admin') || nombre.includes('oficina') || nombre.includes('direccion')) return 'Administración';
    if (nombre.includes('cafeteria')) return 'Cafetería';

    return 'Otros';
  };

  
  const [newRuta, setNewRuta] = useState<Partial<Ruta>>({
    origen_id: 0,
    destino_id: 0,
    coordenadas: {
      origen: { lat: 0, lng: 0 },
      destino: { lat: 0, lng: 0 }
    },
    distancia: null,
    tiempo_estimado: null,
    ruta_optima: null,
    id_usuario: null,
    sincronizado: false
  });

  const resetNewRuta = () => {
    setNewRuta({
      origen_id: 0,
      destino_id: 0,
      coordenadas: {
        origen: { lat: 0, lng: 0 },
        destino: { lat: 0, lng: 0 }
      },
      distancia: null,
      tiempo_estimado: null,
      ruta_optima: null,
      id_usuario: null,
      sincronizado: false
    });
  };

  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  

  React.useEffect(() => {
    cargarDatos();
    cargarHorarios();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const { data: aulasData, error: aulasError } = await supabase
        .from('Aula')
        .select('*');

      if (aulasError) throw aulasError;

      const { data: rutasData, error: rutasError } = await supabase
        .from('Ruta')
        .select('*');

      if (rutasError) throw rutasError;

      setAulas(aulasData as Aula[]);
      setRutas(
        (rutasData as Ruta[]).map((r) => ({
          ...r,
          origen: (aulasData as Aula[]).find(a => a.id_aula === r.origen_id),
          destino: (aulasData as Aula[]).find(a => a.id_aula === r.destino_id),
          sincronizado: true
        }))
      );

    } catch (error) {
      console.error('Error al cargar datos desde Supabase:', error);
      alert('Error al cargar datos desde Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  const cargarHorarios = async () => {
    try {
      const { data: horariosData, error: horariosError } = await supabase
        .from('Horario')
        .select(`
          *,
          aula:Aula(*)
        `);

      if (horariosError) throw horariosError;
      setHorarios(horariosData as Horario[]);
    } catch (error) {
      console.error('Error al cargar horarios desde Supabase:', error);
    }
  };

  const rutasAsignadasHoy = rutas.filter(r => !r.sincronizado).length;


  const stats = [
    { label: "Rutas Activas", value: rutas.length.toString(), icon: Navigation, color: "bg-sky-500" }, 
    { label: "Aulas", value: aulas.length.toString(), icon: Building2, color: "bg-emerald-500" },
    { label: "Sincronizadas", value: rutas.filter(r => r.sincronizado).length.toString(), icon: Smartphone, color: "bg-slate-500" }, 
    { label: "Asignaciones Auto", value: rutasAsignadasHoy.toString(), icon: Zap, color: "bg-teal-500" }
];

  const asignarRutaAutomatica = async (horario: Horario) => {
    if (!horario.id_aula) {
      alert('Este horario no tiene un aula asignada');
      return null;
    }

    const aulaDestino = aulas.find(a => a.id_aula === horario.id_aula);
    if (!aulaDestino) {
      alert('No se encontró el aula asociada al horario');
      return null;
    }

    const aulasOrigen = aulas.filter(a => a.id_aula !== horario.id_aula);
    if (aulasOrigen.length === 0) {
      alert('No hay aulas disponibles como origen');
      return null;
    }
    
    const origenAleatorio = aulasOrigen[Math.floor(Math.random() * aulasOrigen.length)];

    const rutaExistente = rutas.find(r => 
      r.origen_id === origenAleatorio.id_aula && 
      r.destino_id === aulaDestino.id_aula
    );

    if (rutaExistente) {
      alert(`Ya existe una ruta de ${origenAleatorio.nombre_aula} a ${aulaDestino.nombre_aula}`);
      return null;
    }

    const nuevaRuta: Partial<Ruta> = {
      origen_id: origenAleatorio.id_aula,
      destino_id: aulaDestino.id_aula,
      coordenadas: {
        origen: { 
          lat: origenAleatorio.latitud || -12.0464, 
          lng: origenAleatorio.longitud || -77.0428 
        },
        destino: { 
          lat: aulaDestino.latitud || -12.0465, 
          lng: aulaDestino.longitud || -77.0429 
        }
      },
      distancia: Math.floor(Math.random() * 200) + 50,
      tiempo_estimado: Math.floor(Math.random() * 10) + 2,
      ruta_optima: 'Ruta generada automáticamente',
      id_usuario: null,
      sincronizado: false
    };

    try {
      const { data: rutaData, error: rutaError } = await supabase
        .from('Ruta')
        .insert([nuevaRuta])
        .select()
        .single();

      if (rutaError) throw rutaError;

      const rutaCreada = { 
        ...rutaData, 
        origen: origenAleatorio, 
        destino: aulaDestino,
        sincronizado: false 
      };
      
      setRutas([...rutas, rutaCreada]);
      return rutaCreada;
    } catch (error) {
      console.error('Error al asignar ruta:', error);
      alert('Error al crear la ruta en Supabase');
      return null;
    }
  };

  const sincronizarConFlutter = async () => {
  setSyncStatus('syncing');

  try {
    // Verifica si todas las rutas ya están sincronizadas
    const allSynced = rutas.every(r => r.sincronizado);
    if (allSynced) {
      alert('¡Todas las rutas ya están sincronizadas!');
      setSyncStatus('synced');
      return;
    }

    // Obtiene solo las rutas que aún no están sincronizadas
    const rutasIds = rutas.filter(r => !r.sincronizado).map(r => r.id_ruta);

    const { error: syncError } = await supabase
      .from('Ruta')
      .update({ sincronizado: true })
      .in('id_ruta', rutasIds);

    if (syncError) throw syncError;

    // Actualiza el estado local
    setRutas(rutas.map(r => ({ ...r, sincronizado: true })));
    setSyncStatus('synced');

    alert('¡Rutas sincronizadas correctamente!');
  } catch (err: any) {
    console.error('Error en sincronización:', err.message || err);
    setSyncStatus('error');
    alert('Ocurrió un error al sincronizar. Intenta nuevamente.');
  }
};

  const rutasFiltradas = rutas.filter(r => {
    const origenNombre = r.origen?.nombre_aula || '';
    const destinoNombre = r.destino?.nombre_aula || '';
    const nombreRuta = `${origenNombre} → ${destinoNombre}`;
    
    const matchSearch = nombreRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       origenNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       destinoNombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEdificio =
      selectedEdificio === 'Todos' ||
      getCategoria(r.origen || { id_aula: 0, nombre_aula: '', ubicacion_interna: '', id_edificio: null, latitud: null, longitud: null }) === selectedEdificio ||
      getCategoria(r.destino || { id_aula: 0, nombre_aula: '', ubicacion_interna: '', id_edificio: null, latitud: null, longitud: null }) === selectedEdificio;
    return matchSearch && matchEdificio;
  });

  const getPopularidadColor = (popularidad: number): string => {
  // BUENO (Celeste)
  if (popularidad >= 80) return 'text-sky-700 bg-sky-100'; 
  
  // REGULAR (Verde)
  if (popularidad >= 60) return 'text-emerald-700 bg-emerald-100'; 
  
  // BAJO (Plomo/Slate)
  return 'text-slate-600 bg-slate-100'; 
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
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Navigation className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Gestión de Rutas
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

      {/* Modal Crear Ruta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800">Crear Nueva Ruta</h3>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Aula Origen</label>
                <select
                  value={newRuta.origen_id || ''}
                  onChange={(e) => setNewRuta({ ...newRuta, origen_id: parseInt(e.target.value) })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                >
                  <option value="">Seleccionar aula origen</option>
                  {aulas.map(aula => (
                    <option key={aula.id_aula} value={aula.id_aula}>
                      {aula.nombre_aula} {aula.ubicacion_interna ? `- ${aula.ubicacion_interna}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Aula Destino</label>
                <select
                  value={newRuta.destino_id || ''}
                  onChange={(e) => setNewRuta({ ...newRuta, destino_id: parseInt(e.target.value) })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                >
                  <option value="">Seleccionar aula destino</option>
                  {aulas.map(aula => (
                    <option key={aula.id_aula} value={aula.id_aula}>
                      {aula.nombre_aula} {aula.ubicacion_interna ? `- ${aula.ubicacion_interna}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Distancia (metros)</label>
                <input
                  type="number"
                  value={newRuta.distancia || ''}
                  onChange={(e) => setNewRuta({ ...newRuta, distancia: parseFloat(e.target.value) || null })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                  placeholder="Ej: 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Tiempo Estimado (minutos)</label>
                <input
                  type="number"
                  value={newRuta.tiempo_estimado || ''}
                  onChange={(e) => setNewRuta({ ...newRuta, tiempo_estimado: parseInt(e.target.value) || null })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                  placeholder="Ej: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Descripción de Ruta Óptima</label>
                <textarea
                  value={newRuta.ruta_optima || ''}
                  onChange={(e) => setNewRuta({ ...newRuta, ruta_optima: e.target.value })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                  placeholder="Descripción de la ruta óptima..."
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetNewRuta();
                }}
                className="px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  if (!newRuta.origen_id || !newRuta.destino_id) {
                    alert('Debes seleccionar origen y destino');
                    return;
                  }

                  const aulaOrigen = aulas.find(a => a.id_aula === newRuta.origen_id);
                  const aulaDestino = aulas.find(a => a.id_aula === newRuta.destino_id);

                  const rutaParaCrear = {
                    origen_id: newRuta.origen_id,
                    destino_id: newRuta.destino_id,
                    coordenadas: {
                      origen: { 
                        lat: aulaOrigen?.latitud || -12.0464, 
                        lng: aulaOrigen?.longitud || -77.0428 
                      },
                      destino: { 
                        lat: aulaDestino?.latitud || -12.0465, 
                        lng: aulaDestino?.longitud || -77.0429 
                      }
                    },
                    distancia: newRuta.distancia || null,
                    tiempo_estimado: newRuta.tiempo_estimado || null,
                    ruta_optima: newRuta.ruta_optima || null,
                    id_usuario: null
                  };

                  try {
                    const { data: rutaData, error: rutaError } = await supabase
                      .from('Ruta')
                      .insert([rutaParaCrear])
                      .select()
                      .single();

                    if (rutaError) throw rutaError;

                    const rutaCreada = { 
                      ...rutaData, 
                      origen: aulaOrigen, 
                      destino: aulaDestino,
                      sincronizado: false 
                    };
                    
                    setRutas([...rutas, rutaCreada]);
                    setShowModal(false);
                    resetNewRuta();
                    alert('Ruta creada exitosamente');
                  } catch (error) {
                    console.error('Error al crear ruta:', error);
                    alert('Error al crear la ruta. Verifica tu conexión.');
                  }
                }}
                className="px-4 py-2 bg-[#00B9F1] text-white rounded-lg hover:bg-[#0099CC] transition-colors"
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

      {/* Panel de Asignación Automática */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-800">Asignación Automática de Rutas</h3>
      </div>
      <p className="text-slate-600 text-sm mb-4">
        El sistema puede asignar rutas automáticamente basándose en los horarios de clases programados
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => setShowAsignacionModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
        >
          <Zap className="w-4 h-4 mr-2" />
          Asignar desde Horarios
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-all">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Reglas
        </button>
      </div>
    </div>
    <div className="bg-white rounded-lg px-4 py-2 border-2 border-blue-300">
      <div className="text-center">
        <p className="text-sm text-slate-600">Asignadas Hoy</p>
        <p className="text-2xl font-bold text-blue-600">{rutasAsignadasHoy}</p>
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
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
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
        
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-[#00B9F1] mx-auto mb-4 animate-spin" />
            <p className="text-slate-600 font-medium">Cargando rutas...</p>
          </div>
        ) : rutasFiltradas.length > 0 ? (
          <div className="space-y-4">
            {rutasFiltradas.map((ruta) => {
              const origenNombre = ruta.origen?.nombre_aula || 'Origen desconocido';
              const destinoNombre = ruta.destino?.nombre_aula || 'Destino desconocido';
              const nombreRuta = `${origenNombre} → ${destinoNombre}`;
              const popularidad = Math.min(100, Math.floor((ruta.distancia || 0) / 2));
              
              return (
                <div
                  key={ruta.id_ruta}
                  className="p-6 border-l-4 rounded-xl bg-blue-50 border-blue-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-800">{nombreRuta}</h4>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                          Activa
                        </span>
                        <span
                          className={`px-3 py-1 ${getPopularidadColor(popularidad)} text-xs font-semibold rounded-full`}
                        >
                          {popularidad}% popularidad
                        </span>
                        {!ruta.sincronizado && (
                          <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Sin sincronizar
                          </span>
                        )}
                      </div>

                      {/* Barra de popularidad */}
                      {/* Barra de popularidad */}
<div className="flex items-center gap-4 mb-3">
    {/* Fondo de la barra: Plomo ligero */}
    <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-xs overflow-hidden"> 
        {/* Barra de progreso con color dinámico */}
        <div
            className={`h-full ${
                popularidad >= 80
                    ? "bg-sky-600" // BUENO: Celeste
                    : popularidad >= 60
                    ? "bg-emerald-500" // REGULAR: Verde
                    : "bg-slate-500" // BAJO: Plomo/Slate
            } transition-all`}
            style={{ width: `${popularidad}%` }}
        ></div>
    </div>
    {/* Aquí irá el Tag de Popularidad */}
</div>

                      {/* Información de la ruta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Desde:</span>
                          <span>{origenNombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="font-medium">Hasta:</span>
                          <span>{destinoNombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>
                            {ruta.tiempo_estimado || "-"} min • {ruta.distancia || "-"}m
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>{ruta.origen?.ubicacion_interna || "N/A"}</span>
                        </div>
                      </div>

                      {ruta.ruta_optima && (
                        <div className="mb-2 text-sm text-slate-600">
                          <span className="font-medium">Ruta óptima:</span> {ruta.ruta_optima}
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-slate-600 hover:text-[#00B9F1] hover:bg-[#00B9F1]/10 rounded-lg transition-colors"
                        title="Ver en mapa"
                      >
                        <Map className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRuta(ruta);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-slate-600 hover:text-[#00B9F1] hover:bg-[#00B9F1]/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRuta(ruta);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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

      {/* Modal de edición */}
      {showEditModal && selectedRuta && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800">Editar Ruta</h3>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Aula Origen</label>
                <select
                  value={selectedRuta.origen_id}
                  onChange={(e) => setSelectedRuta({ ...selectedRuta, origen_id: parseInt(e.target.value) })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                >
                  {aulas.map(aula => (
                    <option key={aula.id_aula} value={aula.id_aula}>
                      {aula.nombre_aula} {aula.ubicacion_interna ? `- ${aula.ubicacion_interna}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Aula Destino</label>
                <select
                  value={selectedRuta.destino_id}
                  onChange={(e) => setSelectedRuta({ ...selectedRuta, destino_id: parseInt(e.target.value) })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                >
                  {aulas.map(aula => (
                    <option key={aula.id_aula} value={aula.id_aula}>
                      {aula.nombre_aula} {aula.ubicacion_interna ? `- ${aula.ubicacion_interna}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Distancia (metros)</label>
                <input
                  type="number"
                  value={selectedRuta.distancia || ''}
                  onChange={(e) => setSelectedRuta({ ...selectedRuta, distancia: parseFloat(e.target.value) || null })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Tiempo Estimado (minutos)</label>
                <input
                  type="number"
                  value={selectedRuta.tiempo_estimado || ''}
                  onChange={(e) => setSelectedRuta({ ...selectedRuta, tiempo_estimado: parseInt(e.target.value) || null })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Descripción de Ruta Óptima</label>
                <textarea
                  value={selectedRuta.ruta_optima || ''}
                  onChange={(e) => setSelectedRuta({ ...selectedRuta, ruta_optima: e.target.value })}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedRuta(null);
                }}
                className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-black transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!selectedRuta) return;

                  try {
                    const { data: rutaData, error: rutaError } = await supabase
                      .from('Ruta')
                      .update({
                        origen_id: selectedRuta.origen_id,
                        destino_id: selectedRuta.destino_id,
                        distancia: selectedRuta.distancia,
                        tiempo_estimado: selectedRuta.tiempo_estimado,
                        ruta_optima: selectedRuta.ruta_optima,
                      })
                      .eq('id_ruta', selectedRuta.id_ruta)
                      .select()
                      .single();

                    if (rutaError) throw rutaError;

                    const aulaOrigen = aulas.find(a => a.id_aula === selectedRuta.origen_id);
                    const aulaDestino = aulas.find(a => a.id_aula === selectedRuta.destino_id);
                    
                    setRutas(rutas.map(r => r.id_ruta === selectedRuta.id_ruta ? { ...rutaData, origen: aulaOrigen, destino: aulaDestino, sincronizado: false } : r));
                    setShowEditModal(false);
                    setSelectedRuta(null);
                    alert('Ruta actualizada exitosamente');
                  } catch (error) {
                    console.error('Error al actualizar ruta:', error);
                    alert('Error al actualizar la ruta. Verifica tu conexión.');
                  }
                }}
                className="px-4 py-2 bg-[#00B9F1] text-white rounded-lg hover:bg-[#0099CC] transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && selectedRuta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-800">Confirmar eliminación</h3>
            <p className="mt-2 text-slate-600">
              ¿Deseas eliminar la ruta de {selectedRuta.origen?.nombre_aula} a {selectedRuta.destino?.nombre_aula}?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRuta(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!selectedRuta) return;

                  try {
                    const { error: deleteError } = await supabase
                      .from('Ruta')
                      .delete()
                      .eq('id_ruta', selectedRuta.id_ruta);

                    if (deleteError) throw deleteError;

                    setRutas(rutas.filter(r => r.id_ruta !== selectedRuta.id_ruta));
                    setShowDeleteModal(false);
                    setSelectedRuta(null);
                    alert('Ruta eliminada exitosamente');
                  } catch (error) {
                    console.error('Error al eliminar ruta:', error);
                    alert('Error al eliminar la ruta. Verifica tu conexión.');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Asignación Automática */}
      {showAsignacionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">Asignación Automática</h3>
                </div>
                <button 
                  onClick={() => setShowAsignacionModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
              <p className="text-slate-600 text-sm mt-2">
                Selecciona los horarios para generar rutas automáticamente
              </p>
            </div>
            <div className="p-6 space-y-3">
              {horarios.length > 0 ? (
                horarios.map(horario => {
                  const horaInicio = new Date(horario.hora_inicio).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
                  const horaFin = new Date(horario.hora_fin).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={horario.id_horario} className="p-4 border border-slate-200 rounded-xl hover:border-[#00B9F1] hover:bg-blue-50 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{horario.curso}</p>
                          <p className="text-sm text-slate-600">
                            {horario.aula?.nombre_aula || 'Sin aula'} • {horaInicio} - {horaFin}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{horario.dia_semana}</p>
                        </div>
                        <button
                          onClick={async () => {
                            const nueva = await asignarRutaAutomatica(horario);
                            if (nueva) {
                              alert(`Ruta creada: ${nueva.origen?.nombre_aula} → ${nueva.destino?.nombre_aula}`);
                            }
                            setShowAsignacionModal(false);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                        >
                          Asignar Ruta
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No hay horarios disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}