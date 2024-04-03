import { useEffect, Dispatch, SetStateAction } from "react";

type UseKeyboardNavigationExamOptions = {
  currentQuestion: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  totalQuestions: number;
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  setIsKeyboardCapable: Dispatch<SetStateAction<boolean>>;
};

export function useKeyboardNavigationExam({
  currentQuestion,
  setCurrentQuestion,
  setShowResultsPage,
  totalQuestions,
  setIsKeyboardCapable,
}: UseKeyboardNavigationExamOptions) {
  useEffect(() => {
    const isTouchDevice = () => "ontouchstart" in window || "onmsgesturechange" in window;
    var isDesktop = window.screenX != 0 && !isTouchDevice() ? true : false;
    setIsKeyboardCapable(isDesktop);
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsKeyboardCapable(true);
      const inputs = document?.querySelectorAll("input");
      const focused = (document?.querySelector("input:focus") as HTMLInputElement) ?? 0;
      const focusedIndex = Number(focused?.dataset?.index ?? 0);
      switch (e.key) {
        case "ArrowLeft":
          if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
          break;
        case "ArrowRight":
          if (currentQuestion < totalQuestions - 1)
            setCurrentQuestion(currentQuestion + 1);
          break;
        case "Enter":
          if (currentQuestion > 0) setShowResultsPage(true);
          break;
        case "Home":
          setCurrentQuestion(0);
          break;
        case "End":
          setCurrentQuestion(totalQuestions - 1);
          break;
        case "PageUp":
          if (currentQuestion > 9) setCurrentQuestion(currentQuestion - 10);
          else setCurrentQuestion(0);
          break;
        case "PageDown":
          if (currentQuestion < totalQuestions - 10)
            setCurrentQuestion(currentQuestion + 10);
          else setCurrentQuestion(totalQuestions - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (focusedIndex > 0) inputs?.[focusedIndex - 1].focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          if (focusedIndex < inputs.length - 1) {
            console.debug(inputs[focusedIndex + 1]);
            inputs[focusedIndex + 1]?.focus();
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentQuestion,
    setCurrentQuestion,
    totalQuestions,
    setShowResultsPage,
    setIsKeyboardCapable,
  ]);
}
