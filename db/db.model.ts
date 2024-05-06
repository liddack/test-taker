import { StandaloneQuestion } from "@/classes/standalone-question";
import Dexie, { Table, Transaction } from "dexie";

export interface AppSettings {
  name: string;
  value: any;
}

export enum AppSetting {
  ShowCorrectAlternatives = "showCorrectAlternatives",
  ShowCorrectAnswersOnly = "showCorrectAnswersOnly",
  CurrentQuestion = "currentQuestion",
}

export class DB extends Dexie {
  // table name is student
  questions!: Table<StandaloneQuestion>;
  settings!: Table<AppSettings>;
  constructor() {
    super("simuladosDatabase");
    this.version(1).stores({
      questions:
        "++id, command, alternatives, answers, checkedAlternatives, questionSetId, authorId", // Primary key and indexed props
      settings: "++name, value",
    });
    this.on("populate", async (tx: Transaction) => {
      await tx.table("settings").bulkAdd([
        { name: AppSetting.CurrentQuestion, value: 0 },
        { name: AppSetting.ShowCorrectAlternatives, value: true },
        { name: AppSetting.ShowCorrectAnswersOnly, value: false },
      ]);
    });
  }
}

export const db = new DB(); // export the db
