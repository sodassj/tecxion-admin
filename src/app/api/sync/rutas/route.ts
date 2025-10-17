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
    const rutas = await prisma.ruta.findMany();
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

    if (!data.nombre || !data.descripcion) {
      return NextResponse.json(
        { error: 'Nombre y descripción son obligatorios' },
        { status: 400 }
      );
    }

    const nueva = await prisma.ruta.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
      },
    });

    return NextResponse.json({ ruta: nueva });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error creando ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}
