import React, { useState, useEffect } from 'react';
import axios from 'axios'; // If you're using an API
import './Profiles.css';

const ProfileForm = ({ setSelectedComponent }) => {
  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [profiles, setProfiles] = useState([]); // State for managing profiles

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:3001/protected/protected-route', { withCredentials: true });

        if (response.data.success) {
          setIsAuthenticated(true);
          setUser_id(response.data.user_id);
          fetchProfiles(response.data.user_id);
        } else {
          setIsAuthenticated(false);
          setSelectedComponent("");
          setUser_id(null);
        }
      } catch (error) {
        console.error("Auth verification failed,", error);
        setIsAuthenticated(false);
        setUser_id(null);
      }
    };
    checkAuthentication();
  }, []);

  // Fetch user profiles
  const fetchProfiles = async (user_id) => {
    if (!user_id) return; // Wait until user_id is available

    try {
        const response = await axios.get(`http://localhost:3001/profile/getProfiles?user_id=${user_id}`, {  });
        const responseData = response.data;

        if (responseData.success) {
            setProfiles(responseData.profiles);
          

            if (responseData.profiles.length > 0) {
                const firstProfile = responseData.profiles[0];
            }
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }
};

  // Handle profile creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Adding New Profile...');
    const profileData = {
      profile_name: profileName,
      description: description,
      user_id: user_id
    };

    try {
      const response = await axios.post('http://localhost:3001/profile/addProfile', profileData);

      if (response.status === 200) {
        setMessage('Profile created successfully!');
        setProfileName('');
        setDescription('');
        fetchProfiles(user_id); // Refresh profiles
      } else {
        setMessage('Failed to create profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the profile.');
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async (profile_id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;

    try {
      const response = await axios.delete(`http://localhost:3001/profile/deleteProfile/${profile_id}`);

      if (response.data.success) {
        setMessage("Profile deleted successfully!");
        setProfiles(profiles.filter((profile) => profile.profile_id !== profile_id));
      } else {
        setMessage("Failed to delete profile.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      setMessage("An error occurred while deleting the profile.");
    }
  };

  return (
    <div className="profile-form-container">
      <p><strong>Profiles allow you to have individuality and an organized listing of devices to manage them easily.</strong></p>
      <h2>Create a New Profile</h2>
      <form onSubmit={handleSubmit} className='form'>
        <label>Profile Name:</label>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="Enter profile name"
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this profile"
        />

        <button type="submit">Create Profile</button>
      </form>
      {message && <p className='message'>{message}</p>}

      <h2>Your Profiles</h2>
      <ul className="profile-list">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <li key={profile.profile_id}>
              <strong>{profile.profile_name}</strong>: {profile.description}
              <button className="delete-btn" onClick={() => handleDeleteProfile(profile.profile_id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No profiles found.</p>
        )}
      </ul>
    </div>
  );
};

export default ProfileForm;
