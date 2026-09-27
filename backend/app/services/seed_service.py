from datetime import datetime, timedelta, date, timezone
from sqlalchemy.orm import Session
from app.models.pickup_request import PickupRequest

def seed_initial_demo_data(db: Session):
    """Seed identifiable demo pickup requests if none exist."""
    existing_count = db.query(PickupRequest).count()
    if existing_count > 0:
        return

    today = date.today()
    now = datetime.now(timezone.utc)
    demo_requests = [
        PickupRequest(
            request_id="EC-2026-00479",
            waste_category="Dry Waste",
            pickup_address="42 Elmwood Grove, Apt 3B, Downtown",
            pickup_date=(today + timedelta(days=1)).strftime("%Y-%m-%d"),
            pickup_time="08:00 AM – 10:00 AM",
            notes="Cardboard boxes broken down and flattened in lobby.",
            status="Confirmed",
            created_at=now - timedelta(days=2),
            updated_at=now - timedelta(days=1)
        ),
        PickupRequest(
            request_id="EC-2026-00480",
            waste_category="Organic",
            pickup_address="118 Riverdale Heights, Building 2",
            pickup_date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
            pickup_time="10:00 AM – 12:00 PM",
            notes="Green compost bin placed outside back entrance.",
            status="Collected",
            created_at=now - timedelta(days=3),
            updated_at=now - timedelta(days=1)
        ),
        PickupRequest(
            request_id="EC-2026-00481",
            waste_category="Plastic",
            pickup_address="74 Magnolia Avenue, Suite 101",
            pickup_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"),
            pickup_time="02:00 PM – 04:00 PM",
            notes="Rinsed beverage bottles and food containers in transparent bags.",
            status="Pending",
            created_at=now - timedelta(hours=6),
            updated_at=now - timedelta(hours=6)
        ),
        PickupRequest(
            request_id="EC-2026-00482",
            waste_category="E-Waste",
            pickup_address="905 Pinehurst Boulevard, Gate 4",
            pickup_date=(today + timedelta(days=1)).strftime("%Y-%m-%d"),
            pickup_time="12:00 PM – 02:00 PM",
            notes="2 obsolete desktop towers, power cables, and 3 mobile phones.",
            status="Scheduled",
            created_at=now - timedelta(hours=3),
            updated_at=now - timedelta(hours=1)
        ),
    ]

    for item in demo_requests:
        db.add(item)
    db.commit()
