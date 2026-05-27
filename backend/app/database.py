from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
# import psycopg2
# from psycopg2.extras import RealDictCursor
# import time
from .config import settings

SQLALCHEMY_DATABASE_URL = settings.database_url or f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# while True:

#     try:
#         conn = psycopg2.connect(host='localhost', database = 'fastapi', user = 'postgres', password = 'sattwikdas', 
#                                 cursor_factory = RealDictCursor)
#         cursor = conn.cursor()
#         print("Connection to Database was Successful !!")
#         break

#     except Exception as error:
#         print("Failed to Connect to the Database")
#         print("Error : ", error)
#         time.sleep(3)
