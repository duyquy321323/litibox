def test_create_customer_and_personal_color_test(client):
    create = client.post("/api/customers", json={"name": "Test Liti"})
    assert create.status_code == 201
    customer = create.json()

    test = client.post(
        f"/api/customers/{customer['id']}/personal-color-test",
        json={
            "answers": {
                "undertone": "warm",
                "contrast": "medium",
                "jewelry": "gold",
                "lip_tone": "peach",
                "white_shirt": "ivory",
                "hair": "honey",
                "sun": "tan",
                "style": "fresh",
            }
        },
    )
    assert test.status_code == 200
    assert test.json()["result_type"] in {
        "spring_warm",
        "summer_cool",
        "autumn_warm",
        "winter_cool",
    }


def test_products_empty_and_ai_chat(client):
    products = client.get("/api/products")
    assert products.status_code == 200
    assert products.json()["items"] == []

    chat = client.post("/api/ai/chat", json={"message": "Tìm set daily dưới 400k"})
    assert chat.status_code == 200
    assert chat.json()["reply"]
