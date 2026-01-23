# Trending & Social Media Integrations
import httpx
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio

# Free API Keys (to be set in environment)
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")  # newsapi.org - Free tier: 100 req/day
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")  # Google Cloud - Free tier: 10k quota/day
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")  # openweathermap.org - Free tier: 1k calls/day

# Cache for API responses
_cache = {}
_cache_ttl = 3600  # 1 hour

def _get_cache_key(func_name: str, *args, **kwargs) -> str:
    """Generate cache key"""
    return f"{func_name}:{'_'.join(str(a) for a in args)}:{'_'.join(f'{k}={v}' for k,v in sorted(kwargs.items()))}"

def _get_from_cache(key: str) -> Optional[Any]:
    """Get value from cache if not expired"""
    if key in _cache:
        data, timestamp = _cache[key]
        if datetime.now().timestamp() - timestamp < _cache_ttl:
            return data
        else:
            del _cache[key]
    return None

def _set_cache(key: str, value: Any):
    """Set value in cache"""
    _cache[key] = (value, datetime.now().timestamp())

# ============================================================================
# REDDIT API (No auth required for public data)
# ============================================================================

async def get_reddit_trending(subreddit: str = "popular", limit: int = 10) -> List[Dict[str, Any]]:
    """Get trending posts from Reddit (NO API KEY NEEDED)"""
    cache_key = _get_cache_key("reddit", subreddit, limit)
    cached = _get_from_cache(cache_key)
    if cached:
        return cached
    
    try:
        url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit={limit}"
        headers = {"User-Agent": "WhatsNextUp/1.0"}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        posts = []
        for child in data.get("data", {}).get("children", []):
            post_data = child.get("data", {})
            posts.append({
                "title": post_data.get("title", ""),
                "subreddit": post_data.get("subreddit", ""),
                "author": post_data.get("author", ""),
                "upvotes": post_data.get("ups", 0),
                "comments": post_data.get("num_comments", 0),
                "url": f"https://reddit.com{post_data.get('permalink', '')}",
                "created": datetime.fromtimestamp(post_data.get("created_utc", 0)).isoformat(),
                "thumbnail": post_data.get("thumbnail") if post_data.get("thumbnail", "").startswith("http") else None
            })
        
        _set_cache(cache_key, posts)
        return posts
    except Exception as e:
        print(f"❌ Error fetching Reddit data: {e}")
        return []

# ============================================================================
# YOUTUBE API (Requires API key - Free tier: 10k quota/day)
# ============================================================================

async def get_youtube_trending(region_code: str = "US", category_id: str = "0", limit: int = 10) -> List[Dict[str, Any]]:
    """Get trending YouTube videos"""
    if not YOUTUBE_API_KEY:
        return []
    
    cache_key = _get_cache_key("youtube", region_code, category_id, limit)
    cached = _get_from_cache(cache_key)
    if cached:
        return cached
    
    try:
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "part": "snippet,statistics",
            "chart": "mostPopular",
            "regionCode": region_code,
            "videoCategoryId": category_id,
            "maxResults": limit,
            "key": YOUTUBE_API_KEY
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        
        videos = []
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            videos.append({
                "title": snippet.get("title", ""),
                "channel": snippet.get("channelTitle", ""),
                "description": snippet.get("description", "")[:200] + "...",
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url"),
                "views": int(stats.get("viewCount", 0)),
                "likes": int(stats.get("likeCount", 0)),
                "url": f"https://www.youtube.com/watch?v={item.get('id', '')}",
                "published_at": snippet.get("publishedAt", "")
            })
        
        _set_cache(cache_key, videos)
        return videos
    except Exception as e:
        print(f"❌ Error fetching YouTube data: {e}")
        return []

# ============================================================================
# NEWS API (Requires API key - Free tier: 100 requests/day)
# ============================================================================

async def get_top_news(country: str = "us", category: str = "general", limit: int = 10) -> List[Dict[str, Any]]:
    """Get top news headlines"""
    if not NEWS_API_KEY:
        return []
    
    cache_key = _get_cache_key("news", country, category, limit)
    cached = _get_from_cache(cache_key)
    if cached:
        return cached
    
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "country": country,
            "category": category,
            "pageSize": limit,
            "apiKey": NEWS_API_KEY
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        
        articles = []
        for article in data.get("articles", []):
            articles.append({
                "title": article.get("title", ""),
                "description": article.get("description", ""),
                "source": article.get("source", {}).get("name", ""),
                "author": article.get("author", "Unknown"),
                "url": article.get("url", ""),
                "image": article.get("urlToImage"),
                "published_at": article.get("publishedAt", "")
            })
        
        _set_cache(cache_key, articles)
        return articles
    except Exception as e:
        print(f"❌ Error fetching news data: {e}")
        return []

# ============================================================================
# WEATHER API (Requires API key - Free tier: 1k calls/day)
# ============================================================================

