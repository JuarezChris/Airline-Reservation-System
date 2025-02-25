import React, {useState, useRef, useEffect, useMemo} from 'react';
import axios from "axios";
import '../styles/css/flightSearch.css'

const BookFlightPage = () => {
    const dropdownRef = useRef(null);
    const [flightData, setFlightData] = useState([]);
    const [filterData, setFilterData] = useState([])


    // const flight = {
    //     user_id: 1,
    //     airline_ticket_id: 10
    // };
    // const handlePurchase = (flight) => {
    //     console.log(flight)
    //     axios.post("http://127.0.0.1:5000/book/flight",{flight: {name_flight:"HEllo"}} ,{
    //          headers: {
    //         "Content-Type": "application/json", // Ensure JSON is sent
    //         "Accept": "application/json", // Expect JSON response
    //     },withCredentials:true})
    //     .then(response => {
    //         console.log(response.data);
    //     })
    //     .catch(error => console.error("Error fetching data:", error));
    // }

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


    useEffect(() => {
        axios.post("http://127.0.0.1:5000/book/flight", {withCredentials:true, headers: {
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
  return (
    <div>
        <h1>Book a Flight</h1>
        <div>
        {
        flightData.map((flight, idx) => (
            <li 
            key={idx} 
            // onClick={() => handleChange(flight)}
            id='list-item'
            >
            <div className='flight-ticket-container'>
                <span className='list-name'>{flight.Airline_Name}</span>
                <div>
                    <p>{flight.Departure_City} ---------- {flight.Arrival_City}</p>
                    <p>{flight.Duration}</p>
                    <button onClick={() => handlePurchase(flight)}>Book</button>
                </div>
            </div>
            </li>
        ))}
        </div>
    </div>
  )
}

export default BookFlightPage