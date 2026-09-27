from typing import List, Optional
from pydantic import BaseModel

class StatisticsResponse(BaseModel):
    total_requests: int
    pending: int
    confirmed: int
    scheduled: int
    collected: int
    cancelled: int

class CategoryCount(BaseModel):
    category: str
    count: int
    percentage: float

class CategoryStatisticsResponse(BaseModel):
    categories: List[CategoryCount]
    total: int

class TimePoint(BaseModel):
    date: str
    count: int

class AnalyticsResponse(BaseModel):
    total_requests: int
    completed_collections: int
    pending_requests: int
    completion_rate: float
    most_requested_category: Optional[str]
    requests_by_category: List[CategoryCount]
    requests_over_time: List[TimePoint]
