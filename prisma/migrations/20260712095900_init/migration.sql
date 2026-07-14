/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,
    "author" TEXT NOT NULL,
    "publicationYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "publisher" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
