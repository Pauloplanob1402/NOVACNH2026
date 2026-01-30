export interface Alternative {
  id: string;
  texto: string;
  pontos: number;
  tipo_cerebro: 'Reptiliano' | 'Límbico' | 'Neocórtex';
}

export interface Question {
  id: string;
  texto: string;
  categoria: string;
  alternativas: Alternative[];
}

export interface Level {
  nivel: number;
  questoes: Question[];
}

export interface QuizData {
  metadata: {
    title: string;
    version: string;
  };
  niveis: Level[];
}
