from app.core.security import get_password_hash, verify_password
import sys

try:
    print("Testing Argon2 hashing...")
    pwd = "secret"
    hashed = get_password_hash(pwd)
    print(f"Hash generated: {hashed}")
    
    is_valid = verify_password(pwd, hashed)
    print(f"Password verification: {is_valid}")
    
    if is_valid:
        print("Hashing test PASSED")
    else:
        print("Hashing test FAILED")
        sys.exit(1)

except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
