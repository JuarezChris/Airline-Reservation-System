import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import PaymentForm from "./PaymentForm";  // ✅ Import PaymentForm


const BookFlightPage = ({user}) => {
    const stripePromise = loadStripe("pk_test_51Qz5NfFZX2j25Z0XYGthiMz0CwUOlPqCGQPoKufgdc8JeH5ysB93dqZh1YxbSupc2J58OOYq3wZrxA3SzfhHl6o10092JJxiYw"); // Replace with your Stripe Test Public Key
    const { id } = useParams(); 
    const navigate = useNavigate();
    // const stripe = useStripe();
    // const elements = useElements();
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

    // const handlePurchase = (flight) => {
    //     axios.post("http://127.0.0.1:5000/book/flight",{flight}, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json",
    //         },
    //         withCredentials: true
    //     })
        
    //     .then(response => {
    //         console.log(response.data);
    //     })
    //     .catch(error => console.error("Error booking flight:", error));
    // };

  return (
    <div>
            <h1>Book This Flight!</h1>
            <div className='flight-ticket-container'>
                <span className='list-name'>{flight.Airline_Name}</span>
                <div>
                    <p>{flight.Departure_City} ---------- {flight.Arrival_City}</p>
                    <p>{flight.Duration}</p>
                    <p>{flight.Seat}, {flight.Seat_Class}</p>
                    <p>{flight.Flight_Number}</p>
                    <p>{flight.Departure_Date}</p>
                    <p>Price: ${flight.Ticket_Price}</p>
                </div>
            </div>

            {/* ✅ Ensure PaymentForm is inside <Elements> */}
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm flight={flight} clientSecret={clientSecret} user={user} />
                </Elements>
            )}
        </div>
  )
}

export default BookFlightPage