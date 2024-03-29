import { ImportedQuestion } from "@/interfaces/imported-question";
import { getRandomUUID } from "@/utils";

export class StandaloneQuestion {
  constructor({ alternatives, command }: ImportedQuestion) {
    this.id = getRandomUUID();
    this.command = command;
    this.alternatives = alternatives.map((a) => a.label);
    this.answers = alternatives.reduce((prev, a, i) => {
      if (a.isCorrect) return [...prev, i];
      return prev;
    }, [] as number[]);
  }

  id?: string;
  command: string | null;
  alternatives: string[];
  answers: number[];
}
