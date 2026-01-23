# Agent Registry - Central registry for all agents
from typing import Dict, List, Optional
from agents.base_agent import BaseAgent

class AgentRegistry:
    """Central registry for all AI agents"""
    
    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
    
    def register(self, agent: BaseAgent):
        """Register an agent"""
        self._agents[agent.agent_id] = agent
    
    def get(self, agent_id: str) -> Optional[BaseAgent]:
        """Get an agent by ID"""
        return self._agents.get(agent_id)
    
    def get_all(self) -> List[Dict]:
        """Get all registered agents"""
        return [agent.to_dict() for agent in self._agents.values()]
    
    def get_agent_ids(self) -> List[str]:
        """Get all agent IDs"""
        return list(self._agents.keys())

# Global registry instance
agent_registry = AgentRegistry()
