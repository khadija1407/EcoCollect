from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.schemas.auth import AdminLoginRequest, AdminTokenResponse
from app.schemas.stats import (
    StatisticsResponse,
    CategoryStatisticsResponse,
    AnalyticsResponse
)
from app.schemas.request import RequestListResponse
from app.services.request_service import (
    get_statistics,
    get_category_statistics,
    get_analytics,
    get_requests
)
from app.utils.auth import create_admin_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/login", response_model=AdminTokenResponse)
def admin_login(payload: AdminLoginRequest):
    """Simple admin authentication for staff portal."""
    if payload.username.strip() == settings.ADMIN_USERNAME and payload.password == settings.ADMIN_PASSWORD:
        token = create_admin_token(payload.username.strip())
        return AdminTokenResponse(token=token, token_type="bearer", username=payload.username.strip())
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid admin credentials. Please verify your username and password."
    )

@router.get("/statistics", response_model=StatisticsResponse)
def admin_statistics(db: Session = Depends(get_db)):
    """Fetch live counts for Total, Pending, Confirmed, Scheduled, Collected, and Cancelled."""
    return get_statistics(db)

@router.get("/category-statistics", response_model=CategoryStatisticsResponse)
def admin_category_statistics(db: Session = Depends(get_db)):
    """Fetch live distribution of requests grouped by waste category."""
    return get_category_statistics(db)

@router.get("/history", response_model=RequestListResponse)
def admin_history(
    search: Optional[str] = Query(None, description="Search request ID or address"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status (Collected/Cancelled)"),
    date_filter: Optional[str] = Query(None, alias="date", description="Filter by date"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Retrieve completed (Collected) and Cancelled pickup requests."""
    items, total = get_requests(
        db=db,
        search=search,
        category=category,
        status=status,
        date_filter=date_filter,
        is_history=True,
        skip=skip,
        limit=limit
    )
    return {
        "items": [item.to_dict() for item in items],
        "total": total
    }

@router.get("/analytics", response_model=AnalyticsResponse)
def admin_analytics(db: Session = Depends(get_db)):
    """Fetch comprehensive analytics calculated directly from database records."""
    return get_analytics(db)
