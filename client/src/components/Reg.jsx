import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Reg = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        fname:'',
        lname:'',
        email:'',
        password:'',
        password_confirmation:''
    })
    const [errors, setErrors] = useState({})

    const changeHandler = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }
    // {airline_user: {
    //     fname: user.fname,
    //     lname: user.lname,
    //     email: user.email,
    //     password: user.password,
    //     password_confirmation: user.password_confirmation
    //   }}

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
            navigate("/dashboard")
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