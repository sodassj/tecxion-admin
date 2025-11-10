/*
  Warnings:

  - You are about to alter the column `latitud` on the `Aula` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.
  - You are about to alter the column `longitud` on the `Aula` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.
  - You are about to alter the column `latitud` on the `Departamento` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.
  - You are about to alter the column `longitud` on the `Departamento` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.
  - You are about to alter the column `distancia` on the `Ruta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the column `contrasena` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario_has_Roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[firebase_uid]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebase_uid` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Usuario_has_Roles" DROP CONSTRAINT "Usuario_has_Roles_id_roles_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario_has_Roles" DROP CONSTRAINT "Usuario_has_Roles_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Aula" ALTER COLUMN "latitud" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitud" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Departamento" ALTER COLUMN "latitud" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitud" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Ruta" ALTER COLUMN "distancia" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "contrasena",
ADD COLUMN     "firebase_uid" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Roles";

-- DropTable
DROP TABLE "public"."Usuario_has_Roles";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebase_uid_key" ON "Usuario"("firebase_uid");
