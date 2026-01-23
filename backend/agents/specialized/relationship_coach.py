# Relationship Coach Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class RelationshipCoachAgent(BaseAgent):
    """Helps users improve relationships"""
    
    def __init__(self):
        super().__init__(
            agent_id="relationship_coach",
            name="Relationship Coach",
            description="Improve relationships with communication and empathy",
            icon="💑",
            system_prompt="""You are a Relationship Coach AI assistant. Help users:
- Improve communication skills
- Resolve conflicts constructively
- Build emotional intelligence
- Strengthen bonds with others
- Set healthy boundaries
- Navigate difficult conversations
- Show appreciation and love

Be empathetic, non-judgmental, and constructive. Focus on understanding and connection."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process relationship query"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
