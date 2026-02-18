"""
Vibe Dashboard Backend - FastAPI Application
A simple REST API with a GET /api/items endpoint supporting search queries.
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(
    title="Vibe Dashboard API",
    description="A simple search API for the Vibe Dashboard",
    version="1.0.0"
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for item responses
class Item(BaseModel):
    id: int
    name: str
    description: str
    category: str
    price: float
    image_url: str

# Sample dataset with diverse items
SAMPLE_ITEMS = [
    Item(
        id=1,
        name="Wireless Headphones",
        description="Premium noise-cancelling wireless headphones with 30-hour battery life",
        category="Electronics",
        price=199.99,
        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
    ),
    Item(
        id=2,
        name="Minimalist Desk Lamp",
        description="Sleek LED desk lamp with adjustable brightness and color temperature",
        category="Furniture",
        price=79.99,
        image_url="https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&h=300&fit=crop"
    ),
    Item(
        id=3,
        name="Organic Coffee Beans",
        description="Single-origin Ethiopian coffee beans with rich, complex flavor notes",
        category="Food & Beverage",
        price=24.99,
        image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=300&fit=crop"
    ),
    Item(
        id=4,
        name="Yoga Mat Pro",
        description="Non-slip yoga mat with carrying strap, perfect for home or studio practice",
        category="Sports & Fitness",
        price=49.99,
        image_url="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop"
    ),
    Item(
        id=5,
        name="Stainless Steel Water Bottle",
        description="Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours",
        category="Sports & Fitness",
        price=34.99,
        image_url="https://images.unsplash.com/photo-1602143407151-7e36dd5f5a0e?w=400&h=300&fit=crop"
    ),
    Item(
        id=6,
        name="Mechanical Keyboard",
        description="RGB mechanical keyboard with custom switches and programmable keys",
        category="Electronics",
        price=149.99,
        image_url="https://images.unsplash.com/photo-1587829191301-4a71490d63d2?w=400&h=300&fit=crop"
    ),
    Item(
        id=7,
        name="Bamboo Cutting Board Set",
        description="Three-piece bamboo cutting board set with natural antimicrobial properties",
        category="Kitchen",
        price=39.99,
        image_url="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop"
    ),
    Item(
        id=8,
        name="Portable Bluetooth Speaker",
        description="Waterproof portable speaker with 360-degree sound and 12-hour battery",
        category="Electronics",
        price=89.99,
        image_url="https://images.unsplash.com/photo-1589003077984-894e133da26d?w=400&h=300&fit=crop"
    ),
    Item(
        id=9,
        name="Linen Bedding Set",
        description="Premium Egyptian linen bedding set with natural temperature regulation",
        category="Home & Decor",
        price=129.99,
        image_url="https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=300&fit=crop"
    ),
    Item(
        id=10,
        name="Ceramic Plant Pot",
        description="Handcrafted ceramic plant pot with drainage hole and minimalist design",
        category="Home & Decor",
        price=29.99,
        image_url="https://images.unsplash.com/photo-1578482326433-ad12cb7d050f?w=400&h=300&fit=crop"
    ),
    Item(
        id=11,
        name="Leather Notebook",
        description="Premium leather-bound notebook with 200 pages of quality paper",
        category="Stationery",
        price=44.99,
        image_url="https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop"
    ),
    Item(
        id=12,
        name="Aromatic Candle",
        description="Hand-poured soy candle with natural essential oils and 40-hour burn time",
        category="Home & Decor",
        price=32.99,
        image_url="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop"
    ),
]

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Vibe Dashboard API",
        "version": "2.0.0",
        "endpoints": {
            "search": "/api/items?q=search_term&sort_by=name&categories=Electronics,Furniture",
            "item_detail": "/api/items/{item_id}",
            "related_items": "/api/items/{item_id}/related?limit=3",
            "categories": "/api/categories",
            "docs": "/docs"
        }
    }

@app.get("/api/items", response_model=List[Item])
async def search_items(
    q: Optional[str] = Query(None, min_length=1, max_length=100),
    sort_by: Optional[str] = Query("name", regex="^(name|price_asc|price_desc|newest)$"),
    categories: Optional[str] = Query(None)
):
    """
    Search and filter items with advanced options.
    
    Query Parameters:
    - q: Search query string (optional)
    - sort_by: Sort option - name, price_asc, price_desc, newest (default: name)
    - categories: Comma-separated list of categories to filter by (optional)
    
    Returns:
    - List of items matching all filters and sorted as requested
    """
    filtered_items = SAMPLE_ITEMS.copy()
    
    # Text search filter
    if q:
        search_term = q.lower().strip()
        filtered_items = [
            item for item in filtered_items
            if (search_term in item.name.lower() or
                search_term in item.description.lower() or
                search_term in item.category.lower())
        ]
    
    # Category filter (multi-select)
    if categories:
        category_list = [cat.strip() for cat in categories.split(",")]
        filtered_items = [item for item in filtered_items if item.category in category_list]
    
    # Sorting
    if sort_by == "price_asc":
        filtered_items.sort(key=lambda x: x.price)
    elif sort_by == "price_desc":
        filtered_items.sort(key=lambda x: x.price, reverse=True)
    elif sort_by == "newest":
        filtered_items.sort(key=lambda x: x.id, reverse=True)
    else:  # name
        filtered_items.sort(key=lambda x: x.name)
    
    return filtered_items

@app.get("/api/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """
    Get a specific item by ID.
    
    Path Parameters:
    - item_id: The ID of the item to retrieve
    
    Returns:
    - Item details if found
    - 404 error if item not found
    """
    for item in SAMPLE_ITEMS:
        if item.id == item_id:
            return item
    
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Item not found")

@app.get("/api/items/{item_id}/related")
async def get_related_items(item_id: int, limit: int = Query(3, ge=1, le=10)):
    """
    Get related items based on category.
    
    Path Parameters:
    - item_id: The ID of the item to find related items for
    
    Query Parameters:
    - limit: Maximum number of related items to return (default: 3, max: 10)
    
    Returns:
    - List of related items from the same category
    """
    from fastapi import HTTPException
    
    # Find the main item
    main_item = None
    for item in SAMPLE_ITEMS:
        if item.id == item_id:
            main_item = item
            break
    
    if not main_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Get related items from same category (excluding the main item)
    related = [
        item for item in SAMPLE_ITEMS
        if item.category == main_item.category and item.id != item_id
    ]
    
    return related[:limit]



@app.get("/api/categories")
async def get_categories():
    """
    Get all available categories.
    
    Returns:
    - List of unique categories from the items dataset
    """
    categories = list(set(item.category for item in SAMPLE_ITEMS))
    return {"categories": sorted(categories)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
