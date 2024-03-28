"use client";

import { ObfuscatedQuestion } from "@/app/api/test/[qsid]/route";
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";

export default function Questionnaire({ params }: { params: { qsid: number } }) {
  const { qsid } = params;
  const [questions, setQuestions] = useState<ObfuscatedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);

  useEffect(() => {
    fetch(`/api/test/${qsid}`)
      .then((res) => res.json())
      .then((data: ObfuscatedQuestion[]) => {
        setQuestions(data);
        setIsLoading(false);
        setAnswers(data.map(() => []));
        setCurrentQuestion(0);
      });
  }, [qsid]);

  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );
  const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;

  const q = questions[currentQuestion],
    hasPrevious = currentQuestion - 1 >= 0,
    hasNext = currentQuestion + 1 < questions.length;

  const storeAnswer = useCallback(
    (e: ChangeEvent<HTMLInputElement>, question: ObfuscatedQuestion, index: number) => {
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
      <div className="flex justify-end">
        {currentQuestion + 1} de {questions.length}
      </div>
      <h1 className="text-xl font-bold">{q.command}</h1>
      <div className="relative pt-4">
        {q.alternatives.map((a, i) => (
          <div key={i} className="flex mb-3">
            <input
              className="h-4 w-4 mt-[0.2rem] border-gray-300 focus:ring-2 focus:ring-blue-300"
              type={q.type}
              name={`qs${qsid}-q${q.id}`}
              id={`qs${qsid}-q${q.id}-a${i}`}
              onChange={(e) => storeAnswer(e, q, i)}
              checked={answers[currentQuestion].includes(i)}
            ></input>
            <label
              className="ms-2 text font-medium text-gray-90 ml-2 block"
              htmlFor={`qs${qsid}-q${q.id}-a${i}`}
            >
              {a}
            </label>
          </div>
        ))}
        <div className="flex justify-center">
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
              onClick={() => hasNext && setCurrentQuestion(currentQuestion + 1)}
            >
              Ver resultado
            </button>
          )}
        </div>
      </div>
    </Main>
  );
}
