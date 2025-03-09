import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ConfirmPage = ({user}) => {
    const { ticket_id } = useParams(); 
    const [flight, setFlight] = useState({});

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
        })
        .catch(error => console.error("Error booking flight:", error));

    }, [ticket_id]);

  return (
    <div>
        <h1>Confirmation</h1>
        <p>Airline: {flight.Airline_Name }</p>
        <p>Confirmation: {flight.Confirm_Num }</p>
    </div>
  )
}

export default ConfirmPage