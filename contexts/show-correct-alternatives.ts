import { createContext } from "react";

export const ShowCorrectAlternativesContext = createContext([false, () => {}] as [
  boolean,
  (value: boolean) => void
]);
