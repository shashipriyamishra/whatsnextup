# backend/agents/draft_manager.py
"""
Manages plan drafts during the interactive creation process.
Allows users to refine plans step-by-step before committing.
"""

from agents.llm import call_llm
from agents.planning_agent import PlanningAgent
import json
from typing import Dict, List, Any

class DraftManager:
    """Manages interactive plan refinement"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.planning_agent = PlanningAgent(user_id)
    
    def create_draft(self, goal: str, context: Dict = None) -> Dict[str, Any]:
        """
        Create an initial plan draft from a goal.
        User can then refine it step-by-step.
        """
        try:
            print(f"📝 Creating draft plan for: {goal}")
            
            # Generate initial plan
            draft_plan = self.planning_agent.create_plan_from_goal(goal, context)
            
            if "error" in draft_plan:
                return {"error": draft_plan["error"]}
            
            # Generate AI reasoning
            reasoning_prompt = f"""Explain why this plan makes sense for: {goal}
            
Plan structure: {json.dumps(draft_plan, default=str)}

In 1-2 sentences, explain the approach."""
            reasoning = call_llm(reasoning_prompt)
            
            draft_plan["reasoning"] = reasoning
            draft_plan["draft_id"] = f"draft_{self.user_id}_{int(__import__('time').time())}"
            
            print(f"✅ Draft created with ID: {draft_plan['draft_id']}")
            return draft_plan
            
        except Exception as e:
            print(f"❌ Error creating draft: {e}")
            return {"error": str(e)}
    
    def get_field_suggestions(self, field: str, current_value: str, plan_context: Dict = None) -> List[str]:
        """
        Get AI suggestions for a specific plan field.
        Suggestions appear as user types.
        """
        try:
            print(f"💡 Getting suggestions for field: {field}")
            
            context_str = json.dumps(plan_context or {}, default=str)
            
            prompts = {
                "goal": f"""User's current goal: {current_value}
                
Context: {context_str}

Suggest 3 MORE SPECIFIC and ACHIEVABLE goal statements that build on this idea.
Make each one actionable and measurable.

Return ONLY as JSON: ["goal 1", "goal 2", "goal 3"]""",
                
                "timeframe": f"""Goal: {plan_context.get('goal', '') if plan_context else ''}
Current timeframe: {current_value}

Suggest 3 REALISTIC timeframe options (considering complexity and scope).
Examples: "2 weeks", "1 month", "6 weeks"

Return ONLY as JSON: ["timeframe 1", "timeframe 2", "timeframe 3"]""",
                
                "priority": f"""Goal: {plan_context.get('goal', '') if plan_context else ''}
Complexity: {plan_context.get('complexity', 'medium') if plan_context else 'medium'}

Suggest BEST priority level: high (urgent, complex), medium (balanced), or low (flexible, learning)
Explain reasoning.

Return ONLY as JSON: {{"priority": "high/medium/low", "reasoning": "why"}}""",
                
                "steps": f"""Goal: {plan_context.get('goal', '') if plan_context else ''}
Timeframe: {plan_context.get('timeframe', '') if plan_context else ''}

Suggest SPECIFIC breakdown into 3-5 concrete steps.
Each step should be clear and achievable.

