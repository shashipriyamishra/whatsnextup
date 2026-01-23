# Trending module
from .api_integrations import (
    get_reddit_trending,
    get_youtube_trending,
    get_top_news,
    get_weather,
    get_hackernews_top,
    get_github_trending,
    get_personalized_feed
)

__all__ = [
    "get_reddit_trending",
    "get_youtube_trending",
    "get_top_news",
    "get_weather",
    "get_hackernews_top",
    "get_github_trending",
    "get_personalized_feed"
]
