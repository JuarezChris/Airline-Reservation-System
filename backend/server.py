from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
# Allow only localhost:5173 and enable credentials
CORS(app, resources={r"/data": {"origins": "http://localhost:5173"}}, supports_credentials=True)
# CORS(app)  # Allows any origin
# print(f"Allowed Origins: {ALLOWED_ORIGINS}")  # Debugging CORS origins

# CORS(app, resources={r"/data": {"origins": "http://localhost:5173"}})
# # Get allowed origin from environment variables (default: allow localhost)
# ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# # Configure CORS: Allow only specified origins and HTTP methods
# CORS(app, resources={r"/data": {"origins": ALLOWED_ORIGINS, "methods": ["GET"]}})

# Load CSV into DataFrame
def load_csv():
    df = pd.read_csv('flights.csv')
    df = df.dropna().head(20)  # Drops all rows with NaN values
    return df

@app.route('/data', methods=['GET'])
def get_data():
    df = load_csv()
    data = df.to_dict(orient="records")
    # print("Flask is returning:", data)  # Debugging
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

