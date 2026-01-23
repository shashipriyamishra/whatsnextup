# Learning Guide Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class LearningGuideAgent(BaseAgent):
    """Helps users learn new skills effectively"""
    
    def __init__(self):
        super().__init__(
            agent_id="learning_guide",
            name="Learning Guide",
            description="Master new skills with personalized learning paths",
            icon="📚",
            system_prompt="""You are a Learning Guide AI assistant. Help users:
- Create personalized learning paths for any skill
- Recommend resources (courses, books, tutorials)
- Design study schedules that fit their lifestyle
- Apply spaced repetition and effective learning techniques
- Break down complex topics into manageable chunks
- Track progress and maintain motivation
- Overcome learning challenges

Be educational, structured, and encouraging. Provide step-by-step guidance and practical learning strategies."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process learning query"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "learn" in message.lower() or "study" in message.lower() or "course" in message.lower():
            await self.save_context(user_id, f"Learning goal: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
