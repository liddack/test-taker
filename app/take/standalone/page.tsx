"use client";

import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { AppSetting, db } from "@/db/db.model";
import { useLiveQuery } from "dexie-react-hooks";
import { ReactNode, useState } from "react";

function TakeStandalone() {
  const questions = useLiveQuery(() => db.questions.toArray()) ?? [];
  const currentQuestion =
    useLiveQuery(() => db.settings.get(AppSetting.CurrentQuestion))?.value ?? 0;
  const setCurrentQuestion = (value: number) =>
    db.settings.update(AppSetting.CurrentQuestion, { value });
  const [showResultsPage, setShowResultsPage] = useState(false);
  const answers = questions?.map((q) => q.checkedAlternatives);
  const setAnswers = (id: string, answer: number[]) => {
    db.questions.update(id, { checkedAlternatives: answer });
  };

  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (!questions?.length) return <Main>Carregando questões...</Main>;
  return (
    <Main>
      {!showResultsPage ? (
        <StandaloneExam
          questions={questions}
          setShowResultsPage={setShowResultsPage}
          answers={answers}
          setAnswers={setAnswers}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
        />
      ) : (
        <ExamResult
          userAnswers={answers}
          questions={questions}
          setShowResultsPage={setShowResultsPage}
        />
      )}
    </Main>
  );
}

export default TakeStandalone;
