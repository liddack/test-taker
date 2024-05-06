import { StandaloneQuestion } from "@/classes/standalone-question";
import { ImportedQuestion } from "@/interfaces/imported-question";

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

export const getPercentFromTotal = (count: number, total: number) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

/**
 * Return a shuffled copy of the input array.
 * @param array Input array
 * @return A shuffled copy of the original array.
 */
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Shuffles the order of the questions in the given array.
 * @param questions Array of questions to shuffle.
 * @returns A new array with the questions in a random order.
 */
export function shuffleQuestions(questions: ImportedQuestion[]): ImportedQuestion[] {
  return shuffleArray(questions).map((q) => {
    return { ...q, alternatives: shuffleArray(q.alternatives) };
  });
}
