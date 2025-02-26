import { useState, useEffect, useMemo } from 'react';
import { Library, ChevronLeft, ChevronRight, Menu, GraduationCap, Brain, Sparkles } from 'lucide-react';
import { categories } from './data';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { BookCard } from './components/BookCard';
import { MenuBar } from './components/MenuBar';
import { fetchBooks } from './api';
import { Book } from './types';
import { useTheme } from './context/ThemeContext';
import { QuizApp } from './quiz/QuizApp';

// Priority books that should always appear on the first page
const PRIORITY_BOOKS = [
  'Indian Polity by Laxmikanth 6th Edition McGraw Hill',
  'History of Modern India 2020 Edition Bipan Chandra',
  'Geography of India Majid Husain 9th Edition',
  'Ecology Environment Quick Revision Material Disha Experts',
  'Magbook Indian History Janmenjay Sahni',
  'Magbook General Science Poonam Singh',
  'Indian Economy by Ramesh Singh 12th Edition'
];

function App() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const booksPerPage = window.innerWidth < 640 ? 4 : 6;

  const placeholderBooks = Array(booksPerPage).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    title: '',
    author: '',
    category: '',
    coverUrl: '',
    description: '',
  }));

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks();
        setBooks(fetchedBooks);
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2;
          if (progress <= 100) {
            setTotalProgress(progress);
          } else {
            clearInterval(interval);
            setInitialLoadComplete(true);
          }
        }, 20);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const handleImageLoad = (bookId: string) => {
    setLoadedImages(prev => prev + 1);
  };

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                          book.author.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (currentPage === 1 && !search && !selectedCategory) {
      const priorityBooks: Book[] = [];
      const otherBooks: Book[] = [];

      filtered.forEach(book => {
        if (PRIORITY_BOOKS.some(title => 
          book.title.toLowerCase().includes(title.toLowerCase())
        )) {
          priorityBooks.push(book);
        } else {
          otherBooks.push(book);
        }
      });

      priorityBooks.sort((a, b) => {
        const aIndex = PRIORITY_BOOKS.findIndex(title => 
          a.title.toLowerCase().includes(title.toLowerCase())
        );
        const bIndex = PRIORITY_BOOKS.findIndex(title => 
          b.title.toLowerCase().includes(title.toLowerCase())
        );
        return aIndex - bIndex;
      });

      return [...priorityBooks, ...otherBooks];
    }

    return filtered;
  }, [books, search, selectedCategory, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  
  const displayBooks = useMemo(() => {
    if (loading) return placeholderBooks;
    
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    
    if (!initialLoadComplete && currentPage > 2) {
      return currentBooks.slice(0, booksPerPage * 2);
    }
    
    return currentBooks;
  }, [loading, filteredBooks, currentPage, indexOfFirstBook, indexOfLastBook, initialLoadComplete, booksPerPage]);

  const paginate = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showQuiz) {
    return <QuizApp onClose={() => setShowQuiz(false)} />;
  }

  return (
    <div className={`min-h-screen ${theme.bgGradient} transition-colors duration-300`}>
      {/* Header with Logo and Search */}
      <header className={`sticky top-0 z-50 mb-3 sm:mb-6 ${theme.navBg} glass-nav`}>
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* Logo */}
            <div className="w-full flex items-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl text-white shadow-md">
                  <Library className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <h1 className={`text-lg sm:text-2xl font-bold ${theme.textPrimary}`}>
                  Digital Library
                </h1>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full max-w-xl mx-auto">
              <SearchBar search={search} setSearch={setSearch} theme={theme} />
            </div>
          </div>
        </div>
        {loading && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-200/20">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Quiz Button */}
        <div className="mb-3 sm:mb-6">
          <button
            onClick={() => setShowQuiz(true)}
            className="group relative w-full p-4 sm:p-6 rounded-2xl text-white transition-all duration-300 
              transform hover:scale-[1.02] hover:shadow-xl
              bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-600"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Brain className="h-3 w-3 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-l sm:text-xl font-bold mb-1">Test Your Knowledge</h3>
                 
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Start Quiz</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
            </div>
          </button>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          theme={theme}
        />

        {error ? (
          <div className="text-center py-6 sm:py-12">
            <div className={`inline-block ${theme.cardBg} rounded-lg p-4 sm:p-8 border border-white/10`}>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {displayBooks.map((book, index) => (
                <BookCard 
                  key={book.id}
                  book={book}
                  index={index}
                  onLoad={() => handleImageLoad(book.id)}
                  progress={totalProgress}
                  theme={theme}
                />
              ))}
            </div>

            {!loading && totalPages > 1 && (
              <div className="mt-6 sm:mt-12 flex justify-center items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => paginate('prev')}
                  disabled={currentPage === 1}
                  className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${theme.textPrimary} hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base`}
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm sm:text-base shadow-md`}>
                  {currentPage} / {totalPages}
                </div>

                <button
                  onClick={() => paginate('next')}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${theme.textPrimary} hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
                </button>
              </div>
            )}

            {!loading && !error && filteredBooks.length === 0 && (
              <div className="text-center py-6 sm:py-12">
                <div className={`inline-block ${theme.cardBg} rounded-lg p-4 sm:p-8 border border-white/10`}>
                  <p className={`${theme.textSecondary} text-sm sm:text-lg`}>
                    No books found. Try adjusting your search or filters.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <MenuBar />
    </div>
  );
}

export default App;