def test_health_returns_ok(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert "app" in body and "env" in body and "version" in body


def test_health_db_returns_ok(client):
    response = client.get("/api/health/db")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "up"}


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["docs"] == "/docs"
