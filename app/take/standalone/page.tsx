"use client";

import { StandaloneQuestion } from "@/classes/standalone-question";
import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { TestExample } from "@/test-example";
import { ReactNode, useState } from "react";

const TakeStandalone = () => {
  const importedQuestions = TestExample;
  const questions = importedQuestions.map((q) => new StandaloneQuestion(q));
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(questions.map(() => []));
  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (!questions.length) return <Main>Erro ao buscar teste.</Main>;
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
};

export default TakeStandalone;
