# Discovery service with AI fallback
from typing import List, Dict, Optional
from agents.llm import generate_response
import json

async def get_entertainment_suggestions(category: str = "movies") -> List[Dict]:
    """Get entertainment suggestions with AI fallback"""
    from integrations import get_trending_movies, get_trending_tv
    
    try:
        if category == "movies":
            results = await get_trending_movies()
        elif category == "tv":
            results = await get_trending_tv()
        else:
            results = []
        
        # If API returns results, return them
        if results:
            return results
    except:
        pass
    
    # AI fallback
    prompt = f"Suggest 5 popular {category} to watch right now. For each, provide: title, brief description (max 100 chars), estimated rating (1-10). Return as JSON array with keys: title, description, rating, year."
    
    response = await generate_response(prompt, context="")
    
    try:
        # Try to parse JSON from response
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        # If JSON parsing fails, create structured response
        return [
            {
                "title": "The Shawshank Redemption",
                "description": "Two imprisoned men bond over years, finding solace and redemption through acts of common decency.",
                "rating": 9.3,
                "year": "1994"
            },
            {
                "title": "The Dark Knight",
                "description": "Batman must accept one of the greatest psychological and physical tests to fight injustice.",
                "rating": 9.0,
                "year": "2008"
            },
            {
                "title": "Inception",
                "description": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task.",
                "rating": 8.8,
                "year": "2010"
            }
        ][:5]

async def get_food_suggestions(cuisine: Optional[str] = None) -> List[Dict]:
    """Get food and recipe suggestions with AI fallback"""
    from integrations import get_random_recipes
    
    try:
        results = await get_random_recipes(10)
        if results:
            return results
    except:
        pass
    
    # AI fallback
    cuisine_text = f"{cuisine} " if cuisine else ""
    prompt = f"Suggest 5 {cuisine_text}recipes or restaurants to try. For each, provide: name/title, brief description (max 100 chars), estimated time/price. Return as JSON array with keys: title, description, ready_in."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Homemade Pizza", "description": "Classic margherita with fresh mozzarella", "ready_in": 30},
            {"title": "Thai Green Curry", "description": "Spicy and aromatic curry with vegetables", "ready_in": 25},
            {"title": "Chicken Tacos", "description": "Quick and delicious Mexican favorite", "ready_in": 20}
        ][:5]

async def get_learning_suggestions(topic: Optional[str] = None) -> List[Dict]:
    """Get learning suggestions using AI"""
    topic_text = f"about {topic}" if topic else "for personal growth"
    prompt = f"Suggest 5 valuable skills or topics to learn {topic_text}. For each, provide: skill name, brief description (max 100 chars), difficulty level (beginner/intermediate/advanced), estimated time to learn. Return as JSON array with keys: title, description, difficulty, duration."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Python Programming", "description": "Versatile language for web, data science, and automation", "difficulty": "beginner", "duration": "3-6 months"},
            {"title": "Digital Marketing", "description": "Master social media, SEO, and content marketing", "difficulty": "beginner", "duration": "2-4 months"},
            {"title": "UI/UX Design", "description": "Create beautiful and user-friendly interfaces", "difficulty": "intermediate", "duration": "4-6 months"}
        ][:5]

async def get_travel_suggestions(location: Optional[str] = None) -> List[Dict]:
    """Get travel suggestions using AI"""
    location_text = f"near {location}" if location else "around the world"
    prompt = f"Suggest 5 amazing travel destinations {location_text}. For each, provide: destination name, brief description (max 100 chars), best time to visit, budget category (budget/moderate/luxury). Return as JSON array with keys: title, description, best_time, budget."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Bali, Indonesia", "description": "Tropical paradise with beaches, temples, and rice terraces", "best_time": "April-October", "budget": "moderate"},
            {"title": "Tokyo, Japan", "description": "Blend of traditional culture and futuristic technology", "best_time": "March-May", "budget": "moderate"},
            {"title": "Barcelona, Spain", "description": "Stunning architecture, beaches, and vibrant culture", "best_time": "May-June", "budget": "moderate"}
        ][:5]

