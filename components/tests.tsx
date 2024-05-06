import { QuestionSet } from "@/interfaces/question-set";
import Link from "next/link";

export async function HomeTests() {
  const res = await fetch(process.env.URL ?? "http://localhost:3000" + `/api/test`);
  const tests: QuestionSet[] = await res.json();
  console.debug(tests);
  return (
    <>
      {tests.map((test) => (
        <>
          <Link href={`/take/${test.id}`} key={test.id}>
            <span className="underline">Iniciar teste {test.name}</span>
          </Link>
          <br />
        </>
      ))}
    </>
  );
}
