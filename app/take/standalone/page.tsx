"use client";

import { readFromLocalStorage } from "@/app/lib/utils/storage";
import { StandaloneQuestion } from "@/classes/standalone-question";
import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { ImportedQuestion } from "@/interfaces/imported-question";
import { Question } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";

/**
 * Return a shuffled copy of the input array.
 * @param array Input array
 * @return A shuffled copy of the original array.
 */
function shuffleArray<T>(array: T[]): T[] {
  let copy = [...array];
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

const shuffleQuestions = (questions: ImportedQuestion[]): ImportedQuestion[] => {
  return shuffleArray(questions).map((q) => {
    return { ...q, alternatives: shuffleArray(q.alternatives) };
  });
};

function TakeStandalone() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);

  useEffect(() => {
    const questionsData = readFromLocalStorage(
      "questionsData"
    ) as ImportedQuestion[];
    const shuffledQuestions = shuffleQuestions(questionsData);
    const questionsStandalone = shuffledQuestions?.map(
      (q) => new StandaloneQuestion(q)
    );

    setQuestions(questionsStandalone);
    setAnswers(questionsStandalone.map(() => []));
    // console.log("respostas:", answers?.length);
  }, []);
  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (!questions?.length) return <Main>Erro ao buscar teste.</Main>;
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
          userAnswers={answers}
          questions={questions}
          setShowResultsPage={setShowResultsPage}
        />
      )}
    </Main>
  );
}

export default TakeStandalone;
