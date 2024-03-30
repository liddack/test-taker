"use client";
import { HomeTests } from "@/components/tests";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { readFromLocalStorage } from "./lib/utils/storage";
import { useRouter } from "next/navigation";
import { ImportedQuestion } from "@/interfaces/imported-question";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const questions = readFromLocalStorage("questionsData") as ImportedQuestion[];

    if (!questions?.length) {
      router.push("/upload-questions");
    } else {
      router.push("/take/standalone");
    }
  }, [router]);

  return (
    <main className="flex-start grow flex flex-col justify-center text-center">
      <h1 className="text-xl font-bold">Questionários</h1>
      <div className="relative flex place-items-center flex-col pt-4">
        {/* <Suspense fallback={<p>Carregando...</p>}>
          <HomeTests></HomeTests>
        </Suspense> */}
        <Link
          href="/take/standalone?demo=true"
          className="underline hover:text-slate-700"
        >
          Demonstração de teste
        </Link>
      </div>
    </main>
  );
}
