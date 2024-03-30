"use client";

import { readFromLocalStorage } from "@/app/lib/utils/storage";
import { StandaloneQuestion } from "@/classes/standalone-question";
import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { ImportedQuestion } from "@/interfaces/imported-question";
import { TestExample } from "@/test-example";
import { Question } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";

function TakeStandalone() {
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[][]>(questions?.map(() => []));

  useEffect(() => {
    const questionsData = readFromLocalStorage("questionsData") as ImportedQuestion[];
    const questionsStandalone = questionsData?.map((q) => new StandaloneQuestion(q));

    setQuestions(questionsStandalone);
  }, []);
  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (!questions?.length) return <Main>Erro ao buscar teste.</Main>;
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
          answers={answers}
          questions={questions}
          setShowResultsPage={setShowResultsPage}
        />
      )}
    </Main>
  );
}

export default TakeStandalone;
