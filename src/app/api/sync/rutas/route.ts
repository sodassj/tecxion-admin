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

// GET: obtener todas las rutas
export async function GET() {
  try {
    const rutas = await prisma.ruta.findMany({
      include: {
        origen: {
          select: { id_aula: true, nombre_aula: true },
        },
        destino: {
          select: { id_aula: true, nombre_aula: true },
        },
      },
    });

    return NextResponse.json(rutas);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al obtener rutas', details: (e as Error).message },
      { status: 500 }
    );
  }
}

// POST: crear una nueva ruta
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Soporte para { ruta: {...} } o [{...}]
    const rutas = Array.isArray(data)
      ? data
      : data.ruta
      ? [data.ruta]
      : [data];

    // Validación mínima
    for (const ruta of rutas) {
      if (!ruta.origen_id || !ruta.destino_id || !ruta.coordenadas) {
        return NextResponse.json(
          { error: 'origen_id, destino_id y coordenadas son obligatorios' },
          { status: 400 }
        );
      }
    }

    // Crear rutas con createMany
    const result = await prisma.ruta.createMany({
      data: rutas.map(r => ({
        origen_id: r.origen_id,
        destino_id: r.destino_id,
        coordenadas: r.coordenadas,
        distancia: r.distancia || null,
        tiempo_estimado: r.tiempo_estimado || null,
        ruta_optima: r.ruta_optima || null,
        id_usuario: r.id_usuario || null,
      })),
    });

    // Obtener la última ruta creada con nombres de origen y destino
    const ultimaRuta = await prisma.ruta.findFirst({
      orderBy: { id_ruta: 'desc' },
      include: {
        origen: {
          select: { id_aula: true, nombre_aula: true },
        },
        destino: {
          select: { id_aula: true, nombre_aula: true },
        },
      },
    });

    return NextResponse.json({ rutasCreadas: result.count, ruta: ultimaRuta });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error creando ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}