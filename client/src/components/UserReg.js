import React, { useState } from "react";
import './UserReg.css'
import axios from "axios";


const UserReg = ({setIsAuthenticated}) => {

    const [packageDetails, setPackageDetails] = useState(null)
    const [registerData, setRegisterData] = useState({
        name:"",
        email:"",          // Date Defined To Perform Validation and Data Gathering
        recovery_email:"",
        password:"",
        package_id:"",

    })

    const [errors, setErrors] = useState({})  // {} Type To Store Error : Message
    const [succesMessgae, setSuccessMessage] = useState("")

    const handleChange = (e) => {

        const {name, value} = e.target;
         setRegisterData((prevData) => ({
            ...prevData,
            [name]:value,
         }))

    }

    const handlePackage = async (e) => {

        const packageValue = e.target.value  // For Changes & Data use Event "e" to extract value

        try {   // Use Try Catch To Handle Async Better Way  

        const responose = await axios.get(
            `http://localhost:3001/subscription/get-package?package=${packageValue}`
            )

        const packageData = responose.data ;
        
        setRegisterData ((prevData) => ({
            ...prevData,            // registerData.package = packageData.package_id (**Wrong Way**)
            package_id : packageData.package_id,
        }))


        } catch (error) {
            console.log(error)
            setErrors((prevErrors) => ({
                ...prevErrors,
                package : "Failed To Load Package Info"
            }))
        }
    }
    const validateForm = () =>{
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!registerData.name.trim()) {
            newErrors.name = "Name Is Required.";
        }

        if (!emailRegex.test(registerData.email)) {
            newErrors.email = "Enter A Valid Email"
        }

        if (!emailRegex.test(registerData.recovery_email)) {
            newErrors.recovery_email = "Enter A Valid Email";
        }

        if (!registerData.password || registerData.password.length < 6) {
            newErrors.password = "Password Must Be At Least 6 Characters";
        }

        if (!registerData.package_id) {
            newErrors.package_id = "Select A Package!"
        }

        setErrors(newErrors) // Passing Errors To Main Error Object
        console.log(newErrors)
        return Object.keys(newErrors).length === 0 ;
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!validateForm()) {  // Will Call The Validate Function Before Data Submission
            return;
        }

        console.log("API Step")
        try {
         
        const response = await axios.post('http://localhost:3001/user/register', registerData, {
            headers :{
                'Content-Type ' : 'application/json',
            },

             // axios does not require declaring body for payload
        })

        const responseData = await response.data;

        if(responseData.success && responseData.token) {
            setSuccessMessage("Registration successful!");
            localStorage.setItem('token', responseData.token)
            localStorage.setItem('user_id', responseData.user_id)
            setIsAuthenticated(true)
        }
        
        console.log("Registration Response:", response.data);



        }  catch (error) {
            console.log(error)
            setErrors ((prevData) => ({
                ...prevData,
                api: "Failed To Register. Please Try Again"
            }))
        }

    }


    return (
        <div className="userRegister-page">
            <h2>GET YOUR ALPHA CONNECT HUB</h2>
            <div className="packages">
                {packageDetails && <h3>{packageDetails.package}</h3>}
            </div>
            <form onSubmit={handleSubmit} className="userRegister-form">

                <label htmlFor="name">Name:</label>
                <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                />
                <br/>

                {errors.name && <p className="error">{errors.name}</p>}
                

                <label htmlFor="email">Email:</label>
                <input 
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                 />

                <br/>

                {errors.email && <p className="error">{errors.email}</p>}

                <label htmlFor="recoveryEmail">Recovery Email:</label>
                <input 
                type="email"
                name="recovery_email"
                value={registerData.recovery_email}
                onChange={handleChange}
                placeholder="Enter Recovery Email"
                 />

                 <br/>

                 { errors.recoveryEmail && <p className="error">{errors.recoveryEmail}</p>}

                <label htmlFor="password">Password:</label>
                <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleChange}
                placeholder="Type A Strong Password"
                />

                <br/>

                {errors.password && <p className="error">{errors.password}</p>}

                <label htmlFor="package">Package:</label>
                <select name="package" onChange={handlePackage}>
                    <option value="">Select A Package</option>
                    <option value="Basic">Free (Basic)</option>
                    <option value="Connect Plus">Paid (Connect +)</option>
                    <option value="Connect Ultra Plus">Paid (Connect Ultra +)</option>
                </select>

                {errors.package && <p className="error">{errors.package}</p>}


                <button type="submit">Register</button>
            </form>
            {succesMessgae && <p className="success">{succesMessgae}</p>}
            {errors.api && <p className="error">{errors.api}</p>}
        </div>
    )
}

export default UserReg;