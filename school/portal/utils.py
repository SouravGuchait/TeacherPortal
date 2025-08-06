import hashlib
import secrets

def hash_password(password: str, salt: str = None):
    if not salt:
        salt = secrets.token_hex(16)
    password_bytes = (salt + password).encode('utf-8')
    hashed = hashlib.sha256(password_bytes).hexdigest()
    return hashed, salt

#helper function
def calculate_new_marks(existing, new):
    return min(existing + new, 100)