# backend/agents/memory_draft_manager.py
"""
Manages memory drafts during the interactive creation process.
Allows users to refine memories before committing.
"""

from agents.llm import call_llm
from agents.memory_agent import MemoryAgent
import json
from typing import Dict, Any, List

class MemoryDraftManager:
    """Manages interactive memory refinement"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.memory_agent = MemoryAgent(user_id)
    
    def create_draft(self, title: str, content: str, context: Dict = None) -> Dict[str, Any]:
        """
        Create an initial memory draft.
        User can then refine it before saving.
        """
        try:
            print(f"📝 Creating memory draft for: {title}")
            
            # Categorize and structure the memory
            analysis = self.memory_agent.analyze_and_categorize(content)
            
            draft_memory = {
                "title": title,
                "content": content,
                "category": analysis.get("category", "insight"),
                "tags": analysis.get("tags", []),
            }
            
            draft_memory["draft_id"] = f"draft_{self.user_id}_{int(__import__('time').time())}"
            
            print(f"✅ Memory draft created with ID: {draft_memory['draft_id']}")
            return draft_memory
            
        except Exception as e:
            print(f"❌ Error creating memory draft: {e}")
            return {"error": str(e)}
    
    def get_field_suggestions(self, field: str, value: str, context: Dict = None) -> List[str]:
        """Get AI suggestions for a specific field"""
        try:
            if not value.strip():
                return []
            
            prompts = {
                "title": f"""Given this memory: {context.get('content', '')}
                
Suggest 3 concise titles (keep each to 5-7 words):
Return as JSON array: ["title1", "title2", "title3"]""",
                
                "category": f"""Memory: {context.get('content', '')}
                
Suggest the best category (choose one):
- learning: Something you learned
- achievement: A success or accomplishment  
- challenge: An obstacle you overcame
- insight: A realization or understanding

Return only the category name.""",
                
                "tags": f"""Memory: {context.get('content', '')}
                
Suggest 5 relevant tags (comma-separated, no #):
Return as JSON array: ["tag1", "tag2", "tag3", "tag4", "tag5"]""",
            }
            
            if field not in prompts:
                return []
            
            suggestion = call_llm(prompts[field])
            
            # Parse suggestions
            try:
                if field == "category":
                    return [suggestion.strip().lower()]
                parsed = json.loads(suggestion)
                return parsed if isinstance(parsed, list) else [suggestion]
            except:
                return [suggestion]
                
        except Exception as e:
            print(f"❌ Error getting suggestions: {e}")
            return []
    
    def get_refinement_hints(self, memory: Dict) -> List[str]:
        """Get AI suggestions for improving the memory"""
        try:
            hints_prompt = f"""Review this memory and suggest improvements:

Title: {memory.get('title', '')}
Content: {memory.get('content', '')}
Category: {memory.get('category', '')}
Tags: {', '.join(memory.get('tags', []))}

Provide 2-3 specific suggestions to improve this memory (e.g., "Add more specific dates", "Include lessons learned").
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
