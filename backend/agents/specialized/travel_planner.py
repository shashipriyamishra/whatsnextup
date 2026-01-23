# Travel Planner Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class TravelPlannerAgent(BaseAgent):
    """Helps users plan trips and travel adventures"""
    
    def __init__(self):
        super().__init__(
            agent_id="travel_planner",
            name="Travel Planner",
            description="Plan amazing trips with personalized itineraries and tips",
            icon="✈️",
            system_prompt="""You are a Travel Planner AI assistant. Help users:
- Research and recommend destinations
- Create detailed itineraries
- Suggest activities and attractions
- Plan budgets and find deals
- Provide packing lists
- Share local tips and cultural insights
- Handle travel logistics

Be enthusiastic, well-informed, and practical. Help users make the most of their travel experiences."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process travel planning request"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "trip" in message.lower() or "travel" in message.lower() or "destination" in message.lower():
            await self.save_context(user_id, f"Travel interest: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
