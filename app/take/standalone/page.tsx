"use client";

import { getRandomUUID, shuffleQuestions } from "@/app/lib/utils/core";
import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { AppSetting, db } from "@/db/db.model";
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

  const resetExam = () => {
    setIsLoading(true);
    console.log("Resetting questions");
    db.questions.toArray().then(async (questions) => {
      const shuffledQuestions = shuffleQuestions(questions);
      const clearedQuestions = shuffledQuestions.map((q) => ({
        ...q,
        checkedAlternatives: [],
        id: getRandomUUID(),
      }));
      console.debug(clearedQuestions);
      await db.questions.clear();
      console.debug("Cleared database");
      await db.questions.bulkAdd(clearedQuestions);
      await db.settings.update(AppSetting.CurrentQuestion, { value: 0 });
      const newQuestions = await db.questions.toArray();
      const keys = newQuestions.map((q) => q.id);
      setQuestionIds(keys);
      setShowResultsPage(false);
      setIsLoading(false);
      console.log("Questions resetted successfully");
    });
  };

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
        <ExamResult setShowResultsPage={setShowResultsPage} resetExam={resetExam} />
      )}
    </Main>
  );
}

export default TakeStandalone;
