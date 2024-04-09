import { useEffect, Dispatch, SetStateAction, useState } from "react";

type UseKeyboardNavigationExamOptions = {
  setShowResultsPage: Dispatch<SetStateAction<boolean>>;
  setShowAnsweredOnly: Dispatch<SetStateAction<boolean>>;
};

export function useKeyboardNavigationResults({
  setShowResultsPage,
  setShowAnsweredOnly: setShowOnlyAnsweredQuestions,
}: UseKeyboardNavigationExamOptions) {
  const [isKeyboardCapable, setIsKeyboardCapable] = useState(true);
  useEffect(() => {
    const isTouchDevice = () =>
      "ontouchstart" in window || "onmsgesturechange" in window;
    var isDesktop = window.screenX != 0 && !isTouchDevice() ? true : false;
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
          setShowOnlyAnsweredQuestions((value) => !value);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowResultsPage, setShowOnlyAnsweredQuestions]);
  return isKeyboardCapable;
}
