"""
Usage tracking for free tier and paid tier management.
Tracks message counts, API calls, and enforces limits based on subscription tier.
"""

from datetime import datetime, timedelta
from typing import Optional
from google.cloud import firestore

db = firestore.AsyncClient()

# Tier limits
TIER_LIMITS = {
    "free": {
        "messages_per_day": 10,
        "conversations_history": False,
        "trending_api_access": {"reddit": True, "hackernews": True, "github": True, "youtube": False, "news": False, "weather": False},
    },
    "plus": {
        "messages_per_day": -1,  # unlimited
        "conversations_history": True,
        "trending_api_access": {"reddit": True, "hackernews": True, "github": True, "youtube": True, "news": True, "weather": True},
    },
    "pro": {
        "messages_per_day": -1,  # unlimited
        "conversations_history": True,
        "trending_api_access": {"reddit": True, "hackernews": True, "github": True, "youtube": True, "news": True, "weather": True},
        "api_access": True,
        "custom_agents": True,
    },
}


async def get_user_tier(user_id: str) -> str:
    """Get the user's subscription tier."""
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = await user_ref.get()
        
        if not user_doc.exists:
            # Create user document with free tier
            await user_ref.set({
                "tier": "free",
                "created_at": datetime.utcnow().isoformat(),
                "usage": {
                    "messages_today": 0,
                    "last_reset": datetime.utcnow().date().isoformat(),
                }
            })
            return "free"
        
        user_data = user_doc.to_dict()
        return user_data.get("tier", "free")
    except Exception as e:
        print(f"Error getting user tier: {e}")
        return "free"


async def get_usage_stats(user_id: str) -> dict:
    """Get current usage statistics for the user."""
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = await user_ref.get()
        
        if not user_doc.exists:
            return {
                "messages_today": 0,
                "messages_remaining": 10,
                "tier": "free",
                "reset_at": (datetime.utcnow() + timedelta(days=1)).date().isoformat(),
            }
        
        user_data = user_doc.to_dict()
        usage = user_data.get("usage", {})
        tier = user_data.get("tier", "free")
        
        # Check if we need to reset daily counter
        last_reset = usage.get("last_reset", datetime.utcnow().date().isoformat())
        today = datetime.utcnow().date().isoformat()
        
        if last_reset != today:
            # Reset counter
            await user_ref.update({
                "usage.messages_today": 0,
                "usage.last_reset": today,
            })
            messages_today = 0
        else:
            messages_today = usage.get("messages_today", 0)
        
        # Calculate remaining messages
        tier_limit = TIER_LIMITS[tier]["messages_per_day"]
        messages_remaining = tier_limit - messages_today if tier_limit > 0 else -1
        
        return {
            "messages_today": messages_today,
            "messages_remaining": messages_remaining,
            "tier": tier,
            "reset_at": (datetime.utcnow() + timedelta(days=1)).date().isoformat(),
            "limit": tier_limit,
        }
    except Exception as e:
        print(f"Error getting usage stats: {e}")
        return {
            "messages_today": 0,
            "messages_remaining": 10,
            "tier": "free",
            "error": str(e),
        }


async def increment_usage(user_id: str) -> bool:
    """
    Increment the user's message count.
    Returns True if successful, False if limit exceeded.
    """
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = await user_ref.get()
        
        if not user_doc.exists:
            # Create user with first message
            await user_ref.set({
                "tier": "free",
                "created_at": datetime.utcnow().isoformat(),
                "usage": {
                    "messages_today": 1,
                    "last_reset": datetime.utcnow().date().isoformat(),
                }
            })
            return True
        
        user_data = user_doc.to_dict()
        tier = user_data.get("tier", "free")
        usage = user_data.get("usage", {})
        
        # Check if we need to reset daily counter
        last_reset = usage.get("last_reset", datetime.utcnow().date().isoformat())
        today = datetime.utcnow().date().isoformat()
        
        if last_reset != today:
            # Reset counter
            await user_ref.update({
                "usage.messages_today": 1,
                "usage.last_reset": today,
            })
            return True
        
        # Check limit
        messages_today = usage.get("messages_today", 0)
        tier_limit = TIER_LIMITS[tier]["messages_per_day"]
        
        if tier_limit > 0 and messages_today >= tier_limit:
            return False  # Limit exceeded
        
        # Increment counter
        await user_ref.update({
            "usage.messages_today": firestore.Increment(1),
        })
        
        return True
    except Exception as e:
        print(f"Error incrementing usage: {e}")
        return False


async def can_access_feature(user_id: str, feature: str) -> bool:
    """
    Check if user can access a specific feature based on their tier.
    Features: conversations_history, trending_apis, api_access, custom_agents
    """
    try:
        tier = await get_user_tier(user_id)
        tier_features = TIER_LIMITS[tier]
        
        if feature == "conversations_history":
            return tier_features.get("conversations_history", False)
        
        if feature.startswith("trending_"):
            api_name = feature.replace("trending_", "")
            return tier_features.get("trending_api_access", {}).get(api_name, False)
        
        return tier_features.get(feature, False)
    except Exception as e:
        print(f"Error checking feature access: {e}")
        return False


async def update_user_tier(user_id: str, new_tier: str) -> bool:
    """Update user's subscription tier (called after payment)."""
    try:
        if new_tier not in TIER_LIMITS:
            return False
        
        user_ref = db.collection("users").document(user_id)
        await user_ref.set({
            "tier": new_tier,
            "updated_at": datetime.utcnow().isoformat(),
        }, merge=True)
        
        return True
    except Exception as e:
        print(f"Error updating tier: {e}")
        return False
