import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookFlightPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [flight, setFlight] = useState({});

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/flight/data/${id}`,{
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
            setFlight(response.data.res[0])
        })
        .catch(error => console.error("Error booking flight:", error));

      }, []);
  return (
    <div>
        <h1>book this flight!</h1>
        <div className='flight-ticket-container'>
            <span className='list-name'>{flight.Airline_Name}</span>
            <div>
                <p>{flight.Departure_City} ---------- {flight.Arrival_City}</p>
                <p>{flight.Duration}</p>
                <p>Price: ${flight.Ticket_Price}</p>
                <button onClick={() => handleBookFlight(flight.Ticket_ID)}>Purchase</button>
            </div>
        </div>
    </div>
  )
}

export default BookFlightPage