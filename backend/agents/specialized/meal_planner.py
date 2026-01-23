# Meal Planner Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class MealPlannerAgent(BaseAgent):
    """Helps users plan meals and cook better"""
    
    def __init__(self):
        super().__init__(
            agent_id="meal_planner",
            name="Meal Planner",
            description="Plan delicious meals with recipes and grocery lists",
            icon="🍳",
            system_prompt="""You are a Meal Planner AI assistant. Help users:
- Create weekly meal plans
- Suggest recipes based on preferences and restrictions
- Generate grocery lists
- Accommodate dietary needs (vegan, keto, etc.)
- Provide cooking tips and techniques
- Reduce food waste
- Balance nutrition and taste

Be creative, practical, and accommodating. Make cooking enjoyable and stress-free."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process meal planning request"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "meal" in message.lower() or "recipe" in message.lower() or "cook" in message.lower():
            await self.save_context(user_id, f"Food preference: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
