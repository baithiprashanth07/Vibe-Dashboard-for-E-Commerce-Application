# Vibe Dashboard - Full-Stack E-Commerce Application

A production-ready full-stack e-commerce application showcasing elegant architecture and modern UI design. The Vibe Dashboard demonstrates a clean separation of concerns with a Python/FastAPI backend and a React/Next.js frontend featuring glassmorphism design patterns, advanced filtering, and a complete shopping experience.

## Overview

Vibe Dashboard is a comprehensive demonstration of building a polished full-stack e-commerce application with attention to both backend architecture and frontend aesthetics. The application features real-time search, advanced filtering, shopping cart, favorites, and a beautiful glassmorphism UI with smooth transitions.

**Key Features:**
- ✨ Elegant glassmorphism UI with frosted glass effects and backdrop blur
- 🔍 Real-time search with 300ms debouncing
- 💰 Price range filtering with interactive slider
- 🏷️ Multi-select category filtering
- 📊 Advanced sorting (by name, price, newest)
- ❤️ Favorites/Wishlist system
- 🛒 Full shopping cart with quantity management
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design for mobile and desktop
- 🚀 Fast, lightweight Python/FastAPI backend
- 🧪 Comprehensive test coverage (33 tests)
- 📚 Production-ready code structure

## Architecture

The application follows a clean client-server architecture:

```
┌──────────────────────────────────────────────────────────┐
│              Frontend (React/Vite)                       │
│                                                          │
│  - Glassmorphism UI components                          │
│  - Real-time search with debouncing                     │
│  - Advanced filtering (price, category, sort)           │
│  - Shopping cart & favorites management                 │
│  - Dark/Light theme toggle                              │
│  - Loading and empty states                             │
│  - Responsive design (mobile-first)                     │
│                                                          │
│  Port: 3000                                             │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │ (CORS enabled)
                     ▼
┌──────────────────────────────────────────────────────────┐
│             Backend (FastAPI/Python)                     │
│                                                          │
│  - RESTful API with advanced filtering                  │
│  - Full-text search across multiple fields              │
│  - Price range and category filtering                   │
│  - Sorting capabilities                                 │
│  - Related products endpoint                            │
│  - In-memory data storage (12 sample items)             │
│  - Interactive API documentation (Swagger UI)           │
│  - Type-safe request/response validation                │
│                                                          │
│  Port: 8000                                             │
└──────────────────────────────────────────────────────────┘
```

## Project Structure

```
vibe-dashboard/
├── client/                          # React/Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Main search & browse page
│   │   │   ├── ProductDetail.tsx   # Product detail page
│   │   │   ├── Cart.tsx            # Shopping cart page
│   │   │   ├── Favorites.tsx       # Favorites/Wishlist page
│   │   │   ├── Home.test.tsx       # Home page tests
│   │   │   └── EcommerceFunctions.test.tsx  # E-commerce tests
│   │   ├── components/
│   │   │   └── Header.tsx          # Navigation header
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Theme management
│   │   ├── App.tsx                 # Router and layout
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML entry point
│   └── package.json
│
├── backend/                         # FastAPI application
│   ├── main.py                     # API implementation
│   ├── requirements.txt            # Python dependencies
│   ├── .gitignore
│   └── README.md                   # Backend documentation
│
├── README.md                        # This file
├── todo.md                          # Project tracking
└── package.json                     # Root package configuration
```

## Features

### 🔍 Search & Discovery
- **Real-time Search**: Debounced search across product names, descriptions, and categories
- **Price Range Filter**: Interactive slider to filter products by price
- **Category Filter**: Multi-select categories to narrow down results
- **Advanced Sorting**: Sort by name (A-Z), price (low-to-high, high-to-low), or newest

### 🛍️ Shopping Experience
- **Product Details**: Click on any product to view full details and related items
- **Shopping Cart**: Add items, adjust quantities, and view order summary with tax calculation
- **Favorites/Wishlist**: Save products for later with heart icon
- **Cart Persistence**: Cart and favorites are saved in browser local storage

