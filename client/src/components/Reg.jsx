import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserSession } from '../context/UserSessionContext';

const Reg = ({ user, setUser}) => {
    const navigate = useNavigate()
    const { setUserSession } = useUserSession();
    const [errors, setErrors] = useState({})

    const changeHandler = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }


    const submitHandler = (e) => {
        e.preventDefault()
        axios.post("http://127.0.0.1:5000/register",{user}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        .then((res) => {
            console.log(res)
            setUser(res.data.data_received.user)
            navigate(`/dashboard`)
        })
        .catch((err) => {
            console.log(err);
        })
    }

  return (
    <div>
            <form onSubmit={submitHandler}>
            <div>
                <label className="form-label">First Name:</label>
                <input type="text" className="form-control" value={user.firstName} name='fname' onChange={changeHandler}/>
            </div>
            <div>
                <label className="form-label">Last Name:</label>
                <input type="text" className="form-control" value={user.lastName} name='lname' onChange={changeHandler}/>
            </div>
            <div>
                <label className="form-label">Email:</label>
                <input type="email" className="form-control" value={user.email} name='email' onChange={changeHandler}/>
            </div>
            <div>
                <label className="form-label">Password:</label>
                <input type="password" className="form-control" value={user.password} name='password' onChange={changeHandler}/>
            </div>
            <div>
                <label className="form-label">Confirm Password:</label>
                <input type="password" className="form-control" value={user.confirmPassword} name='password_confirmation' onChange={changeHandler}/>
            </div>
            <button className='btn btn-primary d-block'>Register</button>
        </form>
    </div>
  )
}

export default Reg