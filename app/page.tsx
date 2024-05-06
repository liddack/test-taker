"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/db/db.model";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkQuestions = async () => {
      const questions = await db.questions.toArray();
      if (!questions?.length) {
        router.push("/upload-questions");
      } else {
        router.push("/take/standalone");
      }
    };
    checkQuestions();
  }, [router]);

  return (
    <main className="flex-start grow flex flex-col justify-center text-center">
      <h1 className="text-xl font-bold">Questionários</h1>
      <div className="relative flex place-items-center flex-col pt-4">
        Verificando questões...
      </div>
    </main>
  );
}
