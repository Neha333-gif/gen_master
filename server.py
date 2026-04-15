from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
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
import re

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

# Securely load credentials from Environment Variables (set these in Render dashboard)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "666176576272-trcf3h2ukfvt4klg25n8qiiolv9m9chc.apps.googleusercontent.com")
# Accept multiple client IDs during migration/local testing.
# Comma-separated in env var GOOGLE_CLIENT_IDS, falls back to current + legacy IDs.
GOOGLE_CLIENT_IDS = [
    cid.strip()
    for cid in os.environ.get(
        "GOOGLE_CLIENT_IDS",
        f"{GOOGLE_CLIENT_ID},666176576272-asl6e1jn8p3nvs2risittbac5sd655lp.apps.googleusercontent.com",
    ).split(",")
    if cid.strip()
]
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "PLACEHOLDER_SECRET")
WEB_APP_REDIRECT_URL = os.environ.get("WEB_APP_REDIRECT_URL", "http://127.0.0.1:8999/index.html")

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
            clock_skew_in_seconds=300
        )
        aud = idinfo.get("aud")
        if aud not in GOOGLE_CLIENT_IDS:
            raise ValueError(
                f"Token has wrong audience {aud}, expected one of {GOOGLE_CLIENT_IDS}"
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


def extract_requirements_from_code(code: str):
    """
    Supports either:
    - # requirements: package1, package2
    - # pip: package1 package2
    """
    requirements = []
    pattern = re.compile(r"^\s*#\s*(requirements|pip)\s*:\s*(.+)$", re.IGNORECASE)
    install_pattern = re.compile(r"^\s*#\s*pip(?:3)?\s+install\s+(.+)$", re.IGNORECASE)
    for line in code.splitlines():
        match = pattern.match(line)
        if match:
            raw = match.group(2).strip()
        else:
            install_match = install_pattern.match(line)
            if not install_match:
                continue
            raw = install_match.group(1).strip()
        if "," in raw:
            parts = [p.strip() for p in raw.split(",")]
        else:
            parts = [p.strip() for p in raw.split()]
        for part in parts:
            if part:
                requirements.append(part)
    # Keep order, remove duplicates
    deduped = []
    seen = set()
    for req in requirements:
        if req not in seen:
            deduped.append(req)
            seen.add(req)
    return deduped

@app.post("/execute")
async def execute_code(req: CodeExecutionRequest, user_info=Depends(verify_token)):
    code = req.code
    requirements = extract_requirements_from_code(code)
    
    # Write user code to a temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
        # If the user tries to use Pyodide-specific async code, try to patch it lightly or let it throw naturally
        # For a true Python environment, they should use standard Python sync/async. We just write their raw code.
        temp_file.write(code)
        temp_file_path = temp_file.name

    try:
        if requirements:
            install_result = subprocess.run(
                ["python", "-m", "pip", "install", *requirements],
                capture_output=True,
                text=True,
                timeout=300
            )
            if install_result.returncode != 0:
                return {
                    "output": "",
                    "problems": (
                        "[Dependency Install Error]\n"
                        f"{install_result.stderr or install_result.stdout}"
                    ),
                }

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

@app.get("/api/auth-trigger", response_class=HTMLResponse)
async def auth_trigger(request: Request):
    # Log the User-Agent to help troubleshoot if Google still blocks it
    user_agent = request.headers.get("user-agent")
    print(f"--- LOGIN TRIGGER ATTEMPT ---")
    print(f"USER-AGENT: {user_agent}")
    
    redirect_uri = str(request.url_for("google_callback"))
    scope = "email profile openid"
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope={scope}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    
    # Return a "Stealth Landing" page with a manual button. 
    # This prevents Google from blocking it as an "Automated Redirect".
    return HTMLResponse(content=f"""
    <html>
    <head>
        <title>Google Authentication</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f7f9fc; }}
            .card {{ background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; max-width: 320px; }}
            h2 {{ color: #1a1f36; margin: 0 0 1rem; font-size: 1.5rem; }}
            p {{ color: #4f566b; margin-bottom: 2rem; line-height: 1.5; }}
            .btn {{ 
                display: block; background: #4285F4; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; 
                transition: background 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .btn:hover {{ background: #357ae8; }}
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Secure Login</h2>
            <p>Click the button below to sign in to GenAI Masterclass with your Google account.</p>
            <a href="{auth_url}" class="btn">Continue to Google</a>
        </div>
    </body>
    </html>
    """)

@app.get("/api/google-login", response_class=HTMLResponse)
async def google_callback(request: Request, code: str = None):
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code missing from Google")

    # Swapping the Code for an ID Token securely on the server
    import requests
    token_url = "https://oauth2.googleapis.com/token"
    redirect_uri = str(request.url_for("google_callback"))
    
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }
    
    response = requests.post(token_url, data=data)
    token_data = response.json()
    
    if "id_token" not in token_data:
        print(f"!!! GOOGLE CALLBACK FAILED: {token_data}")
        return f"<html><body><h2>Authentication failed</h2><p>{token_data.get('error_description', 'Unknown error')}</p></body></html>"

    token = token_data["id_token"]

    return HTMLResponse(content=f"""
    <html>
    <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="text-align: center;">
            <h2>Signing you in...</h2>
            <p>Verification successful! Returning you to your Dashboard.</p>
        </div>
        <script>
            // If this runs inside a popup (Expo web flow), notify opener and close.
            if (window.opener) {{
                window.opener.postMessage({{ type: "GOOGLE_LOGIN_SUCCESS", token: "{token}" }}, "*");
                window.close();
            }} else {{
                // Fallback for full-page browser flow.
                window.location.href = "{WEB_APP_REDIRECT_URL}#id_token=" + "{token}";
            }}
        </script>
    </body>
    </html>
    """)


if __name__ == "__main__":
    import uvicorn
    # Start server on dynamic port for cloud hosting (Render/Heroku)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
