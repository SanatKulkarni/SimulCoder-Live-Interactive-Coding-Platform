from pymongo.database import Database
from models import QuestionCreate, Question, UserCreate, UserInDB, User # Updated imports
from bson import ObjectId
from typing import Optional, List
from auth import get_password_hash # Import password hashing function

QUESTIONS_COLLECTION = "questions"
USERS_COLLECTION = "users"

def create_question(db: Database, question_data: QuestionCreate) -> Question:
    questions_collection = db[QUESTIONS_COLLECTION]
    inserted_question = questions_collection.insert_one(question_data.model_dump())
    created_question = questions_collection.find_one({"_id": inserted_question.inserted_id})
    return Question(**created_question)

def get_question_by_id(db: Database, question_id: str) -> Optional[Question]:
    questions_collection = db[QUESTIONS_COLLECTION]
    question = questions_collection.find_one({"_id": ObjectId(question_id)})
    if question:
        return Question(**question)
    return None

def get_all_questions(db: Database, skip: int = 0, limit: int = 100) -> List[Question]:
    questions_collection = db[QUESTIONS_COLLECTION]
    questions_cursor = questions_collection.find().skip(skip).limit(limit)
    return [Question(**q) for q in questions_cursor]

# Add update and delete functions as needed

# New User CRUD functions
def get_user_by_email(db: Database, email: str) -> Optional[UserInDB]:
    users_collection = db[USERS_COLLECTION]
    user = users_collection.find_one({"email": email})
    if user:
        return UserInDB(**user)
    return None

def create_user(db: Database, user_data: UserCreate) -> User:
    users_collection = db[USERS_COLLECTION]
    hashed_password = get_password_hash(user_data.password)
    user_in_db_data = user_data.model_dump(exclude={"password"})
    user_in_db_data["hashed_password"] = hashed_password
    
    inserted_user = users_collection.insert_one(user_in_db_data)
    created_user_doc = users_collection.find_one({"_id": inserted_user.inserted_id})
    return User(**created_user_doc) # Return User model (without hashed_password)