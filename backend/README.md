# Vibe Dashboard Backend

A lightweight FastAPI REST API for the Vibe Dashboard search application. This backend provides a simple yet elegant search endpoint with CORS support for local development.

## Overview

The backend serves as the core API for the Vibe Dashboard, providing a `/api/items` endpoint that supports full-text search across product names, descriptions, and categories. The API is built with FastAPI for high performance and includes comprehensive API documentation.

## Features

- **Fast Search API**: GET `/api/items` endpoint with optional search query parameter
- **Full-Text Search**: Search across item names, descriptions, and categories
- **CORS Configuration**: Pre-configured for local development (frontend on port 3000)
- **Interactive Documentation**: Built-in Swagger UI at `/docs`
- **Sample Dataset**: 12 curated products across various categories
- **Type Safety**: Pydantic models for request/response validation

## Project Structure

```
backend/
├── main.py              # FastAPI application with all endpoints
├── requirements.txt     # Python dependencies
├── .gitignore          # Git ignore patterns
└── README.md           # This file
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the FastAPI development server:

```bash
python3 main.py
```

The server will start on `http://localhost:8000`

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## API Endpoints

### 1. Root Endpoint
**GET** `/`

Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Welcome to Vibe Dashboard API",
  "version": "1.0.0",
  "endpoints": {
    "search": "/api/items?q=search_term",
    "docs": "/docs"
  }
}
```

### 2. Search Items
**GET** `/api/items`

Search for items by name, description, or category.

**Query Parameters:**
- `q` (optional): Search query string (1-100 characters)

**Examples:**
```bash
# Get all items
curl http://localhost:8000/api/items

# Search for electronics
curl "http://localhost:8000/api/items?q=electronics"

# Search for coffee
curl "http://localhost:8000/api/items?q=coffee"

# Search by category
curl "http://localhost:8000/api/items?q=furniture"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
    "category": "Electronics",
    "price": 199.99,
    "image_url": "https://images.unsplash.com/..."
  },
  ...
]
```

### 3. Get Item by ID
**GET** `/api/items/{item_id}`

Retrieve a specific item by its ID.

**Path Parameters:**
- `item_id`: The ID of the item (integer)

**Example:**
```bash
curl http://localhost:8000/api/items/1
```

### 4. Get Categories
**GET** `/api/categories`

Retrieve all available product categories.

**Example:**
```bash
curl http://localhost:8000/api/categories
```

**Response:**
```json
{
  "categories": [
    "Electronics",
    "Food & Beverage",
    "Furniture",
    "Home & Decor",
    "Kitchen",
    "Sports & Fitness",
    "Stationery"
  ]
}
```

## Sample Dataset

The API includes 12 sample products across 7 categories:

| ID | Name | Category | Price |
|----|------|----------|-------|
| 1 | Wireless Headphones | Electronics | $199.99 |
| 2 | Minimalist Desk Lamp | Furniture | $79.99 |
| 3 | Organic Coffee Beans | Food & Beverage | $24.99 |
| 4 | Yoga Mat Pro | Sports & Fitness | $49.99 |
| 5 | Stainless Steel Water Bottle | Sports & Fitness | $34.99 |
| 6 | Mechanical Keyboard | Electronics | $149.99 |
| 7 | Bamboo Cutting Board Set | Kitchen | $39.99 |
| 8 | Portable Bluetooth Speaker | Electronics | $89.99 |
| 9 | Linen Bedding Set | Home & Decor | $129.99 |
| 10 | Ceramic Plant Pot | Home & Decor | $29.99 |
| 11 | Leather Notebook | Stationery | $44.99 |
| 12 | Aromatic Candle | Home & Decor | $32.99 |

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js frontend)
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:3000` (Alternative localhost)

To modify CORS settings, edit the `CORSMiddleware` configuration in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", ...],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Interactive API Documentation

FastAPI automatically generates interactive API documentation. Access it at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interfaces allow you to test all endpoints directly from your browser.

## Search Behavior

The search functionality is **case-insensitive** and matches partial strings:

- Query: `"coffee"` matches "Organic Coffee Beans"
- Query: `"electronics"` matches all items in the Electronics category
- Query: `"water"` matches "Stainless Steel Water Bottle"
- Query: `""` (empty) returns all items

## Dependencies

- **fastapi** (0.104.1): Modern web framework for building APIs
- **uvicorn** (0.24.0): ASGI server for running FastAPI
- **pydantic** (2.5.0): Data validation using Python type annotations
- **python-multipart** (0.0.6): Support for form data parsing

## Troubleshooting

### Port Already in Use
If port 8000 is already in use, you can specify a different port:

```bash
python3 -c "import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=8001)"
```

### CORS Errors
If you encounter CORS errors when connecting from the frontend:
1. Verify the backend is running on `http://localhost:8000`
2. Check that the frontend is making requests to the correct URL
3. Ensure the frontend's origin is in the `allow_origins` list

### Connection Refused
If the frontend cannot connect to the backend:
1. Ensure the backend server is running
2. Check that both services are on the expected ports (backend: 8000, frontend: 3000)
3. Verify no firewall is blocking the connection

## Development Notes

- The API uses in-memory data storage (no database)
- Search is performed with simple string matching
- All responses are JSON formatted
- The API is stateless and thread-safe

## Future Enhancements

Potential improvements for production use:
- Add database integration (PostgreSQL, MongoDB)
- Implement pagination for large result sets
- Add authentication and authorization
- Include rate limiting
- Add caching for frequently searched items
- Implement full-text search indexes
- Add product filtering by price range, category, etc.

## License

MIT License - Feel free to use this code for any purpose.

## Support

For issues or questions about the backend API, please refer to the main project README.md.
