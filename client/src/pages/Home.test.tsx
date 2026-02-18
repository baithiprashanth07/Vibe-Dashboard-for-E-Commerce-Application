import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Category Filter Functionality', () => {
  // Mock data for testing
  const mockItems = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling headphones',
      category: 'Electronics',
      price: 199.99,
      image_url: 'https://example.com/image1.jpg',
    },
    {
      id: 2,
      name: 'Yoga Mat Pro',
      description: 'Non-slip yoga mat',
      category: 'Sports & Fitness',
      price: 49.99,
      image_url: 'https://example.com/image2.jpg',
    },
    {
      id: 3,
      name: 'Organic Coffee Beans',
      description: 'Single-origin Ethiopian coffee',
      category: 'Food & Beverage',
      price: 24.99,
      image_url: 'https://example.com/image3.jpg',
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard',
      category: 'Electronics',
      price: 149.99,
      image_url: 'https://example.com/image4.jpg',
    },
  ];

  const mockCategories = ['Electronics', 'Food & Beverage', 'Sports & Fitness'];

  describe('Category Filtering Logic', () => {
    it('should return all items when no category is selected', () => {
      const selectedCategory = null;
      const filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(4);
      expect(filtered).toEqual(mockItems);
    });

    it('should filter items by selected category', () => {
      const selectedCategory = 'Electronics';
      const filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.category === 'Electronics')).toBe(true);
      expect(filtered[0]?.name).toBe('Wireless Headphones');
      expect(filtered[1]?.name).toBe('Mechanical Keyboard');
    });

    it('should return empty array when filtering by non-existent category', () => {
      const selectedCategory = 'Non-existent Category';
      const filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(0);
    });

    it('should filter items by Sports & Fitness category', () => {
      const selectedCategory = 'Sports & Fitness';
      const filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.name).toBe('Yoga Mat Pro');
    });

    it('should filter items by Food & Beverage category', () => {
      const selectedCategory = 'Food & Beverage';
      const filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.name).toBe('Organic Coffee Beans');
    });
  });

  describe('Category List Management', () => {
    it('should have all expected categories', () => {
      expect(mockCategories).toHaveLength(3);
      expect(mockCategories).toContain('Electronics');
      expect(mockCategories).toContain('Food & Beverage');
      expect(mockCategories).toContain('Sports & Fitness');
    });

    it('should extract unique categories from items', () => {
      const uniqueCategories = Array.from(new Set(mockItems.map(item => item.category)));
      expect(uniqueCategories).toContain('Electronics');
      expect(uniqueCategories).toContain('Sports & Fitness');
      expect(uniqueCategories).toContain('Food & Beverage');
    });
  });

  describe('Combined Search and Category Filtering', () => {
    it('should filter by search query first, then by category', () => {
      const searchQuery = 'coffee';
      const selectedCategory = 'Food & Beverage';

      // First filter by search query
      const searchFiltered = mockItems.filter(
        item =>
          searchQuery.toLowerCase() === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Then filter by category
      const finalFiltered = searchFiltered.filter(
        item => !selectedCategory || item.category === selectedCategory
      );

      expect(finalFiltered).toHaveLength(1);
      expect(finalFiltered[0]?.name).toBe('Organic Coffee Beans');
    });

    it('should return empty results when search and category do not match', () => {
      const searchQuery = 'headphones';
      const selectedCategory = 'Food & Beverage';

      const searchFiltered = mockItems.filter(
        item =>
          searchQuery.toLowerCase() === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const finalFiltered = searchFiltered.filter(
        item => !selectedCategory || item.category === selectedCategory
      );

      expect(finalFiltered).toHaveLength(0);
    });

    it('should handle case-insensitive search with category filter', () => {
      const searchQuery = 'YOGA';
      const selectedCategory = 'Sports & Fitness';

      const searchFiltered = mockItems.filter(
        item =>
          searchQuery.toLowerCase() === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const finalFiltered = searchFiltered.filter(
        item => !selectedCategory || item.category === selectedCategory
      );

      expect(finalFiltered).toHaveLength(1);
      expect(finalFiltered[0]?.name).toBe('Yoga Mat Pro');
    });
  });

  describe('Filter State Management', () => {
    it('should reset to null when "All Categories" is selected', () => {
      let selectedCategory: string | null = 'Electronics';
      selectedCategory = null; // Reset to all categories

      const filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );

      expect(selectedCategory).toBeNull();
      expect(filtered).toHaveLength(4);
    });

    it('should maintain filter state when switching between categories', () => {
      let selectedCategory: string | null = 'Electronics';
      let filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(2);

      selectedCategory = 'Sports & Fitness';
      filtered = mockItems.filter(
        item => !selectedCategory || item.category === selectedCategory
      );
      expect(filtered).toHaveLength(1);
    });
  });
});
