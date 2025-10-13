'use client';
import React, { useState } from 'react';
import { Settings, Shield, Bell, Wifi, MapPin, Database, Globe, Lock, Eye, EyeOff, Save, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ConfigView() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    beaconCalibration: 'auto',
    mapQuality: 'high',
    dataRetention: '90'
  });

  const handleSaveSettings = () => {
    // Simulación de guardado
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-[#00B9F1]" />
            Configuración del Sistema
          </h1>
          <p className="text-slate-600 mt-1">Administra las preferencias y ajustes del sistema TecXion</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="flex items-center px-6 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#00B9F1]/30"
        >
          <Save className="w-5 h-5 mr-2" />
          Guardar Cambios
        </button>
      </div>

      {/* System Status Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Sistema Operativo</h3>
              <p className="text-sm text-green-600">Todos los servicios funcionando correctamente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Online</span>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Configuración General
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <h4 className="font-medium text-slate-800">Backup Automático</h4>
                <p className="text-sm text-slate-600">Respaldo diario de datos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={systemSettings.autoBackup}
                  onChange={(e) => setSystemSettings({...systemSettings, autoBackup: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00B9F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B9F1]"></div>
              </label>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="block mb-2">
                <span className="font-medium text-slate-800">Calidad del Mapa</span>
              </label>
              <select 
                value={systemSettings.mapQuality}
                onChange={(e) => setSystemSettings({...systemSettings, mapQuality: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B9F1] bg-white"
              >
                <option value="low">Baja (Menor consumo)</option>
                <option value="medium">Media (Balanceado)</option>
                <option value="high">Alta (Mejor calidad)</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="block mb-2">
                <span className="font-medium text-slate-800">Calibración de Beacons</span>
              </label>
              <select 
                value={systemSettings.beaconCalibration}
                onChange={(e) => setSystemSettings({...systemSettings, beaconCalibration: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B9F1] bg-white"
              >
                <option value="auto">Automática</option>
                <option value="manual">Manual</option>
                <option value="scheduled">Programada</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="block mb-2">
                <span className="font-medium text-slate-800">Retención de Datos (días)</span>
              </label>
              <input 
                type="number" 
                value={systemSettings.dataRetention}
                onChange={(e) => setSystemSettings({...systemSettings, dataRetention: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B9F1]"
                min="30"
                max="365"
              />
              <p className="text-xs text-slate-500 mt-1">Tiempo que se conservan los datos históricos</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Notificaciones
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Notificaciones Email</h4>
                  <p className="text-sm text-slate-600">Recibe alertas por correo</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00B9F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B9F1]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Notificaciones Push</h4>
                  <p className="text-sm text-slate-600">Alertas en el navegador</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00B9F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B9F1]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">Notificaciones SMS</h4>
                  <p className="text-sm text-slate-600">Alertas por mensaje</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00B9F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B9F1]"></div>
              </label>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">Alertas Críticas</h4>
                  <p className="text-sm text-amber-700">Las alertas del sistema siempre se enviarán independientemente de esta configuración.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security and API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Seguridad
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="block mb-2">
                <span className="font-medium text-slate-800">Clave API</span>
              </label>
              <div className="relative">
                <input 
                  type={showApiKey ? "text" : "password"}
                  value="**************"
                  readOnly
                  className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg bg-white font-mono text-sm"
                />
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Usa esta clave para integrar con APIs externas</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-800">Autenticación de Dos Factores</span>
                <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Activo
                </span>
              </div>
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium">
                Configurar 2FA
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-800 block mb-2">Sesiones Activas</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Windows - Chrome</span>
                  <span className="text-slate-500">Activa ahora</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Android - App móvil</span>
                  <span className="text-slate-500">Hace 2 horas</span>
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                Cerrar todas las sesiones
              </button>
            </div>
          </div>
        </div>

        {/* Beacon Configuration */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <Wifi className="w-5 h-5 mr-2 text-[#00B9F1]" />
            Configuración de Beacons
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-800">Estado General</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">47/50 Activos</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-800 block mb-3">Beacons Inactivos</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-slate-700">Beacon #23 - Edificio C</span>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Offline</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-slate-700">Beacon #31 - Laboratorio</span>
                  </div>
                  <span className="text-xs text-amber-600 font-medium">Batería baja</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-slate-700">Beacon #45 - Cafetería</span>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Offline</span>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00B9F1] hover:bg-[#0099CC] text-white rounded-lg font-medium transition-colors">
              <RefreshCw className="w-5 h-5" />
              Recalibrar Todos los Beacons
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
          <Database className="w-5 h-5 mr-2 text-[#00B9F1]" />
          Configuración Avanzada
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-[#00B9F1]" />
              <span className="font-medium text-slate-800">Servidor API</span>
            </div>
            <p className="text-sm text-slate-600">api.tecxion.tecsup.edu.pe</p>
            <span className="text-xs text-green-600 mt-1 block">● Conectado</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-[#00B9F1]" />
              <span className="font-medium text-slate-800">Base de Datos</span>
            </div>
            <p className="text-sm text-slate-600">PostgreSQL 14.2</p>
            <span className="text-xs text-green-600 mt-1 block">● Operativa</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-[#00B9F1]" />
              <span className="font-medium text-slate-800">Proveedor de Mapas</span>
            </div>
            <p className="text-sm text-slate-600">OpenStreetMap</p>
            <span className="text-xs text-green-600 mt-1 block">● Sincronizado</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Zona de Peligro
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <h4 className="font-medium text-slate-800">Restablecer Configuración</h4>
              <p className="text-sm text-slate-600">Volver a los valores predeterminados del sistema</p>
            </div>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Restablecer
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <h4 className="font-medium text-slate-800">Eliminar Todos los Datos</h4>
              <p className="text-sm text-slate-600">Elimina permanentemente toda la información del sistema</p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}