import axios from "axios";
import React, { useEffect, useState } from "react";
import './GetServerAccess.css';

const GetServerAccess = ({ selectedProfile,setSelectedComponent}) => {
    const [connectionCred, setConnectionCred] = useState({ username: "", password: "" });
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [user_id, setUser_id] = useState(null);
    const [activeCreds, setActiveCreds] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [resetPrompt, setResetPrompt] = useState(false);
    const [showCreds, setShowCreds] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConnectionCred((prevData) => ({ ...prevData, [name]: value }));
    };
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

    useEffect(() => {
        if (showCreds) {
            const fetchCreds = async () => {
                const profile_id = selectedProfile;
                const creds_mode = 'DS';
                try {
                    const response = await axios.post("http://localhost:3001/mqtt/get-details", { user_id, profile_id, creds_mode });
                    setActiveCreds(response.data.creds);
                } catch (error) {
                    console.error("Error fetching credentials:", error);
                }
            };
            fetchCreds();
        }
    }, [showCreds, selectedProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("Authenticating With Server...");
        try {
    
            if (!user_id) {
                alert("Login Expired! Please log in again.");
                return;
            }

            const submissionData = {
                ...connectionCred,
                user_id,
                selectedProfile
            };

            const response = await axios.post(
                'http://localhost:3001/mqtt/register-client',
                submissionData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setSuccessMessage("Device Authentication Successful! Your credentials are now active.");
                setShowCreds(true);
            } else {
                setSuccessMessage("Authentication Failed. Try Again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setSuccessMessage("An error occurred during authentication.");
        }
    };

    const handleResetPassword = async (reg_id) => {
        try {
            const response = await axios.put(`http://localhost:3001/mqtt/reset-cred/${reg_id}`, { password: newPassword });
            if (response.data.reset) {
                setSuccessMessage("Password Reset Successfully!");
            }
        } catch (error) {
            console.error("Error resetting credential:", error);
        }
    };

    return (
        <main className="server-access-container">
            <section className="info-section">
                <h2>🔗 Get Server Access & Connect Your Device</h2>
                <p>
                    By obtaining server access, you will receive a **Username** and **Password** that will allow your IoT device to
                    connect securely to the **AlphaConnectHub Server**. Once connected, your device can **send real-time data** and view **live data streams**.
                </p>

                <h3>📌 Steps to Connect Your Device:</h3>
                <ul>
                    <li>1️⃣ Create a **Username** and **Password** using the form given.</li>
                    <li>2️⃣ Register your credentials to activate server access.</li>
                    <li>3️⃣ Use the credentials in your device’s MQTT/IoT configuration.</li>
                    <li>4️⃣ Start sending and monitoring real-time data instantly!</li>
                </ul>
            </section>

            <div className="cred-container">
                <button className="show-auth-btn" onClick={() => setShowCreds(true)}>🔍 Show My Credentials</button>

                {showCreds && activeCreds.length > 0 && (
                    <div className="active-creds">
                        <h3>🔐 Active Credentials:</h3>
                        <ul>
                            {activeCreds.map((cred) => (
                                <li key={cred.reg_id} className="cred-item">
                                    <strong>Username:</strong> {cred.username} <br />
                                    <strong>Password:</strong> *********  
                                    <button className="reset-btn" onClick={() => setResetPrompt(true)}>🔄 Reset Password</button>

                                    {resetPrompt && (
                                        <div className="reset-box">
                                            <input
                                                type="password"
                                                name="newpassword"
                                                placeholder="Type New Password"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button onClick={() => handleResetPassword(cred.reg_id)}>Confirm Reset</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form className="cred-set" onSubmit={handleSubmit}>
                    <h3>🛠 Create Your Device Credentials</h3>
                    <label>Set Username:</label>
                    <input
                        name="username"
                        type="text"
                        value={connectionCred.username}
                        onChange={handleChange}
                        placeholder="Enter Username"
                    />

                    <label>Password:</label>
                    <input
                        name="password"
                        type="password"
                        value={connectionCred.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                    />

                    <button type="submit">🚀 Register & Connect</button>
                    <p id="successMessage">{successMessage}</p>
                </form>
            </div>
        </main>
    );
};

export default GetServerAccess;
