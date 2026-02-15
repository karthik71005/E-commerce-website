import httpx
import asyncio

BASE_URL = "http://localhost:8000/api/v1"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin"

async def test_api():
    async with httpx.AsyncClient() as client:
        # 1. Login
        print("Logging in...")
        response = await client.post(f"{BASE_URL}/auth/login", data={
            "username": ADMIN_EMAIL, 
            "password": ADMIN_PASSWORD
        })
        
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} {response.text}")
            return

        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful.")

        # 2. Create Product
        print("Creating product...")
        product_data = {
            "name": "Test Product to Delete",
            "description": "This product will be deleted",
            "price": 10.0,
            "category": "Test",
            "stock": 1,
            "images": []
        }
        response = await client.post(f"{BASE_URL}/products/", json=product_data, headers=headers)
        if response.status_code != 201:
            print(f"Create product failed: {response.status_code} {response.text}")
            return
        
        product_id = response.json()["_id"]
        print(f"Product created: {product_id}")

        # 3. Delete Product
        print("Deleting product...")
        response = await client.delete(f"{BASE_URL}/products/{product_id}", headers=headers)
        
        if response.status_code == 200:
            print("Delete product PASSED (200 OK)")
             # Verify body
            print(f"Response: {response.json()}")
        elif response.status_code == 204:
             print("Delete product FAILED (Still 204)")
        else:
             print(f"Delete product failed with unexpected status: {response.status_code} {response.text}")

if __name__ == "__main__":
    asyncio.run(test_api())
