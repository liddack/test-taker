interface ImportedAlternative {
  isCorrect: boolean;
  label: string;
}

export interface ImportedQuestion {
  command: string | string[];
  alternatives: ImportedAlternative[];
}
