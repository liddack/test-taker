import { ImportedQuestion } from "@/interfaces/imported-question";
import { getRandomUUID } from "@/utils";
import { Question } from "@prisma/client";
import { micromark } from "micromark";

export class StandaloneQuestion implements Question {
  constructor({ alternatives, command }: ImportedQuestion) {
    this.id = getRandomUUID();
    this.command = Array.isArray(command) ? command.join("\n") : command;
    this.command = micromark(this.command, "utf-8", {
      allowDangerousHtml: true,
      defaultLineEnding: "\n",
    });
    this.command = this.command.replaceAll("<code>", '<code class="language-abap">');
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
