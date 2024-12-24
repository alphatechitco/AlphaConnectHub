import React, { useState } from "react";
import './Register.css';

const Register = () => {
    const [regData, setRegData] = useState({
        name: "",
        serialNumber: "",
        macAddress: "",
        ipAddress: "",
        latitude: "",
        longitude: "",
        status: "",
        deviceType: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", regData);

        // You can add API integration here, e.g., sending data to a backend server
    };

    return (
        <div className="device-register">
            
            <form id="device-form" className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={regData.name}
                    onChange={handleChange}
                    placeholder="Enter Device Name"
                />

                <label htmlFor="serialNumber">Serial Number:</label>
                <input
                    type="text"
                    name="serialNumber"
                    value={regData.serialNumber}
                    onChange={handleChange}
                    placeholder="Enter Serial Number"
                />

                <label htmlFor="macAddress">MAC Address:</label>
                <input
                    type="text"
                    name="macAddress"
                    value={regData.macAddress}
                    onChange={handleChange}
                    placeholder="Enter MAC Address"
                />

                <label htmlFor="ipAddress">IP Address:</label>
                <input
                    type="text"
                    name="ipAddress"
                    value={regData.ipAddress}
                    onChange={handleChange}
                    placeholder="Enter IP Address"
                />

                <label htmlFor="latitude">Latitude:</label>
                <input
                    type="text"
                    name="latitude"
                    value={regData.latitude}
                    onChange={handleChange}
                    placeholder="Enter Latitude"
                />

                <label htmlFor="longitude">Longitude:</label>
                <input
                    type="text"
                    name="longitude"
                    value={regData.longitude}
                    onChange={handleChange}
                    placeholder="Enter Longitude"
                />

                <label htmlFor="status">Status:</label>
                <input
                    type="text"
                    name="status"
                    value={regData.status}
                    onChange={handleChange}
                    placeholder="Enter Status"
                />

                <label htmlFor="deviceType">Device Type:</label>
                <input
                    type="text"
                    name="deviceType"
                    value={regData.deviceType}
                    onChange={handleChange}
                    placeholder="Enter Device Type"
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
