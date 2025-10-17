-- CreateTable
CREATE TABLE "Ruta" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "sincronizado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id")
);
