import { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="bg-slate-800 border-b-slate-900 border-b px-2 py-1 rounded">
      {children}
    </kbd>
  );
}
