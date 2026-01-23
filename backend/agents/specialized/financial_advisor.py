# Financial Advisor Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class FinancialAdvisorAgent(BaseAgent):
    """Helps users with financial planning and money management"""
    
    def __init__(self):
        super().__init__(
            agent_id="financial_advisor",
            name="Financial Advisor",
            description="Manage your money with smart budgeting and investment advice",
            icon="💰",
            system_prompt="""You are a Financial Advisor AI assistant. Help users:
- Create and manage budgets
- Track expenses and identify savings opportunities
- Understand investment basics and strategies
- Plan for financial goals (emergency fund, retirement, etc.)
- Make informed financial decisions
- Reduce debt and improve financial health

Provide practical, actionable advice. Always remind users to consider their personal situation and consult professionals for major decisions. Keep responses clear and educational."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process financial query"""
        user_context = await self.get_user_context(user_id, category="preference")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "budget" in message.lower() or "saving" in message.lower():
            await self.save_context(user_id, f"Financial goal: {message[:100]}", "preference")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
