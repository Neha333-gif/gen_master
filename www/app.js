// API base — auto-detects environment
// In browser: uses localhost. On Android/iOS device: uses your computer's local network IP.
const API_BASE = 'https://genai-backend-m0e0.onrender.com';
const GOOGLE_REDIRECT_URI = 'https://genai-backend-m0e0.onrender.com/api/google-login';
const GOOGLE_CLIENT_ID = '666176576272-asl6e1jn8p3nvs2risittbac5sd655lp.apps.googleusercontent.com';

// Trigger Guest Sign-In
window.triggerGuestSignIn = async function() {
    console.log("DEBUG: Guest Sign-In triggered. API_BASE is: ", API_BASE);
    try {
        const resp = await fetch(API_BASE + '/api/guest-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("DEBUG: Response status: ", resp.status);
        const data = await resp.json();
        
        if (!resp.ok) {
            throw new Error(data.detail || "Guest Login failed");
        }
        
        const token = data.access_token;
        localStorage.setItem('auth_token', token);
        if (window.updateUserProfileUI) window.updateUserProfileUI(token);
        window.navigateTo('screen-dashboard');
    } catch (err) {
        alert("Guest login error: " + err.message);
    }
};

// Trigger Google Sign-In manually
window.triggerGoogleSignIn = function() {
    console.log("DEBUG: Google Sign-In button clicked");
    
    // Fallback: If the GSI library works, use it. Otherwise, manual redirect.
    if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt();
    } else {
        // Manual Redirect Flow (Ideal for cloud hosting)
        const redirect_uri = GOOGLE_REDIRECT_URI;
        const scope = "email profile openid";
        const response_type = "token"; // We'll use implicit flow for simplicity in mobile
        
        // Step 1: Open our Render "Trigger" URL instead of Google directly
        // This makes Google see the request coming from Render (Trusted Domain)
        const triggerUrl = `${API_BASE}/api/auth-trigger`;
        
        const { Browser } = typeof Capacitor !== 'undefined' ? Capacitor.Plugins : { Browser: null };
        if (Browser) {
            Browser.open({ url: triggerUrl });
        } else {
            // Fallback for browser testing
            window.location.href = triggerUrl;
        }
    }
};

// CSS for the custom button
const authStyle = document.createElement('style');
authStyle.innerHTML = `
    .google-auth-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        max-width: 300px;
        height: 48px;
        margin: 0 auto;
        background: #FFFFFF;
        color: #1F1F1F;
        border: 1px solid #747775;
        border-radius: 99px;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .google-auth-btn:active {
        background: #F2F2F2;
        transform: scale(0.98);
    }
`;
document.head.appendChild(authStyle);

// Hide/show bottom nav based on which screen is active
const _origNavigateTo = window.navigateTo;
window.navigateTo = function(targetScreenId) {
    _origNavigateTo(targetScreenId);
    const bottomNav = document.querySelector('nav.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = targetScreenId === 'screen-auth' ? 'none' : 'flex';
    }
};


