import React, {useState, useRef, useEffect, useMemo} from 'react';
import axios from "axios";
import '../styles/css/flightSearch.css'

const Dashboard = ({user}) => {
    const dropdownRef = useRef(null);
    const [flightData, setFlightData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filterData, setFilterData] = useState([])
    const [selectedFlight, setSelectedFlight] = useState({
        Airline_Name: ""
    })
    const [destination, setDestination] = useState("");
    const [searchType, setSearchType] = useState("Roundtrip");
    const [date, setDate] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

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

       // Close dropdown if clicked outside
       useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false); // Close dropdown when clicked outside
        }
        };

        // Add event listener when the dropdown is shown
        if (showDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup event listener on component unmount or when dropdown is hidden
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Handle input change
    const handleInputChange = (e) => {
        setSelectedFlight({...selectedFlight, [e.target.name]: e.target.value.toLowerCase()});
        setShowDropdown(true); // Show dropdown while typing
    };

    // Toggle dropdown visibility when clicking the input
    const handleInputClick = () => {
        setShowDropdown(true); // Show dropdown only when clicked
    };

    // Dropdown name search filter. Memo helps avoid unnecesary renders.
    const handleFilterData = useMemo(() => {
        return filterData.filter((p) => p.Airline_Name.toLowerCase().includes(selectedFlight.Airline_Name))
    }, [selectedFlight, filterData]) 

    // Handle search button click
    const handleSearch = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/search", {
                params: { departure: selectedFlight.name, destination, searchType, date, maxPrice },
            });
            console.log("Search Results:", response.data);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Find Your Flight ✈️</h1>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Flying from (e.g., Atlanta ATL)"
                    name="name"
                    value={selectedFlight.name}
                    onChange={handleInputChange}
                    className="flight-search-input"
                />

                {showDropdown && handleFilterData.length > 0 && (
                    <ul ref={dropdownRef} id='listControl'>
                        {handleFilterData.map((flight, idx) => (
                            <li key={idx} onClick={() => handleSelectFlight(flight)} id='list-item'>
                                {flight.name}
                            </li>
                        ))}
                    </ul>
                )}

                {showDropdown && handleFilterData.length === 0 && (
                    <ul id='listControl'>
                        <li className="px-4 py-2">No matches found</li>
                    </ul>
                )}

                <input 
                    type="text" 
                    placeholder="Flying to (e.g., Los Angeles LAX)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flight-search-input"
                />

                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="flight-search-select">
                    <option value="Roundtrip">Roundtrip</option>
                    <option value="One-way">One-way</option>
                </select>

                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flight-search-date" />

                <input 
                    type="number" 
                    placeholder="Max price ($)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flight-search-price"
                />

                <button onClick={handleSearch} className="flight-search-button">Search</button>
            </div>

            {/* New Information Section */}
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

//   return (
//     <div>
//         <h1>Dashboard</h1>
//         {/* <h1>CSV Data from Flask</h1>
//         <ul>
//             {FlightData.map((item) => (
//                 <li key={item.id}>
//                     {item.name}
//                 </li>
//             ))}
//         </ul> */}
//         <div className="search-container">
//             <input 
//                 type="text" 
//                 placeholder='Name'
//                 name="Airline_Name" 
//                 onChange={handleInputChange}
//                 onClick={handleInputClick}
//                 value={selectedFlight.Airline_Name}
//                 className="flight-search-input"
//                 />
//             {showDropdown && handleFilterData.length > 0 && (
//                 <ul 
//                     ref={dropdownRef}
//                     name="selectFlight" 
//                     // onChange={handleChange}
//                     id='listControl'
//                     >
//                     {
//                     handleFilterData.map((flight, idx) => (
//                         <li 
//                         key={idx} 
//                         onClick={() => handleChange(flight)}
//                         id='list-item'
//                         >
//                         <span className='list-name'>{flight.Airline_Name}</span>
//                         </li>
//                     ))}
//                 </ul>
//             )}

//             {showDropdown && handleFilterData.length === 0 && (
//                 <ul 
//                     id='listControl'
//                 >
//                     <li className="px-4 py-2">No matches found</li>
//                 </ul>
//             )}
//         </div>
//     </div>
//   )
// }

export default Dashboard