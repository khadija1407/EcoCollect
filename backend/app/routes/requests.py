from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.request import (
    RequestCreate,
    RequestUpdateStatus,
    RequestResponse,
    RequestListResponse
)
from app.services.request_service import (
    create_pickup_request,
    get_request_by_id,
    get_requests,
    update_request_status
)

router = APIRouter(prefix="/api/requests", tags=["Requests"])

@router.post("", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    request_in: RequestCreate,
    db: Session = Depends(get_db)
):
    """Create a new waste pickup request."""
    try:
        new_req = create_pickup_request(db, request_in)
        return new_req.to_dict()
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to submit pickup request. Please try again."
        )

@router.get("", response_model=RequestListResponse)
def list_requests(
    search: Optional[str] = Query(None, description="Search request ID, address, or waste type"),
    category: Optional[str] = Query(None, description="Filter by waste category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    date_filter: Optional[str] = Query(None, alias="date", description="Filter by pickup date YYYY-MM-DD"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """List pickup requests with optional search and filters."""
    items, total = get_requests(
        db=db,
        search=search,
        category=category,
        status=status,
        date_filter=date_filter,
        is_history=False,
        skip=skip,
        limit=limit
    )
    return {
        "items": [item.to_dict() for item in items],
        "total": total
    }

@router.get("/{request_id}", response_model=RequestResponse)
def get_request(
    request_id: str,
    db: Session = Depends(get_db)
):
    """Fetch details and live status of a single pickup request by its ID."""
    clean_id = request_id.strip()
    req = get_request_by_id(db, clean_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No pickup request found with ID '{clean_id}'. Please check the ID and try again."
        )
    return req.to_dict()

@router.patch("/{request_id}/status", response_model=RequestResponse)
def update_status(
    request_id: str,
    status_update: RequestUpdateStatus,
    db: Session = Depends(get_db)
):
    """Update status of a pickup request (Pending -> Confirmed -> Scheduled -> Collected, or Cancelled)."""
    clean_id = request_id.strip()
    req = get_request_by_id(db, clean_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No pickup request found with ID '{clean_id}'."
        )
    try:
        updated = update_request_status(db, req, status_update.status)
        return updated.to_dict()
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
