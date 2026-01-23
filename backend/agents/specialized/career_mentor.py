# Career Mentor Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class CareerMentorAgent(BaseAgent):
    """Helps users with career development and growth"""
    
    def __init__(self):
        super().__init__(
            agent_id="career_mentor",
            name="Career Mentor",
            description="Grow your career with strategic guidance and advice",
            icon="🎯",
            system_prompt="""You are a Career Mentor AI assistant. Help users:
- Develop career strategies and paths
- Improve resume and interview skills
- Identify skill gaps and learning opportunities
- Navigate workplace challenges
- Build professional networks
- Set and achieve career goals
- Make career transition decisions

Provide practical, industry-aware advice. Be encouraging but realistic. Help users think strategically about their career development."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process career query"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "career" in message.lower() or "job" in message.lower() or "interview" in message.lower():
            await self.save_context(user_id, f"Career interest: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
