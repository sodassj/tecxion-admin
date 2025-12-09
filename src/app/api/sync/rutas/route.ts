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

// Tipo para rutas con relaciones
type RutaConRelaciones = {
  id_ruta: number;
  origen_id: number;
  destino_id: number;
  coordenadas: { lat: number; lng: number }[] | null;
  distancia: number | null;
  tiempo_estimado: number | null;
  ruta_optima: string | null;
  id_usuario?: number | null;
  origen: { id_aula: number; nombre_aula: string; latitud: number; longitud: number };
  destino: { id_aula: number; nombre_aula: string; latitud: number; longitud: number };
};

// 🔹 GET: obtener todas las rutas con coordenadas como array
export async function GET() {
  try {
    const rutas = await prisma.ruta.findMany({
      include: {
        origen: { select: { id_aula: true, nombre_aula: true, latitud: true, longitud: true } },
        destino: { select: { id_aula: true, nombre_aula: true, latitud: true, longitud: true } },
      },
    });

    // Transformar coordenadas para que siempre sean un array de puntos
    const rutasConCoordenadas = rutas.map((r: RutaConRelaciones) => {
      let coords = r.coordenadas ?? [];

      if (coords.length === 0) {
        coords = [
          { lat: r.origen.latitud, lng: r.origen.longitud },
          { lat: r.destino.latitud, lng: r.destino.longitud },
        ];
      }

      return {
        ...r,
        coordenadas: coords,
      };
    });

    return NextResponse.json(rutasConCoordenadas);
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

      // Si no vienen coordenadas, generarlas desde IDs de aulas
      let coords: { lat: number; lng: number }[] = [];

      if (ruta.coordenadas && Array.isArray(ruta.coordenadas) && ruta.coordenadas.length > 0) {
        coords = ruta.coordenadas;
      } else {
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
        coordenadas: coords,
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

    // Asegurarse que coordenadas devueltas sean array
    if (ultimaRuta) {
      const coords =
        ultimaRuta.coordenadas && Array.isArray(ultimaRuta.coordenadas) && ultimaRuta.coordenadas.length > 0
          ? ultimaRuta.coordenadas
          : [
              { lat: ultimaRuta.origen.latitud ?? 0, lng: ultimaRuta.origen.longitud ?? 0 },
              { lat: ultimaRuta.destino.latitud ?? 0, lng: ultimaRuta.destino.longitud ?? 0 },
            ];

      ultimaRuta.coordenadas = coords;
    }

    return NextResponse.json({ rutasCreadas: result.count, ruta: ultimaRuta });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error creando ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}
