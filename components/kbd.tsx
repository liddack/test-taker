import { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="bg-slate-800 text-white border-b-slate-900 border-b pb-[0.1rem] px-2 py-1 rounded text-[.9em] leading-4">
      {children}
    </kbd>
  );
}
