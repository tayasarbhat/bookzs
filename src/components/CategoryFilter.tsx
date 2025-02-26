import { Category } from '../types';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Grid, BookOpen, Brain, Calculator, GraduationCap } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainCategories = categories.filter(cat => 
    ['QUANTITATIVE APTITUDE', 'REASONING', 'GENERAL KNOWLEDGE', 'GENERAL ENGLISH'].includes(cat.name)
  );
  
  const otherCategories = categories.filter(cat => 
    !['QUANTITATIVE APTITUDE', 'REASONING', 'GENERAL KNOWLEDGE', 'GENERAL ENGLISH'].includes(cat.name)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'QUANTITATIVE APTITUDE':
        return <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'REASONING':
        return <Brain className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'GENERAL KNOWLEDGE':
        return <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'GENERAL ENGLISH':
        return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />;
      default:
        return null;
    }
  };

  const getCategoryStyle = (category: Category | null) => {
    if (!category) {
      return selectedCategory === null
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 ring-2 ring-blue-500/50 ring-offset-2'
        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-indigo-500/25';
    }

    const isSelected = selectedCategory === category.name;
    return `${category.color} ${
      isSelected ? `ring-2 ring-offset-2 ${category.ringColor}` : ''
    }`;
  };

  const isOtherCategorySelected = selectedCategory && otherCategories.some(cat => cat.name === selectedCategory);

  return (
    <div className="my-3 sm:my-8">
      {/* Main Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {mainCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`group relative p-2 sm:p-3 rounded-2xl text-white transition-all duration-300 
              transform hover:scale-[1.02] hover:shadow-xl
              ${getCategoryStyle(category)}
              ${selectedCategory === category.name ? 'scale-[1.02]' : ''}`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1 rounded-xl bg-white/20 backdrop-blur-sm">
                  {getCategoryIcon(category.name)}
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-semibold leading-tight">
                {category.name}
              </h3>
              <div className="mt-1 h-1 w-12 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-0 group-hover:w-full bg-white/60 transition-all duration-700 ease-out" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* All Books Button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`group relative p-2 sm:p-3 rounded-2xl text-white transition-all duration-300 
            transform hover:scale-[1.02] hover:shadow-xl
            ${getCategoryStyle(null)}
            ${selectedCategory === null ? 'scale-[1.02]' : ''}`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1 rounded-xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold leading-tight">
              All Books
            </h3>
            <div className="mt-1 h-1 w-12 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-0 group-hover:w-full bg-white/60 transition-all duration-700 ease-out" />
            </div>
          </div>
        </button>

        {/* More Categories Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group relative w-full p-2 sm:p-3 rounded-2xl text-white transition-all duration-300 
              transform hover:scale-[1.02] hover:shadow-xl
              ${isOtherCategorySelected 
                ? selectedCategory && otherCategories.find(cat => cat.name === selectedCategory)?.color
                : 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-600'
              }
              ${isOtherCategorySelected ? `ring-2 ring-offset-2 ${otherCategories.find(cat => cat.name === selectedCategory)?.ringColor}` : ''}`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold leading-tight">
                  {isOtherCategorySelected ? selectedCategory : 'More Categories'}
                </h3>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              <div className="mt-1 h-1 w-12 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-0 group-hover:w-full bg-white/60 transition-all duration-700 ease-out" />
              </div>
            </div>
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 border border-slate-200">
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
                {otherCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      onSelectCategory(category.name);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 text-sm transition-all hover:bg-slate-50
                      ${selectedCategory === category.name ? 'bg-slate-50 font-medium' : 'text-slate-700'}`}
                  >
                    <span>{category.name}</span>
                    {selectedCategory === category.name && (
                      <span className={`w-2 h-2 rounded-full ${category.color.replace('bg-gradient-to-r', '')}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}