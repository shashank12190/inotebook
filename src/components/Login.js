import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login = (props) => {
    const { showAlert } = props
    let history = useHistory()
    const [credentials, setCredentials] = useState({ email: "", passward: "" })
    const onSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`http://localhost:5000/api/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email, passward: credentials.passward })

            });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            //redirect
            localStorage.setItem("token", json.authtoken)
            showAlert(":- Logged in successfully", 'success')
            history.push('/')
        } else {
            showAlert(":- Invalid credentials", "danger")
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    return (
        <div>
            <form className='my-5 container' onSubmit={onSubmit}>
                <h1 className='text-center my-2'>Login to continue to iNotebook</h1>
                <div className="mb-3 ">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="passwaard" className="form-label">Password</label>
                    <input type="password" className="form-control" name="passward" id="passeward" value={credentials.passward} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
