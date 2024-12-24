import React,{useState, useEffect} from "react";
import './Devices.css';
import axios from 'axios'; // Axios To Call APIs


const Devices = ()=>{
    const [devices, setDevices] = useState([])  // Use State To Assign Data
    const [selectedDevice, setSelectedDevice] = useState(null)


    // Fetch Devices
    useEffect(() =>{ // use Effect To trigger Functionalities (Device Fetch)

        const fetchDevices = async () => { // Async Nature Fetch Devices Function
            try {
        const response = await axios.get("http://localhost:3001/devices/get-devices")  // Devices Data 
        setDevices(response.data)
        } catch (error) {
            console.error("Error fetching devices:", error)
        }
        };
        fetchDevices() // Function Call
    }, []) // Empty Dependencies To Trigger Seamlessly

    return (
        <div className="deviceTab">
            {/* Left Pannel: List Of Devices */}
            <div className="deviceList">
                <h2>Devices:</h2>
                <ul>
                    {devices.map((device)=>{
                        <li 
                        key={device.device_id}
                        onClick={()=>setSelectedDevice(device)}
                        className={selectedDevice?.device_id === device.device_id ? "active": ""}
                        >
                            {device.name}
                        </li>
                    })}
                </ul>
            </div>
            {/* Centre Pannel */}
            <div className="deviceDetails">
                {selectedDevice ? (
                    <div>
                        <h3>Device Details</h3>
                        <p><strong>Name:</strong>{selectedDevice.device_name}</p>
                        <p><strong>Serial Number:</strong>{selectedDevice.serial_number}</p>
                        <p><strong>Mac Address</strong>{selectedDevice.mac_addresss}</p>
                        <p><strong>IP Address:</strong>{selectedDevice.ip_address}</p>
                        <p><strong>Status:</strong>{selectedDevice.status}</p>
                        <p><strong>Last Active</strong>{new Date(selectedDevice.last_active).toLocaleString()}</p>
                        <p><strong>Type:</strong>{selectedDevice.device_type}</p>
                        <p><strong>Location:</strong>
                        {selectedDevice.latitude && selectedDevice.longitude
                        ? `Lat: ${selectedDevice.latitude} , Long: ${selectedDevice.longitude}
                        ` : `No Location Data`
                        }
                        </p>
                        </div>
                ): (
                    <p>Select A Device To View Details</p>
                )}
            </div>
        </div>
    )
}

export default Devices;


