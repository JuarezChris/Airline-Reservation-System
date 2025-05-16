import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/css/confirmPage.css'

const ConfirmPage = ({user}) => {
    const { ticket_id } = useParams(); 
    const [flight, setFlight] = useState({});
    const [cancelMessage, setCancelMessage] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/flight/confirmation/${ticket_id}`,{
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
            setFlight(response.data.res.ticket[0])
            setCancelMessage(false)
        })
        .catch(error => console.error("Error booking flight:", error));

    }, [ticket_id]);

    const cancelTrip = () => {
        axios.get(`http://127.0.0.1:5000/flight/cancel/${ticket_id}`,{
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
            setCancelMessage(true)
        })
        .catch(error => console.error("Error booking flight:", error));
    }

return (
    <div className="confirmation-container">
        {
            cancelMessage ? 
            <div>
                <p>Your flight has been cancelled successfully!</p>
            </div> 
            :
            <div>
            <h1>Confirmation</h1>
            <p>Airline: {flight.Airline_Name }</p>
            <p>Confirmation: {flight.Confirm_Num }</p>
            <button onClick={cancelTrip}>Cancel</button>
            </div>
        }
    </div>
  )
}

export default ConfirmPage