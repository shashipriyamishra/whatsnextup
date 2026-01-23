# backend/agents/reflection_draft_manager.py
"""
Manages reflection drafts during the interactive creation process.
Allows users to refine reflections before committing.
"""

from agents.llm import call_llm
from agents.reflection_agent import ReflectionAgent
import json
from typing import Dict, List, Any

class ReflectionDraftManager:
    """Manages interactive reflection refinement"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.reflection_agent = ReflectionAgent(user_id)
    
    def create_draft(self, title: str, content: str, context: Dict = None) -> Dict[str, Any]:
        """
        Create an initial reflection draft.
        User can then refine it before saving.
        """
        try:
            print(f"📝 Creating reflection draft for: {title}")
            
            # Analyze the reflection
            analysis = self.reflection_agent.analyze_reflection(content)
            
            draft_reflection = {
                "title": title,
                "content": content,
                "type": analysis.get("type", "daily"),
                "insights": analysis.get("key_insights", []),
                "next_actions": analysis.get("next_actions", []),
            }
            
            draft_reflection["draft_id"] = f"draft_{self.user_id}_{int(__import__('time').time())}"
            
            print(f"✅ Reflection draft created with ID: {draft_reflection['draft_id']}")
            return draft_reflection
            
        except Exception as e:
            print(f"❌ Error creating reflection draft: {e}")
            return {"error": str(e)}
    
    def get_field_suggestions(self, field: str, value: str, context: Dict = None) -> List[str]:
        """Get AI suggestions for a specific field"""
        try:
            if not value.strip():
                return []
            
            prompts = {
                "title": f"""Given this reflection: {context.get('content', '')}
                
Suggest 3 concise titles (keep each to 6-8 words):
Return as JSON array: ["title1", "title2", "title3"]""",
                
                "type": f"""Reflection: {context.get('content', '')}
                
Categorize this reflection type (choose one):
- daily: Quick daily reflection
- weekly: Week review and learnings
- monthly: Month summary and progress
- goal-review: Reflecting on goal progress

Return only the type name.""",
                
                "insights": f"""Reflection content: {context.get('content', '')}
                
Extract 3 key insights or realizations from this reflection.
Return as JSON array: ["insight1", "insight2", "insight3"]""",
                
                "next_actions": f"""Based on this reflection: {context.get('content', '')}
                
Suggest 2-3 concrete next actions to take.
Return as JSON array: ["action1", "action2", "action3"]""",
            }
            
            if field not in prompts:
                return []
            
            suggestion = call_llm(prompts[field])
            
            # Parse suggestions
            try:
                if field == "type":
                    return [suggestion.strip().lower()]
                parsed = json.loads(suggestion)
                return parsed if isinstance(parsed, list) else [suggestion]
            except:
                return [suggestion]
                
        except Exception as e:
            print(f"❌ Error getting suggestions: {e}")
            return []
    
    def get_refinement_hints(self, reflection: Dict) -> List[str]:
        """Get AI suggestions for improving the reflection"""
        try:
            hints_prompt = f"""Review this reflection and suggest improvements:

Title: {reflection.get('title', '')}
Content: {reflection.get('content', '')}
Type: {reflection.get('type', '')}
Insights: {', '.join(reflection.get('insights', []))}
Actions: {', '.join(reflection.get('next_actions', []))}

Provide 2-3 specific suggestions to enhance this reflection (e.g., "Add more specific metrics", "Clarify the lessons learned").
Return as JSON array of strings."""
            
            hints_text = call_llm(hints_prompt)
            
            try:
                hints = json.loads(hints_text)
                return hints if isinstance(hints, list) else [hints_text]
            except:
                return [hints_text] if hints_text else []
                
        except Exception as e:
            print(f"❌ Error getting refinement hints: {e}")
            return []
