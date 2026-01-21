# backend/agents/reflection_agent.py

from agents.llm import call_llm
from typing import List, Dict, Any


class ReflectionAgent:
    """
    Helps users extract insights from their experiences.
    Identifies patterns, learnings, and growth opportunities.
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.llm = call_llm
    
    def analyze_reflection(self, reflection_text: str) -> Dict[str, Any]:
        """
        Analyze a reflection and extract insights.
        """
        try:
            prompt = f"""
You are a reflection analysis expert. Analyze this user reflection and provide structured insights.

User Reflection:
{reflection_text}

Respond with a JSON object containing:
{{
  "title": "short title for this reflection",
  "mood": "detected mood (happy/sad/thoughtful/energetic/calm/confused/motivated/grateful)",
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "patterns": ["pattern 1", "pattern 2"],
  "growth_areas": ["area 1", "area 2"],
  "suggested_actions": ["action 1", "action 2"],
  "emotional_tone": "brief description of emotional tone"
}}

Respond with ONLY valid JSON, no other text.
"""
            
            response = self.llm(prompt)
            
            import json
            try:
                analysis = json.loads(response)
                return analysis
            except json.JSONDecodeError:
                return self._create_simple_analysis(reflection_text)
        
        except Exception as e:
            print(f"❌ Error analyzing reflection: {e}")
            return {"error": str(e)}
    
    def identify_patterns(self, reflections: List[str]) -> Dict[str, Any]:
        """
        Identify patterns across multiple reflections.
        """
        try:
            reflections_text = "\n---\n".join(reflections[-10:])  # Last 10 reflections
            
            prompt = f"""
You are a pattern recognition expert. Analyze these reflections and identify recurring patterns.

Reflections:
{reflections_text}

Identify and respond with a JSON object:
{{
  "recurring_themes": ["theme 1", "theme 2"],
  "emotional_patterns": ["pattern 1", "pattern 2"],
  "behavioral_patterns": ["pattern 1", "pattern 2"],
  "progress": "assessment of user's progress",
  "recommendations": ["recommendation 1", "recommendation 2"]
}}

Respond with ONLY valid JSON, no other text.
"""
            
            response = self.llm(prompt)
            
            import json
            try:
                patterns = json.loads(response)
                return patterns
            except json.JSONDecodeError:
                return {"patterns_found": True}
        
        except Exception as e:
            print(f"❌ Error identifying patterns: {e}")
            return []
    
    def extract_learnings(self, reflection: str) -> List[str]:
        """
        Extract key learnings from a reflection.
        """
        try:
            prompt = f"""
You are a learning extraction specialist. Extract the key learnings from this reflection.

Reflection:
{reflection}

Provide 3-5 specific, actionable learnings as a JSON array of strings:
["learning 1", "learning 2", "learning 3"]

Respond with ONLY the JSON array, no other text.
"""
            
            response = self.llm(prompt)
            
            import json
            try:
                learnings = json.loads(response)
                return learnings
            except json.JSONDecodeError:
                return ["Consider reflecting more to identify learnings"]
        
        except Exception as e:
            print(f"❌ Error extracting learnings: {e}")
            return []
    
    def _create_simple_analysis(self, text: str) -> Dict:
        """Fallback analysis"""
        return {
            "title": "Reflection",
            "mood": "thoughtful",
            "key_insights": ["Take time to reflect regularly"],
            "patterns": [],
            "growth_areas": ["Self-awareness"],
            "suggested_actions": ["Continue reflecting"],
            "emotional_tone": "introspective",
            "fallback": True
        }
