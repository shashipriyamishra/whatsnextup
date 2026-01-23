# Goal Coach Agent
from agents.base_agent import BaseAgent
from typing import Dict, Optional

class GoalCoachAgent(BaseAgent):
    """Helps users set and achieve goals"""
    
    def __init__(self):
        super().__init__(
            agent_id="goal_coach",
            name="Goal Setting Coach",
            description="Set and achieve meaningful goals with expert guidance",
            icon="🚀",
            system_prompt="""You are a Goal Coach AI assistant. Help users:
- Set SMART goals
- Break down big goals into steps
- Create action plans
- Track progress and milestones
- Overcome obstacles
- Stay motivated
- Celebrate achievements

Be inspiring, strategic, and supportive. Help users achieve what matters most to them."""
        )
    
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process goal-setting request"""
        user_context = await self.get_user_context(user_id, category="plan")
        
        prompt = self.format_prompt(message, user_context)
        response = await self.generate_response(prompt)
        
        if "goal" in message.lower() or "achieve" in message.lower() or "accomplish" in message.lower():
            await self.save_context(user_id, f"Goal: {message[:100]}", "plan")
        
        return response
    
    async def generate_response(self, prompt: str) -> str:
        from agents.llm import generate_response
        return await generate_response(prompt, context="")
