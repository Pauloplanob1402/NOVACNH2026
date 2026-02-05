
export interface Questao {
  id: number;
  texto: string;
  alternativas: string[];
  respostaCorreta: number;
  explicacao: string;
}

export interface Nivel {
  id: number;
  nome: string;
  questoes: Questao[];
}

export interface QuizData {
  metadata: {
    total_questoes: number;
    versao: string;
  };
  niveis: Nivel[];
}
