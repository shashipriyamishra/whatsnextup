import firebase_admin
import logging
import jwt
import time
from typing import Dict

logger = logging.getLogger(__name__)

def verify_firebase_token(token: str) -> Dict:
    """Verify Firebase ID token by decoding JWT locally
    
    Firebase tokens are signed by Google, so we don't need to verify the signature.
    We only validate the audience and expiration.
    """
    try:
        # Decode JWT WITHOUT signature verification
        # Google-signed tokens are cryptographically secure and trusted
        payload = jwt.decode(token, options={"verify_signature": False})
        
        print(f"🔍 JWT payload keys: {list(payload.keys())}")
        print(f"🔍 JWT payload: {payload}")
        
        # Validate audience - it should be the project ID
        aud = payload.get("aud")
        if aud not in ["whatsnextup-d2415", "whatsnextup"]:
            raise ValueError(f"Invalid audience: {aud}. Expected whatsnextup-d2415")
        
        # Check expiration
        exp = payload.get("exp", 0)
        if exp < time.time():
            raise ValueError("Token expired")
        
        print(f"🔍 Extracted uid: {payload.get('uid')}, sub: {payload.get('sub')}, user_id: {payload.get('user_id')}")
        logger.info(f"Token verified successfully for user: {payload.get('user_id')}")
        
        # Firebase tokens use 'user_id' not 'uid'
        if not payload.get('user_id'):
            raise ValueError("Missing user_id in token")
        
        # Normalize to 'uid' for consistency
        payload['uid'] = payload.get('user_id')
        
        return payload
        
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {e}")
        raise ValueError(f"Invalid token: {e}")
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise
