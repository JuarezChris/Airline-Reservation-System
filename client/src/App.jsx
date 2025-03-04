import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignInPage from "./components/SignInPage";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import ConfirmPage from "./components/ConfirmPage";
import axios from "axios";
import './App.css'
import FlightsPage from "./components/FlightsPage";
import BookFlightPage from "./components/BookFlightPage";

function App() {
//   const [data, setData] = useState([]);

//     useEffect(() => {
//       axios.get("http://127.0.0.1:5000/data", {withCredentials:true, headers: {
//         "Content-Type": "application/json", // Ensure JSON is sent
//         "Accept": "application/json", // Expect JSON response
//       },})
//       .then(response => {
//           console.log("Received Data:", response.data);  // Debug here
//           if (typeof response.data === "string") {
//               setData(JSON.parse(response.data));  // Manually parse if needed
//           } else {
//               setData(response.data);
//           }
//       })
//       .catch(error => console.error("Error fetching data:", error));
//     }, []);

    return (
        <div>

            {/* <h1>CSV Data from Flask</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        {item.name}
                    </li>
                ))}
            </ul> */}

            <Router>
            <NavBar />
                <Routes>
                    <Route index path="/dashboard" element={<Dashboard />} />
                    <Route index path="/flights" element={<FlightsPage />} />
                    <Route index path="/signIn" element={<SignInPage />} />
                    <Route index path="/login" element={<Login />} />
                    <Route index path="/book/flight/:id" element={<BookFlightPage />} />
                    <Route index path="/confirmation/:id" element={<ConfirmPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
