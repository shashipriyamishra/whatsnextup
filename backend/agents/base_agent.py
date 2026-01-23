# Base Agent Class
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
from agents.llm import generate_response
from memory.store import get_memories, save_memory
import json

class BaseAgent(ABC):
    """Base class for all AI agents"""
    
    def __init__(self, agent_id: str, name: str, description: str, icon: str, system_prompt: str):
        self.agent_id = agent_id
        self.name = name
        self.description = description
        self.icon = icon
        self.system_prompt = system_prompt
    
    @abstractmethod
    async def process_message(self, message: str, user_id: str, context: Optional[Dict] = None) -> str:
        """Process a user message and return a response"""
        pass
    
    async def get_user_context(self, user_id: str, category: Optional[str] = None) -> str:
        """Get relevant user context from memories"""
        try:
            memories = await get_memories(user_id, category=category)
            if not memories:
                return ""
            
            context_parts = []
            for memory in memories[:5]:  # Limit to 5 most recent
                text = memory.get("text", memory.get("content", ""))
                if text:
                    context_parts.append(f"- {text}")
            
            return "\n".join(context_parts) if context_parts else ""
        except:
            return ""
    
    async def save_context(self, user_id: str, text: str, category: str):
        """Save important context to memory"""
        try:
            await save_memory(user_id, {
                "text": text,
                "category": category,
                "agent": self.agent_id
            })
        except:
            pass
    
    def format_prompt(self, message: str, user_context: str = "") -> str:
        """Format the prompt with system instructions and context"""
        prompt = f"{self.system_prompt}\n\n"
        if user_context:
            prompt += f"User Context:\n{user_context}\n\n"
        prompt += f"User Message: {message}"
        return prompt
    
    def to_dict(self) -> Dict:
        """Return agent info as dictionary"""
        return {
            "id": self.agent_id,
            "name": self.name,
            "description": self.description,
            "icon": self.icon
        }
