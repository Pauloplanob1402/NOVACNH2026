"use client";

import { useState, useEffect } from 'react';
import { BrainCircuit, Brain, Heart, Turtle, Award, RotateCw } from 'lucide-react';
import type { Alternative, Question, QuizData } from '@/lib/types';
import quizData from '@/lib/questoes_shift.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const BrainIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'Reptiliano':
      return <Turtle className={className} />;
    case 'Límbico':
      return <Heart className={className} />;
    case 'Neocórtex':
      return <Brain className={className} />;
    default:
      return <BrainCircuit className={className} />;
  }
};

export default function Quiz() {
  const allQuestions: Question[] = (quizData as QuizData).niveis.flatMap(level => level.questoes);

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Alternative | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const savedIndex = localStorage.getItem('brainshift-quiz-index');
    const savedXp = localStorage.getItem('brainshift-quiz-xp');
    if (savedIndex) {
      const parsedIndex = parseInt(savedIndex, 10);
      if (parsedIndex < allQuestions.length) {
        setCurrentQuestionIndex(parsedIndex);
      } else {
        // If saved index is out of bounds (e.g. quiz finished), set to finished state
        setCurrentQuestionIndex(allQuestions.length);
      }
    }
    if (savedXp) {
      setXp(parseInt(savedXp, 10));
    }
    setIsLoaded(true);
  }, [allQuestions.length]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('brainshift-quiz-index', currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('brainshift-quiz-xp', xp.toString());
    }
  }, [xp, isLoaded]);

  const playSound = (type: 'correct' | 'incorrect') => {
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.play().catch(error => {
        console.warn(`Could not play sound: ${type}.mp3`, error);
      });
    } catch (error) {
      console.warn('Audio playback is not supported or failed.', error);
    }
  };

  const handleAnswerSelect = (answer: Alternative) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setXp(prevXp => prevXp + answer.pontos);
    playSound('correct');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }, 2500);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setXp(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Carregando o quiz...</p>
        </div>
      </Card>
    );
  }

  const isQuizFinished = currentQuestionIndex >= allQuestions.length;
  const progress = isQuizFinished ? 100 : (currentQuestionIndex / allQuestions.length) * 100;
  const currentQuestion = allQuestions[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          BrainShift Quiz
        </h2>
        <div className="flex items-center gap-2 font-bold text-primary">
          <Award className="w-6 h-6" />
          <span>{xp} XP</span>
        </div>
      </div>
      <Card className="overflow-hidden relative transition-all duration-500 min-h-[480px] flex flex-col">
        <Progress value={progress} className="h-2" />
        {isQuizFinished ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-6 flex-grow">
            <CardTitle className="text-3xl font-bold">Quiz Concluído!</CardTitle>
            <CardDescription className="text-lg">Você acumulou um total de</CardDescription>
            <div className="text-7xl font-extrabold text-primary">{xp} XP</div>
            <p className="text-muted-foreground max-w-md">
              Você explorou diferentes facetas do seu pensamento. Continue se desenvolvendo!
            </p>
            <Button onClick={handleRestart} size="lg" className="mt-4">
              <RotateCw className="mr-2 h-4 w-4" />
              Recomeçar Quiz
            </Button>
          </div>
        ) : (
          <div className="relative flex-grow">
            <div
              className={`transition-opacity duration-300 w-full h-full ${showFeedback ? 'opacity-0' : 'opacity-100'}`}
              style={{ transitionDelay: showFeedback ? '0ms' : '300ms' }}
            >
              <CardHeader>
                <CardDescription>
                  Questão {currentQuestionIndex + 1} de {allQuestions.length}
                </CardDescription>
                <CardTitle className="text-xl md:text-2xl">{currentQuestion.texto}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                {currentQuestion.alternativas.map((alt) => (
                  <Button
                    key={alt.id}
                    variant={selectedAnswer?.id === alt.id ? 'default' : 'outline'}
                    size="lg"
                    className={`h-auto justify-start text-left whitespace-normal py-3 transition-all duration-300 ${
                      selectedAnswer && selectedAnswer.id !== alt.id ? 'opacity-50' : ''
                    } ${
                      selectedAnswer?.id === alt.id ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    onClick={() => handleAnswerSelect(alt)}
                    disabled={!!selectedAnswer}
                  >
                    <div className="flex items-start gap-3">
                      <BrainIcon type={alt.tipo_cerebro} className="w-5 h-5 mt-1 shrink-0 text-muted-foreground" />
                      <span>{alt.texto}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </div>
            
            {showFeedback && selectedAnswer && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-background p-8 transition-opacity duration-300 ${showFeedback ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: showFeedback ? '300ms' : '0ms' }}
              >
                <div className="text-center">
                  <BrainIcon type={selectedAnswer.tipo_cerebro} className="w-20 h-20 mx-auto text-accent animate-pulse" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-accent">{selectedAnswer.tipo_cerebro}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">+{selectedAnswer.pontos} XP</p>
                  <p className="mt-2 text-muted-foreground">Ativando o pensamento {selectedAnswer.tipo_cerebro.toLowerCase()}!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
