import axios from "axios";
import React, { useState } from "react";
import './UserLogin.css';



const UserLogin = ({setIsAuthenticated, setSelectedComponent }) =>{
    

    const [loginData, setLoginData] = useState({
        email: "",
        password:""
    })


    const [successMessage, setSuccessMessage] = useState("")
    const [errors, setErrors] = useState({})


    const  handleChange = (e) => {
        const {name, value} = e.target;

        setLoginData ((prevData) => ({
            ...prevData,
            [name] : value,
        }))

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

        const responose = await axios.post('http://localhost:3001/user/login', loginData, {
            headers : {
                'Content-Type' : 'application/json',
            },
        })

        const responseData = responose.data;

        if(responseData.success && responseData.token) {
            setSuccessMessage("Login Successful")
            localStorage.setItem ('token', responseData.token);
            localStorage.setItem('user_id', responseData.user_id);
            setIsAuthenticated(true)
            setSelectedComponent("Devices")
        }

    } catch (error) {
        console.log("Error While Logging In...")
        setErrors((prevData) => ({
            ...prevData, 
            Login : "Error While Logging In",
        }))
    }
    }



    return (

        <div className="userLogin-page">

            <h1>Login To Your Alpha Connect Hub</h1>
            <form className="userLogin-form" onSubmit={handleSubmit}>

                <label htmlFor="email">Email:</label>
                <input 
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter Email..."
                />

                <br/>


                <label htmlFor="password">Password:</label>
                <input
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter Password..."
                />

                <br/>

                <button type="submit">Login</button>

                
            </form>
            {successMessage && <p className="successMessage">{successMessage}</p>}
            {errors.Login && <p className="errors">{errors.Login}</p>}
        </div>
    )
}


export default UserLogin;