async def get_wellness_suggestions(focus: Optional[str] = None) -> List[Dict]:
    """Get wellness suggestions using AI"""
    focus_text = f"focusing on {focus}" if focus else ""
    prompt = f"Suggest 5 wellness activities or habits {focus_text}. For each, provide: activity name, brief description (max 100 chars), frequency (daily/weekly), difficulty. Return as JSON array with keys: title, description, frequency, difficulty."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Morning Meditation", "description": "Start your day with 10 minutes of mindfulness", "frequency": "daily", "difficulty": "beginner"},
            {"title": "Yoga Practice", "description": "Improve flexibility and reduce stress", "frequency": "3x per week", "difficulty": "beginner"},
            {"title": "Nature Walks", "description": "Connect with nature and boost mood", "frequency": "weekly", "difficulty": "beginner"}
        ][:5]

async def get_shopping_suggestions(category: Optional[str] = None) -> List[Dict]:
    """Get shopping suggestions using AI"""
    category_text = f"in {category}" if category else ""
    prompt = f"Suggest 5 trending products or smart purchases {category_text}. For each, provide: product name, brief description (max 100 chars), price range, category. Return as JSON array with keys: title, description, price_range, category."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Wireless Earbuds", "description": "High-quality audio with noise cancellation", "price_range": "$50-150", "category": "tech"},
            {"title": "Smart Watch", "description": "Track fitness and stay connected", "price_range": "$200-500", "category": "tech"},
            {"title": "Instant Pot", "description": "Versatile pressure cooker for quick meals", "price_range": "$80-120", "category": "home"}
        ][:5]

async def get_hobbies_suggestions(interest: Optional[str] = None) -> List[Dict]:
    """Get hobby suggestions using AI"""
    interest_text = f"related to {interest}" if interest else ""
    prompt = f"Suggest 5 interesting hobbies to explore {interest_text}. For each, provide: hobby name, brief description (max 100 chars), startup cost, skill level. Return as JSON array with keys: title, description, cost, skill_level."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Photography", "description": "Capture moments and express creativity", "cost": "$300-1000", "skill_level": "beginner"},
            {"title": "Gardening", "description": "Grow your own plants and vegetables", "cost": "$50-200", "skill_level": "beginner"},
            {"title": "Painting", "description": "Express yourself through colors and art", "cost": "$30-100", "skill_level": "beginner"}
        ][:5]

async def get_home_suggestions(room: Optional[str] = None) -> List[Dict]:
    """Get home improvement suggestions using AI"""
    room_text = f"for {room}" if room else ""
    prompt = f"Suggest 5 home improvement or organization ideas {room_text}. For each, provide: project name, brief description (max 100 chars), budget, difficulty. Return as JSON array with keys: title, description, budget, difficulty."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Gallery Wall", "description": "Create a stunning photo or art display", "budget": "$50-150", "difficulty": "easy"},
            {"title": "Smart Lighting", "description": "Install adjustable LED lights for ambiance", "budget": "$100-300", "difficulty": "medium"},
            {"title": "Floating Shelves", "description": "Add storage and style to any room", "budget": "$30-80", "difficulty": "easy"}
        ][:5]

async def get_career_suggestions(field: Optional[str] = None) -> List[Dict]:
    """Get career development suggestions using AI"""
    field_text = f"in {field}" if field else ""
    prompt = f"Suggest 5 career growth opportunities or actions {field_text}. For each, provide: opportunity name, brief description (max 100 chars), time investment, impact level. Return as JSON array with keys: title, description, time, impact."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Professional Certification", "description": "Get certified in your field to boost credentials", "time": "3-6 months", "impact": "high"},
            {"title": "Networking Events", "description": "Attend industry meetups and conferences", "time": "ongoing", "impact": "medium"},
            {"title": "Side Project", "description": "Build something to showcase your skills", "time": "2-4 months", "impact": "high"}
        ][:5]

async def get_events_suggestions(location: Optional[str] = None) -> List[Dict]:
    """Get event suggestions using AI"""
    location_text = f"in {location}" if location else "nearby"
    prompt = f"Suggest 5 interesting events or activities {location_text}. For each, provide: event name, brief description (max 100 chars), date/time, price. Return as JSON array with keys: title, description, when, price."
    
    response = await generate_response(prompt, context="")
    
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            return suggestions[:5]
    except:
        return [
            {"title": "Art Gallery Opening", "description": "Contemporary art exhibition by local artists", "when": "This Friday 6PM", "price": "Free"},
            {"title": "Food Festival", "description": "Sample cuisines from around the world", "when": "This Weekend", "price": "$15-30"},
            {"title": "Live Music Night", "description": "Local bands performing at downtown venue", "when": "Saturday 8PM", "price": "$20"}
        ][:5]
