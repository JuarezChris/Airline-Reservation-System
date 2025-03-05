import { useState } from 'react';
import { Link } from "react-router-dom";
import Reg from './Reg';
import Login from './Login';
import '../styles/css/signIn.css'

const SignInPage = () => {
    const [showLogin, setShowLogin] = useState(false);

return (
    <div className='HomeMainContent'>
        <div className='logoContainer'>
            {/* <img src={logo} alt="Company Logo" className='companyLogo' /> */}
        </div>
        { showLogin ? (
            <>
                <Login />
                <p
                    className='loginRegLink'
                    onClick={() => setShowLogin(false)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                    Don't have an account? Register Here
                </p>
                
            </>
        ) : (
            <>
                <Reg />
                <p
                    className='loginRegLink'
                    onClick={() => setShowLogin(true)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                    Already have an account? Login here
                </p>
            </>
        )

        }
        
    </div>
)
}

export default SignInPage