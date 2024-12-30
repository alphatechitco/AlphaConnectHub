import React, { useState, useEffect } from "react";
import './Devices.css';
import axios from 'axios';
import Controls from "./Controls";

const Devices = ({ setSelectedComponent, devicePower }) => {
  const [devices, setDevices] = useState([]); // Devices state
  const [selectedDevice, setSelectedDevice] = useState(null); // Selected device
  const [operationData, setOperationData] = useState([]); // Array of operational data
  const [error, setErrors] = useState({}); // Error state

  // Fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("http://localhost:3001/devices/get-devices");
        setDevices(response.data.result);
        console.log(response.data.result);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices(); // Initial fetch of devices

    const intervalId = setInterval(async () => {
      if (selectedDevice) {
        try {
          const response = await axios.get(
            `http://localhost:3001/devices/realtime/userReqOp?d_id=${selectedDevice.device_id}`
          );
          setOperationData((prevData) => [
            ...prevData.slice(-9), // Keep only the last 10 data points
            response.data.device_operation.sensorData,
          ]);
        } catch (error) {
          console.log("Error fetching operational data:", error);
        }
      }
    }, 5000); // Fetch operational data every 5 seconds

    return () => clearInterval(intervalId);
  }, [selectedDevice]);

  return (
    <div className="deviceTab">
      {/* Left Panel: List of Devices */}
      <div className="deviceList">
        <h2>Devices:</h2>
        <ul>
          {devices.map((device) => (
            <li
              key={device.device_id}
              onClick={() => setSelectedDevice(device)}
              className={selectedDevice?.device_id === device.device_id ? "active" : ""}
            >
              {device.device_name}
            </li>
          ))}
        </ul>
      </div>

      {/* Center Panel: Device Details */}
      <div className="deviceDetails">
        {selectedDevice ? (
          <div>
            <h3>Device Details</h3>
            <p><strong>Name:</strong> {selectedDevice.device_name}</p>
            <p><strong>Serial Number:</strong> {selectedDevice.serial_number}</p>
            <p><strong>Mac Address:</strong> {selectedDevice.mac_address}</p>
            <p><strong>IP Address:</strong> {selectedDevice.ip_address}</p>
            <p><strong>Status:</strong> {selectedDevice.status}</p>
            <p><strong>Last Active:</strong> {new Date(selectedDevice.last_active).toLocaleString()}</p>
            <p><strong>Type:</strong> {selectedDevice.device_type}</p>
            <p>
              <strong>Location:</strong>{" "}
              {selectedDevice.latitude && selectedDevice.longitude
                ? `Lat: ${selectedDevice.latitude}, Long: ${selectedDevice.longitude}`
                : "No Location Data"}
            </p>
            <Controls/>
          </div>

        ) : (
          <p>Select a Device to View Details</p>
        )}
      </div>

      {/* Operational Data with Animation */}
      <div className="operationData">
        <h3>Operational Data:</h3>
        {operationData.length > 0 ? (
          <div className="dataContainer">
            {operationData.map((data, index) => (
              <div key={index} className="dataRow">
                {Object.entries(data).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p>No operational data available</p>
        )}
      </div>
    </div>
  );
};

export default Devices;
