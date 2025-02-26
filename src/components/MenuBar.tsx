import { useState } from 'react';
import { Menu, X, Moon, Sun, Palette, Github, Heart, Coffee, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setThemeById, themes } = useTheme();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40 overflow-hidden h-8">
        <div className="animate-marquee whitespace-nowrap">
          <span className={`${theme.textPrimary} text-sm font-medium px-4`}>
           
          </span>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919906686458?text=Hi,%20TAB"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="absolute -inset-2 bg-green-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300">
          <MessageCircle className="h-6 w-6" />
          <span className="font-medium hidden sm:block">Need a Book?</span>
        </div>
      </a>

      {/* Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${theme.buttonBg} p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-black`}
          style={{ marginTop: '10px' }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {isOpen && (
          <div className="absolute top-16 right-0 p-2 rounded-2xl shadow-xl backdrop-blur-xl border border-white/10 bg-black/20">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="px-4 py-2">
                <h3 className={`text-sm font-medium ${theme.textPrimary}`}>Themes</h3>
              </div>
              
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeById(t.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                    theme.id === t.id ? theme.buttonBg : 'hover:bg-white/10'
                  } ${theme.textPrimary}`}
                >
                  {t.id === 'light' ? (
                    <Sun className="h-4 w-4" />
                  ) : t.id === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Palette className="h-4 w-4" />
                  )}
                  {t.name}
                </button>
              ))}

              <div className="border-t border-white/10 my-2" />

              

              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all hover:bg-white/10 ${theme.textPrimary}`}
              >
                <Coffee className="h-4 w-4" />
               Buy me a Coffee
              </a>

              <div className="px-4 py-2">
                <p className={`text-xs flex items-center gap-1 ${theme.textSecondary}`}>
                  Made with <Heart className="h-3 w-3 text-red-500" /> by TAB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
