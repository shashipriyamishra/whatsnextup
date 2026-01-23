# Specialized agents __init__.py
from .daily_planner import DailyPlannerAgent
from .financial_advisor import FinancialAdvisorAgent
from .health_coach import HealthCoachAgent
from .career_mentor import CareerMentorAgent
from .learning_guide import LearningGuideAgent

def get_all_specialized_agents():
    """Get instances of all specialized agents"""
    return [
        DailyPlannerAgent(),
        FinancialAdvisorAgent(),
        HealthCoachAgent(),
        CareerMentorAgent(),
        LearningGuideAgent()
    ]

__all__ = [
    "DailyPlannerAgent",
    "FinancialAdvisorAgent",
    "HealthCoachAgent",
    "CareerMentorAgent",
    "LearningGuideAgent",
    "get_all_specialized_agents"
]
