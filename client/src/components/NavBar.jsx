import React from "react";
import { Link } from "react-router-dom";
import "../styles/css/navbar.css";

const NavBar = () => {
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
    <Link className="signup" to={"/signIn"}>SIGN UP</Link>
    <Link className="login" to={"/login"}>LOG IN</Link>
    <span className="icon bell">🔔</span>
    <span className="icon search">🔍</span>
    </div>
</nav>
);
};

export default NavBar;