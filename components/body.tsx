"use client";
import Link from "next/link";
import OptionsDropdown from "./options-dropdown";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ShowCorrectAlternativesContext } from "@/contexts/show-correct-alternatives";
import { readFromLocalStorage, saveOnLocalStorage } from "@/app/lib/utils/storage";

const inter = Inter({ subsets: ["latin"] });

export default function Body({ children }: { children: React.ReactNode }) {
  const [showCorrectAlternatives, setShowCorrectAlternatives] = useState(true);
  const handleShowCorrectAlternatives = (value: boolean) => {
    saveOnLocalStorage("showCorrectAlternatives", value);
    setShowCorrectAlternatives(value);
  };
  useEffect(() => {
    const storedShowCorrectAlternatives = Boolean(
      readFromLocalStorage("showCorrectAlternatives", true)
    );
    setShowCorrectAlternatives(storedShowCorrectAlternatives);
  }, []);
  return (
    <body className={inter.className}>
      <ShowCorrectAlternativesContext.Provider
        value={[showCorrectAlternatives, handleShowCorrectAlternatives]}
      >
        <div className={`p-10 min-h-screen flex flex-col items-center`}>
          <nav className="flex sm:justify-between justify-center flex-wrap self-start w-full gap-x-32">
            <Link href={"/"}>
              <span className="font-bold text-xl">Simulados</span>
            </Link>
            <nav className="flex items-center font-normal">
              <ul className="flex items-center gap-3">
                <li>
                  <Link href={"/upload-questions"}>
                    <span className="text-base">Enviar arquivo</span>
                  </Link>
                </li>
                <li>
                  <OptionsDropdown></OptionsDropdown>
                </li>
              </ul>
            </nav>
            {/* <Link href={"/"}>
          <span className="underline">Login</span>
        </Link> */}
          </nav>
          <>{children}</>
        </div>
      </ShowCorrectAlternativesContext.Provider>
    </body>
  );
}
