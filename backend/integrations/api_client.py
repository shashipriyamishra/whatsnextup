# External API Client with caching and rate limiting
import httpx
import json
import time
from typing import Optional, Dict, Any
from functools import lru_cache
import os

class APIClient:
    def __init__(self):
        self.cache: Dict[str, tuple[Any, float]] = {}
        self.cache_ttl = 3600  # 1 hour cache
        self.rate_limit_delay = 0.1  # 100ms between requests
        self.last_request_time: Dict[str, float] = {}
        
    async def _get_cached(self, cache_key: str) -> Optional[Any]:
        """Get from cache if not expired"""
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                return data
            del self.cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Any):
        """Set cache with timestamp"""
        self.cache[cache_key] = (data, time.time())
    
    async def _rate_limit(self, api_name: str):
        """Simple rate limiting"""
        if api_name in self.last_request_time:
            elapsed = time.time() - self.last_request_time[api_name]
            if elapsed < self.rate_limit_delay:
                await asyncio.sleep(self.rate_limit_delay - elapsed)
        self.last_request_time[api_name] = time.time()
    
    async def fetch(self, url: str, headers: Optional[Dict] = None, cache_key: Optional[str] = None, api_name: str = "default") -> Optional[Dict]:
        """Fetch data with caching and rate limiting"""
        if cache_key:
            cached = await self._get_cached(cache_key)
            if cached:
                return cached
        
        await self._rate_limit(api_name)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                if cache_key:
                    self._set_cache(cache_key, data)
                
                return data
        except Exception as e:
            print(f"API fetch error for {url}: {str(e)}")
            return None

# Global API client instance
api_client = APIClient()

import asyncio
