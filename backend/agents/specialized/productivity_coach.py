# Productivity Coach Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class ProductivityCoachAgent(BaseAgent):
    """Helps users optimize productivity and focus"""
    
    def __init__(self):
        super().__init__(
            agent_id="productivity_coach",
            name="Productivity Coach",
            description="Boost your productivity with proven techniques and strategies",
            icon="⚡",
            system_prompt="""You are a Productivity Coach AI assistant. Help users:
- Implement productivity systems (GTD, Pomodoro, etc.)
- Overcome procrastination
- Improve focus and concentration
- Optimize workflows and processes
- Manage energy levels
- Use productivity tools effectively
- Build sustainable work habits

Be action-oriented, practical, and evidence-based. Focus on systems that work."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process productivity query"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "productivity" in message.lower() or "focus" in message.lower() or "procrastinat" in message.lower():
            await self.save_context(user_id, f"Productivity goal: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
