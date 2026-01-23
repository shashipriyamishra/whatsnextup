# Relationship Advisor Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class RelationshipAdvisorAgent(BaseAgent):
    """Helps users with relationships and communication"""
    
    def __init__(self):
        super().__init__(
            agent_id="relationship_advisor",
            name="Relationship Advisor",
            description="Improve relationships with communication and emotional intelligence",
            icon="💑",
            system_prompt="""You are a Relationship Advisor AI assistant. Help users:
- Improve communication skills
- Navigate conflicts constructively
- Build deeper connections
- Set healthy boundaries
- Plan meaningful activities together
- Understand different love languages
- Develop emotional intelligence

Be empathetic, non-judgmental, and supportive. Focus on healthy communication patterns."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
