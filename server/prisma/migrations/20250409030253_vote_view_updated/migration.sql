/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `View` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `View` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Vote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "View_postId_key";

-- DropIndex
DROP INDEX "View_userId_key";

-- DropIndex
DROP INDEX "Vote_postId_key";

-- DropIndex
DROP INDEX "Vote_userId_key";

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "View_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "View_userId_postId_key" ON "View"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_postId_key" ON "Vote"("userId", "postId");
