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

// Función auxiliar para obtener el id desde la URL
function getIdFromReq(req: NextRequest): number {
  // /api/sync/horarios/[id] → extraemos [id] de la URL
  const urlParts = req.nextUrl.pathname.split('/');
  const idStr = urlParts[urlParts.length - 1];
  return parseInt(idStr);
}

// ✅ GET → obtener un horario por ID
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const id = getIdFromReq(req);
    const horario = await prisma.horario.findUnique({
      where: { id_horario: id },
      include: {
        aula: { include: { departamento: true } },
        usuario: true,
      },
    });

    if (!horario) {
      return NextResponse.json({ error: 'Horario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(horario);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al obtener horario', details: (e as Error).message },
      { status: 500 }
    );
  }
}

// ✏️ PUT → actualizar un horario
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const id = getIdFromReq(req);
    const body = await req.json();

    const horarioActualizado = await prisma.horario.update({
      where: { id_horario: id },
      data: {
        curso: body.curso,
        hora_inicio: new Date(body.hora_inicio),
        hora_fin: new Date(body.hora_fin),
        dia_semana: body.dia_semana,
        id_usuario: body.id_usuario,
        id_aula: body.id_aula,
      },
    });

    return NextResponse.json(horarioActualizado);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al actualizar horario', details: (e as Error).message },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE → eliminar un horario
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const id = getIdFromReq(req);
    await prisma.horario.delete({
      where: { id_horario: id },
    });

    return NextResponse.json({ message: 'Horario eliminado correctamente' });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al eliminar horario', details: (e as Error).message },
      { status: 500 }
    );
  }
}
