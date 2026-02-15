import sys
print(sys.path)
try:
    from app.core.config import settings
    print(f"Config loaded: {settings.PROJECT_NAME}")
    from app.models.user_model import UserRole
    print(f"UserRole imported: {UserRole}")
except Exception as e:
    import traceback
    traceback.print_exc()
