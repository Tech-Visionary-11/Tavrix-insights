
import asyncio
import sys
import os
from sqlalchemy import text

# Add the project root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import engine

async def keep_alive():
    print("Starting database keep-alive check...")
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Keep-alive query executed successfully. Result: {result.scalar()}")
    except Exception as e:
        print(f"Error executing keep-alive query: {e}")
        # We don't exit with error to avoid failing the workflow if it's just a transient issue,
        # but for now let's raise it so we know if it fails.
        sys.exit(1)
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(keep_alive())
