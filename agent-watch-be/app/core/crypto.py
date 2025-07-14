# app/core/crypto.py  (simple Fernet helper)
from cryptography.fernet import Fernet
import os

FERNET_KEY = os.getenv("FERNET_KEY") or Fernet.generate_key().decode()
fernet = Fernet(FERNET_KEY.encode())

def encrypt(text: str) -> str:
    return fernet.encrypt(text.encode()).decode()

def decrypt(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