let backendReadyPromise = null;
async function initBackendServer() {
    const terminal = document.getElementById('terminal-output');
    if(terminal) terminal.innerText = "$ Connecting to local AI Execution Server...\n";
    
    try {
        // Ping the server to ensure it's up
        const response = await fetch(API_BASE + '/docs');
        if (response.ok) {
            if(terminal) terminal.innerText = "$ Connected to Python FastAPI Server ✓\n$ Full Machine Learning environment loaded.\n$ Ready for execution.";
            return true;
        } else {
            throw new Error('Server not responding');
        }
    } catch(err) {
        if(terminal) terminal.innerText = "$ Connection Error: Make sure your server.py backend is running on localhost:8000!";
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Helper to decode Google JWT
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    // Update UI with Google Profile Data
    window.updateUserProfileUI = function(token) {
        const payload = parseJwt(token);
        if (!payload) return;

        const nameEl = document.getElementById('dashboard-name');
        const emailEl = document.getElementById('dashboard-email');
        const avatarImg = document.getElementById('dashboard-avatar-img');
        const avatarPlaceholder = document.getElementById('dashboard-avatar-placeholder');

        if (nameEl) nameEl.innerText = payload.name || 'AI Specialist';
        if (emailEl) emailEl.innerText = payload.email || '';
        
        if (payload.picture && avatarImg) {
            avatarImg.src = payload.picture;
            avatarImg.style.display = 'block';
            if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
        } else {
            // Check if it's a guest user
            if (payload.email === 'guest@genai.local') {
                if (avatarImg) avatarImg.style.display = 'none';
                if (avatarPlaceholder) {
                    avatarPlaceholder.style.display = 'inline';
                    avatarPlaceholder.innerText = '👤';
                }
            } else {
                if (avatarImg) avatarImg.style.display = 'none';
                if (avatarPlaceholder) avatarPlaceholder.style.display = 'inline';
            }
        }
    };

    // Global Logout Handler — instant, no confirm dialog, no page reload
    window.handleLogout = function() {
        localStorage.removeItem('auth_token');

        // Reset dashboard UI
        const nameEl = document.getElementById('dashboard-name');
        const emailEl = document.getElementById('dashboard-email');
        const avatarImg = document.getElementById('dashboard-avatar-img');
        const avatarPlaceholder = document.getElementById('dashboard-avatar-placeholder');
        if (nameEl) nameEl.innerText = 'GenAI Masterclass';
        if (emailEl) emailEl.innerText = '';
        if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
        if (avatarPlaceholder) avatarPlaceholder.style.display = 'inline';

        // No more auth form elements to reset

        // Navigate instantly back to login screen
        window.navigateTo('screen-auth');
    };

    // Check for existing session
    const token = localStorage.getItem('auth_token');
    if (!token || token === 'mock_debug_token_bypassed') {
        localStorage.removeItem('auth_token');
        navigateTo('screen-auth');
    } else {
        updateUserProfileUI(token);
        navigateTo('screen-dashboard');
    }

    const theoryMenuList = document.getElementById('theory-menu-list');
    const theoryContainer = document.getElementById('theory-dynamic-container');

    // Populate Menu
    if (theoryMenuList) {
        let menuHTML = '';
        theoryModules.forEach((mod) => {
            menuHTML += `
                <div class="card theory-menu-card" onclick="openTheoryModule(${mod.id})">
                    <div class="module-number">${mod.id}</div>
                    <div class="module-info">
                        <h3 class="white-text">${mod.title}</h3>
                        <p class="tag-pill" style="margin-top: 4px;">${mod.tag}</p>
                    </div>
                    <div class="chevron">▸</div>
                </div>
            `;
        });
        theoryMenuList.innerHTML = menuHTML;
    }

    // Auto-boot python engine organically if practice screen is active
    if (document.getElementById('screen-editor')?.classList.contains('active') && !backendReadyPromise) {
        backendReadyPromise = initBackendServer();
    }

    window.openTheoryModule = function(moduleId) {
        const mod = theoryModules.find(m => m.id === moduleId);
        if(!mod) return;

        // Render Theory HTML
        let htmlSnippet = `
            <h1 class="title-manrope white-text margin-bot">${mod.id}. ${mod.title}</h1>
            <p class="lesson-body margin-bot" style="font-size: 1.1rem; line-height: 1.6; color: var(--grey-text);">${mod.overview}</p>
            
            <div class="card theory-card component-margin">
                <div class="tag-pill">${mod.tag}</div>
                <h3 class="flex-align"><span class="icon">💡</span> Concept Explanation</h3>
                <p class="theory-text margin-bot" style="font-size: 1.05rem; line-height: 1.7;">${mod.explanation}</p>
                <div class="code-gimmick">
                    <pre><code class="language-python">${mod.code}</code></pre>
                </div>
            </div>
        `;

        // Render all full sections if present as Accordions
        if (mod.sections && mod.sections.length > 0) {
            mod.sections.forEach(section => {
                htmlSnippet += `
                <div class="accordion card component-margin" onclick="this.classList.toggle('open')">
                    <div class="acc-header">
                        <span class="flex-align"><span class="icon" style="margin-right: 8px;">📖</span> ${section.subtitle}</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="acc-content">
                        <p class="theory-text margin-bot" style="font-size: 1.05rem; line-height: 1.8;">${section.body}</p>
                        ${section.code ? `<div class="code-gimmick"><pre><code class="language-python">${section.code}</code></pre></div>` : ''}
                    </div>
                </div>`;
            });
        }

        htmlSnippet += `
            <div class="card theory-card component-margin" style="border-left: 4px solid var(--accent-purple);">
                <h3 class="flex-align"><span class="icon">✨</span> Visualization</h3>
                <p class="theory-text" style="font-style: italic;">${mod.visual}</p>
            </div>

            <div class="accordion card component-margin" onclick="this.classList.toggle('open')">
                <div class="acc-header">
                    <span class="icon">⚡</span> <span>Summary Breakdown</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="acc-content">
                    <p class="theory-body">${mod.recap}</p>
                </div>
            </div>

            <div class="card sandbox-card component-margin" style="background: var(--surface-bright); text-align: center;">
                <h3 class="white-text margin-bot">🏋️ Practice Challenge</h3>
                <p class="theory-text margin-bot" style="font-size: 1.1rem; color: #fff;">${mod.hook}</p>
                <button class="primary-btn" onclick="navigateTo('screen-editor')">Launch Code Sandbox ▸</button>
            </div>

            <div class="nav-actions flex-between margin-bot">
                <button class="text-btn grey" onclick="navigateTo('screen-theory-menu')">← Back to Curriculum</button>
            </div>
            <div style="height: 100px;"></div>
        `;

        theoryContainer.innerHTML = htmlSnippet;
        navigateTo('screen-theory');
        
        // Magically apply rich python syntax highlighting if library loaded
        if (window.Prism) {
            Prism.highlightAllUnder(theoryContainer);
        }
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.innerHTML = `
        .screen.active .main-content { animation: slideUpFade 0.3s ease-out forwards; }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Menu Specific */
        .theory-menu-card { display: flex; align-items: center; gap: 1rem; cursor: pointer; padding: 1rem; transition: 0.2s; border-bottom: 1px solid var(--surface-high); }
        .theory-menu-card:active { transform: scale(0.98); background: var(--surface-bright); }
        .module-number { font-family: var(--font-mono); font-size: 1.5rem; color: var(--tertiary); font-weight: bold; }
        .module-info { flex: 1; }
        .chevron { color: var(--grey-text); font-size: 1.2rem; }
    `;
    document.head.appendChild(style);

    window.handleQuiz = function(element, isCorrect) {
        // Reset options
        document.querySelectorAll('#quiz-options .option').forEach(opt => {
            opt.classList.remove('selected');
            opt.classList.remove('wrong-selection');
            opt.querySelector('.radio').classList.remove('active');
            opt.querySelector('.radio').innerText = '';
        });

        element.classList.add('selected');
        const radio = element.querySelector('.radio');
        radio.classList.add('active');

        if (isCorrect) {
            radio.innerText = '✔️';
            document.getElementById('quiz-accuracy').innerText = '100%';
        } else {
            element.classList.add('wrong-selection');
            element.style.borderColor = '#ff4d4d';
            radio.innerText = '❌';
            radio.style.background = '#ff4d4d';
            document.getElementById('quiz-accuracy').innerText = '0%';
        }
    };

    // Execution Logic
    const runBtn = document.getElementById('run-code-btn');
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            const code = document.getElementById('python-code-editor').value;
            const terminal = document.getElementById('terminal-output');
            
            if(!backendReadyPromise) {
                backendReadyPromise = initBackendServer();
            }
            
            terminal.innerText = "$ Executing sequence on Dedicated Backend...\n";
            try {
                let backendConnected = await backendReadyPromise;
                if (!backendConnected) throw new Error("Backend offline");
                
                const token = localStorage.getItem('auth_token') || "";
                console.log("DEBUG: Sending token of length", token.length);
                if (!token) {
                    console.error("CRITICAL: No auth_token found in localStorage!");
                }
                
                // Make API call to our local FastAPI server
                const response = await fetch(API_BASE + '/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ code: code })
                });
                
                if (response.status === 401) {
                    const errData = await response.json();
                    const detail = errData.detail || "Authentication required.";
                    terminal.innerText += `\n[Auth Error] ${detail}\n`;
                    terminal.innerText += "\nTIP: If you're seeing 'Token used too early', please wait 5 seconds and click Run again.";
                    throw new Error(`401 Unauthorized: ${detail}`);
                }
                
                const result = await response.json();
                
                if (result.output) {
                    terminal.innerText += "\n" + result.output;
                }
                terminal.innerText += "\n[Process Completed]";

                const probs = document.getElementById('problems-output');
                if (result.problems && result.problems.trim().length > 0) {
                    probs.innerText = result.problems;
                    document.getElementById('tab-problems').style.color = '#ffab70'; 
                } else {
                    probs.innerText = "No problems detected.";
                    document.getElementById('tab-problems').style.color = ''; 
                }
                
                // Show completion banner natively!
                document.querySelector('.success-notification').style.display = 'flex';
                setTimeout(() => { document.querySelector('.success-notification').style.display = 'none'; }, 3000);
            } catch (err) {
                terminal.innerText += "\n[Server Error]\n" + err.toString();
            }
        });
    }

    const clearBtn = document.querySelector('.debug-btn');
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('terminal-output').innerText = "$ Terminal cleared.";
            document.getElementById('problems-output').innerText = "No problems detected.";
        });
    }

    const clearCodeBtn = document.getElementById('clear-code-btn');
    if(clearCodeBtn) {
        clearCodeBtn.addEventListener('click', () => {
            const editor = document.getElementById('python-code-editor');
            if(editor) {
                editor.value = "";
                // Show a quick visual feedback
                editor.style.opacity = '0.5';
                setTimeout(() => editor.style.opacity = '1', 100);
            }
        });
    }

    // Hide success pill by default
    document.querySelector('.success-notification').style.display = 'none';

    // [NEW] Check for Google OAuth Token in the URL hash (Redirect Flow)
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('id_token='))) {
        processToken(hash);
    }

    function processToken(hashStr) {
        console.log("OAuth token detected, processing...");
        const params = new URLSearchParams(hashStr.substring(hashStr.indexOf('#') + 1));
        const token = params.get('id_token') || params.get('access_token');
        
        if (token) {
            localStorage.setItem('auth_token', token);
            window.updateUserProfileUI(token);
            window.navigateTo('screen-dashboard');
            // Clean up
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // [NEW] Handle App URL Opens (Special Scheme: genai-app://)
    try {
        const { App } = typeof Capacitor !== 'undefined' ? Capacitor.Plugins : { App: null };
        if (App) {
            App.addListener('appUrlOpen', (data) => {
                console.log('App opened with URL:', data.url);
                if (data.url.includes('genai-app://')) {
                    const hashPart = data.url.split('#')[1];
                    if (hashPart) {
                        processToken('#' + hashPart);
                    }
                }
            });
        }
    } catch (e) {
        console.error("Capacitor App plugin listener error:", e);
    }
});

window.switchTerminalTab = function(tabName) {
    document.getElementById('tab-terminal').classList.remove('active');
    document.getElementById('tab-problems').classList.remove('active');
    
    document.getElementById('terminal-output').style.display = 'none';
    document.getElementById('problems-output').style.display = 'none';
    
    if (tabName === 'terminal') {
        document.getElementById('tab-terminal').classList.add('active');
        document.getElementById('terminal-output').style.display = 'block';
    } else {
        document.getElementById('tab-problems').classList.add('active');
        document.getElementById('problems-output').style.display = 'block';
        document.getElementById('tab-problems').style.color = ''; // clear notification color once viewed
    }
};
