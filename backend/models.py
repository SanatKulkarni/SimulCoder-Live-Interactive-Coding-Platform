from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class QuestionBase(BaseModel):
    title: str
    description: str
    difficulty: str  # e.g., "Easy", "Medium", "Hard"
    tags: List[str] = []
    constraints: Optional[str] = None
    starter_code: Optional[str] = None # Optional starter code snippet
    examples: Optional[List[dict]] = None # e.g., [{"input": "...", "output": "...", "explanation": "..."}]

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True # Allows using "_id" from MongoDB and "id" in Pydantic
        from_attributes = True # For orm_mode compatibility if needed later


# New User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDBBase(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        from_attributes = True

class User(UserInDBBase): # Model for returning user info (without password)
    pass

class UserInDB(UserInDBBase): # Model for user stored in DB (with hashed_password)
    hashed_password: str

# Token models are now in auth.py to avoid circular import issues if auth needs them
# We can keep them here if preferred and manage imports carefully.
# For now, assuming Token and TokenData are defined in auth.py