import React, {useState, useRef, useEffect, useMemo} from 'react';
import axios from "axios";
import '../styles/css/flightSearch.css'

const Dashboard = () => {
    const dropdownRef = useRef(null);
    const [flightData, setFlightData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filterData, setFilterData] = useState([])
    const [selectedFlight, setSelectedFlight] = useState({
        name: ""
    })

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
        setSelectedFlight({...selectedFlight, [e.target.name]: e.target.value});
        setShowDropdown(true); // Show dropdown while typing
    };

    // Toggle dropdown visibility when clicking the input
    const handleInputClick = () => {
        setShowDropdown(true); // Show dropdown only when clicked
    };

    // Dropdown name search filter. Memo helps avoid unnecesary renders.
    const handleFilterData = useMemo(() => {
        return filterData.filter((p) => p.name.toLowerCase().includes(selectedFlight.name))
    }, [selectedFlight, filterData]) 

  return (
    <div>
        <h1>Dashboard</h1>
        {/* <h1>CSV Data from Flask</h1>
        <ul>
            {FlightData.map((item) => (
                <li key={item.id}>
                    {item.name}
                </li>
            ))}
        </ul> */}
        <div className="search-container">
            <input 
                type="text" 
                placeholder='Name'
                name="name" 
                onChange={handleInputChange}
                onClick={handleInputClick}
                value={selectedFlight.name}
                className="flight-search-input"
                />
            {showDropdown && handleFilterData.length > 0 && (
                <ul 
                    ref={dropdownRef}
                    name="selectFlight" 
                    // onChange={handleChange}
                    id='listControl'
                    >
                    {
                    handleFilterData.map((flight, idx) => (
                        <li 
                        key={idx} 
                        onClick={() => handleChange(flight)}
                        id='list-item'
                        >
                        <span className='list-name'>{flight.name}</span>
                        </li>
                    ))}
                </ul>
            )}

            {showDropdown && handleFilterData.length === 0 && (
                <ul 
                    id='listControl'
                >
                    <li className="px-4 py-2">No matches found</li>
                </ul>
            )}
        </div>
    </div>
  )
}

export default Dashboard