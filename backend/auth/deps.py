from fastapi import Header, HTTPException
from auth.firebase import verify_firebase_token
import logging
from typing import Optional

logger = logging.getLogger(__name__)

def get_current_user(authorization: Optional[str] = Header(None)):
    """Extract and verify user from Firebase ID token"""
    
    if not authorization:
        logger.warning("Missing Authorization header")
        raise HTTPException(
            status_code=401, 
            detail="Missing Authorization header"
        )
    
    if not authorization.startswith("Bearer "):
        logger.warning(f"Invalid auth format: {authorization[:20]}...")
        raise HTTPException(
            status_code=401, 
            detail="Invalid Authorization header format. Expected: Bearer <token>"
        )

    token = authorization.split(" ", 1)[1]
    
    if not token:
        logger.warning("Empty token after Bearer")
        raise HTTPException(status_code=401, detail="Empty token")

    try:
        logger.debug(f"Verifying token: {token[:20]}...")
        user = verify_firebase_token(token)
        logger.info(f"Auth successful for user: {user.get('uid')}")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token verification error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=401, 
            detail=f"Token verification failed: {str(e)}"
        )
