"use client";
import Link from "next/link";
import OptionsDropdown from "./options-dropdown";
import { Inter } from "next/font/google";
import { ShowCorrectAlternativesContext } from "@/contexts/show-correct-alternatives";
import { useLiveQuery } from "dexie-react-hooks";
import { AppSetting, db } from "@/db/db.model";

const inter = Inter({ subsets: ["latin"] });

export default function Body({ children }: { children: React.ReactNode }) {
  const showCorrectAlternatives = useLiveQuery(() =>
    db.settings.get(AppSetting.ShowCorrectAlternatives)
  )?.value as boolean;
  const setShowCorrectAlternatives = (value: boolean) =>
    db.settings.update(AppSetting.ShowCorrectAlternatives, { value: value });
  return (
    <body className={inter.className}>
      <ShowCorrectAlternativesContext.Provider
        value={[showCorrectAlternatives, setShowCorrectAlternatives]}
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
          </nav>
          <>{children}</>
        </div>
      </ShowCorrectAlternativesContext.Provider>
    </body>
  );
}
