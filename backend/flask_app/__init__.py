from flask import Flask
import stripe
from flask_mail import Mail
from flask_session import Session  # ✅ Import Flask-Session
app = Flask(__name__)
# app.secret_key = "shhhhhh"

# ✅ Secret Key for Flask Session Security
app.config['SECRET_KEY'] = 'shhhhhh'

stripe.api_key = "sk_test_51Qz5NfFZX2j25Z0X2qqlwgm23BAvLBDviFQh6D1og4hWuP46grFiQRDLjUQKggkfDzQNSCoZvjSw3fuPNl5vyV8100ioIfUiKY"  # Replace with your Stripe Test Secret Key

# ✅ Configure Flask Session Storage
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions in the filesystem
app.config['SESSION_PERMANENT'] = False  # Session expires when browser closes
app.config['SESSION_USE_SIGNER'] = True  # Secure session cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Change to True in production (for HTTPS)
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript from accessing session
app.config['SESSION_COOKIE_SAMESITE'] = "None"  # Allows cross-origin requests

# ✅ Email Configuration (Using Gmail SMTP)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'juarez.christopher07@gmail.com'  # 🔹 Replace with your email
app.config['MAIL_PASSWORD'] = 'zhck zlgq zfui ugro'  # 🔹 Replace with your app password
app.config['MAIL_DEFAULT_SENDER'] = 'juarez.christopher07@gmail.com'


# ✅ Initialize Flask Session
Session(app)
mail = Mail(app)