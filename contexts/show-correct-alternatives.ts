import { Dispatch, SetStateAction, createContext } from "react";

export const ShowCorrectAlternativesContext = createContext([false, () => {}] as [
  boolean,
  (value: boolean) => void
]);
