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

// ✅ PUT: actualizar una ruta existente
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const routeId = Number(params.id);

  if (isNaN(routeId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const data = await req.json();

    const updated = await prisma.ruta.update({
      where: { id_ruta: routeId },
      data: {
        origen_id: data.origen_id ?? undefined,
        destino_id: data.destino_id ?? undefined,
        coordenadas: data.coordenadas ?? undefined,
        distancia: data.distancia ?? undefined,
        tiempo_estimado: data.tiempo_estimado ?? undefined,
        ruta_optima: data.ruta_optima ?? undefined,
        id_usuario: data.id_usuario ?? undefined,
      },
    });

    return NextResponse.json({ ruta: updated });
  } catch (e) {
    console.error('❌ Error al actualizar la ruta:', e);
    return NextResponse.json(
      { error: 'Error al actualizar la ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}

// ✅ DELETE: eliminar una ruta por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const routeId = Number(params.id);

  if (isNaN(routeId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await prisma.ruta.delete({ where: { id_ruta: routeId } });
    return NextResponse.json({ message: `Ruta ${params.id} eliminada correctamente` });
  } catch (e) {
    console.error('❌ Error al eliminar la ruta:', e);
    return NextResponse.json(
      { error: 'Error al eliminar la ruta', details: (e as Error).message },
      { status: 400 }
    );
  }
}
