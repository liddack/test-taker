"use client";

import { Question } from ".prisma/client";
import { StandaloneQuestion } from "@/classes/standalone-question";
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";

import { useKeyboardNavigationExam } from "@/hooks/use-keyboard-navigation-exam";
import { useSyntaxHighlighting } from "@/hooks/use-syntax-highlighting";
import { Kbd } from "./kbd";
import { ShowCorrectAlternativesContext } from "@/contexts/show-correct-alternatives";

type StandaloneExamProps = {
  questions: Question[];
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  answers: number[][];
  setAnswers: (id: string, answer: number[]) => void;
  currentQuestion: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
};

export default function StandaloneExam({
  questions,
  answers,
  setAnswers: setCheckedAlternatives,
  currentQuestion,
  setCurrentQuestion,
  setShowResultsPage,
}: StandaloneExamProps) {
  const [showCorrectAlternatives] = useContext(ShowCorrectAlternativesContext);
  const [isKeyboardCapable, setIsKeyboardCapable] = useState(true);
  useSyntaxHighlighting();
  useKeyboardNavigationExam({
    currentQuestion,
    setCurrentQuestion,
    totalQuestions: questions.length,
    setShowResultsPage,
    setIsKeyboardCapable,
  });

  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );
  const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;

  const question = questions[currentQuestion] as StandaloneQuestion,
    hasPrevious = currentQuestion - 1 >= 0,
    hasNext = currentQuestion + 1 < questions.length;

  const questionCount = (count: number) => (
    <>
      {count > 1 ? (
        <>
          Esta questão possui <strong>{count}</strong> alternativas corretas.
        </>
      ) : (
        `Escolha a resposta correta.`
      )}
    </>
  );

  const storeAnswer = useCallback(
    (e: ChangeEvent<HTMLInputElement>, question: StandaloneQuestion, index: number) => {
      const answersCp = [...answers];
      let markedAlternatives = answersCp[currentQuestion];
      if (question.answers.length > 1) {
        // checkbox
        if (e.currentTarget.checked) {
          markedAlternatives.push(index);
        } else {
          markedAlternatives = markedAlternatives.filter((a) => a != index);
        }
      } else {
        // radio
        markedAlternatives = [index];
      }
      setCheckedAlternatives(question.id, markedAlternatives);
      console.log(answersCp);
    },
    [answers, currentQuestion, setCheckedAlternatives]
  );

  if (!questions.length) return <Main>Carregando teste...</Main>;
  return (
    <div className="flex flex-col lg:w-[60rem]">
      <div className="flex justify-end">
        {/* {isKeyboardCapable && <span className="text-red">Entrada de teclado</span>} */}
        {currentQuestion + 1} de {questions.length}
      </div>
      <div
        className="text-xl font-bold mb-1 prose prose-pre:bg-white prose-code:text-sm"
        dangerouslySetInnerHTML={{ __html: question.command ?? "" }}
      ></div>
      {showCorrectAlternatives && (
        <span className="text-sm">{questionCount(question.answers.length)}</span>
      )}
      <div className="relative pt-4">
        {question.alternatives.map((a, i) => (
          <div key={i} className="flex mb-3">
            <input
              key={i}
              type={question.answers.length > 1 ? "checkbox" : "radio"}
              className="me-2 h-4 w-4 mt-[0.2rem] border-gray-300 focus:ring-2 focus:ring-blue-300"
              name={`q:${question.id}`}
              data-index={i}
              id={`q:${question.id}_a:${i}`}
              onChange={(e) => storeAnswer(e, question, i)}
              checked={answers[currentQuestion]?.includes(i)}
              autoFocus={answers[currentQuestion]?.includes(i) || i === 0}
            ></input>
            <label
              className="text font-medium text-gray-90 ml-2 flex gap-2"
              htmlFor={`q:${question.id}_a:${i}`}
              dangerouslySetInnerHTML={{ __html: a ?? "" }}
            ></label>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          {hasPrevious && (
            <button
              className={buttonStyle}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              {isKeyboardCapable ? <Kbd>&larr;</Kbd> : "<"} Anterior
            </button>
          )}
          {hasNext && (
            <button
              className={buttonStyle}
              onClick={() => hasNext && setCurrentQuestion(currentQuestion + 1)}
            >
              Próxima {isKeyboardCapable ? <Kbd>&rarr;</Kbd> : ">"}
            </button>
          )}
          {hasPrevious && (
            <button
              className={buttonStyle + ` font-bold`}
              onClick={() => setShowResultsPage(true)}
            >
              Ver resultado {isKeyboardCapable ? <Kbd>&crarr;</Kbd> : ">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
