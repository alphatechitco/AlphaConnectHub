import React, { useState, useEffect } from "react";
import './Devices.css';
import axios from 'axios';
import { io } from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CodeFetch from "./CodeFetch";


const socket = io("http://localhost:3001"); // Establish the connection once globally

const Devices = ({ setSelectedComponent, profile_id, setIsAuthenticated,setLogoutFlag}) => {
  const [user_id, setUser_id] = useState("")
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [codeTemplate, setCodeTemplate] = useState('');
  const [mqtt, setMQTT] = useState(true)
  const [operationData, setOperationData] = useState([]);
  const [authentication, setAuthentication] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [liveData, setLiveData] = useState(false);
  const [dataBaseMode, setDataBaseMode] = useState(false);
  const [mongodbData, setMongodbData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [codeProcess, setCodeProcess] = useState(false);


  // Fetch devices and authentication details
  const closeConnection = async () => {
    const response = await axios.post("http://localhost:3001/mqtt/disconnect-mqtt");
    if(response.data.close === true){
      setOperationData([{message:"Operational Data Closed. View Collected Data from Database or Restart MQTT"}])
    }
    
  }

  useEffect(() => {
    const fetchDataBaseData = async (device) => {
      const response = await axios.get(`http://localhost:3001/mqtt/get-mqtt-mongodb?topic=${device.mqtt_topic}`);

      const responseData = response.data;
      setMongodbData(responseData);
    
    }
    if(selectedDevice){
      fetchDataBaseData(selectedDevice);
    }
  }, [dataBaseMode])


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:3001/protected/protected-route', {withCredentials:true})

        if(response.data.success) {
          setIsAuthenticated(true);
          setUser_id(response.data.user_id);
        } else {
          setIsAuthenticated(false);
          setLogoutFlag(true);
          setSelectedComponent("")
          setUser_id(null);
        }
      } catch (error) {
        console.error("Auth verification failed, ", error);
        setIsAuthenticated(false);
        setSelectedComponent("")
        setLogoutFlag(false);
        setUser_id(null);
      }
    }
    checkAuthentication();
}, []);
  useEffect (() => {
   if (!mqtt) {
    closeConnection();
   }

  }, [mqtt])
  useEffect(() => {
    console.log("Updated Devices:", devices);
  }, [devices]); // This ensures you see the latest devices state
  
  useEffect(() => {
    const fetchDevices = async () => {
      if (!profile_id || !user_id) return;
      try {
        console.log("Attached Prof", profile_id)
        const response = await axios.get(`http://localhost:3001/devices/get-devices?profile_id=${profile_id}&_=${new Date().getTime()}`);
        if(response.data){
          console.log("Devices Fetch")
          setDevices([]);
          setDevices(response.data.result.result);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    

    const fetchConnectionDetails = async () => {
      if (!profile_id || !user_id) return;
      if (profile_id && user_id) {
        try {
          const response = await axios.post("http://localhost:3001/mqtt/get-details", {
            user_id,
            profile_id,
            creds_mode: 'DS'
          });
          const creds = response.data?.creds?.[0];
          if (creds) setAuthentication(creds);
        } catch (error) {
          console.error("Error fetching authentication details:", error);
        }
      }
    };

    fetchDevices();
    fetchConnectionDetails();
  }, [profile_id, user_id]);

  // Handle MQTT messages
  useEffect(() => {
    socket.on("mqtt_message", (data) => {
      console.log("MQTT Message Received:", data);
      setOperationData((prevData) => [...prevData, data]);
    });

    // Cleanup socket listener on unmount
    return () => {
      socket.off("mqtt_message");
    };
  }, []);

  // Debugging: Log updates when operationData changes
  useEffect(() => {
    console.log("Updated Operational Data:", operationData);
  }, [operationData]);

  const handleDeviceDeletion = async (device_id) => {

    const response = await axios.delete(`http://localhost:3001/devices/delete-device/${device_id}`);

    if(response.data.delete) {
      alert("Device Deleted Refresh Your Page!")
    } else {
      alert("Could Not Delete!")
    }
  }

  // Fetch operational data after authentication
  const connectMQTTServer = async () => {
    if (!username || !password) {
      alert("Please enter your credentials.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/mqtt/connectClient", {
        user_id,
        profile_id,
        password,
      });

      if (response.data.auth) {
        setIsAuthModalOpen(false);
        alert("Successfully authenticated and subscribed to MQTT!");
      } else {
        alert("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error fetching operational data:", error);
      alert("An error occurred while fetching operational data.");
    }
  };

  // Fetch operational data after authentication
  const fetchOperationalData = async () => {
    if (!username || !password) {
      alert("Please enter your credentials.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/mqtt/subscribeData", {
        profile_id,
        device_id: selectedDevice.device_id,
      });

      if (response.data.auth) {
        alert("Successfully authenticated and subscribed to MQTT!");
      } else {
        alert("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error fetching operational data:", error);
      alert("An error occurred while fetching operational data.");
    }
  };

  
  
  return (
    <div className="deviceTab">
      <div className="deviceList">
        <h2>Devices</h2>
        <button onClick={() => setMQTT(false)}>Turn Off MQTT</button>
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

      <div className="deviceDetails">
        {selectedDevice ? (
          <div>
            <h3>{selectedDevice.device_name}</h3>
            <p><strong>MAC:</strong> {selectedDevice.mac_address}</p>
            <p><strong>IP:</strong> {selectedDevice.ip_address}</p>
            <p><strong>Status:</strong> {selectedDevice.status}</p>
            <p><strong></strong></p>
            <button onClick={() => setCodeProcess(true)}>Get Connection Code(.cpp)</button>
            {codeProcess && selectedDevice &&
            <CodeFetch selectedDevice={selectedDevice} authentication={authentication}/>

            }
            <h3>Note!!!</h3>
            <p><strong>Review Your Code</strong> Before Uploading To Your IoT Device.</p>
            <p><strong>Use Suggested IDE Platform IDE / Arduino IDE</strong> To Upload The Code To IoT Device.</p>
            <p>Also, <strong>Make Sure You Have The Correct Board And Port Selected</strong></p>
            
            <button onClick={() => setIsAuthModalOpen(true)}>Connect To MQTT Server</button>
            <button onClick={() => fetchOperationalData(true)}>View Live Operational Data</button>
            <button onClick={() => setDataBaseMode(true)}>View Collected Data</button>
            <button onClick={() => handleDeviceDeletion(selectedDevice.device_id)}>Delete Device</button>
          </div>
        ) : (
          <p>Select a device to view details</p>
        )}
      </div>

      {dataBaseMode && (
  <div className="databasemode">
    <h2>Collected Data</h2>
    
    {mongodbData.length > 0 ? (
      <>
        {/* Graph */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mongodbData.slice(-10)}> {/* Show only last 10 */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide={true} /> {/* Hide timestamp for clarity */}
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="data" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        {/* Limited Data List */}
        <div className="dataList">
          {mongodbData.slice(-10).map((data, index) => (
            <div key={index} className="dataRow">
              <p><strong>Timestamp:</strong> {data.timestamp}</p>
              <p><strong>Temperature:</strong> {data.data}</p>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p>Loading Data...</p>
    )}
  </div>
)}
      {isAuthModalOpen && (
        <div className="authModal">
          <h3>Authentication Required</h3>
          <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </form>
          <button onClick={connectMQTTServer}>Authenticate</button>

          <button onClick={() => setIsAuthModalOpen(false)}>Cancel</button>
        </div>
      )}

      <div className="operationData">
        <h3>Operational Data</h3>
        {operationData.length > 0 ? (
          <div className="dataContainer">
            {operationData.map((data, index) => (
              <div key={index} className="dataRow">
                <p>{data.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No Live operational data available...Check IoT Device</p>
        )}
      </div>
    </div>
  );
};

export default Devices;
