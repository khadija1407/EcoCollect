import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_db
from app.routes.requests import router as requests_router
from app.routes.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed sample data on startup
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="EcoCollect Waste Pickup & Tracking Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Friendly validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    if errors:
        first_err = errors[0]
        msg = first_err.get("msg", "Invalid input.")
        # Strip ValueError prefix if present
        if msg.startswith("Value error, "):
            msg = msg.replace("Value error, ", "")
        loc = first_err.get("loc", [])
        field_name = loc[-1] if loc else "field"
        
        # Friendly fallbacks for common missing fields
        if "Field required" in msg or "field required" in msg:
            friendly_names = {
                "waste_category": "Please choose a waste category.",
                "pickup_address": "Please enter your pickup address.",
                "pickup_date": "Please select a pickup date.",
                "pickup_time": "Please choose a pickup time slot.",
                "status": "Please provide a valid status."
            }
            msg = friendly_names.get(field_name, f"Please fill out {field_name}.")

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": msg}
        )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Please check your entered details and try again."}
    )

# Include Routers
app.include_router(requests_router)
app.include_router(admin_router)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

# Static file serving for production Cloud Run deployment
BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "frontend" / "dist"

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Allow API routes to pass through
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        index_path = STATIC_DIR / "index.html"
        if index_path.is_file():
            return FileResponse(index_path)
        return JSONResponse(status_code=404, content={"detail": "Frontend not found"})
