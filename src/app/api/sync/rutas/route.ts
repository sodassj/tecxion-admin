import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// 🔥 Tipo corregido para coincidir con Prisma
type RutaConRelaciones = {
  id_ruta: number;
  origen_id: number;
  destino_id: number;
  coordenadas: any;
  distancia: number | null;
  tiempo_estimado: number | null;
  ruta_optima: string | null;
  id_usuario?: number | null;
  origen: { 
    id_aula: number; 
    nombre_aula: string; 
    latitud: number | null;  // 🔥 Cambiado a null
    longitud: number | null; // 🔥 Cambiado a null
  };
  destino: { 
    id_aula: number; 
    nombre_aula: string; 
    latitud: number | null;  // 🔥 Cambiado a null
    longitud: number | null; // 🔥 Cambiado a null
  };
};

// 🔥 Función para normalizar coordenadas a formato array
function normalizarCoordenadas(coordenadas: any, origen: any, destino: any): { lat: number; lng: number }[] {
  // Caso 1: Ya es un array válido
  if (Array.isArray(coordenadas) && coordenadas.length > 0) {
    return coordenadas.map(c => ({
      lat: c.lat ?? 0,
      lng: c.lng ?? 0
    }));
  }

  // Caso 2: Es un objeto con formato {origen: {...}, destino: {...}}
  if (coordenadas && typeof coordenadas === 'object' && coordenadas.origen && coordenadas.destino) {
    return [
      { lat: coordenadas.origen.lat ?? 0, lng: coordenadas.origen.lng ?? 0 },
      { lat: coordenadas.destino.lat ?? 0, lng: coordenadas.destino.lng ?? 0 }
    ];
  }

  // Caso 3: Coordenadas vacías o null → usar las aulas
  return [
    { lat: origen.latitud ?? 0, lng: origen.longitud ?? 0 },
    { lat: destino.latitud ?? 0, lng: destino.longitud ?? 0 }
  ];
}

// 🔹 GET: obtener todas las rutas con coordenadas como array
export async function GET() {
  try {
    const rutas = await prisma.ruta.findMany({
      include: {
        origen: { select: { id_aula: true, nombre_aula: true, latitud: true, longitud: true } },
        destino: { select: { id_aula: true, nombre_aula: true, latitud: true, longitud: true } },
      },
    });

    // 🔥 Mapear con el tipo correcto
    const rutasNormalizadas = rutas.map((r: typeof rutas[0]) => ({
      ...r,
      coordenadas: normalizarCoordenadas(r.coordenadas, r.origen, r.destino)
    }));

    return NextResponse.json(rutasNormalizadas);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al obtener rutas', details: (e as Error).message },
      { status: 500 }
    );
  }
}

// 🔹 POST: crear una nueva ruta con coordenadas como array
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const rutas = Array.isArray(data) ? data : data.ruta ? [data.ruta] : [data];

    const rutasParaGuardar: {
      origen_id: number;
      destino_id: number;
      coordenadas: { lat: number; lng: number }[];
      distancia: number | null;
      tiempo_estimado: number | null;
      ruta_optima: string | null;
      id_usuario?: number | null;
    }[] = [];

    for (const ruta of rutas) {
      if (!ruta.origen_id || !ruta.destino_id) {
        return NextResponse.json(
          { error: 'origen_id y destino_id son obligatorios' },
          { status: 400 }
        );
      }

      let coords: { lat: number; lng: number }[] = [];

      // 🔥 Detectar si viene en formato objeto anidado
      if (ruta.coordenadas && typeof ruta.coordenadas === 'object' && ruta.coordenadas.origen && ruta.coordenadas.destino) {
        coords = [
          { lat: ruta.coordenadas.origen.lat, lng: ruta.coordenadas.origen.lng },
          { lat: ruta.coordenadas.destino.lat, lng: ruta.coordenadas.destino.lng }
        ];
      }
      // Si ya viene como array
      else if (Array.isArray(ruta.coordenadas) && ruta.coordenadas.length > 0) {
        coords = ruta.coordenadas;
      }
      // Si no hay coordenadas, buscar desde aulas
      else {
        const origenAula = await prisma.aula.findUnique({ where: { id_aula: ruta.origen_id } });
        const destinoAula = await prisma.aula.findUnique({ where: { id_aula: ruta.destino_id } });

        if (origenAula && destinoAula) {
          coords = [
            { lat: origenAula.latitud ?? 0, lng: origenAula.longitud ?? 0 },
            { lat: destinoAula.latitud ?? 0, lng: destinoAula.longitud ?? 0 },
          ];
        }
      }

      rutasParaGuardar.push({
        origen_id: ruta.origen_id,
        destino_id: ruta.destino_id,
        coordenadas: coords, // 🔥 Siempre se guarda como array
        distancia: ruta.distancia ?? null,
        tiempo_estimado: ruta.tiempo_estimado ?? null,
        ruta_optima: ruta.ruta_optima ?? null,
        id_usuario: ruta.id_usuario ?? null,
      });
    }

    const result = await prisma.ruta.createMany({
      data: rutasParaGuardar,
    });

    const ultimaRuta = await prisma.ruta.findFirst({
      orderBy: { id_ruta: 'desc' },
      include: {
        origen: { select: { id_aula: true, nombre_aula: true, latitud: true, longitud: true } },
        destino: { select: { id_aula: true, nombre_aula: true, latitud: true, longitud: true } },
      },
    });

    if (ultimaRuta) {
      ultimaRuta.coordenadas = normalizarCoordenadas(
        ultimaRuta.coordenadas,
        ultimaRuta.origen,
        ultimaRuta.destino
      );
    }

    return NextResponse.json({ rutasCreadas: result.count, ruta: ultimaRuta });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error creando ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}