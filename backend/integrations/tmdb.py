# TMDB API Integration for movies and TV shows
import os
from typing import List, Dict, Optional
from .api_client import api_client

TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

async def get_trending_movies() -> List[Dict]:
    """Get trending movies"""
    if not TMDB_API_KEY:
        return []
    
    url = f"{TMDB_BASE_URL}/trending/movie/week?api_key={TMDB_API_KEY}"
    data = await api_client.fetch(url, cache_key="tmdb_trending_movies", api_name="tmdb")
    
    if not data or "results" not in data:
        return []
    
    return [
        {
            "title": movie.get("title", ""),
            "description": movie.get("overview", "")[:200] + "...",
            "rating": movie.get("vote_average", 0),
            "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
            "image": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get("poster_path") else None
        }
        for movie in data["results"][:10]
    ]

async def get_trending_tv() -> List[Dict]:
    """Get trending TV shows"""
    if not TMDB_API_KEY:
        return []
    
    url = f"{TMDB_BASE_URL}/trending/tv/week?api_key={TMDB_API_KEY}"
    data = await api_client.fetch(url, cache_key="tmdb_trending_tv", api_name="tmdb")
    
    if not data or "results" not in data:
        return []
    
    return [
        {
            "title": show.get("name", ""),
            "description": show.get("overview", "")[:200] + "...",
            "rating": show.get("vote_average", 0),
            "year": show.get("first_air_date", "")[:4] if show.get("first_air_date") else "",
            "image": f"https://image.tmdb.org/t/p/w500{show.get('poster_path')}" if show.get("poster_path") else None
        }
        for show in data["results"][:10]
    ]

async def search_movies(query: str) -> List[Dict]:
    """Search for movies"""
    if not TMDB_API_KEY:
        return []
    
    url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={query}"
    data = await api_client.fetch(url, cache_key=f"tmdb_search_{query}", api_name="tmdb")
    
    if not data or "results" not in data:
        return []
    
    return [
        {
            "title": movie.get("title", ""),
            "description": movie.get("overview", "")[:200] + "...",
            "rating": movie.get("vote_average", 0),
            "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
        }
        for movie in data["results"][:5]
    ]
