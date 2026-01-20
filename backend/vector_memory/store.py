# backend/vector_memory/store.py

import math

_documents = []
_vectors = []
_model = None


def get_model():
    """
    Lazily load SentenceTransformer model.
    This avoids heavy startup cost on Cloud Run.
    """
    global _model

    if _model is None:
        from sentence_transformers import SentenceTransformer
        print("[ML] Loading SentenceTransformer model...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    return dot / (norm1 * norm2 + 1e-8)


def embed_text(text: str):
    try:
        model = get_model()
        return model.encode(text).tolist()
    except Exception as e:
        print(f"❌ Error embedding text: {e}")
        return []


def add_document(text: str):
    try:
        vector = embed_text(text)
        if vector:
            _documents.append(text)
            _vectors.append(vector)
    except Exception as e:
        print(f"❌ Error adding document: {e}")


def search_similar(query: str, k: int = 3):
    try:
        if not _vectors:
            return []

        query_vector = embed_text(query)
        if not query_vector:
            return []

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
