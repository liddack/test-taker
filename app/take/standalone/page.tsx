"use client";

import { shuffleQuestions } from "@/app/lib/utils/core";
import { StandaloneQuestion } from "@/classes/standalone-question";
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

  const resetExam = (questions: StandaloneQuestion[]) => {
    const clearedAnswers = questions.map((q) => ({ ...q, checkedAlternatives: [] }));
    const shuffledQuestions = shuffleQuestions(clearedAnswers);
    console.debug(shuffledQuestions);
    const keys = shuffledQuestions.map((q) => q.id);
    db.questions.clear();
    db.questions.bulkAdd(shuffledQuestions);
    setQuestionIds(keys);
    db.settings.update(AppSetting.CurrentQuestion, { value: 0 });
    setShowResultsPage(false);
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
