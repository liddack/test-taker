import { useEffect, Dispatch, SetStateAction, useState } from "react";

type UseKeyboardNavigationExamOptions = {
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  showAnsweredOnly: boolean;
  setShowAnsweredOnly: (value: boolean) => void;
  resetExam: () => void;
};

export function useKeyboardNavigationResults({
  setShowResultsPage,
  showAnsweredOnly,
  setShowAnsweredOnly: setShowOnlyAnsweredQuestions,
  resetExam,
}: UseKeyboardNavigationExamOptions) {
  const [isKeyboardCapable, setIsKeyboardCapable] = useState(true);
  useEffect(() => {
    const isTouchDevice = () => "ontouchstart" in window || "onmsgesturechange" in window;
    const isDesktop = window.screenX != 0 && !isTouchDevice() ? true : false;
    setIsKeyboardCapable(isDesktop);
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsKeyboardCapable(true);
      console.debug("Pressed key:", e.key);
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setShowResultsPage(false);
          break;
        case "Delete":
          e.preventDefault();
          resetExam();
          break;
        case "q":
          e.preventDefault();
          setShowOnlyAnsweredQuestions(!showAnsweredOnly);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowResultsPage, setShowOnlyAnsweredQuestions, showAnsweredOnly, resetExam]);
  return isKeyboardCapable;
}
