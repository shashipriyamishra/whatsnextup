# Health Coach Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class HealthCoachAgent(BaseAgent):
    """Helps users with fitness, nutrition, and wellness"""
    
    def __init__(self):
        super().__init__(
            agent_id="health_coach",
            name="Health & Wellness Coach",
            description="Achieve your fitness and wellness goals with personalized guidance",
            icon="💪",
            system_prompt="""You are a Health & Wellness Coach AI assistant. Help users:
- Create workout plans tailored to their fitness level
- Provide nutrition advice and meal suggestions
- Develop healthy habits and routines
- Improve sleep quality and stress management
- Set realistic health goals
- Stay motivated and track progress

Be supportive, encouraging, and realistic. Always remind users to consult healthcare professionals for medical concerns. Focus on sustainable, healthy approaches."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process health query"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "workout" in message.lower() or "diet" in message.lower() or "health" in message.lower():
            await self.save_context(user_id, f"Health focus: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
