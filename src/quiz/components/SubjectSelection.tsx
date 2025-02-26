import { useState, useEffect } from 'react';
import { Brain, Clock, LogOut, Plus } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';
import { subjects } from '../config/constants';

interface SubjectSelectionProps {
  store: QuizStore;
  onSelectSubject: () => void;
  onCreateSubject: () => void;
  onLogout: () => void;
}

export function SubjectSelection({ store, onSelectSubject, onCreateSubject, onLogout }: SubjectSelectionProps) {
  const [loading, setLoading] = useState(true);
  const [loadingSubject, setLoadingSubject] = useState<string | null>(null);
  const usedPalettes = new Set();

  useEffect(() => {
    const loadSubjects = async () => {
      await store.loadSubjects();
      setLoading(false);
    };
    loadSubjects();
  }, [store]);

  const handleSubjectSelect = async (subjectId: string) => {
    try {
      setLoadingSubject(subjectId);
      store.state.selectedSubject = subjectId;
      store.loadState(subjectId);

      if (store.state.quizCompleted) {
        store.clearState(subjectId);
        store.state.selectedSubject = subjectId;
        await store.startQuiz(subjectId);
      } else if (store.state.quizStarted) {
        onSelectSubject();
      } else {
        await store.startQuiz(subjectId);
      }

      setLoadingSubject(null);
      onSelectSubject();
    } catch (error) {
      console.error('Error selecting subject:', error);
      alert('Failed to start quiz. Please try again.');
      setLoadingSubject(null);
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-600 to-cyan-500',
      'from-purple-600 to-pink-500',
      'from-emerald-600 to-teal-500',
      'from-orange-600 to-yellow-500',
      'from-red-600 to-rose-500',
      'from-indigo-600 to-violet-500'
    ];

    let availableGradients = gradients.filter(g => !usedPalettes.has(g));
    if (availableGradients.length === 0) {
      usedPalettes.clear();
      availableGradients = gradients;
    }

    const gradient = availableGradients[Math.floor(Math.random() * availableGradients.length)];
    usedPalettes.add(gradient);
    return gradient;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 h-[180px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-5 w-24 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex items-center gap-4" data-aos="fade-down">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">
              Welcome back, {store.state.playerName}!
            </h2>
            <p className="text-gray-600">Choose a subject to start your quiz journey</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4" data-aos="fade-up">
          {store.state.playerName === 'admin@quiz' && (
            <button
              onClick={onCreateSubject}
              className="flex items-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Subject
            </button>
          )}

          <button
            onClick={onLogout}
            className="flex items-center px-4 py-3 bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl border border-gray-200 transition-all duration-200 ml-auto"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject, index) => {
          const gradient = getRandomGradient();
          const isLoading = loadingSubject === subject.id;
          
          return (
            <div key={subject.id} className="group" data-aos="fade-up" data-aos-delay={index * 100}>
              <button
                onClick={() => handleSubjectSelect(subject.id)}
                disabled={isLoading}
                className={`w-full h-full rounded-2xl p-6 transition-all duration-500
                         hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02]
                         relative overflow-hidden
                         bg-gradient-to-r ${gradient} ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20
                                 flex items-center justify-center transform group-hover:scale-110 transition-all duration-500
                                 group-hover:rotate-6">
                      <Brain className={`w-7 h-7 text-white transform group-hover:-rotate-6 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 transform group-hover:translate-x-2 transition-transform duration-500">
                        {subject.name}
                      </h3>
                      <div className="flex items-center text-sm text-white/80">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{subject.timeInMinutes * 2} mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden mb-6">
                    <div className={`h-full bg-white/30 transition-all duration-1000 ease-out ${isLoading ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-white/90">
                    <div className="flex items-center text-sm">
                      <Brain className="w-4 h-4 mr-1" />
                      <span>{subject.questions} questions</span>
                    </div>
                    <div className="flex items-center font-medium">
                      <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-500">
                        {isLoading ? 'Loading...' : 'Start'}
                      </span>
                      {!isLoading && (
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}