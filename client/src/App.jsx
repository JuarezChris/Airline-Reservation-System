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
import { UserSessionProvider } from './context/UserSessionContext';

function App() {
    const [user, setUser] = useState({
        user_id: false,
        fname:'',
        lname:'',
        email:'',
        password:'',
        password_confirmation:''
    })
    const [foundFlight, setFoundFlight] = useState([]);

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
            <NavBar user={user} setUser={setUser}/>
            <UserSessionProvider>
                <Routes>
                    <Route index path="/dashboard" element={<Dashboard user={user} foundFlight={foundFlight} setFoundFlight={setFoundFlight} />} />
                    <Route  path="/flights" element={<FlightsPage user={user} foundFlight={foundFlight} setFoundFlight={setFoundFlight} />} />
                    <Route index path="/signIn" element={<SignInPage user={user} setUser={setUser} />} />
                    {/* <Route index path="/login" element={<Login setUser={setUser} />} /> */}
                    <Route  path="/book/flight/:id" element={<BookFlightPage user={user} />} />
                    <Route  path="/confirmation/:ticket_id" element={<ConfirmPage user={user} />} />
                </Routes>
            </UserSessionProvider>
            </Router>
        </div>
    );
}

export default App;
