import { getCorrectAnswers, getPercentFromTotal } from "@/app/lib/utils/core";
import { StandaloneQuestion } from "@/classes/standalone-question";
import { useSyntaxHighlighting } from "@/hooks/use-syntax-highlighting";
import { Dispatch, Fragment, SetStateAction, useCallback, useState } from "react";

type ExamResultProps = {
  questions: StandaloneQuestion[];
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  userAnswers: number[][];
};

const buttonStyle = `px-3 py-2 mr-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500`;
const containsAll = (arr1: number[], arr2: number[]) =>
  arr2?.every((arr2Item) => arr1?.includes(arr2Item));

const sameMembers = (arr1: number[], arr2: number[]) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

export default function ExamResult({
  questions,
  userAnswers: answers,
  setShowResultsPage,
}: ExamResultProps) {
  const [showAnsweredOnly, setShowAnsweredOnly] = useState(false);
  useSyntaxHighlighting();

  const correctAnswers = getCorrectAnswers(answers, questions);
  const answeredCount = answers.filter((answer) => answer.length > 0).length;

  console.debug("correctAnswers.length", correctAnswers.length);
  console.debug("answeredCount", answeredCount);

  const getResults = useCallback(() => {
    if (showAnsweredOnly) {
      const userAnsweredOnly = answers.filter((a) => a.length > 0);
      const answeredQuestions = questions.filter((_, i) => answers[i].length > 0);
      return answeredQuestions.map((question, i) => ({
        question,
        userAnswer: userAnsweredOnly[i],
        index: i,
        total: userAnsweredOnly.length,
      }));
    }
    return questions.map((question, i) => ({
      question,
      userAnswer: answers[i],
      index: i,
      total: answers.length,
    }));
  }, [showAnsweredOnly, answers, questions]);

  const results = getResults();

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
      <p>
        <label className="flex text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="mr-1"
            checked={showAnsweredOnly}
            onClick={() => setShowAnsweredOnly(!showAnsweredOnly)}
          />
          Mostrar apenas questões respondidas
        </label>
      </p>
      {results.length === 0 && (
        <p className="text-center mt-10 text-slate-500">Nenhuma questão foi respondida</p>
      )}
      {results.map(({ question, userAnswer, index, total }) => {
        const isCorrect = sameMembers(question.answers, userAnswer);
        return (
          <Fragment key={question.id}>
            <div className="lg:w-[60rem] border p-4 border-slate-400 my-2 rounded-md">
              <h3
                className={`flex justify-between items-baseline text-normal text-sm font-semibold mb-2 ${
                  isCorrect ? "text-emerald-700" : "text-red-600"
                }`}
              >
                <div className="inline-flex">
                  <span className="shrink-0">{isCorrect ? "✅" : "❌"}</span>
                  <span
                    className="pl-1 prose text-inherit text-sm prose-pre:bg-white"
                    dangerouslySetInnerHTML={{ __html: question.command ?? "" }}
                  ></span>
                </div>
                <span className="text-slate-400 justify-self-end font-normal text-sm">
                  {index + 1} de {total}
                </span>
              </h3>
              <div className="ml-6 my-1">
                {question.alternatives.map((alt, idx) => {
                  const wasChosen = userAnswer?.includes(idx);
                  const isCorrect = question.answers.includes(idx);
                  const type = question.answers.length > 1 ? "checkbox" : "radio";
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
