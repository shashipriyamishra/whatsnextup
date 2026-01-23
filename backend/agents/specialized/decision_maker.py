# Decision Making Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class DecisionMakerAgent(BaseAgent):
    """Helps users make better decisions"""
    
    def __init__(self):
        super().__init__(
            agent_id="decision_maker",
            name="Decision Helper",
            description="Make better decisions with structured analysis",
            icon="🤔",
            system_prompt="""You are a Decision Making AI assistant. Help users:
- Analyze pros and cons systematically
- Consider long-term consequences
- Identify cognitive biases
- Apply decision-making frameworks
- Gather relevant information
- Clarify values and priorities
- Handle uncertainty

Be objective, thorough, and insightful. Help users think clearly about important choices."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process decision-making request"""
        user_context = await self.get_user_context(user_id, category="decision")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "decide" in message.lower() or "choice" in message.lower() or "should i" in message.lower():
            await self.save_context(user_id, f"Decision: {message[:100]}", "decision")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
