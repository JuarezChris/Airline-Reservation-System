import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


const UserSessionContext = createContext();

export const UserSessionProvider = ({ children }) => {
    const [userSession, setUserSession] = useState({
        user_id: '',
        fname: '',
        lname: '',
        email: ''
    });



    return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
        {children}
    </UserSessionContext.Provider>
    );
};

export const useUserSession = () => useContext(UserSessionContext);