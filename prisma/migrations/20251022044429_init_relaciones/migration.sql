/*
  Warnings:

  - You are about to drop the column `id_aula` on the `Ruta` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Ruta" DROP CONSTRAINT "Ruta_id_aula_fkey";

-- AlterTable
ALTER TABLE "Ruta" DROP COLUMN "id_aula";

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_origen_id_fkey" FOREIGN KEY ("origen_id") REFERENCES "Aula"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "Aula"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;
