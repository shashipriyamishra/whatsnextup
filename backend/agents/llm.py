# agents/llm.py

import os
import vertexai
from vertexai.generative_models import GenerativeModel
from google.api_core.exceptions import GoogleAPICallError
# These are SAFE defaults
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "whatsnextup")
LOCATION = "us-central1"  # supported for Gemini

# Initialize Vertex AI
vertexai.init(project=PROJECT_ID, location=LOCATION)

# IMPORTANT: use EXACT model name from Vertex AI Studio
model = GenerativeModel("gemini-2.5-flash")

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
        return "AI service is temporarily unavailable. Please try again."
