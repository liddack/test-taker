import { ImportedQuestion } from "@/interfaces/imported-question";
import { readFileSync } from "fs";
import sanitize from "sanitize-html";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: process.argv,
  options: {
    file: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const questions = JSON.parse(readFileSync(values.file ?? 0, "utf-8"));

const dedupedQuestions: ImportedQuestion[] = [];

for (const q of questions) {
  const sanitizedCommand = sanitize(q.command, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const foundSameQuestion = dedupedQuestions.find(({ command }) =>
    sanitize(Array.isArray(command) ? command.join(" ") : command, {
      allowedTags: [],
      allowedAttributes: {},
    }).includes(sanitizedCommand)
  );
  if (!foundSameQuestion) {
    dedupedQuestions.push(q);
  }
}

console.log(JSON.stringify(dedupedQuestions, null, 2));
