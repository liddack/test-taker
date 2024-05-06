"use client";

import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { db } from "@/db/db.model";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function TakeStandalone() {
  const [questionIds, setQuestionIds] = useState([] as string[]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResultsPage, setShowResultsPage] = useState(false);
  useEffect(() => {
    const getKeys = async () => {
      const keys = (
        await db.transaction("r", db.questions, () => db.questions.toCollection().keys())
      ).map((id) => id.toString());
      console.debug(keys);
      setQuestionIds(keys);
      setIsLoading(false);
    };
    getKeys();
  }, []);

  const router = useRouter();
  if (!isLoading && questionIds.length === 0) {
    router.push("/upload-questions");
  }

  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (isLoading) return <Main>Carregando questões...</Main>;
  return (
    <Main>
      {!showResultsPage ? (
        <StandaloneExam
          questionIds={questionIds}
          setShowResultsPage={setShowResultsPage}
        />
      ) : (
        <ExamResult setShowResultsPage={setShowResultsPage} />
      )}
    </Main>
  );
}

export default TakeStandalone;
