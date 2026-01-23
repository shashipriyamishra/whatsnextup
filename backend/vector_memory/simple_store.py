# backend/vector_memory/store.py

import math

_documents = []
_vectors = []
_model = None


def get_model():
    """
    Lazily load SentenceTransformer model.
    This runs ONLY when semantic memory is actually used.
    Returns None if model cannot be loaded.
    """
    global _model

    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            print("[ML] Loading SentenceTransformer model...")
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except ImportError as e:
            print(f"⚠️ sentence_transformers not installed: {e}")
            return None
        except Exception as e:
            print(f"⚠️ Failed to load SentenceTransformer: {e}")
            return None

    return _model


def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    return dot / (norm1 * norm2 + 1e-8)


def embed_text(text: str):
    """
    Convert text to embedding vector.
    Returns empty list if model unavailable.
    """
    try:
        model = get_model()
        if model is None:
            print("⚠️ Embedding model unavailable, skipping embeddings")
            return []
        return model.encode(text).tolist()
    except Exception as e:
        print(f"❌ Error embedding text: {e}")
        return []


def add_document(text: str):
    """
    Store text and its vector representation.
    Safely handles missing model.
    """
    try:
        vector = embed_text(text)
        if vector:  # Only add if we have a valid vector
            _documents.append(text)
            _vectors.append(vector)
        else:
            print(f"⚠️ Skipping vector storage for: {text[:50]}...")
    except Exception as e:
        print(f"❌ Error adding document: {e}")


def search_similar(query: str, k: int = 3):
    """
    Find top-k semantically similar past documents.
    Returns empty list if model unavailable or no documents.
    """
    try:
        if not _vectors:
            return []

        model = get_model()
        if model is None:
            print("⚠️ Embedding model unavailable for search")
            return []

        query_vector = model.encode(query).tolist()

        scores = [
            (cosine_similarity(query_vector, v), idx)
            for idx, v in enumerate(_vectors)
        ]

        scores.sort(reverse=True)
        top_indices = [idx for _, idx in scores[:k]]

        return [_documents[i] for i in top_indices]
    except Exception as e:
        print(f"❌ Error searching similar documents: {e}")
        return []