async def get_weather(city: str = "New York", country_code: str = "US") -> Dict[str, Any]:
    """Get current weather for a location"""
    if not OPENWEATHER_API_KEY:
        return {}
    
    cache_key = _get_cache_key("weather", city, country_code)
    cached = _get_from_cache(cache_key)
    if cached:
        return cached
    
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": f"{city},{country_code}",
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        
        weather_data = {
            "city": data.get("name", ""),
            "country": data.get("sys", {}).get("country", ""),
            "temperature": data.get("main", {}).get("temp", 0),
            "feels_like": data.get("main", {}).get("feels_like", 0),
            "description": data.get("weather", [{}])[0].get("description", ""),
            "icon": data.get("weather", [{}])[0].get("icon", ""),
            "humidity": data.get("main", {}).get("humidity", 0),
            "wind_speed": data.get("wind", {}).get("speed", 0)
        }
        
        _set_cache(cache_key, weather_data)
        return weather_data
    except Exception as e:
        print(f"❌ Error fetching weather data: {e}")
        return {}

# ============================================================================
# HACKER NEWS API (No auth required)
# ============================================================================

async def get_hackernews_top(limit: int = 10) -> List[Dict[str, Any]]:
    """Get top Hacker News stories (NO API KEY NEEDED)"""
    cache_key = _get_cache_key("hackernews", limit)
    cached = _get_from_cache(cache_key)
    if cached:
        return cached
    
    try:
        # Get top story IDs
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("https://hacker-news.firebaseio.com/v0/topstories.json")
            response.raise_for_status()
            story_ids = response.json()[:limit]
        
        # Fetch story details
        stories = []
        async with httpx.AsyncClient(timeout=10.0) as client:
            for story_id in story_ids:
                try:
                    response = await client.get(f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json")
                    response.raise_for_status()
                    story = response.json()
                    
                    stories.append({
                        "title": story.get("title", ""),
                        "author": story.get("by", ""),
                        "score": story.get("score", 0),
                        "comments": story.get("descendants", 0),
                        "url": story.get("url", f"https://news.ycombinator.com/item?id={story_id}"),
                        "hn_url": f"https://news.ycombinator.com/item?id={story_id}",
                        "time": datetime.fromtimestamp(story.get("time", 0)).isoformat()
                    })
                except:
                    continue
        
        _set_cache(cache_key, stories)
        return stories
    except Exception as e:
        print(f"❌ Error fetching Hacker News data: {e}")
        return []

# ============================================================================
# GITHUB TRENDING (No auth required)
# ============================================================================

async def get_github_trending(language: str = "", since: str = "daily") -> List[Dict[str, Any]]:
    """Get trending GitHub repositories (NO API KEY NEEDED)"""
    cache_key = _get_cache_key("github", language, since)
    cached = _get_from_cache(cache_key)
    if cached:
        return cached
    
    try:
        # Using unofficial API
        url = f"https://api.gitterapp.com/repositories?since={since}"
        if language:
            url += f"&language={language}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
        
        repos = []
        for repo in data[:10]:
            repos.append({
                "name": repo.get("name", ""),
                "full_name": repo.get("fullname", ""),
                "author": repo.get("author", ""),
                "description": repo.get("description", ""),
                "language": repo.get("language", ""),
                "stars": repo.get("stars", 0),
                "forks": repo.get("forks", 0),
                "stars_today": repo.get("currentPeriodStars", 0),
                "url": repo.get("url", "")
            })
        
        _set_cache(cache_key, repos)
        return repos
    except Exception as e:
        print(f"❌ Error fetching GitHub trending: {e}")
        return []

# ============================================================================
# AGGREGATED FEED
# ============================================================================

async def get_personalized_feed(
    user_location: Optional[Dict[str, str]] = None,
    interests: Optional[List[str]] = None
) -> Dict[str, Any]:
    """Get aggregated personalized feed from multiple sources"""
    try:
        # Run all API calls in parallel
        reddit_task = get_reddit_trending("popular", limit=5)
        hackernews_task = get_hackernews_top(limit=5)
        github_task = get_github_trending(since="daily")
        
        # Add location-based if provided
        tasks = {
            "reddit": reddit_task,
            "tech": hackernews_task,
            "github": github_task
        }
        
        if user_location:
            city = user_location.get("city", "New York")
            country = user_location.get("country_code", "US")
            tasks["weather"] = get_weather(city, country)
            tasks["news"] = get_top_news(country.lower(), "general", limit=5)
        
        if YOUTUBE_API_KEY:
            tasks["youtube"] = get_youtube_trending("US", "0", limit=5)
        
        # Wait for all tasks
        results = await asyncio.gather(*[tasks[k] for k in tasks], return_exceptions=True)
        
        feed = {}
        for i, key in enumerate(tasks.keys()):
            if not isinstance(results[i], Exception):
                feed[key] = results[i]
            else:
                feed[key] = []
        
        return feed
    except Exception as e:
        print(f"❌ Error creating personalized feed: {e}")
        return {}
