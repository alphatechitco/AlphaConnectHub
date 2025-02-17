import './App.css';
import Devices from './components/Devices';
import Intro from './components/Intro';
import UserReg from './components/UserReg';
import Sidebar  from './components/StaticComponents/Sidebar';
import Header from './components/StaticComponents/Header';
import React, { useState, useEffect } from 'react';
import UserLogin from './components/UserLogin';
import logo from './components/assets/AlphaConnectLogo.png'
import GetServerAccess from './components/GetServerAccess'
import AddDevice from './components/AddDevice';
import ProfileForm from './components/Profiles';


function App() {
  const [selectedComponent, setSelectedComponent] = useState(
    sessionStorage.getItem('selectedComponent') || ''
  );   // Track the selected component
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user_id, setUser_id] = useState(
    localStorage.getItem('user_id')
  );


  const [logoutFlag, setLogoutFlag] = useState(false);
  const [workSpaceState, setWorkSpaceState] = useState(false);
  const [selectedProfile,setSelectedProfile] = useState("")
  console.log(selectedProfile)


  // Persist state changes to localStorage
  useEffect (() => {
    sessionStorage.setItem('selectedComponent', selectedComponent)
    localStorage.setItem('isAuthenticated', isAuthenticated)
  }, [selectedComponent, isAuthenticated])

  useEffect(() => {

  })

  useEffect (() => {
    if(logoutFlag) {
      sessionStorage.removeItem('selectedComponent')
      console.log("LogOutttttt", logoutFlag)
      setSelectedComponent("")
    }
  }, [logoutFlag])
  // Define a function to render the selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Devices':
        return <Devices setSelectedComponent = {setSelectedComponent} profile_id={selectedProfile} setIsAuthenticated={setIsAuthenticated} setLogoutFlag={setLogoutFlag} />;
      case 'Add Device':
        return <AddDevice profile_id={selectedProfile} setSelectedComponent={setSelectedComponent} setIsAuthenticated={setIsAuthenticated}/>;
      case 'Profiles':
        return <ProfileForm setSelectedComponent={setSelectedComponent}/>;
      case 'Register':
        return <UserReg setIsAuthenticated = {setIsAuthenticated} setSelectedComponent={setSelectedComponent}/>
      case 'Login':
        return <UserLogin setIsAuthenticated = {setIsAuthenticated} setSelectedComponent={setSelectedComponent}/>
      case 'Get Server Access':
        return <GetServerAccess selectedProfile={selectedProfile} setSelectedComponent={setSelectedComponent} />
      default:
        return <Intro setSelectedComponent={setSelectedComponent} />;
    }
  };

  const isIntroOrRegister = selectedComponent === '' || 
  selectedComponent === 'Register' || 
  selectedComponent === 'Login' ||
  selectedComponent === 'About'

  return (
    <div className="App">
      {!isIntroOrRegister && isAuthenticated && <Header />}

      <div className="App-container">

         {/* Right Column: Interal Navigation Options */}
         {!isIntroOrRegister && isAuthenticated && (  // Checking State Of Authentication Param (Variables)
        <Sidebar setSelectedComponent={setSelectedComponent} setLogoutFlag={setLogoutFlag} setSelectedProfile={setSelectedProfile} setWorkSpaceState={setWorkSpaceState}/>
        )}
        {/* Center Panel: Render Selected Component */}
        <div className="App-main">
          {renderComponent()}
        </div>

        

        {/* App Main Components -- Presenting Render Component For Main App Options */}
        
      </div>

      <footer>
        <p>© 2025 <a href="">Alpha Connect Hub</a> - Owned and Developed by <a href="https://alphatechitco.netlify.app/">AlphaTech</a></p>
        <p><a href="https://alphatechitco.netlify.app/">About Us</a> | <a href="https://www.instagram.com/alphatechltdco?igshid=MWtjanJrNzhmZjcx&utm_source=qr">Contact</a></p>
        
    </footer>
    </div>
  );
}

export default App;
