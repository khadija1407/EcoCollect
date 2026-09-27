from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class PickupRequest(Base):
    __tablename__ = "pickup_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String(32), unique=True, index=True, nullable=False)
    waste_category = Column(String(64), nullable=False, index=True)
    pickup_address = Column(String(255), nullable=False)
    pickup_date = Column(String(32), nullable=False, index=True)
    pickup_time = Column(String(64), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(32), nullable=False, default="Pending", index=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "waste_category": self.waste_category,
            "pickup_address": self.pickup_address,
            "pickup_date": self.pickup_date,
            "pickup_time": self.pickup_time,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
