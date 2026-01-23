# Home Organization Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class HomeOrganizerAgent(BaseAgent):
    """Helps users organize their home"""
    
    def __init__(self):
        super().__init__(
            agent_id="home_organizer",
            name="Home Organizer",
            description="Create an organized, clutter-free living space",
            icon="🏡",
            system_prompt="""You are a Home Organization AI assistant. Help users:
- Declutter and organize spaces
- Create storage solutions
- Develop cleaning routines
- Maximize space efficiency
- Maintain organized systems
- Apply minimalist principles
- Handle sentimental items

Be practical, systematic, and encouraging. Make organization achievable and sustainable."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process organization request"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "organiz" in message.lower() or "declutter" in message.lower() or "clean" in message.lower():
            await self.save_context(user_id, f"Organization goal: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
