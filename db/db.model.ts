import { hashCode } from "@/app/lib/utils/core";
import { StandaloneQuestion } from "@/classes/standalone-question";
import Dexie, { Table, Transaction } from "dexie";

export interface AppSettings {
  name: string;
  value: any;
}

export enum AppSetting {
  ShowCorrectAlternatives = "showCorrectAlternatives",
  ShowAnsweredQuestionsOnly = "showAnsweredQuestionsOnly",
  CurrentQuestion = "currentQuestion",
}

export class DB extends Dexie {
  // table name is student
  questions!: Table<StandaloneQuestion>;
  settings!: Table<AppSettings>;
  constructor() {
    super("simuladosDatabase");
    this.version(11).stores({
      questions:
        "++id, command, alternatives, answers, checkedAlternatives, questionSetId, authorId", // Primary key and indexed props
      settings: "++name, value",
    });
    this.on("populate", async (tx: Transaction) => {
      await tx.table("settings").bulkAdd([
        { name: AppSetting.CurrentQuestion, value: 0 },
        { name: AppSetting.ShowCorrectAlternatives, value: true },
        { name: AppSetting.ShowAnsweredQuestionsOnly, value: false },
      ]);
    });
  }
}

const db = new DB();

// Convert pre-hashed alternatives to hashed alternatives.
if (global?.indexedDB) {
  db.questions.toArray().then(async (questions) => {
    if (questions.length && !questions[0].alternatives[0]?.hash) {
      const hashedQuestions = questions.map((q: any) => {
        q.alternatives = q.alternatives.map((a: string) => {
          return { label: a, hash: hashCode(a) };
        });
        q.answers = q.answers.map((a: number) => {
          return q.alternatives[a].hash;
        });
        q.checkedAlternatives = q.checkedAlternatives.map((ca: number) => {
          return q.alternatives[ca].hash;
        });
        return q as StandaloneQuestion;
      });
      await db.questions.clear();
      await db.questions.bulkAdd(hashedQuestions);
    }
  });
}

export { db }; // export the db
