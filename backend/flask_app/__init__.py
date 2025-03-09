from flask import Flask
from flask_session import Session  # ✅ Import Flask-Session
app = Flask(__name__)
# app.secret_key = "shhhhhh"

# ✅ Secret Key for Flask Session Security
app.config['SECRET_KEY'] = 'shhhhhh'

# app.config['SECRET_KEY'] = 'your_secret_key_here'
# app.config['SESSION_TYPE'] = 'filesystem'  
# app.config['SESSION_PERMANENT'] = False  
# app.config['SESSION_USE_SIGNER'] = True  
# app.config['SESSION_COOKIE_SECURE'] = False  # Change to True in production (for HTTPS)
# app.config['SESSION_COOKIE_HTTPONLY'] = True  
# app.config['SESSION_COOKIE_SAMESITE'] = "None"  # ✅ Allow cross-origin cookies


# ✅ Configure Flask Session Storage
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions in the filesystem
app.config['SESSION_PERMANENT'] = False  # Session expires when browser closes
app.config['SESSION_USE_SIGNER'] = True  # Secure session cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Change to True in production (for HTTPS)
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript from accessing session
app.config['SESSION_COOKIE_SAMESITE'] = "None"  # Allows cross-origin requests

# ✅ Initialize Flask Session
Session(app)