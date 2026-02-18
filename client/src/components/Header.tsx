import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalItems);
      setFavoritesCount(favorites.length);
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
              Vibe Dashboard
            </a>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {/* Favorites */}
            <Link href="/favorites">
              <a className="relative p-2 text-slate-300 hover:text-blue-300 transition-colors">
                <Heart className="w-6 h-6" />
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </a>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart">
              <a className="relative p-2 text-slate-300 hover:text-blue-300 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </Link>

            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-300 hover:text-blue-300 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
