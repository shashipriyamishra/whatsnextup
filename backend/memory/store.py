import sqlite3
from datetime import datetime
from typing import Optional, List, Dict

DB_NAME = "memory.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


async def save_memory(user_id: str, data: Dict):
    """Save a memory for a user"""
    conn = get_connection()
    cursor = conn.cursor()
    
    content = data.get("text", data.get("content", ""))
    category = data.get("category", "general")

    cursor.execute(
        "INSERT INTO memories (user_id, content, category, created_at) VALUES (?, ?, ?, ?)",
        (user_id, content, category, datetime.utcnow().isoformat())
    )

    conn.commit()
    conn.close()


async def get_memories(user_id: str, category: Optional[str] = None, limit: int = 5) -> List[Dict]:
    """Get recent memories for a user"""
    conn = get_connection()
    cursor = conn.cursor()

    if category:
        cursor.execute(
            "SELECT content, category, created_at FROM memories WHERE user_id = ? AND category = ? ORDER BY id DESC LIMIT ?",
            (user_id, category, limit)
        )
    else:
        cursor.execute(
            "SELECT content, category, created_at FROM memories WHERE user_id = ? ORDER BY id DESC LIMIT ?",
            (user_id, limit)
        )

    rows = cursor.fetchall()
    conn.close()

    return [{"text": row[0], "category": row[1], "created_at": row[2]} for row in rows]


def get_recent_memories(limit: int = 5):
    """Legacy function - get all recent memories"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT content FROM memories ORDER BY id DESC LIMIT ?",
        (limit,)
    )

    rows = cursor.fetchall()
    conn.close()

    return [row[0] for row in rows]
