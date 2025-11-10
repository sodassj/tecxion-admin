-- CreateTable
CREATE TABLE "Roles" (
    "id_roles" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_roles")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "carrera" TEXT,
    "seccion" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Usuario_has_Roles" (
    "id_usuario" INTEGER NOT NULL,
    "id_roles" INTEGER NOT NULL,

    CONSTRAINT "Usuario_has_Roles_pkey" PRIMARY KEY ("id_usuario","id_roles")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id_edificio" SERIAL NOT NULL,
    "nombre_edificio" TEXT NOT NULL,
    "ubicacion" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id_edificio")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id_aula" SERIAL NOT NULL,
    "nombre_aula" TEXT NOT NULL,
    "ubicacion_interna" TEXT,
    "id_edificio" INTEGER,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id_horario" SERIAL NOT NULL,
    "curso" TEXT NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,
    "dia_semana" TEXT NOT NULL,
    "id_usuario" INTEGER,
    "id_aula" INTEGER,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "id_ruta" SERIAL NOT NULL,
    "origen_id" INTEGER NOT NULL,
    "destino_id" INTEGER NOT NULL,
    "coordenadas" JSONB NOT NULL,
    "distancia" DECIMAL(10,2),
    "tiempo_estimado" INTEGER,
    "ruta_optima" TEXT,
    "id_usuario" INTEGER,
    "id_aula" INTEGER,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id_ruta")
);

-- CreateTable
CREATE TABLE "ReporteUsuario" (
    "id_reporte_usuario" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER,

    CONSTRAINT "ReporteUsuario_pkey" PRIMARY KEY ("id_reporte_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Usuario_has_Roles" ADD CONSTRAINT "Usuario_has_Roles_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_has_Roles" ADD CONSTRAINT "Usuario_has_Roles_id_roles_fkey" FOREIGN KEY ("id_roles") REFERENCES "Roles"("id_roles") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_id_edificio_fkey" FOREIGN KEY ("id_edificio") REFERENCES "Departamento"("id_edificio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "Aula"("id_aula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "Aula"("id_aula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteUsuario" ADD CONSTRAINT "ReporteUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
