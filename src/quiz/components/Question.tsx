import { useEffect, useState } from 'react';
import { Home, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';

interface QuestionProps {
  store: QuizStore;
  onComplete: () => void;
  onHome: () => void;
}

export function Question({ store, onComplete, onHome }: QuestionProps) {
  const [, setForceUpdate] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setForceUpdate({});
    });

    const timer = setInterval(() => {
      store.state.timeLeft--;
      if (store.state.timeLeft <= 0) {
        completeQuiz();
      }
      store.saveState(store.state.selectedSubject);
    }, 1000);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const completeQuiz = async () => {
    setIsLoading(true);
    await store.completeQuiz();
    setIsLoading(false);
    onComplete();
  };

  const handleSelectAnswer = async (index: number) => {
    setIsLoading(true);
    await store.selectAnswer(index);
    setIsLoading(false);
  };

  const previousQuestion = async () => {
    setIsLoading(true);
    await store.previousQuestion();
    setIsLoading(false);
  };

  const nextQuestion = async () => {
    setIsLoading(true);
    if (!store.nextQuestion()) {
      await completeQuiz();
    }
    setIsLoading(false);
  };

  const handleHome = () => {
    store.saveState(store.state.selectedSubject);
    onHome();
  };

  const question = store.state.questions[store.state.currentQuestion];
  const minutes = Math.floor(store.state.timeLeft / 60);
  const seconds = store.state.timeLeft % 60;
  const currentAnswer = store.state.answers[store.state.currentQuestion];

  if (!question || isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-lg">
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{store.state.currentQuestion + 1}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Loading Question...
          </div>
          <div className="mt-4 w-64 h-2 mx-auto bg-gray-700/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-loading"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
          <button
            onClick={handleHome}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Go to Home"
          >
            <Home className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-lg"></div>
            <svg width="60" height="60" className="transform -rotate-90">
              <circle
                cx="30"
                cy="30"
                r="28"
                fill="none"
                stroke="rgba(229, 231, 235, 0.5)"
                strokeWidth="4"
              ></circle>
              <circle
                cx="30"
                cy="30"
                r="28"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - (store.state.currentQuestion + 1) / store.state.questions.length)}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              ></circle>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1"></stop>
                  <stop offset="100%" stopColor="#A855F7"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {store.state.currentQuestion + 1}/{store.state.questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-3 bg-black/5 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/20">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className="font-mono text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      <div className="relative mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          {question.question}
        </h2>
      </div>
      
      <div className="space-y-4 mb-8">
        {question.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            className={`group w-full p-5 text-left rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
              currentAnswer === index
                ? 'border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white transform scale-[1.02]'
                : 'border-gray-100 hover:border-transparent hover:shadow-lg hover:scale-[1.01]'
            }`}
          >
            {currentAnswer !== index && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            )}
            <div className="flex items-center">
              <span className={`inline-block w-10 h-10 rounded-full flex items-center justify-center text-base
                ${currentAnswer === index
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-700 group-hover:bg-white/80'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`ml-4 text-base ${
                currentAnswer === index ? 'text-white' : 'text-gray-700'
              }`}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        {store.state.currentQuestion > 0 ? (
          <button
            onClick={previousQuestion}
            className="flex items-center px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
        ) : <div></div>}
        
        <button
          onClick={nextQuestion}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          {store.state.currentQuestion === store.state.questions.length - 1 ? 'Finish' : 'Next'}
          {store.state.currentQuestion < store.state.questions.length - 1 && (
            <ArrowRight className="w-5 h-5 ml-2" />
          )}
        </button>
      </div>
    </div>
  );
}