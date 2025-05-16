import React, {useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/css/flightsPage.css'
// import '../styles/css/flightSearch.css'

const FlightsPage = ({user, foundFlight, setFoundFlight}) => {
    const navigate = useNavigate();
    const [flightData, setFlightData] = useState([]);
    const [filterData, setFilterData] = useState([])

    const handleBookFlight = (flightId) => {
        setFoundFlight([])
        navigate(`/book/flight/${flightId}`);
    };

    const handlePurchase = (flight) => {
        axios.post("http://127.0.0.1:5000/book/flight",{flight}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.error("Error booking flight:", error));
    };
    

    useEffect(() => {
        setFilterData(flightData)
    },[flightData])

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/data", {withCredentials:true, headers: {
        "Content-Type": "application/json", // Ensure JSON is sent
        "Accept": "application/json", // Expect JSON response
        },})
        .then(response => {
            console.log("Received Data:", response.data);  // Debug here
            if (typeof response.data === "string") {
            setFlightData(JSON.parse(response.data));  // Manually parse if needed
            } else {
            setFlightData(response.data);
            }
        })
        .catch(error => console.error("Error fetching data:", error));
    }, []);



    // Handle input change
    const handleInputChange = (e) => {
        setSelectedFlight({...selectedFlight, [e.target.name]: e.target.value.toLowerCase()});
    };

    // Toggle dropdown visibility when clicking the input
    const handleInputClick = () => {
        setShowDropdown(true); // Show dropdown only when clicked
    };

  return (
    <div>
    <h1>Book a Flight</h1>
    <div className="flights-container">
{ !foundFlight.length > 0 ? 
    flightData.map((flight, idx) => (
        <div key={idx} className="flight-card">
            
            <div className="flight-airline">
                <p className="airline-name">{flight.Airline_Name}</p>
            </div>

            <div className="flight-info">
                <p className="flight-time">{flight.Departure_Time} → {flight.Arrival_Time}</p>
                <p className="flight-route">{flight.Departure_City} → {flight.Arrival_City}</p>
                <p className="flight-duration">{flight.Duration}</p>
            </div>

            <div className="flight-action">
                <button onClick={() => handleBookFlight(flight.Ticket_ID)} className="book-button">
                    Book
                </button>
            </div>

        </div>
    ))
    :
    foundFlight.map((flight, idx) => (
        <div key={idx} className="flight-card">
            
            <div className="flight-airline">
                <p className="airline-name">{flight.flight.Airline_Name}</p>
            </div>

            <div className="flight-info">
                <p className="flight-time">{flight.flight.Departure_Time} → {flight.flight.Arrival_Time}</p>
                <p className="flight-route">{flight.flight.Departure_City} → {flight.flight.Arrival_City}</p>
                <p className="flight-duration">{flight.flight.Duration}</p>
            </div>

            <div className="flight-action">
                <button onClick={() => handleBookFlight(flight.flight.Ticket_ID)} className="book-button">
                    Book
                </button>
            </div>

        </div>
    ))
}
</div>

</div>
)
}

export default FlightsPage

