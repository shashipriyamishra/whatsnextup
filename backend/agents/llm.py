# agents/llm.py

import os
import vertexai
from vertexai.generative_models import GenerativeModel
from google.api_core.exceptions import GoogleAPICallError

# On Cloud Run, this will be set automatically. Fallback to project ID from Firebase env
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("GCP_PROJECT") or os.getenv("FIREBASE_PROJECT_ID", "whatsnextup")
LOCATION = "us-central1"  # supported for Gemini

print(f"📍 Initializing Vertex AI with PROJECT_ID={PROJECT_ID}, LOCATION={LOCATION}")

model = None  # Will be initialized lazily

# Initialize Vertex AI with error handling
try:
    # On Cloud Run, Application Default Credentials are used automatically
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print(f"✅ Vertex AI initialized successfully")
    
    # IMPORTANT: use EXACT model name from Vertex AI Studio
    try:
        model = GenerativeModel("gemini-2.5-flash")
        print(f"✅ Gemini model loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load Gemini model: {e}")
        print(f"⚠️  LLM features will be disabled")
except Exception as e:
    print(f"❌ Vertex AI initialization failed: {e}")
    print(f"⚠️  This may happen if GOOGLE_CLOUD_PROJECT is not set or ADC is not available")
    print(f"⚠️  LLM features will be disabled, but app will continue")

def call_llm(prompt: str) -> str:
    global model
    
    if model is None:
        print("⚠️  LLM model not available")
        return "AI service is currently unavailable. Please try again later."
    
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
        return "AI service encountered an error. Please try again."
