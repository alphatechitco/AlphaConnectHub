import React, { useState } from 'react';
import axios from 'axios'; // If you're using an API
import './Profiles.css';

const ProfileForm = () => {
  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem('user_id');

    const profileData = {
      profile_name: profileName,
      description: description,
      user_id: user_id  // Replace with actual user ID
    };

    try {
      // Send data to backend API
      const response = await axios.post('http://localhost:3001/profile/addProfile', profileData);
      
      if (response.status === 200) {
        setMessage('Profile created successfully!');
        setProfileName('');
        setDescription('');
      } else {
        setMessage('Failed to create profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the profile.');
    }
  };

  return (
    <div className="profile-form-container" >
      <p><strong>Profiles Allows U To Have Individuality And Organized Listing Of <br/> Devices To Manage Your Devices Easily</strong></p>
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

        <label >Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this profile"
        />

        <button type="submit">Create Profile</button>
      </form>
      {message && <p className='message'>{message}</p>}
    </div>
  );
};



export default ProfileForm;
