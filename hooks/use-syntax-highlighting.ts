import hljs from "highlight.js";
import abap from "highlightjs-sap-abap/dist/abap.es.min";
import "highlight.js/styles/xcode.css";
import { useEffect } from "react";

hljs.registerLanguage("abap", abap);

export function useSyntaxHighlighting() {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
}
