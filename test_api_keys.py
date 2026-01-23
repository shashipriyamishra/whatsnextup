#!/usr/bin/env python3
# Test if API keys are loaded from .env
import os
import sys

# Add backend to path
sys.path.insert(0, '/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend')

# Load dotenv
from dotenv import load_dotenv
load_dotenv('/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env')

# Check keys
NEWS_KEY = os.getenv("NEWS_API_KEY", "")
YOUTUBE_KEY = os.getenv("YOUTUBE_API_KEY", "")
WEATHER_KEY = os.getenv("OPENWEATHER_API_KEY", "")

print("\n🔑 API Keys Status:")
print("=" * 50)
print(f"NEWS_API_KEY: {'✅ Found (' + NEWS_KEY[:10] + '...)' if NEWS_KEY else '❌ NOT FOUND'}")
print(f"YOUTUBE_API_KEY: {'✅ Found (' + YOUTUBE_KEY[:10] + '...)' if YOUTUBE_KEY else '❌ NOT FOUND'}")
print(f"OPENWEATHER_API_KEY: {'✅ Found (' + WEATHER_KEY[:10] + '...)' if WEATHER_KEY else '❌ NOT FOUND'}")
print("=" * 50)

if NEWS_KEY and YOUTUBE_KEY and WEATHER_KEY:
    print("\n✅ All API keys loaded successfully!")
    print("\n📝 Next step: Restart backend server to load these keys")
    print("   Run: cd backend && python3 main.py")
else:
    print("\n❌ Some API keys are missing!")
    print("   Edit backend/.env and add your actual keys")
