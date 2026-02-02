"use client";

import { useState, useEffect } from 'react';
import { BrainCircuit, Brain, Heart, Turtle, Award, RotateCw, Check } from 'lucide-react';
import quizData from '@/data/questoes_shift.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const BrainIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'correta': return <Brain className={className} />;
    case 'B': return <Heart className={className} />;
    case 'A': return <Turtle className={className} />;
    default: return <BrainCircuit className={className} />;
  }
};

export default function Quiz() {
  const allQuestions = quizData.niveis.flatMap(level => level.questoes);

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<{visualKey: string, originalKey: string, value: string}[]>([]);

  // Carregar progresso
  useEffect(() => {
    const savedIndex = localStorage.getItem('reset-quiz-index');
    const savedXp = localStorage.getItem('reset-quiz-xp');
    if (savedIndex) setCurrentQuestionIndex(Math.min(parseInt(savedIndex), allQuestions.length - 1));
    if (savedXp) setXp(parseInt(savedXp));
    setIsLoaded(true);
  }, []);

  // Salvar progresso
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('reset-quiz-index', currentQuestionIndex.toString());
      localStorage.setItem('reset-quiz-xp', xp.toString());
    }
  }, [currentQuestionIndex, xp, isLoaded]);

  // Lógica de Embaralhamento
  useEffect(() => {
    if (isLoaded && currentQuestionIndex < allQuestions.length) {
      const currentQuestion = allQuestions[currentQuestionIndex];
      const options = Object.entries(currentQuestion.alternativas).map(([key, value]) => ({
        originalKey: key,
        value: value as string
      }));
      
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      
      const visualOptions = shuffled.map((opt, index) => ({
        visualKey: String.fromCharCode(65 + index), 
        originalKey: opt.originalKey,
        value: opt.value
      }));
      
      setShuffledOptions(visualOptions);
    }
  }, [currentQuestionIndex, isLoaded]);

  const proximaQuestao = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
    if ((currentQuestionIndex + 1) % 20 === 0) {
      tocarSom('nivel');
    }
  }

  const tocarSom = (tipo: 'click' | 'vitoria' | 'nivel') => {
    const sons: Record<string, string> = {
      'click': 'sounds/click.mp3',
      'vitoria': 'sounds/brain-power.mp3',
      'nivel': 'sounds/level-up.mp3'
    };
    const audio = new Audio(sons[tipo]);
    audio.play().catch(e => console.log("Aguardando interação"));
  };

  const handleAnswerSelect = (visualKey: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(visualKey);
    const selectedOption = shuffledOptions.find(opt => opt.visualKey === visualKey);

    if (selectedOption?.originalKey === 'C') {
      setXp(prev => prev + 10);
      tocarSom('vitoria');
    } else if (selectedOption?.originalKey === 'B') {
      setXp(prev => prev + 5);
      tocarSom('click');
    } else {
      setXp(prev => prev + 0);
      tocarSom('click');
    }

    setShowFeedback(true);
    setTimeout(proximaQuestao, 2000);
  };

  const handleRestart = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'RESET',
      text: 'O bullying não te define. O RESET sim. ⚡',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado!');
      }
    } catch (err) { console.log('Erro ao compartilhar'); }
  };

  if (!isLoaded) return <div className="font-headline text-2xl animate-pulse p-10 text-primary">CARREGANDO MISSÃO...</div>;

  const isQuizFinished = currentQuestionIndex >= allQuestions.length;
  const progress = (currentQuestionIndex / allQuestions.length) * 100;
  const currentQuestion = allQuestions[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl mx-auto p-4 font-body">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-headline text-primary flex items-center gap-3">
          <RotateCw className="w-8 h-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]"/>
          <span>RESET</span>
        </h1>
        <div className="flex items-center gap-2 font-bold text-accent bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
          <Award className="w-5 h-5"/>
          <span>{xp} XP</span>
        </div>
      </header>

      <Card className="bg-card/50 border-primary/20 backdrop-blur-lg overflow-hidden relative min-h-[550px] flex flex-col shadow-2xl shadow-primary/10">
        <Progress value={progress} className="h-2 bg-primary/10 [&>div]:bg-accent"/>
        
        {isQuizFinished ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-6 flex-grow">
            <p className="text-lg italic text-muted-foreground max-w-md font-medium">O bullying não define você. A verdadeira força está na empatia e na coragem.</p>
            <div className="text-7xl font-bold text-white">{xp} XP</div>
            <Button onClick={handleShare} variant="default" size="lg" className="bg-accent/90 hover:bg-accent text-white shadow-lg">
              Compartilhar Despertar ⚡
            </Button>
            <Button onClick={handleRestart} variant="outline" size="sm" className="mt-4">
              REINICIAR
            </Button>
          </div>
        ) : (
          <div key={currentQuestionIndex} className="relative flex-grow flex flex-col p-6 sm:p-8">
            <CardHeader className="p-0 mb-8">
              <CardDescription className="text-muted-foreground font-mono uppercase tracking-widest text-xs">
                Missão {currentQuestionIndex + 1} / {allQuestions.length}
              </CardDescription>
              <CardTitle className="text-2xl md:text-3xl font-medium text-foreground leading-tight mt-2">
                {currentQuestion?.texto}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 grid gap-4">
              {shuffledOptions.map((option) => (
                <Button
                  key={option.visualKey}
                  variant="outline"
                  className={`h-auto min-h-min justify-start text-left py-3 px-4 bg-background/50 border text-foreground/80 transition-all duration-200 hover:scale-[1.02] disabled:opacity-100
                    ${selectedAnswer === option.visualKey
                      ? (option.originalKey === 'C' ? 'border-accent ring-2 ring-accent shadow-accent/20' : 'border-primary ring-2 ring-primary')
                      : 'border-primary/20 hover:bg-primary/10'
                    }`}
                  onClick={() => handleAnswerSelect(option.visualKey)}
                  disabled={!!selectedAnswer}
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono flex-shrink-0
                      ${selectedAnswer === option.visualKey ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      {option.visualKey}
                    </div>
                    <span className="flex-1 text-base whitespace-normal pt-2">{option.value}</span>
                    {selectedAnswer === option.visualKey && <Check className="w-6 h-6 text-accent self-center ml-auto"/>}
                  </div>
                </Button>
              ))}
            </CardContent>

            {/* FRASE ATUALIZADA ABAIXO */}
            <p className='text-center text-[12.5px] text-gray-400 mt-6 leading-relaxed'>
              Sua voz é o seu <span className="font-bold text-primary">RESET! </span>    
              Bullying é crime (Lei 14.811/24). <br/>
              Não joga solo: deu ruim? Chama um adulto. <span className="font-bold text-white">Passa a visão!</span> 
            </p>

            {showFeedback && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 z-10">
                <BrainIcon type={shuffledOptions.find(o => o.visualKey === selectedAnswer)?.originalKey === 'C' ? 'correta' : shuffledOptions.find(o => o.visualKey === selectedAnswer)?.originalKey || ''} className="w-20 h-20 mb-4 text-primary animate-pulse"/>
                <h3 className="text-3xl font-headline text-white mb-2 uppercase">
                  {shuffledOptions.find(o => o.visualKey === selectedAnswer)?.originalKey === 'C' ? 'NEOCÓRTEX ATIVADO!' : shuffledOptions.find(o => o.visualKey === selectedAnswer)?.originalKey === 'B' ? 'SISTEMA LÍMBICO' : 'CÉREBRO REPTILIANO'}
                </h3>
                <p className="text-muted-foreground">Processando evolução...</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}