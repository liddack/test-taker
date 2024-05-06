import { StandaloneQuestion } from "@/classes/standalone-question";
import Dexie, { Table } from "dexie";

export class DB extends Dexie {
  // table name is student
  questions!: Table<StandaloneQuestion>;
  constructor() {
    super("simuladosDatabase");
    this.version(1).stores({
      questions:
        "++id, command, alternatives, answers, checkedAlternatives, questionSetId, authorId", // Primary key and indexed props
    });
  }
}

export const db = new DB(); // export the db
