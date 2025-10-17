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

// PUT: actualizar ruta
export async function PUT(req: NextRequest, context: any) {
  const id = Number(context.params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const data = await req.json();

    if (!data.nombre || !data.descripcion) {
      return NextResponse.json(
        { error: 'Nombre y descripción son obligatorios' },
        { status: 400 }
      );
    }

    const updated = await prisma.ruta.update({
      where: { id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        sincronizado: false,
      },
    });

    return NextResponse.json({ ruta: updated });
  } catch (e) {
    return NextResponse.json(
      { error: 'Ruta no encontrada o error', details: (e as Error).message },
      { status: 400 }
    );
  }
}

// DELETE: eliminar ruta
export async function DELETE(req: NextRequest, context: any) {
  const id = Number(context.params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await prisma.ruta.delete({ where: { id } });
    return NextResponse.json({ message: 'Ruta eliminada' });
  } catch (e) {
    return NextResponse.json(
      { error: 'Ruta no encontrada o error', details: (e as Error).message },
      { status: 400 }
    );
  }
}
