import { useEffect, Dispatch, SetStateAction, useState } from "react";

type UseKeyboardNavigationExamOptions = {
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  showAnsweredOnly: boolean;
  setShowAnsweredOnly: (value: boolean) => void;
};

export function useKeyboardNavigationResults({
  setShowResultsPage,
  showAnsweredOnly,
  setShowAnsweredOnly: setShowOnlyAnsweredQuestions,
}: UseKeyboardNavigationExamOptions) {
  const [isKeyboardCapable, setIsKeyboardCapable] = useState(true);
  useEffect(() => {
    const isTouchDevice = () => "ontouchstart" in window || "onmsgesturechange" in window;
    const isDesktop = window.screenX != 0 && !isTouchDevice() ? true : false;
    setIsKeyboardCapable(isDesktop);
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsKeyboardCapable(true);
      console.log(e.key);
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setShowResultsPage(false);
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
  }, [setShowResultsPage, setShowOnlyAnsweredQuestions, showAnsweredOnly]);
  return isKeyboardCapable;
}
