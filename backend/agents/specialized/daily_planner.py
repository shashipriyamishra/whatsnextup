# Daily Planner Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class DailyPlannerAgent(BaseAgent):
    """Helps users plan their day effectively"""
    
    def __init__(self):
        super().__init__(
            agent_id="daily_planner",
            name="Daily Planner",
            description="Plan your day with AI-powered scheduling and prioritization",
            icon="📅",
            system_prompt="""You are a Daily Planner AI assistant. Help users:
- Create effective daily schedules
- Prioritize tasks based on importance and urgency
- Suggest optimal time blocks for different activities
- Consider energy levels throughout the day
- Balance work, personal time, and rest
- Provide realistic and achievable plans

Be concise, actionable, and encouraging. Format responses clearly with bullet points or numbered lists when appropriate."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process planning request"""
        # Get user's previous plans and preferences
        user_context = await self.get_user_context(user_id, category="plan")
        
        # Generate response
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        # Save important planning insights
        if "priority" in message.lower() or "schedule" in message.lower():
            await self.save_context(user_id, f"Planning session: {message[:100]}", "plan")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        """Generate AI response"""
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
