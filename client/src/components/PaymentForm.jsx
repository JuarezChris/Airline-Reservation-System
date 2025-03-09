import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useUserSession } from '../context/UserSessionContext';

const PaymentForm = ({ flight, clientSecret, user }) => {
    const { userSession } = useUserSession();
    // const [user, setUser ] = useState({})
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // // ✅ Request Stripe Payment Intent from Flask
    // useEffect(() => {
    //     if (flight && flight.Ticket_Price) {
    //         axios.post("http://127.0.0.1:5000/create-payment-intent", { flight })
    //             .then(response => {
    //                 console.log("Payment Intent:", response.data);
    //                 setClientSecret(response.data.clientSecret); // ✅ Save the clientSecret
    //             })
    //             .catch(error => console.error("Error fetching payment intent:", error));
    //     }
    // }, [flight]);

    // ✅ Handle Stripe Payment
    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!stripe || !elements || !clientSecret) {
                setError("Payment setup error. Please try again.");
                setLoading(false);
                return;
            }

            // ✅ Step 2: Confirm Payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                setPaymentSuccess(true);
                console.log("Payment successful! Flight booked.");
                handlePurchase();
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError("Payment failed. Please try again.");
        }

        setLoading(false);
    };

    const handlePurchase = () => {
        axios.post(`http://127.0.0.1:5000/book/flight`,{flight, user}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        
        .then(response => {
            console.log(response.data);
            navigate(`/confirmation/${response.data.res.ticket_id}`)
        })
        .catch(error => console.error("Error booking flight:", error));
    };

    return (
        <div>
            <form onSubmit={handlePayment}>
                    <h3>Enter Payment Details</h3>
                    <CardElement />
                    <button type="submit" disabled={!stripe || loading}>
                        {loading ? "Processing..." : "Pay & Book Flight"}
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;