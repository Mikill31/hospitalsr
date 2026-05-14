SECRET_KEY = "super_secret_key"

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://sebas:123456@localhost:5432/sanrafaelhospital_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
   