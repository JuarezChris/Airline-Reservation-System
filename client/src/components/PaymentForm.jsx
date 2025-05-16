import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useUserSession } from '../context/UserSessionContext';
import '../styles/css/paymentForm.css';

const PaymentForm = ({ flight, clientSecret, user }) => {
    const { userSession } = useUserSession();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);


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
        <div className="payment-container">
        <h3 className="payment-title">Enter Payment Details</h3>
        <form onSubmit={handlePayment} className="payment-form">
            <div className="card-element-container">
                <CardElement className="custom-card-input" />
            </div>
            <button type="submit" className="payment-button" disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay & Book Flight"}
            </button>
            {error && <p className="payment-error">{error}</p>}
        </form>
    </div>
);
};

export default PaymentForm;
