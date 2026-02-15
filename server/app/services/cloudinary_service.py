import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config( 
  cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
  api_key = settings.CLOUDINARY_API_KEY, 
  api_secret = settings.CLOUDINARY_API_SECRET 
)

class CloudinaryService:
    def upload_image(self, file, folder: str = "ecommerce"):
        try:
            result = cloudinary.uploader.upload(file.file, folder=folder)
            return result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            raise e

cloudinary_service = CloudinaryService()
