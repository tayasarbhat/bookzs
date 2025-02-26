import { useState, useEffect } from 'react';
import { QuizStore } from './store/QuizStore';
import { NameInput } from './components/NameInput';
import { SubjectSelection } from './components/SubjectSelection';
import { Question } from './components/Question';
import { Results } from './components/Results';
import { Review } from './components/Review';
import { LogoutConfirmation } from './components/LogoutConfirmation';
import { CreateSubject } from './components/CreateSubject';
import { X } from 'lucide-react';

interface QuizAppProps {
  onClose: () => void;
}

export function QuizApp({ onClose }: QuizAppProps) {
  const [store] = useState(() => new QuizStore());
  const [view, setView] = useState<'name' | 'subjects' | 'quiz' | 'results' | 'review' | 'create' | 'logout'>('name');

  useEffect(() => {
    store.loadPlayerName();
    if (store.state.playerName) {
      setView('subjects');
    }
  }, [store]);

  const renderView = () => {
    switch (view) {
      case 'name':
        return <NameInput store={store} onComplete={() => setView('subjects')} />;
      case 'subjects':
        return (
          <SubjectSelection 
            store={store} 
            onSelectSubject={() => setView('quiz')}
            onCreateSubject={() => setView('create')}
            onLogout={() => setView('logout')}
          />
        );
      case 'quiz':
        return (
          <Question 
            store={store} 
            onComplete={() => setView('results')} 
            onHome={() => setView('subjects')}
          />
        );
      case 'results':
        return (
          <Results 
            store={store} 
            onReview={() => setView('review')}
            onRestart={() => setView('quiz')}
            onHome={() => setView('subjects')}
          />
        );
      case 'review':
        return <Review store={store} onBack={() => setView('results')} />;
      case 'create':
        return <CreateSubject store={store} onComplete={() => setView('subjects')} />;
      case 'logout':
        return (
          <LogoutConfirmation 
            onConfirm={() => {
              store.clearAllData();
              setView('name');
            }}
            onCancel={() => setView('subjects')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 animate-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          {renderView()}
        </div>
      </div>
    </div>
  );
}