# backend/agents/planning_agent.py

from agents.llm import call_llm
from typing import List, Dict, Any
import json

class PlanningAgent:
    """
    Converts vague user thoughts into structured plans.
    Breaks goals into actionable steps with deadlines.
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.llm = call_llm
    
    def create_plan_from_goal(self, goal: str, context: Dict = None) -> Dict[str, Any]:
        """
        Convert a user goal into a detailed plan with steps.
        """
        try:
            context_text = self._format_context(context)
            
            prompt = f"""You are an expert planning assistant. Create a detailed, actionable plan.

User Context:
{context_text}

Goal: {goal}

IMPORTANT: Create a COMPLETE plan with specific details. Be thorough.

Return ONLY valid JSON (no markdown):
{{
  "goal": "specific restatement of goal",
  "timeframe": "realistic timeframe with reasoning",
  "priority": "high/medium/low",
  "steps": [
    {{
      "step": 1,
      "action": "specific, concrete first action",
      "deadline": "Day 1, Week 1, etc",
      "effort": "low/medium/high"
    }},
    {{
      "step": 2,
      "action": "detailed second action",
      "deadline": "Day 3, Week 2",
      "effort": "medium"
    }},
    {{
      "step": 3,
      "action": "thorough third action",
      "deadline": "Week 3",
      "effort": "high"
    }},
    {{
      "step": 4,
      "action": "implementation/verification step",
      "deadline": "Week 4",
      "effort": "medium"
    }},
    {{
      "step": 5,
      "action": "review and adjust",
      "deadline": "End of month",
      "effort": "low"
    }}
  ],
  "potential_challenges": [
    "realistic obstacle 1 with why it matters",
    "realistic obstacle 2 with mitigation",
    "realistic obstacle 3"
  ],
  "resources_needed": [
    "specific tool/resource 1 with reason",
    "specific tool/resource 2",
    "skill or person needed"
  ],
  "success_metric": "specific, measurable way to know goal is achieved"
}}"""
            
            response = self.llm(prompt)
            
            # Parse JSON response
            try:
                plan = json.loads(response)
                plan["created_by"] = "planning_agent"
                return plan
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return self._create_simple_plan(goal, response)
        
        except Exception as e:
            print(f"❌ Error creating plan: {e}")
            return {"error": str(e)}
    
    def break_down_task(self, task: str, context: Dict = None) -> List[Dict]:
        """
        Break down a task into subtasks.
        """
        try:
            context_text = self._format_context(context)
            
            prompt = f"""
You are a task breakdown expert. Break down this task into clear, actionable subtasks.

User Context:
{context_text}

Task to break down:
{task}

Respond with a JSON array of subtasks:
[
  {{
    "subtask": "clear description",
    "duration": "estimated time (e.g., 30 mins, 2 hours)",
    "order": 1,
    "dependencies": []
  }}
]

Respond with ONLY valid JSON array, no other text.
"""
            
            response = self.llm(prompt)
            
            try:
                subtasks = json.loads(response)
                return subtasks
            except json.JSONDecodeError:
                return self._create_simple_breakdown(task, response)
        
        except Exception as e:
            print(f"❌ Error breaking down task: {e}")
            return []
    
    def prioritize_tasks(self, tasks: List[str]) -> List[Dict]:
        """
        Prioritize a list of tasks for the user.
        """
        try:
            tasks_text = "\n".join([f"{i+1}. {task}" for i, task in enumerate(tasks)])
            
            prompt = f"""
You are a prioritization expert. Help the user prioritize these tasks.

Tasks:
{tasks_text}

Respond with a JSON array, prioritized by importance:
[
  {{
    "task": "task description",
    "priority": "urgent/high/medium/low",
    "reason": "why this priority",
    "effort": "effort estimate"
  }}
]

Respond with ONLY valid JSON array, no other text.
"""
            
            response = self.llm(prompt)
            
            try:
                prioritized = json.loads(response)
                return prioritized
            except json.JSONDecodeError:
                return []
        
        except Exception as e:
            print(f"❌ Error prioritizing tasks: {e}")
            return []
    
    def suggest_next_actions(self, situation: str, context: Dict = None) -> List[str]:
        """
        Suggest next actions based on current situation.
        """
        try:
            context_text = self._format_context(context)
            
            prompt = f"""
You are an action planning expert. Given this situation, suggest 3-5 concrete next actions.

User Context:
{context_text}

Current Situation:
{situation}

Suggest specific, actionable next steps. Be practical and concise.
Format as a simple JSON array:
["action 1", "action 2", "action 3"]

Respond with ONLY the JSON array, no other text.
"""
            
            response = self.llm(prompt)
            
            try:
                actions = json.loads(response)
                return actions
            except json.JSONDecodeError:
                return self._extract_actions_from_text(response)
        
        except Exception as e:
            print(f"❌ Error suggesting actions: {e}")
            return []
    
    def _format_context(self, context: Dict = None) -> str:
        """Format context for prompts"""
        if not context:
            return "No additional context provided."
        
        lines = []
        if "user_preferences" in context:
            lines.append("User Preferences: " + str(context["user_preferences"]))
        if "relevant_memories" in context:
            lines.append("Relevant Memories: " + "\n".join(context["relevant_memories"][:3]))
        
        return "\n".join(lines) if lines else "No additional context provided."
    
    def _create_simple_plan(self, goal: str, response: str) -> Dict:
        """Fallback plan creation"""
        return {
            "goal": goal,
            "steps": [
                {"step": 1, "action": "Start working on: " + goal},
                {"step": 2, "action": "Track progress"},
                {"step": 3, "action": "Adjust as needed"}
            ],
            "created_by": "planning_agent",
            "fallback": True
        }
    
    def _create_simple_breakdown(self, task: str, response: str) -> List[Dict]:
        """Fallback task breakdown"""
        return [
            {"subtask": "Understand the task: " + task, "order": 1},
            {"subtask": "Execute", "order": 2},
            {"subtask": "Review and refine", "order": 3}
        ]
    
    def _extract_actions_from_text(self, text: str) -> List[str]:
        """Extract action items from text response"""
        lines = text.split("\n")
        actions = [line.strip() for line in lines if line.strip() and line.startswith("-")]
        return actions[:5]  # Return max 5 actions
