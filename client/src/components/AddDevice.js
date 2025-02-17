import React, { useState, useEffect} from "react";
import axios from "axios";
import './AddDevice.css';

const AddDevice = ({profile_id, setIsAuthenticated, setSelectedComponent}) => {
    const [deviceDetails, setDeviceDetails] = useState({
        device_name: "",
        device_type: "",
        description: "",
        device_handler: ""
    });
    const [user_id, setUser_id] = useState(null);
    console.log("prof", profile_id)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            const response = await axios.get('http://localhost:3001/protected/protected-route', {withCredentials:true})
    
            if(response.data.success) {
              setIsAuthenticated(true);
              setUser_id(response.data.user_id);
            } else {
              setIsAuthenticated(false);
              setSelectedComponent("")
              setUser_id(null);
            }
          } catch (error) {
            console.error("Auth verification failed, ", error);
            setIsAuthenticated(false);
            setUser_id(null);
          }
        }
        checkAuthentication();
    }, []);

    const deviceTypes = [
        "Temperature Sensor",
        "Humidity Sensor",
        "Air Quality Sensor",
        "Motion Detector",
        "Light Sensor",
        "Gas Sensor",
        "Water Flow Sensor",
        "Vibration Sensor",
        "GPS Module",
        "Smart Plug",
        "Relay Module",
        "Other"
    ];
    const deviceHandlers = [
        "ESP-32",
        "Arduino",
        "Raspberry-Pi",
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeviceDetails((prev) => ({ ...prev, [name]: value }));
    };

    const generateMQTTTopic = () => {
        return `user/${user_id}/profile/${profile_id}/device/${deviceDetails.device_name.replace(/\s+/g, '_')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mqtt_topic = generateMQTTTopic();

        try {
            setSuccessMessage("Authenticating With Servers...");
            const response = await axios.post("http://localhost:3001/devices/reg-device", {
                ...deviceDetails,
                user_id,
                profile_id,
                mqtt_topic
            });
           

            if (response.data.result.reg) {
                setSuccessMessage("✅ Device added successfully!");
                setDeviceDetails({ device_name: "", device_type: "", description: "" });
            } else {
                setErrorMessage("❌ Failed to add device.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("❌ An error occurred while adding the device.");
        }
    };

    return (
        <div className="add-device-container">
            <h2>Add New IoT Device</h2>

            {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <label>Device Name:</label>
                <input
                    type="text"
                    name="device_name"
                    value={deviceDetails.device_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter device name"
                />

                <label>Device Type:</label>
                <select
                    name="device_type"
                    value={deviceDetails.device_type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>

                <label>Device Handler:</label>
                <select
                    name="device_handler"
                    value={deviceDetails.device_handler}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Device Handler</option>
                    {deviceHandlers.map((handler, index) => (
                        <option key={index} value={handler}>{handler}</option>
                    ))}
                </select>

                <label>Description:</label>
                <textarea
                    name="description"
                    value={deviceDetails.description}
                    onChange={handleChange}
                    placeholder="Describe the device"
                ></textarea>

                <button type="submit">Add Device</button>
            </form>
        </div>
    );
};

export default AddDevice;
