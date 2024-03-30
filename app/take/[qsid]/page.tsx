"use client";

import { ObfuscatedQuestion } from "@/app/api/test/[qsid]/route";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export default function Questionnaire({
  params,
}: {
  params: { qsid: number };
}) {
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
    <main className="flex-start grow flex flex-col justify-center">
      {children}
    </main>
  );
  const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;

  const q = questions[currentQuestion],
    hasPrevious = currentQuestion - 1 >= 0,
    hasNext = currentQuestion + 1 < questions.length;

  const storeAnswer = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      question: ObfuscatedQuestion,
      index: number
    ) => {
      const answersCp = [...answers];
      switch (question.type) {
        case "checkbox":
          if (e.currentTarget.checked) {
            answersCp[currentQuestion].push(index);
          } else {
            answersCp[currentQuestion] = answersCp[currentQuestion].filter(
              (a) => a != index
            );
          }
          break;
        case "radio":
          answersCp[currentQuestion] = [index];
          break;
      }
      setAnswers(answersCp);
      console.log(answersCp);
    },
    [answers, currentQuestion, setAnswers]
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
