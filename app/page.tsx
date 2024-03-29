"use client";
import { HomeTests } from "@/components/tests";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex-start grow flex flex-col justify-center">
      <h1 className="text-xl font-bold">Questionários</h1>
      <div className="relative flex place-items-center flex-col pt-4">
        <Suspense fallback={<p>Carregando...</p>}>
          <HomeTests></HomeTests>
        </Suspense>
      </div>
    </main>
  );
}
