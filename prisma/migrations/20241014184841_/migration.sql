/*
  Warnings:

  - The `fileSize` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileSize",
ADD COLUMN     "fileSize" INTEGER NOT NULL DEFAULT 0;
