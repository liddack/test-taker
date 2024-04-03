import { getCorrectAnswers, getPercentFromTotal } from "@/app/lib/utils/core";
import { StandaloneQuestion } from "@/classes/standalone-question";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import hljs from "highlight.js";
import abap from "highlightjs-sap-abap/dist/abap.es.min";
import "highlight.js/styles/xcode.css";

hljs.registerLanguage("abap", abap);

type ExamResultProps = {
  questions: StandaloneQuestion[];
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  answers: number[][];
};

const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;
const containsAll = (arr1: number[], arr2: number[]) =>
  arr2?.every((arr2Item) => arr1?.includes(arr2Item));

const sameMembers = (arr1: number[], arr2: number[]) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

export default function ExamResult({
  questions,
  answers,
  setShowResultsPage,
}: ExamResultProps) {
  const correctAnswers = getCorrectAnswers(answers, questions);

  const answeredCount = answers.filter((answer) => answer.length > 0).length;

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <>
      <h1 className="text-6xl text-center font-bold mb-4">
        {getPercentFromTotal(correctAnswers.length, questions.length)}%
      </h1>
      <h2 className="text-2xl text-center font-bold mb-4">
        Você acertou {correctAnswers.length} de um total de {questions.length} questões
      </h2>
      {answeredCount !== questions.length && (
        <div className="flex flex-col justify-center items-center  py-2">
          <strong>Resultado parcial: </strong>
          <p>{getPercentFromTotal(correctAnswers.length, answeredCount)}%</p>
          <p>
            Você acertou {correctAnswers.length} de {answeredCount} questões respondidas
          </p>
        </div>
      )}
      <p className="text-center mb-6">
        <button className={buttonStyle} onClick={() => setShowResultsPage(false)}>
          Voltar
        </button>
      </p>
      <h2 className="font-bold text-2xl mb-3 text-center">Resultados</h2>
      {questions.map((q, i) => {
        const isCorrect = sameMembers(q.answers, answers[i]);
        return (
          <Fragment key={q.id}>
            <div className="lg:w-[60rem] border p-4 border-slate-400 my-2 rounded-md">
              <h3
                className={`inline-flex items-baseline text-normal text-sm font-semibold mb-2 ${
                  isCorrect ? "text-emerald-700" : "text-red-600"
                }`}
              >
                <span className="shrink-0">{isCorrect ? "✅" : "❌"}</span>
                <span
                  className="pl-1 prose text-inherit text-sm prose-pre:bg-white"
                  dangerouslySetInnerHTML={{ __html: q.command ?? "" }}
                ></span>
              </h3>
              <div className="ml-6 my-1">
                {q.alternatives.map((alt, idx) => {
                  const wasChosen = answers[i]?.includes(idx);
                  const isCorrect = q.answers.includes(idx);
                  const type = q.answers.length > 1 ? "checkbox" : "radio";
                  return (
                    <div
                      key={idx}
                      className={`py-1 px-2 my-2 text-sm rounded bg-opacity-50 border-opacity-50 border-2 ${
                        isCorrect
                          ? "bg-green-100 border-emerald-600"
                          : "bg-red-100 border-red-600"
                      }`}
                    >
                      <label className={`flex items-center`}>
                        <input
                          type={type}
                          readOnly
                          checked={wasChosen}
                          onClick={() => {}}
                        />
                        <span className="ml-1">{alt}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
