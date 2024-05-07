import { StandaloneQuestion } from "@/classes/standalone-question";

export interface QuestionSet {
  id: string;
  name: string;
  question: StandaloneQuestion[];
}
