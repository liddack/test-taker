import { Dispatch, SetStateAction, createContext } from "react";

export const ShowCorrectAlternativesContext = createContext([false, () => {}] as [
  boolean,
  Dispatch<SetStateAction<boolean>>
]);
