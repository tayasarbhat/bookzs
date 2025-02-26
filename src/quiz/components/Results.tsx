import { useState, useEffect } from 'react';
import { BookOpen, RefreshCcw, Home } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';

interface ResultsProps {
  store: QuizStore;
  onReview: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export function Results({ store, onReview, onRestart, onHome }: ResultsProps) {
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState(0);

  useEffect(() => {
    const loadResults = async () => {
      const calculatedScore = store.calculateScore();
      setScore(calculatedScore);
      setPercentage(Math.round((calculatedScore / store.state.questions.length) * 100));

      const leaderboardData = await store.getLeaderboard();
      setLeaderboard(leaderboardData);
      setUserRank(leaderboardData.findIndex(entry => entry.name === store.state.playerName) + 1);
    };

    loadResults();
  }, [store]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Score Card */}
      <div className="glassmorphism rounded-3xl p-8 shadow-xl" data-aos="fade-right">
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-lg opacity-50"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">{percentage}%</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {store.state.playerName}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rank #{userRank} • {score}/{store.state.questions.length} correct
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onReview}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Review Answers
            </button>
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glassmorphism rounded-3xl p-8 shadow-xl" data-aos="fade-left">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Top Performers</h3>
        <div className="space-y-4">
          {leaderboard.slice(0, 5).map((entry, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-xl ${
                entry.name === store.state.playerName
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'bg-white/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                entry.name === store.state.playerName ? 'bg-white/20' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              } mr-4`}>
                <span className="text-white">{index + 1}</span>
              </div>
              <span className="flex-1 font-medium">{entry.name}</span>
              <span className="font-bold">{entry.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <button
          onClick={onHome}
          className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Home className="w-5 h-5" />
          Back to Subjects
        </button>
      </div>
    </div>
  );
}