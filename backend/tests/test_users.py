import pytest
from app import schemas
from jose import jwt

from app.config import settings


def test_root(client):
    res = client.get("/")
    assert res.json()["message"] == "Hello! Welcome to the Website"
    assert res.status_code == 200


def test_create_user(client):
    res = client.post(
        "/users/", json={"email": "createuser@gmail.com", "password": "password123"})
    
    new_user = schemas.UserOut(**res.json())
    assert new_user.email == "createuser@gmail.com"
    assert res.status_code == 201

def test_login_user(client, test_user):
    res = client.post(
        "/login/", data={"username": "leo123@gmail.com", "password": "password123"})

    login_res = schemas.Token(**res.json())
    payload = jwt.decode(login_res.access_token,settings.secret_key,algorithms=[settings.algorithm])
    
    id: str = payload.get("user_id")
    assert id == test_user['id']
    assert login_res.token_type == "bearer"
    assert res.status_code == 200

@pytest.mark.parametrize("email, password, status_code", [
    ('wrongemail@gmail.com','password123', 403),
    ('leo123@gmail.com','wrongpassword', 403),
    ('wrongemail@gmail.com','wrongpassword', 403),
    (None, 'password123', 422),
    ('leo123@gmail.com', None, 422)
])

def test_incorrect_login(test_user, client, email, password, status_code):
    res = client.post(
        "/login", data={"username": email, "password" : password }
    )

    assert res.status_code == status_code
    # assert res. json(). get('detail') == 'Invalid Credentials'