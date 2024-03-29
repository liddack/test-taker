"use client";

import { ImportedQuestion } from "@/interfaces/imported-question";
import { ChangeEvent } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { saveOnLocalStorage } from "../lib/utils/storage";

const exampleQuestions: ImportedQuestion[] = [
  {
    command: "Qual é a capital do Brasil?",
    alternatives: [
      { isCorrect: true, label: "Brasília" },
      { isCorrect: false, label: "Rio de Janeiro" },
      { isCorrect: false, label: "São Paulo" },
      { isCorrect: false, label: "Belo Horizonte" },
    ],
  },
  {
    command: "Qual destes países não faz parte da União Europeia?",
    alternatives: [
      { isCorrect: false, label: "França" },
      { isCorrect: false, label: "Alemanha" },
      { isCorrect: true, label: "Noruega" },
      { isCorrect: false, label: "Itália" },
    ],
  },
];

const stringfiedQuestions = JSON.stringify(exampleQuestions, null, 2);

const UploadQuestions = () => {
  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("Please select the file.");
      return;
    }

    let reader = new FileReader();

    let jsonContent;
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      try {
        jsonContent = JSON.parse(content);

        saveOnLocalStorage("questionsData", jsonContent);
        console.log("received file path json reader: ", jsonContent);
      } catch (error) {
        console.log("error when loading file: ", error);
        alert("Erro ao carregar arquivo! :(");
      }
    };

    reader.readAsText(file);
  };
  return (
    <div className="text-base text-gray-600">
      <div className="max-w-md h-40 rounded-lg border-gray-600 border-2 border-dashed flex items-center justify-center">
        <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
          <svg
            className="w-10 h-10 mx-auto"
            viewBox="0 0 41 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-3 text-gray-700 max-w-xs mx-auto">
            Clique para{" "}
            <span className="font-medium text-indigo-600">Enviar um arquivo</span> ou
            arraste e solte seu arquivo aqui.
          </p>
        </label>
        <input
          id="file"
          type="file"
          className="hidden"
          onChange={handleSelectFile}
          accept=".json"
        />
      </div>
      <div className="flex gap-2 pb-3">
        <strong>Tipos de arquivos permitidos:</strong>
        <p>JSON</p>
      </div>
      <span>O arquivo json deve respeitar o seguinte formato:</span>
      <div className="flex max-w-md text-xs max-h-[26rem] overflow-auto">
        <SyntaxHighlighter language="json" style={prism}>
          {stringfiedQuestions}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default UploadQuestions;