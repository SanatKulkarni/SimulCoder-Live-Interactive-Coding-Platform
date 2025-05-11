from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sanat:sanat@cluster0.48djh.mongodb.net/simulcoder?retryWrites=true&w=majority")
DATABASE_NAME = "simulcoder" # Or extract from MONGO_URI if preferred

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        try:
            self.client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
            # Send a ping to confirm a successful connection
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
            self.db = self.client[DATABASE_NAME]
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            self.client = None
            self.db = None

    def get_db(self):
        if self.db is None:
            self.connect()
        return self.db

    def close(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

db_handler = Database()

# To easily access the database instance
def get_database_instance():
    return db_handler.get_db()

# Example of how to get a collection
# def get_questions_collection():
#     db = get_database_instance()
#     if db:
#         return db["questions"]
#     return None