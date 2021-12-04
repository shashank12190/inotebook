import { useHistory } from 'react-router-dom'
import React, { useState } from 'react'


const Signup = (props) => {
    const { showAlert } = props
    let history = useHistory()
    const [credentials, setCredentials] = useState({ name: "", email: "", passward: "", rpassward: "" })
    const onSubmit = async (e) => {
        e.preventDefault()
        const { name, email, passward } = credentials
        const response = await fetch(`http://localhost:5000/api/auth/createuser`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, passward })

            });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            //redirect
            localStorage.setItem("token", json.authtoken)
            history.push('/')
            showAlert(":- Successfully created account", "success")

        } else {
            showAlert(":- Invalid credentials", "danger")

        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };


    return (
        <div >
            <form onSubmit={onSubmit}>
                <h1 className='text-center my-4'>Create an account to continue to iNotebook</h1>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">User Name</label>
                    <input type="name" className="form-control" name="name" value={credentials.name} id="name" aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name="email" value={credentials.email} id="email" aria-describedby="emailHelp" onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="passward" className="form-label">Password</label>
                    <input type="password" className="form-control" name="passward" value={credentials.passward} id="passward" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="rpassward" className="form-label">Retype Password</label>
                    <input type="password" className="form-control" name="rpassward" value={credentials.rpassward} id="rpassward" onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup
