import { StandaloneQuestion } from "@/classes/standalone-question";
import { Dispatch, Fragment, SetStateAction } from "react";

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
  const correctAnswers = answers?.filter((a, i) => {
    const questionAnswers = questions[i]?.answers;
    return sameMembers(a, questionAnswers);
  });
  return (
    <>
      <h1 className="text-6xl text-center font-bold mb-4">
        {Math.round((correctAnswers.length / questions.length) * 100)}%
      </h1>
      <h2 className="text-2xl text-center font-bold mb-4">
        Você acertou {correctAnswers.length} de {questions.length} questões
      </h2>
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
            <div className="sm:w-[60rem] border p-4 border-slate-400 my-2 rounded-md">
              <h3
                className={`inline-flex items-center text-normal text-sm font-semibold mb-2 ${
                  isCorrect ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {isCorrect ? "✅" : "❌"} {i + 1}. {q.command}
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
