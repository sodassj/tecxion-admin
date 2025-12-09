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
    const rutasConCoordenadas = rutas.map((r: any & { origen: any; destino: any }) => {
  let coords = r.coordenadas;

  if (!coords || coords.length === 0) {
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

    const rutasParaGuardar = [];

    for (const ruta of rutas) {
      if (!ruta.origen_id || !ruta.destino_id) {
        return NextResponse.json(
          { error: 'origen_id y destino_id son obligatorios' },
          { status: 400 }
        );
      }

      // 🔹 Si no vienen coordenadas, generar desde IDs de aulas
      let coords = ruta.coordenadas;
      if (!coords || coords.length === 0) {
        const origenAula = await prisma.aula.findUnique({ where: { id_aula: ruta.origen_id } });
        const destinoAula = await prisma.aula.findUnique({ where: { id_aula: ruta.destino_id } });

        if (origenAula && destinoAula) {
          coords = [
            { lat: origenAula.latitud, lng: origenAula.longitud },
            { lat: destinoAula.latitud, lng: destinoAula.longitud },
          ];
        } else {
          coords = [];
        }
      }

      rutasParaGuardar.push({
        origen_id: ruta.origen_id,
        destino_id: ruta.destino_id,
        coordenadas: coords,
        distancia: ruta.distancia || null,
        tiempo_estimado: ruta.tiempo_estimado || null,
        ruta_optima: ruta.ruta_optima || null,
        id_usuario: ruta.id_usuario || null,
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
    if (ultimaRuta && (!ultimaRuta.coordenadas || ultimaRuta.coordenadas.length === 0)) {
      ultimaRuta.coordenadas = [
        { lat: ultimaRuta.origen.latitud, lng: ultimaRuta.origen.longitud },
        { lat: ultimaRuta.destino.latitud, lng: ultimaRuta.destino.longitud },
      ];
    }

    return NextResponse.json({ rutasCreadas: result.count, ruta: ultimaRuta });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error creando ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}
