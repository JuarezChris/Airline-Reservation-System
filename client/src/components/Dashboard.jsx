import React, {useState, useRef, useEffect, useMemo} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../styles/css/flightSearch.css';

const Dashboard = ({user, foundFlight, setFoundFlight}) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [flightData, setFlightData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filterData, setFilterData] = useState([]);

    const [selectedFlight, setSelectedFlight] = useState({
        Departure_City: "",
        Ticket_Price: "",
        Arrival_City: "",
        Arrival_Date: "",
        Departure_Date: "",
    });

    const [destination, setDestination] = useState("");
    const [searchType, setSearchType] = useState("Roundtrip");
    const [date, setDate] = useState("");
    const [returnDate, setReturnDate] = useState(""); // ✅ Added state for return date
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        setFilterData(flightData);
    }, [flightData]);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/data", { withCredentials: true, headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }})
        .then(response => {
            console.log("Received Data:", response.data);
            if (typeof response.data === "string") {
                setFlightData(JSON.parse(response.data));
            } else {
                setFlightData(response.data);
            }
        })
        .catch(error => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleInputChange = (e) => {
        setSelectedFlight({ ...selectedFlight, [e.target.name]: e.target.value});
        setShowDropdown(true);
    };


        // Dropdown name search filter. Memo helps avoid unnecesary renders.
    const handleFilterData = useMemo(() => {
        return filterData.filter((p) => {
            console.log(p.Departure_City)
            return p.Departure_City.toLowerCase().includes(selectedFlight.Departure_City)
        })
    }, [selectedFlight, filterData]) 

    const handleSearch = () => {
        console.log("here")
        let bestMatches = [];
        let highestScore = 0;

        flightData.forEach((flight) => {
            let matchScore = 0;
            let totalKeys = Object.keys(selectedFlight).length;

            Object.keys(selectedFlight).forEach((key) => {
                if (selectedFlight[key] && flight[key] === selectedFlight[key]) {
                    matchScore++; // ✅ Increase score for each matching property
                }
            });

            const matchPercentage = (matchScore / totalKeys) * 100; // Match percentage
            if (matchScore > 0) {
                bestMatches.push({ flight, matchPercentage });
            }

            bestMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        });

        setFoundFlight(bestMatches || "No similar sandwich found");
        navigate(`/flights`);
    };


    return (
        <div className="dashboard-container">
            <h1>Find Your Flight ✈️</h1>
            <div className="search-container">
            <div className="dropdown-container">
                <input 
                    type="text" 
                    placeholder="Flying from (e.g., Atlanta ATL)"
                    name="Departure_City"
                    value={selectedFlight.Departure_City}
                    onChange={handleInputChange}
                    className="flight-search-input"
                />
                
            </div>

                <input 
                    type="text" 
                    placeholder="Flying to (e.g., Los Angeles LAX)"
                    value={selectedFlight.Arrival_City}
                    name="Arrival_City"
                    onChange={handleInputChange}
                    className="flight-search-input"
                />

                <select 
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)} 
                    className="flight-search-select"
                >
                    <option value="Roundtrip">Roundtrip</option>
                    <option value="One-way">One-way</option>
                </select>

                {/* Always Show Departure Date */}
                <input 
                    type="date" 
                    value={selectedFlight.Departure_Date}
                    name="Departure_Date"
                    onChange={handleInputChange}
                    className="flight-search-date" 
                />

                {/* Show Return Date ONLY if "Roundtrip" is selected */}
                {searchType === "Roundtrip" && (
                    <input 
                        type="date" 
                        value={selectedFlight.Arrival_Date}
                        name="Arrival_Date"
                        onChange={handleInputChange}
                        className="flight-search-date" 
                    />
                )}

                <input 
                    type="number" 
                    placeholder="Max price ($)"
                    value={selectedFlight.Ticket_Price}
                    name="Ticket_Price"
                    onChange={handleInputChange}
                    className="flight-search-price"
                />

                <button onClick={handleSearch} className="flight-search-button">Search</button>
            </div>

            <section className="info-section">
                <h2 className="info-title">Supporting You Through Your Travel Journey</h2>

                <div className="info-highlight">
                    <div className="info-icon">📅✈️</div>
                    <div className="info-text">
                        <h3>How Can I Cancel or Change My Flight?</h3>
                        <p>We understand that your plans may change. Easily modify your flight before departure in just a few steps.</p>
                    </div>
                </div>

                    <div className="info-cards">
                <div className="card">
                    <img src="https://images.pexels.com/photos/5778603/pexels-photo-5778603.jpeg" alt="Onboard Experience" />
                    <h3>Our Onboard Experience</h3>
                    <p>Enjoy comfortable seating, meals, and entertainment on all flights.</p>
                </div>
                <div className="card">
                    <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" alt="Upgrade Options" />
                    <h3>Upgrade Yourself</h3>
                    <p>Check out upgrade options to make your travel even more comfortable.</p>
                </div>
                <div className="card">
                    <img src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg" alt="Premium Travel" />
                    <h3>Enjoy Premium Travel</h3>
                    <p>Experience our premium seating and services for a luxury experience.</p>
                </div>
            </div>
            </section>
        </div>
    );
};

export default Dashboard
