from fastapi import WebSocket
from typing import Dict, List, Tuple

class SessionManager:
    def __init__(self):
        # Stores active connections: {session_id: [WebSocket, WebSocket, ...]}
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Stores current code for each session: {session_id: "code content"}
        self.session_code: Dict[str, str] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        """Adds a user's WebSocket connection to a session."""
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
            self.session_code[session_id] = "" # Initialize with empty code for new session
        self.active_connections[session_id].append(websocket)
        # Send current session code to the newly connected user
        initial_code = self.session_code.get(session_id, "")
        await websocket.send_text(initial_code)

    def disconnect(self, session_id: str, websocket: WebSocket):
        """Removes a user's WebSocket connection from a session."""
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]: # If last user leaves
                del self.active_connections[session_id]
                if session_id in self.session_code:
                    del self.session_code[session_id] # Clean up session code

    async def broadcast_code_update(self, session_id: str, code: str, sender: WebSocket):
        """Broadcasts code updates to all users in the session except the sender."""
        self.session_code[session_id] = code # Update server's copy of the code
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                if connection != sender:
                    await connection.send_text(code)

    def get_session_code(self, session_id: str) -> str:
        """Gets the current code for a session."""
        return self.session_code.get(session_id, "")

# Global instance of the session manager
manager = SessionManager()