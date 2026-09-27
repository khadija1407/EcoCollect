import os
import sys
from datetime import date, timedelta
from fastapi.testclient import TestClient

# Ensure backend is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import init_db

def run_verification():
    init_db()
    client = TestClient(app)
    print("=== Starting EcoCollect Verification Scenario ===")

    # 1 & 2. Open website / healthcheck
    print("[1 & 2] Verifying health check and root serving...")
    res = client.get("/health")
    assert res.status_code == 200, f"Healthcheck failed: {res.text}"
    print("  -> Service is healthy: EcoCollect 1.0.0")

    # Check that root serves frontend index.html
    root_res = client.get("/")
    assert root_res.status_code == 200, "Frontend root did not serve 200"
    assert "EcoCollect" in root_res.text or "<div id=\"root\">" in root_res.text
    print("  -> Frontend index.html served at root correctly.")

    # 3, 4, 5, 6, 7, 8: Submit Request
    print("[3-8] Testing Request submission (E-Waste, address, future date, time slot)...")
    future_date = (date.today() + timedelta(days=3)).strftime("%Y-%m-%d")
    payload = {
        "waste_category": "E-Waste",
        "pickup_address": "88 Hackathon Boulevard, Floor 4",
        "pickup_date": future_date,
        "pickup_time": "10:00 AM – 12:00 PM",
        "notes": "Box of old circuit boards, cables, and 2 laptops"
    }

    create_res = client.post("/api/requests", json=payload)
    assert create_res.status_code == 201, f"Failed creating request: {create_res.text}"
    created_data = create_res.json()

    # 9. Receive unique request ID
    req_id = created_data["request_id"]
    print(f"[9] Created Request with unique ID: {req_id}")
    assert req_id.startswith("EC-")

    # 10 & 11. Open tracking & confirm status is Pending
    print(f"[10 & 11] Opening tracking for {req_id}...")
    track_res = client.get(f"/api/requests/{req_id}")
    assert track_res.status_code == 200
    track_data = track_res.json()
    assert track_data["status"] == "Pending", f"Expected Pending, got {track_data['status']}"
    print(f"  -> Confirmed status is: {track_data['status']}")

    # 12. Log into Admin
    print("[12] Logging into Admin with staff credentials...")
    login_res = client.post("/api/admin/login", json={"username": "admin", "password": "ecocollect2026"})
    assert login_res.status_code == 200, f"Admin login failed: {login_res.text}"
    token = login_res.json()["token"]
    print("  -> Successfully authenticated as Admin.")

    # 13 & 14. Find the request via search / filter
    print("[13 & 14] Searching and filtering request in staff list...")
    search_res = client.get(f"/api/requests?search={req_id}")
    assert search_res.status_code == 200
    search_items = search_res.json()["items"]
    assert any(item["request_id"] == req_id for item in search_items), "Request not found in search"
    print(f"  -> Found {req_id} via search query.")

    filter_res = client.get("/api/requests?category=E-Waste&status=Pending")
    assert filter_res.status_code == 200
    assert any(item["request_id"] == req_id for item in filter_res.json()["items"])
    print("  -> Found request in E-Waste + Pending filter.")

    # 15. Change status to Confirmed
    print(f"[15] Changing status of {req_id} to Confirmed...")
    p1 = client.patch(f"/api/requests/{req_id}/status", json={"status": "Confirmed"})
    assert p1.status_code == 200
    assert p1.json()["status"] == "Confirmed"
    print("  -> Status updated to Confirmed.")

    # 16. Change status to Scheduled
    print(f"[16] Changing status of {req_id} to Scheduled...")
    p2 = client.patch(f"/api/requests/{req_id}/status", json={"status": "Scheduled"})
    assert p2.status_code == 200
    assert p2.json()["status"] == "Scheduled"
    print("  -> Status updated to Scheduled.")

    # 17 & 18. Return to user tracking & verify new status is displayed
    print(f"[17 & 18] User tracking query for {req_id}...")
    track_res2 = client.get(f"/api/requests/{req_id}")
    assert track_res2.status_code == 200
    assert track_res2.json()["status"] == "Scheduled"
    print("  -> User tracking confirms real-time status: Scheduled.")

    # 19. Change status to Collected
    print(f"[19] Changing status of {req_id} to Collected...")
    p3 = client.patch(f"/api/requests/{req_id}/status", json={"status": "Collected"})
    assert p3.status_code == 200
    assert p3.json()["status"] == "Collected"
    print("  -> Status updated to Collected.")

    # 20. Confirm it appears in history
    print(f"[20] Verifying {req_id} appears in Completed Pickup History...")
    hist_res = client.get(f"/api/admin/history?search={req_id}")
    assert hist_res.status_code == 200
    hist_items = hist_res.json()["items"]
    assert any(item["request_id"] == req_id and item["status"] == "Collected" for item in hist_items)
    print("  -> Request confirmed in history archive.")

    # 21. Confirm dashboard statistics update accordingly
    print("[21] Checking live dashboard statistics...")
    stats_res = client.get("/api/admin/statistics")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["collected"] >= 2, "Collected count should be at least 2 now"
    print(f"  -> Total: {stats['total_requests']}, Pending: {stats['pending']}, Scheduled: {stats['scheduled']}, Collected: {stats['collected']}")

    # Check analytics
    analytics_res = client.get("/api/admin/analytics")
    assert analytics_res.status_code == 200
    analytics = analytics_res.json()
    assert analytics["completion_rate"] > 0
    print(f"  -> Analytics Completion Rate: {analytics['completion_rate']}%")

    print("\n[22 & 23] Checking validation edge cases...")
    # Past date validation
    past_res = client.post("/api/requests", json={
        "waste_category": "Plastic",
        "pickup_address": "123 Main St",
        "pickup_date": "2020-01-01",
        "pickup_time": "08:00 AM – 10:00 AM"
    })
    assert past_res.status_code == 422
    assert "past" in past_res.json()["detail"].lower()
    print("  -> Past date correctly rejected with friendly message.")

    # Missing category validation
    cat_err_res = client.post("/api/requests", json={
        "waste_category": "",
        "pickup_address": "123 Main St",
        "pickup_date": future_date,
        "pickup_time": "08:00 AM – 10:00 AM"
    })
    assert cat_err_res.status_code == 422
    assert "choose a waste category" in cat_err_res.json()["detail"].lower()
    print("  -> Missing category correctly rejected with friendly message.")

    print("\n ALL 23 SCENARIO CRITERIA VERIFIED AND PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_verification()
