"use client";

import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { Question } from "@prisma/client";
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";

export default function Questionnaire({ params }: { params: { qsid: number } }) {
  const { qsid } = params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);

  useEffect(() => {
    fetch(`/api/test/${qsid}`)
      .then((res) => res.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setIsLoading(false);
        setAnswers(data.map(() => []));
        setCurrentQuestion(0);
      });
  }, [qsid]);

  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (isLoading) return <Main>Carregando...</Main>;
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
}
