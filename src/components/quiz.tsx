
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Award, CheckCircle, XCircle, RotateCw, Share2 } from 'lucide-react';
import quizDataJson from '@/data/questoes_cnh.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Questao, QuizData } from '@/lib/types';

const quizData: QuizData = quizDataJson;

const tocarSom = (som: 'acerto' | 'erro' | 'finalizar') => {
  if (typeof window !== 'undefined') {
    const audio = new Audio(`/sounds/${som}.mp3`);
    audio.play().catch(error => {
      console.error(`Erro ao tocar o som ${som}:`, error);
    });
  }
};

export default function Quiz() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [showGlow, setShowGlow] = useState(false); // Estado para a animação de brilho

  useEffect(() => {
    const todasQuestoes = quizData.niveis.flatMap(nivel => nivel.questoes);
    setQuestoes(todasQuestoes);
  }, []);

  const handleResposta = (index: number) => {
    if (respostaSelecionada !== null) return;

    setRespostaSelecionada(index);
    const questaoCorreta = questoes[indiceQuestaoAtual].respostaCorreta;

    if (index === questaoCorreta) {
      setPontuacao(p => p + 1);
      tocarSom('acerto');
      setShowGlow(true); // Ativa o brilho
    } else {
      tocarSom('erro');
    }

    setMostrarExplicacao(true);
  };

  const proximaQuestao = useCallback(() => {
    setShowGlow(false); // Desativa o brilho para a próxima questão
    setMostrarExplicacao(false);
    setRespostaSelecionada(null);

    if (indiceQuestaoAtual < questoes.length - 1) {
      setIndiceQuestaoAtual(i => i + 1);
    } else {
      setQuizFinalizado(true);
      tocarSom('finalizar');
    }
  }, [indiceQuestaoAtual, questoes.length]);

  const reiniciarQuiz = () => {
    setShowGlow(false);
    setIndiceQuestaoAtual(0);
    setPontuacao(0);
    setRespostaSelecionada(null);
    setMostrarExplicacao(false);
    setQuizFinalizado(false);
  };

  const shareResult = async () => {
    const shareText = `Estou estudando para a Nova CNH 2026 e acertei ${pontuacao} questões! 🚗💨`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Resultado no Simulado CNH 2026',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para desktop ou navegadores sem suporte
      navigator.clipboard.writeText(shareText);
      alert('Resultado copiado para a área de transferência! Cole no seu app de mensagens para compartilhar.');
    }
  };


  if (questoes.length === 0) {
    return <div className="text-center p-8 text-white">Carregando simulado...</div>;
  }

  const questaoAtual = questoes[indiceQuestaoAtual];
  const progresso = ((indiceQuestaoAtual + 1) / 100) * 100;

  if (quizFinalizado) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 text-center bg-card text-card-foreground">
        <CardTitle className="text-3xl font-bold mb-4 text-brand-secondary">Simulado Finalizado!</CardTitle>
        <CardContent className="flex flex-col gap-4">
          <p className="text-xl">Sua pontuação final foi:</p>
          <div className="text-6xl font-bold text-primary">
            {pontuacao} / 100
          </div>
          <Button onClick={reiniciarQuiz} size="lg" className="bg-brand-secondary text-brand-primary hover:bg-brand-secondary/90">
            <RotateCw className="mr-2 h-5 w-5" />
            Refazer Simulado
          </Button>
          <Button onClick={shareResult} size="lg" variant="outline" className="bg-green-500 text-white hover:bg-green-600 border-green-500">
            <Share2 className="mr-2 h-5 w-5" />
            Compartilhar no WhatsApp
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">NOVA CNH 2026</h1>
        <div className="flex items-center gap-3 font-bold text-lg text-white">
          <Award className="w-6 h-6 text-brand-secondary"/>
          <span>{pontuacao} Pontos</span>
        </div>
      </header>

      <Card className={`overflow-hidden bg-card text-card-foreground border-border transition-shadow duration-500 ${showGlow ? 'correct-answer-glow' : ''}`}>
        <Progress value={progresso} className="h-2 bg-brand-secondary" />
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl leading-tight text-white">
            ({indiceQuestaoAtual + 1}/100) {questaoAtual.texto}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {questaoAtual.alternativas.map((alternativa, index) => {
            const isSelected = respostaSelecionada === index;
            const isCorrect = questaoAtual.respostaCorreta === index;
            
            let buttonClass = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
            if (isSelected) {
              buttonClass = isCorrect ? 'bg-yellow-400 text-black' : 'bg-red-600 text-white';
            } else if (respostaSelecionada !== null && isCorrect) {
                buttonClass = 'bg-yellow-400 text-black';
            }
            
            return (
            <Button
              key={index}
              className={`h-auto justify-start text-left py-3 px-4 transition-all duration-300 ${buttonClass}`}
              onClick={() => handleResposta(index)}
              disabled={respostaSelecionada !== null}
            >
              <div className="flex items-center gap-4">
                 <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                 <span className="flex-1 whitespace-normal">{alternativa}</span>
                 {isSelected && (isCorrect ? <CheckCircle /> : <XCircle />)}
              </div>
            </Button>
          )} )}
        </CardContent>
      </Card>

      {mostrarExplicacao && (
        <Card className="mt-4 p-4 bg-gray-800 text-white border-t-4 border-brand-secondary">
            <h3 className="font-bold text-lg mb-2">Explicação:</h3>
            <p>{questaoAtual.explicacao}</p>
            <Button onClick={proximaQuestao} className="mt-4 w-full bg-brand-secondary text-brand-primary hover:bg-brand-secondary/90" size="lg">
              Próxima Questão
            </Button>
        </Card>
      )}
    </div>
  );
}
