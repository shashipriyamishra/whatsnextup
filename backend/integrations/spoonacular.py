# Spoonacular API Integration for food and recipes
import os
from typing import List, Dict, Optional
from .api_client import api_client

SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY", "")
SPOONACULAR_BASE_URL = "https://api.spoonacular.com"

async def get_random_recipes(number: int = 10) -> List[Dict]:
    """Get random recipes"""
    if not SPOONACULAR_API_KEY:
        return []
    
    url = f"{SPOONACULAR_BASE_URL}/recipes/random?apiKey={SPOONACULAR_API_KEY}&number={number}"
    data = await api_client.fetch(url, cache_key="spoonacular_random", api_name="spoonacular")
    
    if not data or "recipes" not in data:
        return []
    
    return [
        {
            "title": recipe.get("title", ""),
            "description": recipe.get("summary", "")[:200] + "..." if recipe.get("summary") else "",
            "ready_in": recipe.get("readyInMinutes", 0),
            "servings": recipe.get("servings", 0),
            "image": recipe.get("image"),
            "source_url": recipe.get("sourceUrl")
        }
        for recipe in data["recipes"]
    ]

async def search_recipes(query: str, cuisine: Optional[str] = None) -> List[Dict]:
    """Search for recipes"""
    if not SPOONACULAR_API_KEY:
        return []
    
    url = f"{SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey={SPOONACULAR_API_KEY}&query={query}&number=10"
    if cuisine:
        url += f"&cuisine={cuisine}"
    
    data = await api_client.fetch(url, cache_key=f"spoonacular_search_{query}_{cuisine}", api_name="spoonacular")
    
    if not data or "results" not in data:
        return []
    
    return [
        {
            "title": recipe.get("title", ""),
            "image": recipe.get("image"),
            "id": recipe.get("id")
        }
        for recipe in data["results"]
    ]
