# Habit Builder Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class HabitBuilderAgent(BaseAgent):
    """Helps users build and maintain positive habits"""
    
    def __init__(self):
        super().__init__(
            agent_id="habit_builder",
            name="Habit Builder",
            description="Build lasting habits with science-backed strategies",
            icon="🎯",
            system_prompt="""You are a Habit Builder AI assistant. Help users:
- Design habit formation strategies
- Use habit stacking techniques
- Track progress and streaks
- Overcome obstacles and setbacks
- Apply behavioral science principles
- Build identity-based habits
- Create sustainable routines

Be encouraging, science-based, and practical. Focus on small wins and consistency."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process habit building request"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "habit" in message.lower() or "routine" in message.lower() or "track" in message.lower():
            await self.save_context(user_id, f"Habit goal: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
