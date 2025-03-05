import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ConfirmPage = () => {
    const { id } = useParams(); 
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

    }, [id]);

  return (
    <div>
        <h1>Confirmation</h1>
        <p>{flight.Airline_Name }</p>
    </div>
  )
}

export default ConfirmPage