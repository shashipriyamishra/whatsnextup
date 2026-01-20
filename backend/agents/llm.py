# agents/llm.py

import os
import vertexai
from vertexai.generative_models import GenerativeModel
from google.api_core.exceptions import GoogleAPICallError

# These are SAFE defaults
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "whatsnextup-d2415")
LOCATION = "us-central1"  # supported for Gemini

print(f"📍 Initializing Vertex AI with PROJECT_ID={PROJECT_ID}, LOCATION={LOCATION}")

# Initialize Vertex AI with error handling
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print(f"✅ Vertex AI initialized successfully")
except Exception as e:
    print(f"❌ Vertex AI initialization failed: {e}")
    raise

# IMPORTANT: use EXACT model name from Vertex AI Studio
try:
    model = GenerativeModel("gemini-2.5-flash")
    print(f"✅ Gemini model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load Gemini model: {e}")
    raise

def call_llm(prompt: str) -> str:
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.4,
                "max_output_tokens": 256,
            }
        )
        return response.text
    except GoogleAPICallError as e:
        print(f"❌ API Error: {e}")
        return "AI service is temporarily unavailable. Please try again."
    except Exception as e:
        print(f"❌ Unexpected error in call_llm: {e}")
        return "AI service encountered an error. Please try again."
