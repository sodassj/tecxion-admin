import { NextRequest, NextResponse } from 'next/server';

// Datos de ejemplo (puedes reemplazar con tu base de datos)
let rutas = [
  { id: 1, nombre: 'Ruta A', descripcion: 'Descripción A' },
  { id: 2, nombre: 'Ruta B', descripcion: 'Descripción B' },
];

// GET: Obtener todas las rutas
export async function GET(req: NextRequest) {
  return NextResponse.json(rutas);
}

// POST: Agregar una nueva ruta
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const nuevaRuta = { id: rutas.length + 1, ...data };
    rutas.push(nuevaRuta);
    return NextResponse.json({ message: 'Ruta agregada', ruta: nuevaRuta });
  } catch (error) {
    return NextResponse.json({ error: 'Error al agregar la ruta' }, { status: 400 });
  }
}
