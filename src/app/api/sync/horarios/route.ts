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

// ✅ GET → obtener todos los horarios
export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      include: {
        aula: { include: { departamento: true } },
        usuario: true,
      },
    });
    return NextResponse.json(horarios);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al obtener horarios', details: (e as Error).message },
      { status: 500 }
    );
  }
}

// 🆕 POST → crear un nuevo horario
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const nuevoHorario = await prisma.horario.create({
      data: {
        curso: body.curso,
        hora_inicio: new Date(body.hora_inicio),
        hora_fin: new Date(body.hora_fin),
        dia_semana: body.dia_semana,
        id_usuario: body.id_usuario,
        id_aula: body.id_aula,
      },
    });

    return NextResponse.json(nuevoHorario, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al crear horario', details: (e as Error).message },
      { status: 500 }
    );
  }
}
