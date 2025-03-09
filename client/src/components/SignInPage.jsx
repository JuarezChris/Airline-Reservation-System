import { useState } from 'react';
import { Link } from "react-router-dom";
import Reg from './Reg';
import Login from './Login';
import '../styles/css/signIn.css'

const SignInPage = ({ user, setUser }) => {
    const [showLogin, setShowLogin] = useState(false);

return (
    <div className='HomeMainContent'>
        <div className='logoContainer'>
            {/* <img src={logo} alt="Company Logo" className='companyLogo' /> */}
        </div>
        { showLogin ? (
            <>
                <Login user={user} setUser={setUser} />
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
                <Reg user={user} setUser={setUser}/>
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