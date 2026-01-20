# backend/agents/llm.py

_model = None   # global variable, starts empty


def get_model():
    """
    Load the ML model ONLY when needed.
    This function runs the first time /chat is called.
    """
    global _model

    if _model is None:
        # Import happens INSIDE the function (this is the key)
        from sentence_transformers import SentenceTransformer

        print("[ML] Loading SentenceTransformer model...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


def call_llm(prompt: str) -> str:
    """
    Called by orchestrator.
    This is safe because model loads lazily.
    """
    model = get_model()

    # Encode text (example usage)
    embedding = model.encode(prompt)

    return f"[whatsnextup AI] I understood:\n{prompt}"
