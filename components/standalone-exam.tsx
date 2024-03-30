"use client";

import { Question } from ".prisma/client";
import { StandaloneQuestion } from "@/classes/standalone-question";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useCallback } from "react";

type StandaloneExamProps = {
  questions: Question[];
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  answers: number[][];
  setAnswers: Dispatch<SetStateAction<number[][]>>;
  currentQuestion: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
};

export default function StandaloneExam({
  questions,
  answers,
  setAnswers,
  currentQuestion,
  setCurrentQuestion,
  setShowResultsPage,
}: StandaloneExamProps) {
  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );
  const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;

  const q = questions[currentQuestion],
    hasPrevious = currentQuestion - 1 >= 0,
    hasNext = currentQuestion + 1 < questions.length;

  const questionCount = (count: number) => (
    <>
      {count > 1 ? (
        <>
          Esta questão possui <strong>{count}</strong> respostas corretas.
        </>
      ) : (
        `Escolha a resposta correta.`
      )}
    </>
  );

  const storeAnswer = useCallback(
    (e: ChangeEvent<HTMLInputElement>, question: StandaloneQuestion, index: number) => {
      const answersCp = [...answers];
      if (question.answers.length > 1) {
        // checkbox
        if (e.currentTarget.checked) {
          answersCp[currentQuestion].push(index);
        } else {
          answersCp[currentQuestion] = answersCp[currentQuestion].filter(
            (a) => a != index
          );
        }
      } else {
        // radio
        answersCp[currentQuestion] = [index];
      }
      setAnswers(answersCp);
      console.log(answersCp);
    },
    [answers, currentQuestion, setAnswers]
  );

  if (!questions.length) return <Main>Erro ao buscar teste.</Main>;
  return (
    <>
      <div className="flex justify-end">
        {currentQuestion + 1} de {questions.length}
      </div>
      <h1 className="text-xl font-bold mb-1">{q.command}</h1>
      <span className="text-sm">{questionCount(q.answers.length)}</span>
      <div className="relative pt-4">
        {q.alternatives.map((a, i) => (
          <div key={i} className="flex mb-3">
            <input
              className="h-4 w-4 mt-[0.2rem] border-gray-300 focus:ring-2 focus:ring-blue-300"
              type={q.answers.length > 1 ? "checkbox" : "radio"}
              id={`q:${q.id}_a:${i}`}
              onChange={(e) => storeAnswer(e, q, i)}
              checked={answers[currentQuestion]?.includes(i)}
            ></input>
            <label
              className="ms-2 text font-medium text-gray-90 ml-2 block"
              htmlFor={`q:${q.id}_a:${i}`}
            >
              {a}
            </label>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          {hasPrevious && (
            <button
              className={buttonStyle}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              {"<"} Anterior
            </button>
          )}
          {hasNext && (
            <button
              className={buttonStyle}
              onClick={() => hasNext && setCurrentQuestion(currentQuestion + 1)}
            >
              Próxima {">"}
            </button>
          )}
          {hasPrevious && !hasNext && (
            <button
              className={buttonStyle + ` font-bold`}
              onClick={() => setShowResultsPage(true)}
            >
              Ver resultado
            </button>
          )}
        </div>
      </div>
    </>
  );
}
