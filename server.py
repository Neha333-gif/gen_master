from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import sqlite3
import hashlib
import json
import base64

def init_db():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL)''')
    conn.commit()
    conn.close()

init_db()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_mock_jwt(user_id: int, name: str, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "name": name,
        "email": email,
        "iss": "local_auth"
    }
    encoded_payload = base64.b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    return f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{encoded_payload}.mock_signature"

app = FastAPI()

# Allow connections from the frontend (port 8999 or localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "GenAI Masterclass Backend is Live"}

@app.middleware("http")
async def add_logging(request, call_next):
    print(f">>> RECEIVED REQUEST: {request.method} {request.url}")
    response = await call_next(request)
    print(f"<<< RESPONDED: {response.status_code}")
    return response

security = HTTPBearer()

# IMPORTANT: Replace this with your actual Google OAuth Client ID!
GOOGLE_CLIENT_ID = "666176576272-asl6e1jn8p3nvs2risittbac5sd655lp.apps.googleusercontent.com" 

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if not token or token == "undefined" or token == "null":
        print("!!! SECURITY ALERT: Token is empty or null")
        raise HTTPException(status_code=401, detail="Authentication token missing. Please sign in.")
    
    if token.endswith(".mock_signature"):
        try:
            # Pad the string correctly for base64
            padded = token.split(".")[1]
            padded += "=" * ((4 - len(padded) % 4) % 4)
            payload_str = base64.b64decode(padded).decode()
            payload = json.loads(payload_str)
            if payload.get("iss") == "local_auth":
                return payload
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid local token")

    try:
        # Strictly verify the token is from Google and meant for our Client ID
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=300
        )
        return idinfo
    except ValueError as e:
        print(f"!!! JWT VERIFICATION FAILED: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Google Authentication Token: {e}")

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/register")
async def register_user(req: RegisterRequest):
    try:
        conn = sqlite3.connect("users.db")
        c = conn.cursor()
        c.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", 
                  (req.name, req.email, hash_password(req.password)))
        conn.commit()
        user_id = c.lastrowid
        conn.close()
        access_token = create_mock_jwt(user_id, req.name, req.email)
        return {"access_token": access_token}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/login")
async def login_user(req: LoginRequest):
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute("SELECT id, name, email, password_hash FROM users WHERE email = ?", (req.email,))
    user = c.fetchone()
    conn.close()
    
    if user and user[3] == hash_password(req.password):
        access_token = create_mock_jwt(user[0], user[1], user[2])
        return {"access_token": access_token}
    
    raise HTTPException(status_code=401, detail="Invalid email or password")

@app.post("/api/guest-login")
async def guest_login():
    # Return a mock JWT for a guest user
    access_token = create_mock_jwt(0, "Guest Specialist", "guest@genai.local")
    return {"access_token": access_token}

class CodeExecutionRequest(BaseModel):
    code: str

@app.post("/execute")
async def execute_code(req: CodeExecutionRequest, user_info=Depends(verify_token)):
    code = req.code
    
    # Write user code to a temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
        # If the user tries to use Pyodide-specific async code, try to patch it lightly or let it throw naturally
        # For a true Python environment, they should use standard Python sync/async. We just write their raw code.
        temp_file.write(code)
        temp_file_path = temp_file.name

    try:
        # Run the temporary Python file
        result = subprocess.run(
            ["python", temp_file_path],
            capture_output=True,
            text=True,
            timeout=300 # 300 second timeout to allow large HuggingFace model downloads
        )
        return {"output": result.stdout, "problems": result.stderr}
    except subprocess.TimeoutExpired:
        return {"output": "", "problems": "[Execution Timeout] Code took longer than 300 seconds to run."}
    except Exception as e:
        return {"output": "", "problems": f"[Exception Caught]\n{str(e)}"}
    finally:
        # Clean up the temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    # Start server on dynamic port for cloud hosting (Render/Heroku)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
