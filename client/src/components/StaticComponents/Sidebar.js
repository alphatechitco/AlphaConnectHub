import axios from "axios";
import React, { useEffect, useState } from "react";

const Sidebar = ({ setSelectedComponent, setLogoutFlag, setSelectedProfile, setWorkSpaceState }) => {
    const [profiles, setProfiles] = useState([]);
    const [user_id, setUser_id] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeProfile, setActiveProfile] = useState(null); // For highlighting the active profile

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get('http://localhost:3001/protected/protected-route', { withCredentials: true });

                if (response.data.success) {
                    setIsAuthenticated(true);
                    setUser_id(response.data.user_id);
                } else {
                    setIsAuthenticated(false);
                    setLogoutFlag(true);
                    setSelectedComponent("");
                    setUser_id(null);
                }
            } catch (error) {
                console.error("Auth verification failed: ", error);
                setIsAuthenticated(false);
                setSelectedComponent("");
                setLogoutFlag(false);
                setUser_id(null);
            }
        };

        checkAuthentication();
    }, []);

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user_id) return; // Wait until user_id is available

            try {
                const response = await axios.get(`http://localhost:3001/profile/getProfiles?user_id=${user_id}`, {  });
                const responseData = response.data;

                if (responseData.success) {
                    setProfiles(responseData.profiles);
                    setWorkSpaceState();

                    if (responseData.profiles.length > 0) {
                        const firstProfile = responseData.profiles[0];
                        setSelectedProfile(firstProfile.profile_id);
                        setActiveProfile(firstProfile.profile_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();
    }, [user_id, setSelectedProfile, setWorkSpaceState]); // Fetch profiles only when user_id changes

    const handleProfileClick = (profileId) => {
        setSelectedProfile(profileId);
        setActiveProfile(profileId); // Set the active profile for UI highlighting
    };

    return (
        <div className="sidebar-component">
            <div className="profiles">
                <h4>Your Profiles</h4>
                <ul>
                    {profiles.map((profile) => (
                        <li
                            key={profile.profile_id}
                            onClick={() => handleProfileClick(profile.profile_id)}
                            className={activeProfile === profile.profile_id ? 'active' : ''}
                        >
                            {profile.profile_name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="App-sidebar">
                <h3>Dashboard</h3>
                <ul>
                    <li onClick={() => setSelectedComponent('Devices')}>Devices</li>
                    <li onClick={() => setSelectedComponent('Add Device')}>Add Device</li>
                    <li onClick={() => setSelectedComponent('Profiles')}>Manage & Add Profiles</li>
                    <li onClick={() => setSelectedComponent('Get Server Access')}>Get Server Access</li>
                    <li onClick={() => setLogoutFlag(true)}>Log out</li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
