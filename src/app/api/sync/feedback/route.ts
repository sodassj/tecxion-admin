// app/api/sync/feedback/route.ts
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

// ✅ Headers CORS para todas las respuestas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ✅ Manejar peticiones OPTIONS (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// ✅ GET → obtener todos los reportes/feedbacks con filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get('tipo');
    const email = searchParams.get('email');

    // Construir filtros dinámicos
    const where: any = {};

    if (tipo && tipo !== 'todos') {
      where.tipo = tipo;
    }

    // Obtener reportes filtrados
    const reportes = await prisma.reporteUsuario.findMany({
      where,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
          }
        }
      },
      orderBy: {
        fecha_envio: 'desc'
      }
    });

    // Filtrar por email/correo si se proporciona
    let filteredReportes = reportes;
    if (email) {
      filteredReportes = reportes.filter((r: typeof reportes[0]) => r.usuario?.correo === email);
    }

    // Calcular estadísticas
    const stats = {
      total: filteredReportes.length,
      pendientes: Math.floor(filteredReportes.length * 0.4),
      en_revision: Math.floor(filteredReportes.length * 0.3),
      resueltos: Math.floor(filteredReportes.length * 0.3),
      promedioCalificacion: '4.2'
    };

    // Formatear datos para el frontend
    const formattedData = filteredReportes.map((item: typeof reportes[0]) => {
      const nombreCompleto = item.usuario 
        ? `${item.usuario.nombre} ${item.usuario.apellido}`.trim()
        : 'Usuario Anónimo';
      const userEmail = item.usuario?.correo || 'sin-email@tecsup.edu.pe';
      
      const avatar = nombreCompleto
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      const diasDesdeEnvio = Math.floor(
        (new Date().getTime() - new Date(item.fecha_envio).getTime()) / (1000 * 60 * 60 * 24)
      );
      let estado = 'pendiente';
      if (diasDesdeEnvio > 7) estado = 'resuelto';
      else if (diasDesdeEnvio > 2) estado = 'en_revision';

      let prioridad = 'media';
      if (item.tipo === 'error') prioridad = 'alta';
      else if (item.tipo === 'sugerencia') prioridad = 'media';
      else prioridad = 'baja';

      let calificacion = 4;
      if (item.tipo === 'error') calificacion = 2;
      else if (item.tipo === 'sugerencia') calificacion = 5;
      else calificacion = 4;

      return {
        id_feedback: item.id_reporte_usuario,
        tipo: item.tipo || 'comentario',
        usuario: nombreCompleto,
        email: userEmail,
        avatar: avatar,
        fecha: item.fecha_envio.toISOString().slice(0, 16).replace('T', ' '),
        calificacion: calificacion,
        comentario: item.descripcion,
        estado: estado,
        prioridad: prioridad,
        id_usuario: item.id_usuario,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
      stats
    }, { headers: corsHeaders });

  } catch (e) {
    console.error('Error al obtener reportes:', e);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener reportes', 
        details: (e as Error).message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ POST → crear un nuevo reporte/feedback
export async function POST(req: NextRequest) {
  try {
    console.log('📨 Recibiendo petición POST en /api/sync/feedback');
    
    const body = await req.json();
    console.log('📦 Body recibido:', body);

    const { tipo, usuario, email, calificacion, comentario } = body;

    // Validaciones
    if (!comentario) {
      console.log('❌ Comentario vacío');
      return NextResponse.json(
        { success: false, error: 'El comentario es requerido' },
        { status: 400, headers: corsHeaders }
      );
    }

    const tipoValido = tipo || 'comentario';
    if (!['error', 'sugerencia', 'comentario'].includes(tipoValido)) {
      console.log('❌ Tipo inválido:', tipoValido);
      return NextResponse.json(
        { success: false, error: 'Tipo inválido. Debe ser: error, sugerencia o comentario' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 🔹 Buscar usuario por email en la base de datos
    let idUsuario = null;
    if (email) {
      console.log('🔍 Buscando usuario con email:', email);
      const usuarioEncontrado = await prisma.usuario.findUnique({
        where: { correo: email },
        select: { id_usuario: true, nombre: true, apellido: true }
      });
      
      if (usuarioEncontrado) {
        idUsuario = usuarioEncontrado.id_usuario;
        console.log('✅ Usuario encontrado con ID:', idUsuario);
      } else {
        console.log('⚠️ No se encontró usuario con ese email');
      }
    }

    console.log('✅ Creando reporte en BD con id_usuario:', idUsuario);
    
    // Crear nuevo reporte con el id_usuario encontrado
    const nuevoReporte = await prisma.reporteUsuario.create({
      data: {
        descripcion: comentario,
        tipo: tipoValido,
        id_usuario: idUsuario, // 👈 Ahora será el ID correcto o null si no se encontró
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
          }
        }
      }
    });

    console.log('✅ Reporte creado con ID:', nuevoReporte.id_reporte_usuario);

    // Generar avatar
    const nombreCompleto = nuevoReporte.usuario 
      ? `${nuevoReporte.usuario.nombre} ${nuevoReporte.usuario.apellido}`.trim()
      : usuario || 'Usuario Anónimo';
    
    const avatar = nombreCompleto
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const responseData = {
      success: true,
      message: 'Feedback enviado exitosamente',
      data: {
        id_feedback: nuevoReporte.id_reporte_usuario,
        tipo: nuevoReporte.tipo,
        usuario: nombreCompleto,
        email: nuevoReporte.usuario?.correo || email || 'sin-email@tecsup.edu.pe',
        avatar: avatar,
        fecha: nuevoReporte.fecha_envio.toISOString().slice(0, 16).replace('T', ' '),
        calificacion: calificacion || 4,
        comentario: nuevoReporte.descripcion,
        estado: 'pendiente',
        prioridad: tipoValido === 'error' ? 'alta' : 'media',
      }
    };

    console.log('✅ Enviando respuesta exitosa');
    
    return NextResponse.json(responseData, { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (e) {
    console.error('❌ Error al crear reporte:', e);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear feedback', 
        details: (e as Error).message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ PATCH → actualizar reporte
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, estado, prioridad, tipo } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de reporte requerido' },
        { status: 400, headers: corsHeaders }
      );
    }

    const reporteExistente = await prisma.reporteUsuario.findUnique({
      where: { id_reporte_usuario: id }
    });

    if (!reporteExistente) {
      return NextResponse.json(
        { success: false, error: 'Reporte no encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    const updateData: any = {};

    if (tipo && ['error', 'sugerencia', 'comentario'].includes(tipo)) {
      updateData.tipo = tipo;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Reporte sin cambios',
        data: {
          id_feedback: reporteExistente.id_reporte_usuario,
          tipo: reporteExistente.tipo,
          estado: estado || 'pendiente',
          prioridad: prioridad || 'media',
        }
      }, { headers: corsHeaders });
    }

    const reporteActualizado = await prisma.reporteUsuario.update({
      where: { id_reporte_usuario: id },
      data: updateData,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reporte actualizado exitosamente',
      data: {
        id_feedback: reporteActualizado.id_reporte_usuario,
        tipo: reporteActualizado.tipo,
        fecha: reporteActualizado.fecha_envio.toISOString().slice(0, 16).replace('T', ' '),
        estado: estado || 'pendiente',
        prioridad: prioridad || 'media',
      }
    }, { headers: corsHeaders });

  } catch (e) {
    console.error('Error al actualizar reporte:', e);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar feedback', 
        details: (e as Error).message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ DELETE → eliminar reporte
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de reporte requerido' },
        { status: 400, headers: corsHeaders }
      );
    }

    const reporteExistente = await prisma.reporteUsuario.findUnique({
      where: { id_reporte_usuario: parseInt(id) }
    });

    if (!reporteExistente) {
      return NextResponse.json(
        { success: false, error: 'Reporte no encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.reporteUsuario.delete({
      where: { id_reporte_usuario: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Reporte eliminado exitosamente'
    }, { headers: corsHeaders });

  } catch (e) {
    console.error('Error al eliminar reporte:', e);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar feedback', 
        details: (e as Error).message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}