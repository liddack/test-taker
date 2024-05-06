import { ReactNode } from "react";

export function Kbd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={`bg-black bg-opacity-40 text-white border-b-slate-900 border-b pb-[0.1rem] px-2 py-1 rounded text-[.9em] leading-4 ${className}`}
    >
      {children}
    </kbd>
  );
}
