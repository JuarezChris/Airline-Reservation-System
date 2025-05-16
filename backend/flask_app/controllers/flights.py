from flask import render_template, redirect, request, session
import stripe
from flask_mail import Message
from flask_app.models.flight_ticket_model import FlightTicket
from flask_app import app, mail
from flask_app.models.user_model import User

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

# Allow only localhost:5173 and enable credentials
CORS(app, resources={r"/data": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# CORS(app)  # Allows any origin
# print(f"Allowed Origins: {ALLOWED_ORIGINS}")  # Debugging CORS origins

@app.route('/book/flight', methods=['OPTIONS'])
def handle_options():
    """Handles CORS preflight requests"""
    response = jsonify({"message": "CORS preflight passed"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    # response.headers.add("Access-Control-Max-Age", "86400")  # ✅ Allow caching of preflight requests
    return response, 200

@app.route('/register', methods=['OPTIONS'])
def handle_reg_options():
    """Handles CORS preflight requests"""
    response = jsonify({"message": "CORS preflight passed"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    return response, 200

@app.route('/login', methods=['OPTIONS'])
def handle_login_options():
    """Handles CORS preflight requests"""
    response = jsonify({"message": "CORS preflight passed"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    return response, 200

@app.route('/create-payment-intent', methods=['OPTIONS'])
def handle_payment_options():
    """Handles CORS preflight requests"""
    response = jsonify({"message": "CORS preflight passed"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    return response, 200

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

@app.route('/flight/data/<int:flightId>', methods=['GET'])
def get_flight_data(flightId):
    print("Retrieving flight...")
    df = load_csv()  # Load CSV

    print("First few rows of CSV:")
    print(df[['Ticket_ID']].head())  # Show only Ticket_ID column

    print(f"Searching for Ticket_ID: {flightId}")

    if 'Ticket_ID' not in df.columns:
        return jsonify({"error": "Ticket_ID column missing in CSV"}), 400

    # Print all Ticket_IDs to check values
    # print("Available Ticket_IDs:", df['Ticket_ID'].tolist())

    # Search for matching Ticket_ID
    flight = df[df['Ticket_ID'] == flightId]

    print("Filtered flight data:", flight)

    if flight.empty:
        return jsonify({"error": "Flight not found"}), 404
    
    flight_dict = flight.to_dict(orient="records")

    response = jsonify({
            "message": "found flight",
            "res": flight_dict
        })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 201  # ✅ Return JSON + CORS headers


@app.route('/flight/confirmation/<int:Ticket_ID>', methods=['GET'])
def get_flight_confirmation(Ticket_ID):
    print("Retrieving flight...")
    flight_ticket = FlightTicket.retrieve_flight({"Ticket_ID":Ticket_ID})
    
    response = jsonify({
            "message": "found flight",
            "res": flight_ticket
        })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 201  # ✅ Return JSON + CORS headers




@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        # print("Session ID at payment start:", request.cookies.get('session'))  # Print session ID
        # print("Session Data:", session)  # Print session contents
        data = request.get_json()
        flight = data.get("flight", {})

        if not flight or "Ticket_Price" not in flight:
            return jsonify({"error": "Invalid flight data"}), 400

        amount = int(flight["Ticket_Price"]) * 100  # Convert dollars to cents
        print(f"Creating payment intent for amount: {amount}")

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            payment_method_types=["card"],
        )
        response = jsonify({
            "message": "Flight booked successfully",
            "data_received": data,
            "clientSecret": intent.client_secret
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201  # Return JSON + CORS headers
        # return jsonify({"clientSecret": intent.client_secret})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/book/flight', methods=['POST'])
def book_flight():
    print("HEREE")
    try:
        data = request.get_json()
        # print("Session at booking start:", session)  # Debugging
        print("made it")
        print(data['user']['user_id'])
        print(data['user']['email'])
        user_email = data['user']['email']

        data['flight']['user_id'] = data['user']['user_id']
        print("Received Data:", data)  # Debugging
        ########### card payment ####################
        amount = data.get("amount", 5000)  # Default to $50 (Stripe uses cents)

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            payment_method_types=["card"],
        )
        ########### end card payment ####################


        # Ensure data is received properly
        if not data:
            return jsonify({"error": "No data received"}), 400

        # If booking logic is needed, add it here
        print("Processing booking...")
        # Save booking to the database
        booking_response = FlightTicket.buy_ticket(data)  # Save booking
        print("******************************")
        print(booking_response)
        print(booking_response["ticket_id"])
        print("******************************")

        #################### Email #################################

        # Send Email Confirmation
        subject = "Flight Ticket Confirmation"
        body = f"""
        Your booking is confirmed!  

        Here is your itinerary and receipt! Thanks for booking with us! 

        Your confirmation number is: #{booking_response["ticket_id"]}

        Flight Details 

        Departing Flight Information 

        Date: {booking_response["flight_data"]["Departure_Date"]}

        Flight #: {booking_response["flight_data"]["Flight_Number"]}

        Airline: {booking_response["flight_data"]["Airline_Name"]}

        Depart Airport:  {booking_response["flight_data"]["Departure_Airport"]}

        Depart Time: {booking_response["flight_data"]["Departure_Time"]}

        Arrival Flight Information 

        Date: {booking_response["flight_data"]["Arrival_Date"]}

        Flight #: {booking_response["flight_data"]["Flight_Number"]}

        Airline: {booking_response["flight_data"]["Airline_Name"]}

        Arrival Airport: {booking_response["flight_data"]["Arrival_Airport"]}

        Arrival Time: {booking_response["flight_data"]["Arrival_Time"]}

        Passenger Name: 

        

        Receipt:  

        Total Trip Cost: 
        """

        try:
            msg = Message(subject, recipients=[user_email], body=body)
            mail.send(msg)
            print(f"Email sent to {user_email}")

        except Exception as e:
            print(f"Error sending email: {e}")
            return jsonify({"error": "Failed to send confirmation email"}), 500

        response = jsonify({
            "message": "Flight booked successfully",
            "data_received": data,
            "res": booking_response,
            "clientSecret": intent.client_secret
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201  # Return JSON + CORS headers

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/register', methods=['POST'])
def register():
    try:
        # if not User.validate_user(request.form):
        #     print("Made it here!")
        #     return redirect('/')
        data = request.get_json()
        print("made it to register backend")
        print("user form data", data)

        # Ensure data is received properly
        if not data:
            return jsonify({"error": "No data received"}), 400

        # If booking logic is needed, add it here
        print("Processing register...")
        # Save user
        user_id = User.create_user(data)
        # print(user_id)
        session['user_id'] = user_id
        # session.modified = True
        print(session['user_id'])
        data["user"]["user_id"] = user_id
        response = jsonify({
            "message": "Register Successful",
            "data_received": data,
            "user_id": user_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201  # Return JSON + CORS headers

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("made it to login backend")
        print("user form data", data)

        # Ensure data is received properly
        if not data:
            return jsonify({"error": "No data received"}), 400

        # If booking logic is needed, add it here
        print("Processing login...")
        # Save user
        user_in_db = User.find_user(data)


        response = jsonify({
            "message": "login Successful",
            "data_received": user_in_db,
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201  # Return JSON + CORS headers

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/flight/cancel/<int:flightId>', methods=['GET'])
def cancel_flight(flightId):
    print("cancelling flight...")

    data = {
        "Ticket_ID": flightId
    }

    FlightTicket.delete(data)

    response = jsonify({
            "message": "Flight Cancelled",

        })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 201  # Return JSON + CORS headers