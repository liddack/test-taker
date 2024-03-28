"use server";
import { prisma } from "@/db";
import Link from "next/link";

export default async function Home() {
  const questionSets = await prisma.questionSet.findMany({});
  return (
    <main className="flex-start grow flex flex-col justify-center">
      <h1 className="text-xl font-bold">Questionários</h1>
      <div className="relative flex place-items-center flex-col pt-4">
        {questionSets.map((qs) => (
          <>
            <Link href={`/take/${qs.id}`} key={qs.id}>
              <span className="underline">Iniciar teste {qs.name}</span>
            </Link>
            <br />
          </>
        ))}
      </div>
    </main>
  );
}
