import { ImportedQuestion } from "@/interfaces/imported-question";
import { getRandomUUID } from "@/utils";
import { Question } from "@prisma/client";

export class StandaloneQuestion implements Question {
  constructor({ alternatives, command }: ImportedQuestion) {
    this.id = getRandomUUID();
    this.command = command;
    this.alternatives = alternatives.map((a) => a.label);
    this.answers = alternatives.reduce((prev, a, i) => {
      if (a.isCorrect) return [...prev, i];
      return prev;
    }, [] as number[]);
    this.questionSetId = null;
    this.authorId = null;
  }

  id: string;
  command: string | null;
  alternatives: string[];
  answers: number[];
  questionSetId: string | null;
  authorId: string | null;
}
