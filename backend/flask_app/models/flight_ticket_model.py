from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models import user_model

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
            user_id = 3  # Extract user_id separately
            print("######################")

            # Step 1: Insert the ticket into airline_tickets
            ticket_query = """
            INSERT INTO airline_tickets (
                Airline_ID, Airline_Name, Flight_Number, Departure_Airport, Departure_City,
                Departure_Country, Departure_Date, Departure_Time, Arrival_Airport, Arrival_City,
                Arrival_Country, Arrival_Date, Arrival_Time, Duration, Ticket_Price,
                Seat_Class, Seat, Available_Seats, Booking_Status, User_ID
            ) VALUES (
                %(Airline_ID)s, %(Airline_Name)s, %(Flight_Number)s, %(Departure_Airport)s, %(Departure_City)s,
                %(Departure_Country)s, %(Departure_Date)s, %(Departure_Time)s, %(Arrival_Airport)s, %(Arrival_City)s,
                %(Arrival_Country)s, %(Arrival_Date)s, %(Arrival_Time)s, %(Duration)s, %(Ticket_Price)s,
                %(Seat_Class)s, %(Seat)s, %(Available_Seats)s, %(Booking_Status)s, %(User_ID)s
            );
            """

            # Add user_id to flight_data before inserting
            flight_data["User_ID"] = user_id
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(flight_data, "Thiss is the form data")

            ticket_id = db.query_db(ticket_query, flight_data)  # Insert & get new airline_ticket_id

            if not ticket_id:
                return {"error": "Failed to insert ticket"}

            return {"message": "Flight booked successfully", "ticket_id": ticket_id}

        except Exception as e:
            return {"error": str(e)}
    
    # @classmethod
    # def buy_ticket(cls, form_data):
    #     return "Success"

    @classmethod
    def get_all(cls):
        query = "SELECT * FROM books_authors_db.books;"
        results = connectToMySQL('books_authors_db').query_db(query)
        # print(results)
        books = []
        for book in results:
            books.append( cls(book) )
        return books

    @classmethod
    def get_book(cls, data):
        query = "SELECT * FROM books_authors_db.books WHERE id = %(id_num)s;"
        return connectToMySQL('books_authors_db').query_db(query, data)[0]

    @classmethod
    def create_book(cls, data):
        query = "INSERT INTO books_authors_db.books (title, num_of_pages) VALUES ( %(title)s, %(num_of_pages)s);"
        return connectToMySQL('books_authors_db').query_db(query, data)

