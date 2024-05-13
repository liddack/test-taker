import { getRandomUUID, hashCode } from "@/app/lib/utils/core";
import { ImportedQuestion } from "@/interfaces/imported-question";
import { micromark } from "micromark";

export class StandaloneQuestion {
  constructor({ alternatives, command }: ImportedQuestion) {
    this.id = getRandomUUID();
    this.command = Array.isArray(command) ? command.join("\n") : command;
    this.command = micromark(this.command, "utf-8", {
      allowDangerousHtml: true,
      defaultLineEnding: "\n",
    });
    this.command = this.command.replaceAll("<code>", '<code class="language-abap">');
    this.alternatives = alternatives.map((a) => {
      return { label: a.label, hash: hashCode(a.label) };
    });
    this.answers = alternatives.reduce((prev, a, i) => {
      if (a.isCorrect) return [...prev, i];
      return prev;
    }, [] as number[]);
    this.questionSetId = null;
    this.checkedAlternatives = [];
    this.authorId = null;
  }

  id: string;
  command: string | null;
  alternatives: {
    label: string;
    hash: string | number;
  }[];
  answers: (number | string)[];
  checkedAlternatives: (number | string)[];
  questionSetId: string | null;
  authorId: string | null;
}
