"use client";
import Link from "next/link";
import OptionsDropdown from "./options-dropdown";
import { Inter } from "next/font/google";
import { useState } from "react";
import { ShowCorrectAlternativesContext } from "@/contexts/show-correct-alternatives";

const inter = Inter({ subsets: ["latin"] });

export default function Body({ children }: { children: React.ReactNode }) {
  const showCorrectAlternatives = useState(true);
  return (
    <body className={inter.className}>
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
                <ShowCorrectAlternativesContext.Provider
                  value={showCorrectAlternatives}
                >
                  <OptionsDropdown></OptionsDropdown>
                </ShowCorrectAlternativesContext.Provider>
              </li>
            </ul>
          </nav>

          {/* <Link href={"/"}>
          <span className="underline">Login</span>
        </Link> */}
        </nav>
        <ShowCorrectAlternativesContext.Provider value={showCorrectAlternatives}>
          <>{children}</>
        </ShowCorrectAlternativesContext.Provider>
      </div>
    </body>
  );
}
