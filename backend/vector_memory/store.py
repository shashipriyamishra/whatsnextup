import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

VECTOR_DIM = 384
index = faiss.IndexFlatL2(VECTOR_DIM)
documents = []


def embed_text(text: str):
    return model.encode([text])[0]


def add_document(text: str):
    vector = embed_text(text)
    index.add(np.array([vector]).astype("float32"))
    documents.append(text)


def search_similar(query: str, k: int = 3):
    query_vector = embed_text(query)
    distances, indices = index.search(
        np.array([query_vector]).astype("float32"), k
    )

    results = []
    for idx in indices[0]:
        if idx < len(documents):
            results.append(documents[idx])

    return results