### 🎨 User Interface
- **Glassmorphism Design**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Dark/Light Theme**: Toggle between dark and light themes with persistent preference
- **Responsive Layout**: Optimized for mobile, tablet, and desktop screens
- **Navigation Header**: Quick access to cart, favorites, and theme toggle

### 📊 Backend API
- **GET /api/items**: Search and filter items with query parameters
  - `q`: Search query (optional)
  - `min_price`: Minimum price filter (optional)
  - `max_price`: Maximum price filter (optional)
  - `sort_by`: Sort option - name, price_asc, price_desc, newest (default: name)
  - `categories`: Comma-separated list of categories (optional)
- **GET /api/items/{item_id}**: Get product details
- **GET /api/items/{item_id}/related**: Get related products from same category
- **GET /api/categories**: Get list of all available categories
- **GET /api/price-range**: Get min and max prices available

## Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** (for frontend)
- **Python** 3.8+ (for backend)
- **Git** (for cloning the repository)

### Running Locally

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vibe-dashboard.git
cd vibe-dashboard
```

#### 2. Start the Backend

```bash
cd backend

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python3 main.py
```

The backend will start on `http://localhost:8000`. Visit `http://localhost:8000/docs` to see the interactive API documentation.

#### 3. Start the Frontend

In a new terminal:

```bash
# From the project root
pnpm install
pnpm dev
```

The frontend will start on `http://localhost:3000`. Open your browser and navigate to `http://localhost:3000` to see the application.

### API Endpoints

#### Search and Filter Items
```bash
# Get all items
curl http://localhost:8000/api/items

# Search for items
curl "http://localhost:8000/api/items?q=headphones"

# Filter by price range
curl "http://localhost:8000/api/items?min_price=50&max_price=200"

# Sort by price (ascending)
curl "http://localhost:8000/api/items?sort_by=price_asc"

# Filter by categories
curl "http://localhost:8000/api/items?categories=Electronics,Furniture"

# Combine filters
curl "http://localhost:8000/api/items?q=lamp&min_price=50&max_price=150&sort_by=price_asc"
```

#### Get Product Details
```bash
# Get specific product
curl http://localhost:8000/api/items/1

# Get related products
curl "http://localhost:8000/api/items/1/related?limit=3"
```

#### Get Metadata
```bash
# Get all categories
curl http://localhost:8000/api/categories

# Get price range
curl http://localhost:8000/api/price-range
```

## Testing

The project includes comprehensive test coverage with 33 tests covering:
- Category filtering logic
- Price range filtering
- Sorting functionality
- Shopping cart operations
- Favorites management
- Theme persistence
- Multi-select categories

Run tests with:
```bash
pnpm test
```

## Troubleshooting

### Backend Connection Issues
If you see "Unable to connect to the API" error:
1. Ensure the backend is running on `http://localhost:8000`
2. Check that CORS is properly configured
3. Verify the `VITE_API_URL` environment variable if needed

### Port Already in Use
If port 3000 or 8000 is already in use:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Theme Not Persisting
Clear browser local storage and refresh the page:
1. Open Developer Tools (F12)
2. Go to Application > Local Storage
3. Clear all entries
4. Refresh the page

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Debounced Search**: 300ms debounce on search input reduces API calls
- **Image Optimization**: Unsplash images with responsive sizing
- **Lazy Loading**: Components load on demand
- **Local Storage Caching**: Cart and favorites stored locally
- **Efficient Filtering**: Server-side filtering reduces data transfer

## Future Enhancements

- User authentication and accounts
- Persistent backend database
- Payment processing (Stripe integration)
- Order history and tracking
- Product reviews and ratings
- Wishlist sharing
- Advanced analytics
- Admin dashboard

## Development

### Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS 4
- TypeScript
- Wouter (routing)
- rc-slider (price range slider)
- Lucide React (icons)

**Backend:**
- FastAPI
- Pydantic (validation)
- Python 3.8+
- CORS support

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Vitest for unit testing
- Comprehensive error handling

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Unsplash for product images
- Tailwind CSS for utility-first CSS framework
- FastAPI for the modern Python web framework
- React for the UI library
- All open-source contributors

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for elegant, full-stack development**
