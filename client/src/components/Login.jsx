import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserSession } from '../context/UserSessionContext';

const Login = ({user, setUser}) => {
    const navigate = useNavigate()
    const { setUserSession } = useUserSession();
    const [errors, setErrors] = useState({})

    const changeHandler = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const submitHandler = (e) => {
        e.preventDefault()
        // console.log(user)
        axios.post("http://127.0.0.1:5000/login",{user}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true
        })
        .then((res) => {
            console.log(res)
            setUser(res.data.data_received[0])
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
                <label className="form-label">Email:</label>
                <input type="email" className="form-control" value={user.email} name='email' onChange={changeHandler}/>
            </div>
            <div>
                <label className="form-label">Password:</label>
                <input type="password" className="form-control" value={user.password} name='password' onChange={changeHandler}/>
            </div>
            <button className='btn btn-primary d-block'>Login</button>
        </form>
    </div>
  )
}

export default Login