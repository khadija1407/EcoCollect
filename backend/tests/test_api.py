import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.pickup_request import PickupRequest
from app.services.seed_service import seed_initial_demo_data

# In-memory test DB with StaticPool so all threads/sessions share the same in-memory DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_initial_demo_data(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_initial_seed_data_loaded():
    res = client.get("/api/requests")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 4
    ids = [item["request_id"] for item in data["items"]]
    assert "EC-2026-00482" in ids
    assert "EC-2026-00481" in ids

def test_create_request_validation_empty_category():
    today = date.today()
    payload = {
        "waste_category": "",
        "pickup_address": "123 Green Street, Apt 4",
        "pickup_date": (today + timedelta(days=2)).strftime("%Y-%m-%d"),
        "pickup_time": "10:00 AM – 12:00 PM"
    }
    res = client.post("/api/requests", json=payload)
    assert res.status_code == 422
    assert "choose a waste category" in res.json()["detail"]

def test_create_request_validation_past_date():
    yesterday = date.today() - timedelta(days=1)
    payload = {
        "waste_category": "Plastic",
        "pickup_address": "123 Green Street, Apt 4",
        "pickup_date": yesterday.strftime("%Y-%m-%d"),
        "pickup_time": "10:00 AM – 12:00 PM"
    }
    res = client.post("/api/requests", json=payload)
    assert res.status_code == 422
    assert "past" in res.json()["detail"].lower()

def test_create_request_success_flow():
    tomorrow = date.today() + timedelta(days=1)
    payload = {
        "waste_category": "E-Waste",
        "pickup_address": "500 Innovation Way, Suite 12",
        "pickup_date": tomorrow.strftime("%Y-%m-%d"),
        "pickup_time": "02:00 PM – 04:00 PM",
        "notes": "Old printer and cables in box"
    }
    res = client.post("/api/requests", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["request_id"].startswith("EC-")
    assert data["waste_category"] == "E-Waste"
    assert data["status"] == "Pending"
    new_id = data["request_id"]

    # Verify retrieval by request_id
    get_res = client.get(f"/api/requests/{new_id}")
    assert get_res.status_code == 200
    assert get_res.json()["request_id"] == new_id

    # Update status to Confirmed
    patch_res = client.patch(f"/api/requests/{new_id}/status", json={"status": "Confirmed"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Confirmed"

    # Update status to Scheduled
    patch_res2 = client.patch(f"/api/requests/{new_id}/status", json={"status": "Scheduled"})
    assert patch_res2.status_code == 200
    assert patch_res2.json()["status"] == "Scheduled"

    # Update status to Collected
    patch_res3 = client.patch(f"/api/requests/{new_id}/status", json={"status": "Collected"})
    assert patch_res3.status_code == 200
    assert patch_res3.json()["status"] == "Collected"

def test_admin_endpoints():
    # Login
    login_res = client.post("/api/admin/login", json={"username": "admin", "password": "ecocollect2026"})
    assert login_res.status_code == 200
    assert "token" in login_res.json()

    # Statistics
    stats_res = client.get("/api/admin/statistics")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_requests"] >= 4
    assert stats["collected"] >= 1

    # Category stats
    cat_res = client.get("/api/admin/category-statistics")
    assert cat_res.status_code == 200
    assert len(cat_res.json()["categories"]) == 6

    # History
    hist_res = client.get("/api/admin/history")
    assert hist_res.status_code == 200
    for item in hist_res.json()["items"]:
        assert item["status"] in ["Collected", "Cancelled"]
