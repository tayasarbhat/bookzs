import { UserCircle } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';

interface NameInputProps {
  store: QuizStore;
  onComplete: () => void;
}

export function NameInput({ store, onComplete }: NameInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim();
    
    if (name) {
      store.state.playerName = name;
      store.savePlayerName();
      onComplete();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <UserCircle className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
        Welcome to the Quiz
      </h2>
      <p className="text-gray-600 mb-8 text-lg">Enter your name to begin</p>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          className="w-full px-6 py-4 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none mb-6 text-lg"
          required
        />
        <button
          type="submit"
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-lg font-medium"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
}