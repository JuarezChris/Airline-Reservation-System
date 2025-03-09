from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models import user_model
import random
import string

db = 'airline_db'

class FlightTicket:
    def __init__(self, data):
        self.ticket_id = data['Ticket_ID']
        self.airline_id = data['Airline_ID']
        self.airline_name = data['Airline_Name']
        self.flight_number = data['Flight_Number']
        self.departure_airport = data['Departure_Airport']
        self.departure_city = data['Departure_City']
        self.departure_country = data['Departure_Country']
        self.departure_date = data['Departure_Date']
        self.departure_time = data['Departure_Time']
        self.arrival_airport = data['Arrival_Airport']
        self.arrival_city = data['Arrival_City']
        self.arrival_country = data['Arrival_Country']
        self.arrival_date = data['Arrival_Date']
        self.arrival_time = data['Arrival_Time']
        self.duration = data['Duration']
        self.ticket_price = data['Ticket_Price']
        self.seat_class = data['Seat_Class']
        self.seat = data['Seat']
        self.available_seats = data['Available_Seats']
        self.booking_status = data['Booking_Status']

    @classmethod
    def buy_ticket(cls, form_data):
        db = connectToMySQL('airline_db')  # Ensure correct DB connection
        try:
            flight_data = form_data["flight"]  # Extract nested flight object
            user_id = flight_data["user_id"]  # Extract user_id separately
            print(flight_data)
            print("######################")
            confirmation_num = FlightTicket.generate_random_string()
            print(confirmation_num)  # Example output: 'A7f9X2z'
            
            # Step 1: Insert the ticket into airline_tickets
            ticket_query = """
            INSERT INTO airline_tickets (
                Airline_ID, Airline_Name, Flight_Number, Departure_Airport, Departure_City,
                Departure_Country, Departure_Date, Departure_Time, Arrival_Airport, Arrival_City,
                Arrival_Country, Arrival_Date, Arrival_Time, Duration, Ticket_Price,
                Seat_Class, Seat, Available_Seats, Booking_Status, User_ID, Confirm_Num
            ) VALUES (
                %(Airline_ID)s, %(Airline_Name)s, %(Flight_Number)s, %(Departure_Airport)s, %(Departure_City)s,
                %(Departure_Country)s, %(Departure_Date)s, %(Departure_Time)s, %(Arrival_Airport)s, %(Arrival_City)s,
                %(Arrival_Country)s, %(Arrival_Date)s, %(Arrival_Time)s, %(Duration)s, %(Ticket_Price)s,
                %(Seat_Class)s, %(Seat)s, %(Available_Seats)s, %(Booking_Status)s, %(User_ID)s, %(Confirm_Num)s
            );
            """

            # Add user_id to flight_data before inserting
            flight_data["User_ID"] = user_id
            flight_data["Confirm_Num"] = confirmation_num
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(flight_data, "Thiss is the form data")

            ticket_id = db.query_db(ticket_query, flight_data)  # Insert & get new airline_ticket_id

            if not ticket_id:
                return {"error": "Failed to insert ticket"}

            return {"message": "Flight booked successfully", "ticket_id": ticket_id}
        
        except Exception as e:
            return {"error": str(e)}
        

    @classmethod
    def retrieve_flight(cls, form_data):
        db = connectToMySQL('airline_db')  # Ensure correct DB connection
        try:
            ticket_query = "SELECT * from airline_tickets WHERE airline_ticket_id = %(Ticket_ID)s"

            ticket = db.query_db(ticket_query, form_data)  # Insert & get new airline_ticket_id
            print(ticket)

            if not ticket:
                return {"error": "Failed to insert ticket"}

            return {"message": "Flight Ticket Found", "ticket": ticket}
        
        except Exception as e:
            return {"error": str(e)}
    
    @staticmethod
    def generate_random_string(length=7):
        characters = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
        return ''.join(random.choices(characters, k=length))

    # @classmethod
    # def buy_ticket(cls, form_data):
    #     return "Success"



