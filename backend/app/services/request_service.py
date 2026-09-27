from datetime import datetime, timezone
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.models.pickup_request import PickupRequest
from app.schemas.request import RequestCreate, VALID_CATEGORIES, VALID_STATUSES
from app.schemas.stats import (
    StatisticsResponse,
    CategoryStatisticsResponse,
    CategoryCount,
    AnalyticsResponse,
    TimePoint
)

ALLOWED_TRANSITIONS = {
    "Pending": ["Confirmed", "Cancelled"],
    "Confirmed": ["Scheduled", "Cancelled"],
    "Scheduled": ["Collected", "Cancelled"],
    "Collected": [],
    "Cancelled": []
}

def generate_request_id(db: Session) -> str:
    """Generate the next unique request ID like EC-2026-00483."""
    year = datetime.now(timezone.utc).year
    prefix = f"EC-{year}-"
    
    # Find requests starting with prefix
    latest = (
        db.query(PickupRequest)
        .filter(PickupRequest.request_id.like(f"{prefix}%"))
        .order_by(desc(PickupRequest.request_id))
        .first()
    )
    
    if latest:
        try:
            current_num = int(latest.request_id.replace(prefix, ""))
            next_num = current_num + 1
        except ValueError:
            next_num = 483
    else:
        next_num = 483

    return f"{prefix}{next_num:05d}"

def create_pickup_request(db: Session, request_in: RequestCreate) -> PickupRequest:
    request_id = generate_request_id(db)
    now = datetime.now(timezone.utc)
    new_request = PickupRequest(
        request_id=request_id,
        waste_category=request_in.waste_category,
        pickup_address=request_in.pickup_address.strip(),
        pickup_date=request_in.pickup_date,
        pickup_time=request_in.pickup_time,
        notes=request_in.notes.strip() if request_in.notes else None,
        status="Pending",
        created_at=now,
        updated_at=now
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

def get_request_by_id(db: Session, request_id: str) -> Optional[PickupRequest]:
    return db.query(PickupRequest).filter(
        (PickupRequest.request_id == request_id) | (PickupRequest.id == int(request_id) if request_id.isdigit() else False)
    ).first()

def get_requests(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    date_filter: Optional[str] = None,
    is_history: bool = False,
    skip: int = 0,
    limit: int = 100
) -> Tuple[List[PickupRequest], int]:
    query = db.query(PickupRequest)

    if is_history:
        query = query.filter(PickupRequest.status.in_(["Collected", "Cancelled"]))
    elif status:
        query = query.filter(PickupRequest.status == status)

    if category and category != "All" and category != "All Categories":
        query = query.filter(PickupRequest.waste_category == category)

    if date_filter:
        query = query.filter(PickupRequest.pickup_date == date_filter)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (PickupRequest.request_id.ilike(search_term)) |
            (PickupRequest.pickup_address.ilike(search_term)) |
            (PickupRequest.waste_category.ilike(search_term))
        )

    total = query.count()
    items = query.order_by(desc(PickupRequest.created_at)).offset(skip).limit(limit).all()
    return items, total

def update_request_status(db: Session, request_obj: PickupRequest, new_status: str) -> PickupRequest:
    if new_status not in VALID_STATUSES:
        raise ValueError(f"Invalid status '{new_status}'.")
    
    current_status = request_obj.status
    if current_status == new_status:
        return request_obj
    
    # Check valid flow or admin override
    valid_next = ALLOWED_TRANSITIONS.get(current_status, [])
    if new_status not in valid_next and current_status == "Collected":
        raise ValueError("Completed pickup requests cannot be changed.")

    request_obj.status = new_status
    request_obj.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(request_obj)
    return request_obj

def get_statistics(db: Session) -> StatisticsResponse:
    total = db.query(PickupRequest).count()
    pending = db.query(PickupRequest).filter(PickupRequest.status == "Pending").count()
    confirmed = db.query(PickupRequest).filter(PickupRequest.status == "Confirmed").count()
    scheduled = db.query(PickupRequest).filter(PickupRequest.status == "Scheduled").count()
    collected = db.query(PickupRequest).filter(PickupRequest.status == "Collected").count()
    cancelled = db.query(PickupRequest).filter(PickupRequest.status == "Cancelled").count()

    return StatisticsResponse(
        total_requests=total,
        pending=pending,
        confirmed=confirmed,
        scheduled=scheduled,
        collected=collected,
        cancelled=cancelled
    )

def get_category_statistics(db: Session) -> CategoryStatisticsResponse:
    total = db.query(PickupRequest).count()
    counts = (
        db.query(PickupRequest.waste_category, func.count(PickupRequest.id))
        .group_by(PickupRequest.waste_category)
        .all()
    )
    count_dict = {cat: count for cat, count in counts}

    categories_list = []
    for cat in VALID_CATEGORIES:
        c = count_dict.get(cat, 0)
        percentage = round((c / total * 100), 1) if total > 0 else 0.0
        categories_list.append(CategoryCount(category=cat, count=c, percentage=percentage))

    return CategoryStatisticsResponse(categories=categories_list, total=total)

def get_analytics(db: Session) -> AnalyticsResponse:
    total = db.query(PickupRequest).count()
    collected = db.query(PickupRequest).filter(PickupRequest.status == "Collected").count()
    pending = db.query(PickupRequest).filter(PickupRequest.status == "Pending").count()
    completion_rate = round((collected / total * 100), 1) if total > 0 else 0.0

    category_stats = get_category_statistics(db)
    
    # Find most requested category
    most_requested = None
    max_count = -1
    for item in category_stats.categories:
        if item.count > max_count and item.count > 0:
            max_count = item.count
            most_requested = item.category

    # Requests over time
    date_counts = (
        db.query(PickupRequest.pickup_date, func.count(PickupRequest.id))
        .group_by(PickupRequest.pickup_date)
        .order_by(PickupRequest.pickup_date)
        .all()
    )
    time_series = [TimePoint(date=d, count=c) for d, c in date_counts if d]

    return AnalyticsResponse(
        total_requests=total,
        completed_collections=collected,
        pending_requests=pending,
        completion_rate=completion_rate,
        most_requested_category=most_requested,
        requests_by_category=category_stats.categories,
        requests_over_time=time_series
    )
