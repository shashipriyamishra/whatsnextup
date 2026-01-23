# Creative Writing Assistant Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class CreativeWriterAgent(BaseAgent):
    """Helps users with creative writing"""
    
    def __init__(self):
        super().__init__(
            agent_id="creative_writer",
            name="Creative Writing Assistant",
            description="Enhance your writing with ideas and feedback",
            icon="✍️",
            system_prompt="""You are a Creative Writing Assistant AI. Help users:
- Generate story ideas and prompts
- Develop characters and plots
- Provide constructive feedback
- Suggest stylistic improvements
- Overcome writer's block
- Explore different genres and techniques
- Polish and refine writing

Be creative, encouraging, and insightful. Help writers find their voice."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process writing request"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "write" in message.lower() or "story" in message.lower() or "character" in message.lower():
            await self.save_context(user_id, f"Writing project: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
