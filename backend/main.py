from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect # Added WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordRequestForm # For login form
from pymongo.database import Database
from typing import List
from datetime import timedelta # Add this import

from database import db_handler, get_database_instance
from models import QuestionCreate, Question, UserCreate, User # Updated imports
import crud
import auth # Import the auth module
from fastapi.middleware.cors import CORSMiddleware 
from session_manager import manager # Import the session manager

app = FastAPI(title="SimulCoder API")

# CORS Configuration
origins = [
    "http://localhost:5173", # Your React frontend URL
    "http://127.0.0.1:5173",
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

@app.on_event("startup")
async def startup_db_client():
    db_handler.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    db_handler.close()

# --- Authentication Routes ---
@app.post("/auth/register", response_model=User, status_code=201)
async def register_user(
    user_data: UserCreate,
    db: Database = Depends(get_database_instance)
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    db_user = crud.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    created_user = crud.create_user(db=db, user_data=user_data)
    return created_user

@app.post("/auth/token", response_model=auth.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Database = Depends(get_database_instance)
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    user = crud.get_user_by_email(db, email=form_data.username) # OAuth2 form uses 'username' for email
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(auth.get_current_active_user)):
    return current_user

# --- Question Routes ---
@app.post("/questions/", response_model=Question, status_code=201)
async def add_new_question(
    question_data: QuestionCreate,
    db: Database = Depends(get_database_instance),
    current_user: User = Depends(auth.get_current_active_user) # Protected route
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    try:
        created_question = crud.create_question(db=db, question_data=question_data)
        return created_question
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/questions/", response_model=List[Question])
async def read_questions(
    skip: int = 0,
    limit: int = 10,
    db: Database = Depends(get_database_instance)
    # This route can remain public or be protected, depending on requirements
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    questions = crud.get_all_questions(db=db, skip=skip, limit=limit)
    return questions

@app.get("/questions/{question_id}", response_model=Question)
async def read_question(
    question_id: str,
    db: Database = Depends(get_database_instance)
    # This route can remain public or be protected
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    question = crud.get_question_by_id(db=db, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

# --- WebSocket Endpoint for Collaborative Sessions ---
@app.websocket("/ws/editor/{session_id}")
async def websocket_editor_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if isinstance(data, dict) and data.get("type") == "question_update":
                manager.session_questions[session_id] = data.get("question")
                # Broadcast question update to all users in session
                for conn in manager.active_connections[session_id]:
                    if conn != websocket:
                        await conn.send_json({"type": "question_update", "question": data.get("question")})
            else:
                # Handle code updates
                code = data if isinstance(data, str) else data.get("code", "")
                await manager.broadcast_code_update(session_id, code, websocket)
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
    except Exception as e:
        print(f"Error in WebSocket session {session_id}: {e}")
        manager.disconnect(session_id, websocket)


@app.get("/")
async def root():
    return {"message": "Welcome to SimulCoder API"}