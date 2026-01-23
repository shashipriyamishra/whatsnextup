# Specialized agents __init__.py
from .daily_planner import DailyPlannerAgent
from .financial_advisor import FinancialAdvisorAgent
from .health_coach import HealthCoachAgent
from .career_mentor import CareerMentorAgent
from .learning_guide import LearningGuideAgent
from .travel_planner import TravelPlannerAgent
from .productivity_coach import ProductivityCoachAgent
from .meal_planner import MealPlannerAgent
from .habit_builder import HabitBuilderAgent
from .decision_maker import DecisionMakerAgent
from .relationship_coach import RelationshipCoachAgent
from .creative_writer import CreativeWriterAgent
from .home_organizer import HomeOrganizerAgent
from .budget_tracker import BudgetTrackerAgent
from .goal_coach import GoalCoachAgent

def get_all_specialized_agents():
    """Get instances of all specialized agents"""
    return [
        DailyPlannerAgent(),
        FinancialAdvisorAgent(),
        HealthCoachAgent(),
        CareerMentorAgent(),
        LearningGuideAgent(),
        TravelPlannerAgent(),
        ProductivityCoachAgent(),
        MealPlannerAgent(),
        HabitBuilderAgent(),
        DecisionMakerAgent(),
        RelationshipCoachAgent(),
        CreativeWriterAgent(),
        HomeOrganizerAgent(),
        BudgetTrackerAgent(),
        GoalCoachAgent()
    ]

__all__ = [
    "DailyPlannerAgent",
    "FinancialAdvisorAgent",
    "HealthCoachAgent",
    "CareerMentorAgent",
    "LearningGuideAgent",
    "TravelPlannerAgent",
    "ProductivityCoachAgent",
    "MealPlannerAgent",
    "HabitBuilderAgent",
    "DecisionMakerAgent",
    "RelationshipCoachAgent",
    "CreativeWriterAgent",
    "HomeOrganizerAgent",
    "BudgetTrackerAgent",
    "GoalCoachAgent",
    "get_all_specialized_agents"
]
