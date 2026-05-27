import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from app.config import settings
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
from app import schemas
from app.main import app
import pytest
from app.database import get_db, Base
from app import models, utils
from tests.database import engine, TestingSessionLocal
from app.oauth2 import create_access_token


@pytest.fixture
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close() 


@pytest.fixture
def client(session):
    def override_get_db():
    
        try:
            yield session
        finally:
            session.close()
            
    app.dependency_overrides[get_db] = override_get_db 

    yield TestClient(app)


@pytest.fixture
def test_user(session):
    user_data = {
        "email": "leo123@gmail.com",
        "password": "password123"
    }

    # remove existing user
    session.query(models.User).filter(
        models.User.email == user_data["email"]
    ).delete()

    session.commit()

    # create user
    user = models.User(**user_data)

    # hash password
    user.password = utils.hash(user.password)

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "password": user_data["password"]
    }

@pytest.fixture
def test_user2(session):
    user_data = {
        "email": "maddy@gmail.com",
        "password": "password123"
    }

    # remove existing user
    session.query(models.User).filter(
        models.User.email == user_data["email"]
    ).delete()

    session.commit()

    # create user
    user = models.User(**user_data)

    # hash password
    user.password = utils.hash(user.password)

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "password": user_data["password"]
    }

@pytest.fixture
def token(test_user):
    return create_access_token({"user_id": test_user['id']})

@pytest.fixture
def authorized_client(client, token):
    client.headers["Authorization"] = f"Bearer {token}"
    return client

@pytest.fixture
def test_posts(test_user, session, test_user2):
    posts_data = [
        {
            "title": "Learning FastAPI",
            "content": "FastAPI makes it easy to build APIs with Python.",
            "owner_id": test_user['id']
        },
        {
            "title": "Pytest Basics",
            "content": "Pytest helps in writing clean and scalable test cases.",
            "owner_id": test_user['id']
        },
        {
            "title": "SQLAlchemy ORM",
            "content": "SQLAlchemy is used for database operations in Python applications.",
            "owner_id": test_user['id']
        },
        {
            "title": "this is test post",
            "content": "this post was made by user",
            "owner_id": test_user2['id']
        }

    ]

    def create_post_model(post):
        return models.Post(**post)

    post_map = map(create_post_model, posts_data)
    posts = list(post_map)

    session.add_all(posts)
    session.commit()

    posts = session.query(models.Post).all()

    return posts

