import { StandaloneQuestion } from "@/classes/standalone-question";

const containsAll = (arr1: number[], arr2: number[]) =>
  arr2?.every((arr2Item) => arr1?.includes(arr2Item));

const sameMembers = (arr1: number[], arr2: number[]) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

export const getCorrectAnswers = (
  userAnswers: number[][],
  questions: StandaloneQuestion[]
) => {
  const correctAnswers = userAnswers?.filter((answer, index) => {
    const questionAnswers = questions[index]?.answers;

    return sameMembers(answer, questionAnswers);
  });

  return correctAnswers;
};

export const getPercentFromTotal = (count: number, total: number) => {
  const percentFromTotal = Math.round((count / total) * 100);

  return percentFromTotal;
};
