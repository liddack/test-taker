import * as cryptoServer from "crypto";
import { StandaloneQuestion } from "@/classes/standalone-question";

export const containsAll = (arr1: (number | string)[], arr2: (number | string)[]) =>
  arr2?.every((arr2Item) => arr1?.includes(arr2Item));

export const sameMembers = (arr1: (number | string)[], arr2: (number | string)[]) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

export const getCorrectAnswers = (questions: StandaloneQuestion[]) => {
  const userAnswers = questions.map((q) => q.checkedAlternatives);
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
export function shuffleArray<T>(array: T[]): T[] {
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
export function shuffleQuestions<T>(questions: (T & { alternatives: unknown[] })[]): T[] {
  return shuffleArray(questions).map((q) => {
    return { ...q, alternatives: shuffleArray(q.alternatives) };
  });
}

/**
 * Returns a random UUID string.
 *
 * If the environment is a browser, this function uses the `crypto.randomUUID()` method,
 * which is supported by most modern browsers. If the environment is Node.js, this function
 * uses the `crypto.randomBytes()` method to generate a random 16-byte buffer, and then
 * encodes the buffer into a hexadecimal string.
 *
 * @returns A random UUID string.
 */
export function getRandomUUID() {
  if (typeof window === "undefined") {
    return cryptoServer.randomBytes(16).toString("hex");
  }
  return crypto.randomUUID();
}

/**
 * Generates a hash code for the given source string or array of strings.
 *
 * If the source is an array, it joins the elements into a single string using a space as the separator.
 * Then, it calculates a hash code using a simple algorithm that iterates over each character in the string.
 * The algorithm multiplies the current hash value by 31 (a prime number), subtracts the hash value, and adds the ASCII value of the current character.
 * The final hash value is converted to a 32-bit integer using the bitwise OR operator with zero.
 *
 * @param source - The source string or array of strings to generate the hash code for.
 * @returns The hash code for the given source.
 */
export function hashCode(source: string | string[]) {
  if (Array.isArray(source)) {
    return source.join(" ");
  }
  let hash = 0,
    i,
    chr;
  if (source.length === 0) return hash;
  for (i = 0; i < source.length; i++) {
    chr = source.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
