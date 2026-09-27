from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator

VALID_CATEGORIES = [
    "Plastic",
    "Dry Waste",
    "Organic",
    "E-Waste",
    "Hazardous",
    "Other"
]

VALID_STATUSES = [
    "Pending",
    "Confirmed",
    "Scheduled",
    "Collected",
    "Cancelled"
]

class RequestCreate(BaseModel):
    waste_category: str = Field(..., description="Waste category chosen by the user")
    pickup_address: str = Field(..., description="Pickup location address")
    pickup_date: str = Field(..., description="Pickup date in YYYY-MM-DD format")
    pickup_time: str = Field(..., description="Preferred pickup time slot")
    notes: Optional[str] = Field(None, description="Optional notes for the collector")

    @field_validator("waste_category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        clean = v.strip() if v else ""
        if not clean:
            raise ValueError("Please choose a waste category.")
        if clean not in VALID_CATEGORIES:
            raise ValueError(f"'{clean}' is not a valid waste category. Allowed: {', '.join(VALID_CATEGORIES)}.")
        return clean

    @field_validator("pickup_address")
    @classmethod
    def validate_address(cls, v: str) -> str:
        clean = v.strip() if v else ""
        if not clean:
            raise ValueError("Please enter your pickup address.")
        if len(clean) < 5:
            raise ValueError("Please provide a more detailed address (at least 5 characters).")
        return clean

    @field_validator("pickup_date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        clean = v.strip() if v else ""
        if not clean:
            raise ValueError("Please select a pickup date.")
        try:
            parsed_date = datetime.strptime(clean, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Invalid date format. Please use YYYY-MM-DD.")
        
        today = date.today()
        if parsed_date < today:
            raise ValueError("Pickup date cannot be in the past. Please select today or a future date.")
        return clean

    @field_validator("pickup_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        clean = v.strip() if v else ""
        if not clean:
            raise ValueError("Please choose a pickup time slot.")
        return clean

class RequestUpdateStatus(BaseModel):
    status: str = Field(..., description="New status for the pickup request")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        clean = v.strip() if v else ""
        if clean not in VALID_STATUSES:
            raise ValueError(f"Invalid status '{clean}'. Must be one of: {', '.join(VALID_STATUSES)}.")
        return clean

class RequestResponse(BaseModel):
    id: int
    request_id: str
    waste_category: str
    pickup_address: str
    pickup_date: str
    pickup_time: str
    notes: Optional[str] = None
    status: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class RequestListResponse(BaseModel):
    items: List[RequestResponse]
    total: int
