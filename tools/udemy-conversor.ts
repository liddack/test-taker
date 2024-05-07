import { readFileSync } from "fs";

export interface UdemyQuestion {
  _class: "assessment";
  id: number;
  assessment_type: string;
  prompt: Prompt;
  correct_response: string[];
  section: string;
  question_plain: string;
  related_lectures: any[];
}

export enum CorrectResponse {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
}

const correctResponseIndex = ["a", "b", "c", "d", "e"];

export interface Prompt {
  question: string;
  answers: string[];
  explanation?: string;
  relatedLectureIds?: string;
  feedbacks?: string[];
}

const original: UdemyQuestion[] = JSON.parse(readFileSync(0, "utf-8"));

interface ImportedAlternative {
  isCorrect: boolean;
  label: string;
}

export interface ImportedQuestion {
  command: string | string[];
  alternatives: ImportedAlternative[];
}

const result: ImportedQuestion[] = [];

for (const q of original) {
  result.push({
    command: q.prompt.question,
    alternatives: q.prompt.answers.map((a, i) => ({
      isCorrect: q.correct_response.includes(correctResponseIndex[i]),
      label: a,
    })),
  });
}

console.log(JSON.stringify(result, null, 2));
