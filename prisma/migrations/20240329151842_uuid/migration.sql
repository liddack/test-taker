/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `QuestionSet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_questionSetId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "questionSetId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Question_id_seq";

-- AlterTable
ALTER TABLE "QuestionSet" DROP CONSTRAINT "QuestionSet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "QuestionSet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "QuestionSet_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "QuestionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
