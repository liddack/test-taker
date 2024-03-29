import { ImportedQuestion } from "./interfaces/imported-question";

export const TestExample: ImportedQuestion[] = [
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
  {
    command: "Quais são os três estados mais populosos dos Estados Unidos?",
    alternatives: [
      { isCorrect: true, label: "Califórnia" },
      { isCorrect: true, label: "Texas" },
      { isCorrect: true, label: "Flórida" },
      { isCorrect: false, label: "Nova York" },
    ],
  },
  {
    command: "Quais são os planetas do sistema solar?",
    alternatives: [
      { isCorrect: true, label: "Mercúrio" },
      { isCorrect: false, label: "Na'vi" },
      { isCorrect: true, label: "Terra" },
      { isCorrect: true, label: "Marte" },
    ],
  },
  {
    command: "Quais são os principais componentes do sangue humano?",
    alternatives: [
      { isCorrect: true, label: "Plasma" },
      { isCorrect: true, label: "Glóbulos vermelhos" },
      { isCorrect: true, label: "Glóbulos brancos" },
      { isCorrect: false, label: "Hormônios" },
    ],
  },
  {
    command: "Qual destas obras foi escrita por Machado de Assis?",
    alternatives: [
      { isCorrect: false, label: "Capitães da Areia" },
      { isCorrect: false, label: "Grande Sertão: Veredas" },
      { isCorrect: true, label: "Memórias Póstumas de Brás Cubas" },
      { isCorrect: false, label: "O Cortiço" },
    ],
  },
  {
    command: "Quais desses países fazem parte do G7?",
    alternatives: [
      { isCorrect: true, label: "Estados Unidos" },
      { isCorrect: true, label: "Reino Unido" },
      { isCorrect: false, label: "China" },
      { isCorrect: false, label: "Índia" },
    ],
  },
  {
    command: "Quais são os elementos químicos do grupo dos halogênios?",
    alternatives: [
      { isCorrect: true, label: "Flúor" },
      { isCorrect: true, label: "Cloro" },
      { isCorrect: true, label: "Bromo" },
      { isCorrect: false, label: "Hélio" },
    ],
  },
  {
    command: "Quais destes filmes foram dirigidos por Steven Spielberg?",
    alternatives: [
      { isCorrect: true, label: "Tubarão" },
      { isCorrect: true, label: "E.T. - O Extraterrestre" },
      { isCorrect: false, label: "Pulp Fiction" },
      { isCorrect: false, label: "A Origem" },
    ],
  },
  {
    command: "Quais são os ingredientes básicos de uma pizza margherita?",
    alternatives: [
      { isCorrect: true, label: "Molho de tomate" },
      { isCorrect: true, label: "Queijo mozzarella" },
      { isCorrect: false, label: "Pepperoni" },
      { isCorrect: false, label: "Frango" },
    ],
  },
];
