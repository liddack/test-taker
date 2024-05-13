import {
  getCorrectAnswers,
  getPercentFromTotal,
  sameMembers,
} from "@/app/lib/utils/core";
import { useKeyboardNavigationResults } from "@/hooks/use-keyboard-navigation-results";
import { useSyntaxHighlighting } from "@/hooks/use-syntax-highlighting";
import { Dispatch, Fragment, SetStateAction, useCallback } from "react";
import { Kbd } from "./kbd";
import { AppSetting, db } from "@/db/db.model";
import { useLiveQuery } from "dexie-react-hooks";
import { StandaloneQuestion } from "@/classes/standalone-question";

type ExamResultProps = {
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  resetExam: (questions: StandaloneQuestion[]) => void;
};

const buttonStyle = `px-3 py-2 mr-2 text-white rounded cursor-pointer  disabled:text-slate-300 disabled:bg-slate-500`;
const buttonColors = `bg-slate-700 hover:bg-slate-600`;

export default function ExamResult({ setShowResultsPage, resetExam }: ExamResultProps) {
  const showAnsweredOnly =
    (useLiveQuery(() => db.settings.get(AppSetting.ShowAnsweredQuestionsOnly))
      ?.value as boolean) ?? false;
  const setShowAnsweredOnly = (value: boolean) =>
    db.settings.update(AppSetting.ShowAnsweredQuestionsOnly, { value });
  useSyntaxHighlighting();

  let questions = useLiveQuery(() => db.questions.toArray());
  const isLoading = questions === undefined;
  questions ??= [];
  const correctAnswers = getCorrectAnswers(questions);
  const answeredCount = questions.filter((q) => q.checkedAlternatives.length > 0).length;
  const handleShowAnsweredOnly = () => setShowAnsweredOnly(!showAnsweredOnly);

  const getResults = useCallback(() => {
    if (showAnsweredOnly) {
      const answeredQuestions = questions.filter((q) => q.checkedAlternatives.length > 0);
      return answeredQuestions.map((question, i) => ({
        question,
        index: i,
        total: answeredCount,
      }));
    }
    return questions.map((question, i) => ({
      question,
      index: i,
      total: questions.length,
    }));
  }, [showAnsweredOnly, answeredCount, questions]);

  const results = getResults();

  const triggerResetExam = () => {
    resetExam(questions);
  };

  const isKeyboardCapable = useKeyboardNavigationResults({
    setShowAnsweredOnly,
    showAnsweredOnly,
    setShowResultsPage,
    triggerResetExam,
  });

  return (
    <>
      <h1 className="text-6xl text-center font-bold mb-4">
        {getPercentFromTotal(correctAnswers.length, questions.length)}%
      </h1>
      <h2 className="text-2xl text-center font-bold mb-4">
        Você acertou {correctAnswers.length} de um total de {questions.length} questões
      </h2>
      {answeredCount !== questions.length && (
        <div className="flex flex-col justify-center items-center py-2">
          <strong>Resultado parcial: </strong>
          <p>{getPercentFromTotal(correctAnswers.length, answeredCount)}%</p>
          <p>
            Você acertou {correctAnswers.length} de {answeredCount} questões respondidas
          </p>
        </div>
      )}
      <p className="justify-center mb-6 flex gap-2">
        <button
          className={buttonStyle + ` bg-rose-950 hover:bg-rose-900`}
          onClick={() => triggerResetExam()}
        >
          Limpar respostas marcadas {isKeyboardCapable && <Kbd>Del</Kbd>}
        </button>
        <button
          className={`${buttonStyle} ${buttonColors}`}
          onClick={() => setShowResultsPage(false)}
        >
          Voltar {isKeyboardCapable && <Kbd>Esc</Kbd>}
        </button>
      </p>
      <h2 className="font-bold text-2xl mb-3 text-center">Resultados</h2>
      <p>
        <label className="flex text-sm font-medium text-slate-700">
          <input
            className="mr-1"
            type="checkbox"
            checked={showAnsweredOnly}
            onClick={handleShowAnsweredOnly}
          />
          Mostrar apenas questões respondidas &nbsp;
          {isKeyboardCapable && <Kbd className="bg-slate-700 bg-opacity-70">Q</Kbd>}
        </label>
      </p>
      {isLoading && <p className="text-center mt-10">Carregando resultados...</p>}
      {!isLoading && results.length === 0 && (
        <p className="text-center mt-10 text-slate-500">Nenhuma questão foi respondida</p>
      )}
      {results.map(({ question, index, total }) => {
        const { id, command, answers, checkedAlternatives, alternatives } = question;
        const isCorrect = sameMembers(answers, checkedAlternatives);
        return (
          <Fragment key={id}>
            <div className="lg:w-[60rem] border p-4 border-slate-400 my-2 rounded-md">
              <h3
                className={`flex justify-between items-baseline text-normal text-sm font-semibold mb-2 ${
                  isCorrect ? "text-emerald-700" : "text-red-600"
                }`}
              >
                <div className="inline-flex">
                  <span className="shrink-0">{isCorrect ? "✅" : "❌"}</span>
                  <span
                    className="pl-1 prose text-inherit text-sm prose-pre:bg-white prose-code:text-slate-800"
                    dangerouslySetInnerHTML={{ __html: command ?? "" }}
                  ></span>
                </div>
                <span className="text-slate-400 justify-self-end font-normal text-sm">
                  {index + 1} de {total}
                </span>
              </h3>
              <div className="ml-6 my-1">
                {alternatives.map((alt, idx) => {
                  const wasChosen = checkedAlternatives?.includes(alt.hash);
                  const isCorrect = answers.includes(alt.hash);
                  const type = answers.length > 1 ? "checkbox" : "radio";
                  return (
                    <div
                      key={idx}
                      className={`py-1 px-2 my-2 text-sm rounded bg-opacity-50 border-opacity-50 border-2 ${
                        isCorrect
                          ? "bg-green-100 border-emerald-600"
                          : "bg-red-100 border-red-600"
                      }`}
                    >
                      <label
                        className={`flex items-center`}
                        id={`${question.id}-${alt.hash}`}
                      >
                        <input type={type} readOnly checked={wasChosen} />
                        <span
                          className="ml-1 select-none"
                          dangerouslySetInnerHTML={{ __html: alt.label }}
                        ></span>
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
