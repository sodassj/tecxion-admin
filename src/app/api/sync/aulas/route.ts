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

export async function GET() {
  try {
    const aulas = await prisma.aula.findMany({
      include: {
        departamento: true
      }
    });
    return NextResponse.json(aulas);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error al obtener aulas', details: (e as Error).message },
      { status: 500 }
    );
  }
}