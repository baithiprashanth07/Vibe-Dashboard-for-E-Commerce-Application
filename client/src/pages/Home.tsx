import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { debounce } from 'lodash';
import { Link } from 'wouter';

interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'newest'>('name');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query: string, cats: Set<string>, sort: string) => {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const params = new URLSearchParams();
        if (query.trim()) params.append('q', query);
        params.append('sort_by', sort);

        if (cats.size > 0) {
          params.append('categories', Array.from(cats).join(','));
        }

        const response = await fetch(`${API_BASE_URL}/api/items?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError('Unable to connect to the API. Make sure the backend is running on http://localhost:8000');
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query, selectedCategories, sortBy);
  };

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
    performSearch(searchQuery, newCategories, sortBy);
  };

  // Handle sort change
  const handleSortChange = (newSort: 'name' | 'price_asc' | 'price_desc' | 'newest') => {
    setSortBy(newSort);
    performSearch(searchQuery, selectedCategories, newSort);
  };

  // Load all items on mount
  useEffect(() => {
    performSearch('', new Set(), 'name');
  }, [performSearch]);

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'newest', label: 'Newest' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Vibe Dashboard
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Discover amazing products with elegant search and filtering
            </p>

            {/* Search Input with Glassmorphism */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-2xl hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by name, description, or category..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-transparent text-white placeholder-slate-400 outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Category Filter */}
              {!categoriesLoading && categories.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <p className="text-slate-300 text-sm font-medium mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-xl border ${selectedCategories.has(category)
                            ? 'bg-blue-500/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/15'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort Options */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <p className="text-slate-300 text-sm font-medium mb-3">Sort By</p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as any)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm appearance-none cursor-pointer hover:bg-white/15 transition-all"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-xl">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && hasSearched && (
          <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-6xl mx-auto">
              {items.length > 0 ? (
                <>
                  <p className="text-slate-300 text-sm mb-6">
                    Found {items.length} item{items.length !== 1 ? 's' : ''}
                    {selectedCategories.size > 0 && ` in ${selectedCategories.size} categor${selectedCategories.size !== 1 ? 'ies' : 'y'}`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <Link key={item.id} href={`/product/${item.id}`}>
                        <a className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer block">
                          {/* Image Container */}
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </div>

                            <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                              {item.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-medium text-blue-300">
                                {item.category}
                              </span>
                              <span className="text-lg font-bold text-white">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-white/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
                        </a>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No items found
                  </h3>
                  <p className="text-slate-400">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
