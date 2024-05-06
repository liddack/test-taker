"use client";

import { ImportedQuestion } from "@/interfaces/imported-question";
import { ChangeEvent, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { saveOnLocalStorage } from "../lib/utils/storage";
import { useRouter } from "next/navigation";
import { db } from "@/db/db.model";
import { StandaloneQuestion } from "@/classes/standalone-question";
import { shuffleQuestions } from "../lib/utils/core";

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
    command: [
      "Considere o código abaixo:",
      "```",
      "<strong>Texto</strong>",
      "```",
      "O que ele faz?",
    ],
    alternatives: [
      { isCorrect: false, label: "Adiciona uma imagem" },
      { isCorrect: false, label: "Deixa o texto em itálico" },
      { isCorrect: true, label: "Deixa o texto em negrito" },
      {
        isCorrect: false,
        label: "Adiciona uma quebra de linha antes do texto",
      },
    ],
  },
];

const stringfiedQuestions = JSON.stringify(exampleQuestions, null, 2);

async function clearQuestions() {
  try {
    await db.questions.clear();
  } catch (error) {
    console.error(`Failed to clear questions: ${error}`);
  }
}

async function replaceQuestions(questions: StandaloneQuestion[]) {
  try {
    await clearQuestions();
    await db.questions.bulkAdd(questions);
    return true;
  } catch (error) {
    console.error(`Failed to replace questions: ${error}`);
  }
}

const UploadQuestions = () => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileName = file?.name || "";

    //   console.log();

    if (!file) {
      console.log("Please select the file.");
      return;
    }

    const reader = new FileReader();

    let jsonContent;
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      try {
        jsonContent = JSON.parse(content) as ImportedQuestion[];

        setSelectedFileName(fileName);
        const shuffledQuestions = shuffleQuestions(jsonContent);
        const standaloneQuestions = shuffledQuestions.map(
          (q) => new StandaloneQuestion(q)
        );
        replaceQuestions(standaloneQuestions);
      } catch (error) {
        console.log("error when loading file: ", error);
        alert("Erro ao carregar arquivo! :(");
      }
    };

    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setSelectedFileName("");
    clearQuestions();
    // localStorage.removeItem("questionsData");

    const inputElement: any = inputRef.current;

    if (inputElement) {
      inputElement.value = "";
      inputElement.type = "";
      inputElement.type = "file";
    }
  };

  const handleGoToTest = () => {
    router.push("/take/standalone");
  };

  return (
    <div className=" flex flex-col sm:max-w-lg  w-full items-center text-base text-gray-600">
      <div className="mb-3 mt-4 sm:max-w-lg w-full h-40 rounded-lg border-gray-600 border-2 border-dashed flex items-center justify-center">
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
          <p className="my-3 text-gray-700 max-w-xs mx-full">
            Clique para{" "}
            <span className="font-medium text-indigo-600">Enviar um arquivo</span> com as
            questões do simulado
          </p>
          {selectedFileName && (
            <>
              <strong>Arquivo selecionado: </strong>
              <span>{selectedFileName}</span>
            </>
          )}
        </label>
        <input
          id="file"
          type="file"
          className="hidden"
          onChange={handleSelectFile}
          accept=".json"
          ref={inputRef}
        />
      </div>
      {!selectedFileName ? (
        <div className=" w-full">
          <div className="flex gap-2 pb-3">
            <strong>Tipos de arquivos permitidos:</strong>
            <p>JSON</p>
          </div>
          <span>O arquivo json deve respeitar o seguinte formato:</span>
          <div className="flex w-full text-xs max-h-[26rem] overflow-auto">
            <SyntaxHighlighter className="w-full rounded" language="json" style={prism}>
              {stringfiedQuestions}
            </SyntaxHighlighter>
          </div>
          <br />
          <p>
            Para adicionar um bloco de código ao comando de uma questão, transforme-o em
            um <em>array</em> e adicione cada linha como um elemento do mesmo.
          </p>
          <p>
            Em seguida, delimite o bloco de código usando os caracteres{" "}
            <code className="font-bold bg-slate-300 rounded p-1">```</code> (três crases),
            como na <em>segunda questão</em> do exemplo acima.
          </p>
          <p className="mt-2">
            <strong>💡 Dica:</strong> use{" "}
            <a
              className="text-indigo-600 hover:underline"
              target="_blank"
              href="https://codepen.io/nosilleg/pen/KdmLPO"
            >
              esta ferramenta
            </a>{" "}
            para converter um texto com múltiplas linhas para um array JSON.
          </p>
          <p>
            <a
              className="text-indigo-600 hover:underline"
              target="_blank"
              href="https://github.com/liddack/test-taker/assets/8820502/5f205736-a48f-425d-a043-1bc380f4590c"
            >
              🎬 Aqui está um vídeo demonstrando a ferramenta.
            </a>
          </p>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center flex-wrap gap-2">
          <button
            className={"w-full sm:w-48 border py-2 border-gray-600 rounded"}
            onClick={handleRemoveFile}
          >
            Remover arquivo
          </button>
          <button
            className="w-full sm:w-48 py-2 bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 disabled:text-slate-300 disabled:bg-slate-500"
            onClick={handleGoToTest}
          >
            Iniciar teste
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadQuestions;
