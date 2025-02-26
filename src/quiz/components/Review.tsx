import { Info, X } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';

interface ReviewProps {
  store: QuizStore;
  onBack: () => void;
}

export function Review({ store, onBack }: ReviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Review Answers</h2>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-6">
        {store.state.questions.map((question, index) => (
          <div key={index} className="review-card glassmorphism rounded-2xl p-6" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {question.options.map((option: string, optIndex: number) => (
                <div
                  key={optIndex}
                  className={`flex items-center p-4 rounded-xl ${
                    optIndex === question.answer
                      ? 'bg-green-100 border-2 border-green-500'
                      : optIndex === store.state.answers[index]
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-white/50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    optIndex === question.answer
                      ? 'bg-green-500 text-white'
                      : optIndex === store.state.answers[index]
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200'
                  } mr-3`}>
                    {String.fromCharCode(65 + optIndex)}
                  </span>
                  <span>{option}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Info className="w-5 h-5" />
                <span className="font-medium">Explanation</span>
              </div>
              <p className="text-gray-700">{question.explanation || 'No explanation available.'}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-8 right-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Back to Results
        </button>
      </div>
    </div>
  );
}