import { X } from 'lucide-react';
import { QuizStore } from '../store/QuizStore';
import { availableIcons, availableColors } from '../config/constants';

interface CreateSubjectProps {
  store: QuizStore;
  onComplete: () => void;
}

export function CreateSubject({ store, onComplete }: CreateSubjectProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newSubject = {
      id: formData.get('name')?.toString().replace(/\s+/g, ''),
      name: formData.get('name'),
      icon: formData.get('icon'),
      color: formData.get('color'),
      questions: parseInt(formData.get('questions')?.toString() || '0'),
      timeInMinutes: parseInt(formData.get('timeInMinutes')?.toString() || '0')
    };

    try {
      await store.createSubject(newSubject);
      onComplete();
    } catch (error) {
      alert((error as Error).message || 'Failed to create subject');
    }
  };

  const handleIconSelect = (icon: string) => {
    const buttons = document.querySelectorAll('.icon-button');
    buttons.forEach(btn => {
      btn.classList.remove('bg-white', 'shadow-md');
      if ((btn as HTMLElement).dataset.icon === icon) {
        btn.classList.add('bg-white', 'shadow-md');
      }
    });
    (document.querySelector('input[name="icon"]') as HTMLInputElement).value = icon;
  };

  const handleColorSelect = (color: string) => {
    const buttons = document.querySelectorAll('.color-button');
    buttons.forEach(btn => {
      btn.classList.remove('ring-4', 'ring-indigo-200');
      if ((btn as HTMLElement).dataset.color === color) {
        btn.classList.add('ring-4', 'ring-indigo-200');
      }
    });
    (document.querySelector('input[name="color"]') as HTMLInputElement).value = color;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create New Subject</h2>
          <button
            onClick={onComplete}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
              placeholder="Enter subject name"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose an Icon
            </label>
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-xl">
              {availableIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className="icon-button w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white transition-all duration-200"
                  data-icon={icon}
                >
                  <i data-lucide={icon} className="w-6 h-6"></i>
                </button>
              ))}
            </div>
            <input type="hidden" name="icon" required />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Color Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              {availableColors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorSelect(color.value)}
                  className={`color-button h-12 rounded-xl bg-gradient-to-r ${color.value} opacity-75 hover:opacity-100 transition-all duration-200 flex items-center justify-center text-white font-medium`}
                  data-color={color.value}
                >
                  {color.name}
                </button>
              ))}
            </div>
            <input type="hidden" name="color" required />
          </div>

          {/* Questions and Time */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                name="questions"
                required
                min="5"
                max="50"
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (minutes)
              </label>
              <input
                type="number"
                name="timeInMinutes"
                required
                min="1"
                max="60"
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="5"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Create Subject
          </button>
        </form>
      </div>
    </div>
  );
}