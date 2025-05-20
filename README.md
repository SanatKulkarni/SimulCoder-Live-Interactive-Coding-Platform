# SimulCoder - Real-time Collaborative Coding Platform 

DEMO VIDEO: https://youtu.be/q1MCvhVT-KQ?si=wv25Co498Lhej-Z6


SimulCoder is a web-based platform designed for real-time collaborative coding. It's perfect for remote pair programming, technical interviews, educational purposes, and team-based coding assessments. Experience a seamless coding environment where multiple users can write, edit, and run code together, live!

**Collaborate, Code, Conquer. Real-time pair programming, simplified.**
![Screenshot 2025-05-20 174517](https://github.com/user-attachments/assets/8870363c-5037-44c4-a4ee-9303d82a5c47)

---

## Features

*   **Real-time Collaborative Editor:** Multiple users can type and see changes instantly in a shared Monaco Editor (VS Code-like experience).
*   **User Authentication:** Secure registration and login system using JWT.
*   **Session Management:**
    *   Create new coding sessions (simple or with a pre-defined problem).
    *   Join existing sessions using a unique ID or link.
    *   (Coming Soon) View your recent sessions.
*   **Integrated Code Execution:** Run code (Python currently supported) directly within the platform and view output.
*   **Problem Setting:**
    *   Interviewers/Educators can create and assign coding problems with titles, descriptions, difficulty, tags, constraints, starter code, and example test cases.
    *   Problems are displayed alongside the code editor for easy reference.
*   **Responsive UI:** Built with Tailwind CSS for a clean and modern look across devices.

---

## 🛠️ Tech Stack

### Backend

*   **Framework:** FastAPI (Python)
*   **Database:** MongoDB
*   **Authentication:** JWT (JSON Web Tokens)
    *   `python-jose` for JWT handling
    *   `passlib` for password hashing
*   **Real-time Communication:** FastAPI WebSocket support
*   **Data Validation:** Pydantic
*   **Environment Management:** `python-dotenv`

### Frontend

*   **Framework/Library:** React (with Vite for build tooling)
*   **UI Styling:** Tailwind CSS
*   **Code Editor:** Monaco Editor
*   **State Management:** React Context API
*   **HTTP Client:** Axios
*   **Real-time Communication:** Native WebSocket API

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v16 or higher recommended) & npm/yarn
*   Python (v3.8 or higher recommended) & pip
*   MongoDB (local instance or a cloud-based service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/simulcoder.git
    cd simulcoder
    ```

2.  **Backend Setup:**
    ```bash
    cd backend

    # Create a virtual environment (recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt

    # Create a .env file in the 'backend' directory
    # Copy .env.example to .env if available, or create .env and add:
    MONGO_URI="your_mongodb_connection_string"
    SECRET_KEY="your_super_secret_jwt_key"
    ALGORITHM="HS256" # Or your chosen algorithm
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```
    *Replace placeholder values in `.env` with your actual configurations.*

3.  **Frontend Setup:**
    ```bash
    cd ../frontend

    # Install dependencies
    npm install
    # or
    yarn install

    # Create a .env file in the 'frontend' directory (if needed for API base URL, etc.)
    # Example:
    # VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```

### Running the Application

1.  **Start the Backend Server:**
    Navigate to the `backend` directory and run:
    ```bash
    # Make sure your virtual environment is activated
    uvicorn main:app --reload
    ```
    The backend server will typically start on `http://localhost:8000`.

2.  **Start the Frontend Development Server:**
    Navigate to the `frontend` directory and run:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application will typically start on `http://localhost:5173` (or another port specified by Vite).

3.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

---

## Usage

1.  **Register/Login:** Create an account or log in if you already have one.
2.  **Dashboard:**
    *   **Start a New Session:**
        *   **Create Simple Session:** Instantly starts a blank coding session.
        *   **Add Question:** Define a problem (title, description, examples, etc.) and then create a session with this problem.
    *   **Join an Existing Session:** Enter the Session ID or link provided by another user.
3.  **Coding Session:**
    *   If a problem is assigned, it will be displayed on the left panel.
    *   The central panel is the Monaco code editor. Code collaboratively in real-time.
    *   Select the language (Python currently).
    *   Provide input if required by the code.
    *   Click "Run Code" to execute and see the output.
4.  **Invite Others:** Share the unique session link (displayed or via a "Copy Invite Link" button) to invite collaborators.


---

## Acknowledgements

*   FastAPI
*   React
*   Monaco Editor
*   Tailwind CSS
*   MongoDB
*   Vite
