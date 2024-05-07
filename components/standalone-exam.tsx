"use client";

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
import { AppSetting, db } from "@/db/db.model";
import { useLiveQuery } from "dexie-react-hooks";

type StandaloneExamProps = {
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  questionIds: string[];
};

export default function StandaloneExam({
  questionIds,
  setShowResultsPage,
}: StandaloneExamProps) {
  const [showCorrectAlternatives] = useContext(ShowCorrectAlternativesContext);
  const currentQuestion =
    useLiveQuery(() => db.settings.get(AppSetting.CurrentQuestion))?.value ?? 0;
  const setCurrentQuestion = (value: number) =>
    db.settings.update(AppSetting.CurrentQuestion, { value });
  const setCheckedAlternatives = useCallback((id: string, answer: number[]) => {
    db.questions.update(id, { checkedAlternatives: answer });
  }, []);
  const [isKeyboardCapable, setIsKeyboardCapable] = useState(true);
  useSyntaxHighlighting();
  useKeyboardNavigationExam({
    currentQuestion,
    setCurrentQuestion,
    totalQuestions: questionIds?.length ?? 0,
    setShowResultsPage,
    setIsKeyboardCapable,
  });
  const question = useLiveQuery(
    () => db.questions.get(questionIds[currentQuestion]),
    [currentQuestion]
  );
  console.debug("questionIds[currentQuestion]", questionIds[currentQuestion]);

  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );
  const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;

  const hasPrevious = currentQuestion - 1 >= 0;
  const hasNext = currentQuestion + 1 < questionIds.length;

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
      let markedAlternatives = question.checkedAlternatives;
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
      console.debug("Answered: ", markedAlternatives);
    },
    [setCheckedAlternatives]
  );

  if (question === undefined) return <Main>Carregando questão...</Main>;
  return (
    <div className="flex flex-col lg:w-[60rem]">
      <div className="flex justify-end">
        {currentQuestion + 1} de {questionIds.length}
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
              checked={question.checkedAlternatives?.includes(i)}
              autoFocus={question.checkedAlternatives?.includes(i) || i === 0}
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
