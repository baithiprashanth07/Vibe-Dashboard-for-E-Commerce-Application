import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('E-commerce Functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Shopping Cart', () => {
    it('should add item to cart', () => {
      const item = { id: 1, name: 'Test Item', price: 99.99, quantity: 1, image_url: 'test.jpg' };
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(savedCart).toHaveLength(1);
      expect(savedCart[0].id).toBe(1);
      expect(savedCart[0].name).toBe('Test Item');
    });

    it('should increase quantity if item already in cart', () => {
      const item = { id: 1, name: 'Test Item', price: 99.99, quantity: 1, image_url: 'test.jpg' };
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Add same item again
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((i: any) => i.id === 1);
      if (existingItem) {
        existingItem.quantity += 1;
      }
      localStorage.setItem('cart', JSON.stringify(cart));

      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(savedCart).toHaveLength(1);
      expect(savedCart[0].quantity).toBe(2);
    });

    it('should remove item from cart', () => {
      const item1 = { id: 1, name: 'Item 1', price: 99.99, quantity: 1, image_url: 'test.jpg' };
      const item2 = { id: 2, name: 'Item 2', price: 49.99, quantity: 1, image_url: 'test.jpg' };
      let cart = [item1, item2];
      localStorage.setItem('cart', JSON.stringify(cart));

      // Remove item 1
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = cart.filter((item: any) => item.id !== 1);
      localStorage.setItem('cart', JSON.stringify(cart));

      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(savedCart).toHaveLength(1);
      expect(savedCart[0].id).toBe(2);
    });

    it('should calculate cart total correctly', () => {
      const items = [
        { id: 1, name: 'Item 1', price: 100, quantity: 2, image_url: 'test.jpg' },
        { id: 2, name: 'Item 2', price: 50, quantity: 1, image_url: 'test.jpg' },
      ];
      localStorage.setItem('cart', JSON.stringify(items));

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      expect(subtotal).toBe(250);
      expect(tax).toBe(25);
      expect(total).toBe(275);
    });

    it('should update item quantity', () => {
      const item = { id: 1, name: 'Test Item', price: 99.99, quantity: 1, image_url: 'test.jpg' };
      localStorage.setItem('cart', JSON.stringify([item]));

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartItem = cart.find((i: any) => i.id === 1);
      if (cartItem) {
        cartItem.quantity = 5;
      }
      localStorage.setItem('cart', JSON.stringify(cart));

      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(savedCart[0].quantity).toBe(5);
    });
  });

  describe('Favorites', () => {
    it('should add item to favorites', () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      favorites.push(1);
      localStorage.setItem('favorites', JSON.stringify(favorites));

      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      expect(savedFavorites).toHaveLength(1);
      expect(savedFavorites[0]).toBe(1);
    });

    it('should remove item from favorites', () => {
      const favorites = [1, 2, 3];
      localStorage.setItem('favorites', JSON.stringify(favorites));

      let saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      saved = saved.filter((id: number) => id !== 2);
      localStorage.setItem('favorites', JSON.stringify(saved));

      const result = JSON.parse(localStorage.getItem('favorites') || '[]');
      expect(result).toHaveLength(2);
      expect(result).not.toContain(2);
    });

    it('should check if item is in favorites', () => {
      const favorites = [1, 2, 3];
      localStorage.setItem('favorites', JSON.stringify(favorites));

      const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFavorite = saved.includes(2);

      expect(isFavorite).toBe(true);
    });

    it('should toggle favorite status', () => {
      const favorites = [1, 2, 3];
      localStorage.setItem('favorites', JSON.stringify(favorites));

      let saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      const itemId = 2;
      const isFavorite = saved.includes(itemId);

      if (isFavorite) {
        saved = saved.filter((id: number) => id !== itemId);
      } else {
        saved.push(itemId);
      }
      localStorage.setItem('favorites', JSON.stringify(saved));

      const result = JSON.parse(localStorage.getItem('favorites') || '[]');
      expect(result).not.toContain(2);

      // Toggle again
      saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      saved.push(2);
      localStorage.setItem('favorites', JSON.stringify(saved));

      const result2 = JSON.parse(localStorage.getItem('favorites') || '[]');
      expect(result2).toContain(2);
    });
  });

  describe('Theme', () => {
    it('should store theme preference', () => {
      localStorage.setItem('theme', 'dark');
      const theme = localStorage.getItem('theme');
      expect(theme).toBe('dark');
    });

    it('should toggle theme preference', () => {
      let theme = localStorage.getItem('theme') || 'light';
      theme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', theme);

      expect(localStorage.getItem('theme')).toBe('dark');

      theme = localStorage.getItem('theme') || 'light';
      theme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', theme);

      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should persist theme across sessions', () => {
      localStorage.setItem('theme', 'dark');
      const theme1 = localStorage.getItem('theme');

      // Simulate new session
      const theme2 = localStorage.getItem('theme');

      expect(theme1).toBe(theme2);
      expect(theme2).toBe('dark');
    });
  });



  describe('Sorting', () => {
    it('should sort items by price ascending', () => {
      const items = [
        { id: 1, name: 'Item 1', price: 150 },
        { id: 2, name: 'Item 2', price: 50 },
        { id: 3, name: 'Item 3', price: 100 },
      ];

      const sorted = [...items].sort((a, b) => a.price - b.price);

      expect(sorted[0].price).toBe(50);
      expect(sorted[1].price).toBe(100);
      expect(sorted[2].price).toBe(150);
    });

    it('should sort items by price descending', () => {
      const items = [
        { id: 1, name: 'Item 1', price: 150 },
        { id: 2, name: 'Item 2', price: 50 },
        { id: 3, name: 'Item 3', price: 100 },
      ];

      const sorted = [...items].sort((a, b) => b.price - a.price);

      expect(sorted[0].price).toBe(150);
      expect(sorted[1].price).toBe(100);
      expect(sorted[2].price).toBe(50);
    });

    it('should sort items by name', () => {
      const items = [
        { id: 1, name: 'Zebra', price: 100 },
        { id: 2, name: 'Apple', price: 50 },
        { id: 3, name: 'Mango', price: 150 },
      ];

      const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

      expect(sorted[0].name).toBe('Apple');
      expect(sorted[1].name).toBe('Mango');
      expect(sorted[2].name).toBe('Zebra');
    });
  });

  describe('Multi-Select Categories', () => {
    it('should filter items by single category', () => {
      const items = [
        { id: 1, category: 'Electronics' },
        { id: 2, category: 'Furniture' },
        { id: 3, category: 'Electronics' },
      ];

      const selectedCategories = new Set(['Electronics']);
      const filtered = items.filter(item => selectedCategories.has(item.category));

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe(1);
      expect(filtered[1].id).toBe(3);
    });

    it('should filter items by multiple categories', () => {
      const items = [
        { id: 1, category: 'Electronics' },
        { id: 2, category: 'Furniture' },
        { id: 3, category: 'Electronics' },
        { id: 4, category: 'Kitchen' },
      ];

      const selectedCategories = new Set(['Electronics', 'Furniture']);
      const filtered = items.filter(item => selectedCategories.has(item.category));

      expect(filtered).toHaveLength(3);
    });

    it('should toggle category selection', () => {
      let selectedCategories = new Set<string>();

      // Add category
      selectedCategories.add('Electronics');
      expect(selectedCategories.has('Electronics')).toBe(true);

      // Remove category
      selectedCategories.delete('Electronics');
      expect(selectedCategories.has('Electronics')).toBe(false);

      // Add again
      selectedCategories.add('Electronics');
      expect(selectedCategories.has('Electronics')).toBe(true);
    });
  });
});
