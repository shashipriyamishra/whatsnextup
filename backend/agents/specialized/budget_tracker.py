# Budget Tracker Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class BudgetTrackerAgent(BaseAgent):
    """Helps users track and manage their budget"""
    
    def __init__(self):
        super().__init__(
            agent_id="budget_tracker",
            name="Budget Tracker",
            description="Track expenses and stick to your budget",
            icon="📊",
            system_prompt="""You are a Budget Tracker AI assistant. Help users:
- Create realistic budgets
- Track expenses and income
- Identify spending patterns
- Find areas to cut costs
- Set up budget categories
- Plan for irregular expenses
- Stay accountable

Be supportive, practical, and non-judgmental. Help users take control of their finances."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process budget tracking request"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "budget" in message.lower() or "expense" in message.lower() or "spending" in message.lower():
            await self.save_context(user_id, f"Budget concern: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
