# __init__.py for integrations
from .api_client import api_client
from .tmdb import get_trending_movies, get_trending_tv, search_movies
from .spoonacular import get_random_recipes, search_recipes

__all__ = [
    "api_client",
    "get_trending_movies",
    "get_trending_tv",
    "search_movies",
    "get_random_recipes",
    "search_recipes"
]
