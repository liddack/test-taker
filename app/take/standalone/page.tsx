"use client";

import ExamResult from "@/components/exam-result";
import StandaloneExam from "@/components/standalone-exam";
import { db } from "@/db/db.model";
import { ImportedQuestion } from "@/interfaces/imported-question";
import { Question } from "@prisma/client";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function TakeStandalone() {
  const questions = useLiveQuery(() => db.questions.toArray()) ?? [];
  // const [questions, setQuestions] = useState<Question[]>([]);
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // const [answers, setAnswers] = useState<number[][]>([]);
  const answers = questions?.map((q) => q.checkedAlternatives);
  const setAnswers = (id: string, answer: number[]) => {
    db.questions.update(id, { checkedAlternatives: answer });
  };

  // useEffect(() => {
  //   // setAnswers(questions.map(() => []));
  //   // console.log("respostas:", answers?.length);
  // }, [questionsStandalone]);
  const Main = ({ children }: { children: ReactNode }) => (
    <main className="flex-start grow flex flex-col justify-center">{children}</main>
  );

  if (!questions?.length) return <Main>Carregando questões...</Main>;
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
