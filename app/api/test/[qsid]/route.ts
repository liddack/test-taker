import { prisma } from "@/db";
import { Question } from "@prisma/client";
import { NextResponse } from "next/server";

export type ObfuscatedQuestion = Omit<Question, "answers"> & {
  answerCount: number;
};

export async function GET(_: Request, { params }: { params: { qsid: string } }) {
  const { qsid } = params;
  const questions = await prisma.question.findMany({
    where: {
      questionSetId: Number(qsid),
    },
  });
  const obfuscatedQuestions = questions.map((q): ObfuscatedQuestion => {
    const { answers, ...qst } = q;
    return { ...qst, answerCount: answers.length };
  });
  return NextResponse.json(obfuscatedQuestions);
}
