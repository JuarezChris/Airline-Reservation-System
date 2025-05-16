import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import PaymentForm from "./PaymentForm";  // ✅ Import PaymentForm
import '../styles/css/bookFlight.css';


const BookFlightPage = ({user}) => {
    const stripePromise = loadStripe("pk_test_51Qz5NfFZX2j25Z0XYGthiMz0CwUOlPqCGQPoKufgdc8JeH5ysB93dqZh1YxbSupc2J58OOYq3wZrxA3SzfhHl6o10092JJxiYw"); // Replace with your Stripe Test Public Key
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [flight, setFlight] = useState({});
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    // ✅ Request Stripe Payment Intent from Flask
    useEffect(() => {
        if (flight && flight.Ticket_Price) {
            axios.post("http://127.0.0.1:5000/create-payment-intent", { flight }, {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        withCredentials: true
                    })
                .then(response => {
                    console.log("Payment Intent:", response.data);
                    setClientSecret(response.data.clientSecret); // ✅ Save the clientSecret
                })
                .catch(error => console.error("Error fetching payment intent:", error));
        }
    }, [flight]);

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
    <div className="book-flight-container">
    <h1 className="page-title">Book a Flight</h1>

    <div className="flight-card">
        <div className="flight-airline">
            <p className="airline-name">{flight.Airline_Name}</p>
            <p className="flight-number">{flight.Flight_Number}</p>
        </div>

        <div className="flight-info">
            <p className="flight-time">{flight.Departure_Time} → {flight.Arrival_Time}</p>
            <p className="flight-route">{flight.Departure_City} → {flight.Arrival_City}</p>
            <p className="flight-duration">{flight.Duration}</p>
            <p className="flight-stops">{flight.Stops ? `${flight.Stops} stops` : "Direct Flight"}</p>
        </div>

        <div className="flight-price">
            <p className="ticket-price">${flight.Ticket_Price}</p>
            <button className="book-button">Book</button>
        </div>
    </div>

    {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm flight={flight} clientSecret={clientSecret} user={user} />
        </Elements>
    )}
</div>
);
}

export default BookFlightPage;
