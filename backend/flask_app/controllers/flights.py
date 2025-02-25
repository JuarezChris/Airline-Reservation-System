from flask import render_template, redirect, request
from flask_app.models.flight_ticket_model import FlightTicket
from flask_app import app
from flask_app.models.user_model import User

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

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
    df = pd.read_csv('airline_tickets.csv')
    df = df.dropna().head(5)  # Drops all rows with NaN values
    return df

@app.route('/data', methods=['GET'])
def get_data():
    df = load_csv()
    data = df.to_dict(orient="records")
    # print("Flask is returning:", data)  # Debugging
    return jsonify(data)

@app.route('/book/flight', methods=['OPTIONS'])
def handle_options():
    """Handles CORS preflight requests"""
    response = jsonify({"message": "CORS preflight passed"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 200

@app.route('/book/flight', methods=['POST'])
def book_flight():
    try:
        data = request.get_json()
        print("made it")
        data['flight']['user_id'] = 3
        print("Received Data:", data)  # Debugging

        # Ensure data is received properly
        if not data:
            return jsonify({"error": "No data received"}), 400

        # If booking logic is needed, add it here
        print("Processing booking...")
        # Save booking to the database
        booking_response = FlightTicket.buy_ticket(data)  # Save booking
        print(booking_response)

        response = jsonify({
            "message": "Flight booked successfully",
            "data_received": data,
            "res": booking_response
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201  # ✅ Return JSON + CORS headers

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# @app.route('/book/flight', methods=['POST'])
# def book_flight():
#     try:
#         # Get JSON data from Axios request
#         data = request.get_json()
#         print(data)
#         # Ensure required fields are present
#         # if "user_id" not in data or "airline_ticket_id" not in data:
#         #     return jsonify({"error": "Missing required fields"}), 400

#         # Save booking to the database
#         # booking_response = FlightTicket.buy_ticket(data)  # Save booking

#         # Return success response
#         return jsonify({"message": "Flight booked successfully"}), 201

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/book/flight', methods=['OPTIONS'])
# def handle_options():
#     """Handles CORS preflight requests"""
#     return '', 200  # Respond OK to OPTIONS request

# @app.route('/book/flight', methods=['POST'])
# def book_flight():
#     try:
#         # Print request headers and data for debugging
#         print("Headers:", request.headers)
#         print("Raw Data:", request.data)  # Print raw data
#         print("JSON Data:", request.get_json())  # Print parsed JSON

#         return jsonify({"message": "Debugging CORS"}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