Return ONLY as JSON: ["Step 1: ...", "Step 2: ...", "Step 3: ..."]""",
            }
            
            prompt = prompts.get(field, f"Suggest improvements for {field}: {current_value}")
            response = call_llm(prompt)
            
            try:
                suggestions = json.loads(response)
                if isinstance(suggestions, dict) and field == "priority":
                    return [suggestions]
                elif isinstance(suggestions, list):
                    return suggestions
                else:
                    return [str(suggestions)]
            except json.JSONDecodeError:
                print(f"⚠️  Could not parse suggestions: {response}")
                return [current_value]  # Return current value if parsing fails
                
        except Exception as e:
            print(f"❌ Error getting suggestions: {e}")
            return []
    
    def refine_draft(self, draft_id: str, field: str, new_value: str, plan_data: Dict) -> Dict[str, Any]:
        """
        Refine a specific field in the draft.
        Regenerates downstream fields if needed.
        """
        try:
            print(f"🔄 Refining draft {draft_id}, field: {field}")
            
            # Update the field
            plan_data[field] = new_value
            
            # If goal changed, regenerate everything
            if field == "goal":
                print(f"  → Goal changed, regenerating plan structure")
                new_plan = self.planning_agent.create_plan_from_goal(new_value)
                if "error" not in new_plan:
                    plan_data.update(new_plan)
            
            # If timeframe changed, suggest adjusted steps
            elif field == "timeframe":
                print(f"  → Timeframe changed, adjusting steps")
                goal = plan_data.get("goal", "")
                steps_prompt = f"""Goal: {goal}
New timeframe: {new_value}

Adjust the steps for this timeframe. Create a realistic breakdown.
Return as JSON: [{{"step": 1, "action": "...", "deadline": "..."}}]"""
                response = call_llm(steps_prompt)
                try:
                    plan_data["steps"] = json.loads(response)
                except:
                    pass
            
            # If priority changed, adjust effort levels
            elif field == "priority":
                print(f"  → Priority changed, adjusting effort levels")
                if field == "priority" and plan_data.get("steps"):
                    for step in plan_data["steps"]:
                        if new_value == "high":
                            step["effort"] = "high"
                        elif new_value == "low":
                            step["effort"] = "low"
            
            print(f"✅ Draft refined successfully")
            return plan_data
            
        except Exception as e:
            print(f"❌ Error refining draft: {e}")
            return plan_data
    
    def generate_alternative_plans(self, goal: str, style: str = "balanced") -> List[Dict]:
        """
        Generate 3 different plan approaches for the same goal.
        User can choose which style they prefer.
        
        Styles: "aggressive" (fast), "balanced" (medium), "relaxed" (thorough)
        """
        try:
            print(f"🎯 Generating {style} plan alternatives for: {goal}")
            
            prompt = f"""Create a {style} plan for: {goal}

Plan styles:
- aggressive: Fast execution, 1-2 weeks, high effort, risk acceptable
- balanced: Medium pace, 3-4 weeks, moderate effort, balanced risk
- relaxed: Thorough approach, 6-8 weeks, manageable effort, low risk

Generate a COMPLETE plan in JSON format for the '{style}' style:
{{
  "style": "{style}",
  "timeframe": "...",
  "priority": "high/medium/low",
  "steps": [
    {{"step": 1, "action": "...", "deadline": "...", "effort": "..."}},
    ...
  ],
  "potential_challenges": ["..."],
  "resources_needed": ["..."],
  "success_metric": "..."
}}

Return ONLY valid JSON."""
            
            response = call_llm(prompt)
            plan = json.loads(response)
            
            print(f"✅ Generated {style} alternative plan")
            return [plan]
            
        except Exception as e:
            print(f"❌ Error generating alternative: {e}")
            return []
    
    def get_refinement_hints(self, plan_data: Dict) -> List[str]:
        """
        Suggest areas that could be improved in the current draft.
        """
        hints = []
        
        # Check completeness
        if not plan_data.get("goal"):
            hints.append("Add a clear, specific goal")
        if not plan_data.get("timeframe"):
            hints.append("Define a realistic timeframe")
        if not plan_data.get("steps") or len(plan_data["steps"]) < 2:
            hints.append("Add more detailed steps (at least 3-4)")
        if not plan_data.get("success_metric"):
            hints.append("Define how you'll measure success")
        if not plan_data.get("resources_needed"):
            hints.append("List tools or resources needed")
        
        # Check quality
        goal = plan_data.get("goal", "")
        if len(goal) < 10:
            hints.append("Make your goal more specific and detailed")
        
        if not hints:
            hints.append("✅ Plan looks good! Ready to save when you are.")
        
        return hints
