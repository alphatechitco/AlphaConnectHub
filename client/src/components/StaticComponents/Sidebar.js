import axios from "axios";
import React, { useEffect, useState } from "react";

const Sidebar = ({ setSelectedComponent, setLogoutFlag, setSelectedProfile, setWorkSpaceState }) => {
    const [profiles, setProfiles] = useState([]);
    const [activeProfile, setActiveProfile] = useState(null); // For highlighting the active profile

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const user_id = localStorage.getItem('user_id');
                console.log('UID:', user_id);

                const response = await axios.post('http://localhost:3001/profile/getProfiles', { user_id });
                const responseData = response.data;

                if (responseData.success) {
                    setProfiles(responseData.profiles);
                    setWorkSpaceState();

                    if (responseData.profiles.length>0){
                        const firstProfile = responseData.profiles[0];
                        setSelectedProfile(firstProfile.profile_id);
                        setActiveProfile(firstProfile.profile_id)
                    }
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();

        
    }, [setSelectedProfile, setWorkSpaceState]);

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
