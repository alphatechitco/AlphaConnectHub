import axios from "axios";
import React, { useEffect, useState } from "react";
import './GetServerAccess.css';

const GetServerAccess = ({ selectedProfile }) => {
    const [connectionCred, setConnectionCred] = useState({ username: "", password: "" });
    const [activeCreds, setActiveCreds] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [resetPrompt, setResetPrompt] = useState(false);
    const [showCreds, setShowCreds] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConnectionCred((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (showCreds) {
            const fetchCreds = async () => {
                const profile_id = selectedProfile;
                const user_id = localStorage.getItem('user_id');
                const creds_mode = 'DS';
                try {
                    const response = await axios.post("http://localhost:3001/mqtt/get-details", { user_id, profile_id, creds_mode});
                    setActiveCreds(response.data.creds);
                    console.log("Adjusted", activeCreds)
                } catch (error) {
                    console.error("Error fetching Authentications:", error);
                }
            };
            fetchCreds();
        }
    }, [showCreds, selectedProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("Authenticating With Servers...");
        try {
            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                alert("Login Expired!");
                return;
            }

            const submissionData = {
                ...connectionCred,
                user_id: user_id,
                selectedProfile
            };

            const response = await axios.post(
                'http://localhost:3001/mqtt/register-client',
                submissionData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setSuccessMessage("Authenticated & Registered!");
                setShowCreds(true); // Refresh credentials after adding new
            } else {
                setSuccessMessage("Authentication Failed. Try Again.");
            }
        } catch (error) {
            console.error("Error", error);
            setSuccessMessage("An error occurred during authentication.");
        }
    };

    const handleDelete = async (reg_id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/mqtt/delete-cred/${reg_id}`);
            if (response.data.success) {
                setActiveCreds((prevCreds) => prevCreds.filter(cred => cred.id !== reg_id));
                setSuccessMessage("Credential Deleted Successfully!");
            }
        } catch (error) {
            console.error("Error deleting credential:", error);
        }
    };
    const handleResetPassword = async (reg_id) => {
        try {
            const response = await axios.put(`http://localhost:3001/mqtt/reset-cred/${reg_id}`, {password:newPassword});
            if (response.data.reset) {
                setActiveCreds((prevCreds) => prevCreds.filter(cred => cred.id !== reg_id));
                setSuccessMessage("Password Reset Successfully!");
            }
        } catch (error) {
            console.error("Error Reseting credential:", error);
        }
    };

    const handleUpdate = async (reg_id, updatedUsername, updatedPassword) => {
        try {
            const response = await axios.put(`http://localhost:3001/mqtt/update-cred/${reg_id}`, {
                username: updatedUsername,
                password: updatedPassword
            });
            if (response.data.success) {
                setSuccessMessage("Credential Updated Successfully!");
                setShowCreds(true); // Refresh credentials after update
            }
        } catch (error) {
            console.error("Error updating credential:", error);
        }
    };

    return (
        <main>
            <div className="cred-container">
                <button onClick={() => setShowCreds(true)}>Show My Authentications</button>

                {showCreds && activeCreds && (
                    <div className="active-creds">
                        <h3>Active Credentials:</h3>
                        <ul>
                            {activeCreds.map((cred) => (
                                <li key={cred.reg_id}>
                                    <strong>Username:</strong> {cred.username} <br />
                                    {resetPrompt && activeCreds && (
                                        <div className="reset-box">
                                        <input
                                        type="password"
                                        name="newpassword"
                                        placeholder="Type New Password"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <p id="successMessage">{successMessage}</p>
                                        <button onClick={() => handleResetPassword(cred.reg_id)}>Reset Password</button>
                                        </div>
                                    )}
                                    <strong>Password:</strong> *********  
                                    <button onClick={() => setResetPrompt(true)}>Reset Password</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form className="cred-set" onSubmit={handleSubmit}>
                    <h3>Create A Username And Password For Connecting Device</h3>
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

                    <button type="submit">Register For Connection</button>
                    <p id="successMessage">{successMessage}</p>
                </form>
            </div>
        </main>
    );
};

export default GetServerAccess;
