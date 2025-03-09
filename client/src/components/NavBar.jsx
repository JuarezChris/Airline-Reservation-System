import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/css/navbar.css";

const NavBar = ({user, setUser}) => {
    const navigate = useNavigate();

const logout = () => {
    setUser({
        user_id: false,
        fname:'',
        lname:'',
        email:'',
        password:'',
        password_confirmation:''
    })
    navigate(`/signIn`)
}

return (
<nav className="navbar">
    <div className="navbar-left">
    {/* <Link to={"/dashboard"}></Link> */}
    <span className="logo"><Link className="home-link" to={"/dashboard"}>FLIGHTBOOK</Link></span>
    </div>

    <div className="navbar-center">
    <Link className="signup" to={"/flights"}>BROWSE</Link>
    <a href="/check-in">CHECK-IN</a>
    <a href="/my-trips">MY TRIPS</a>
    <a href="/flight-status">FLIGHT STATUS</a>
    <a href="/travel-info"></a>
    </div>

    <div className="navbar-right">
    { user.user_id ? 
    <div>
        <p>Welcome, {user.fname}</p> 
        <button className="login" onClick={logout}>LOG OUT</button>
    </div>
    : 
    <div>
    <Link className="signup" to={"/signIn"}>SIGN UP</Link>
    <Link className="login" to={"/login"}>LOG IN</Link>
    </div>
    }
    <span className="icon bell">🔔</span>
    <span className="icon search">🔍</span>
    </div>
</nav>
);
};

export default NavBar;