import './App.css';
import Devices from './components/Devices';
import Register from './components/Register';
import Intro from './components/Intro';
import UserReg from './components/UserReg';
import Sidebar  from './components/StaticComponents/Sidebar';
import Header from './components/StaticComponents/Header';
import React, { useState } from 'react';
import UserLogin from './components/UserLogin';
import logo from './components/assets/AlphaConnectLogo.png'

function App() {
  const [selectedComponent, setSelectedComponent] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Track the selected component

  // Define a function to render the selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Devices':
        return <Devices />;
      case 'Add Device':
        return <Register />;
      case 'Register':
        return <UserReg setIsAuthenticated = {setIsAuthenticated} setSelectedComponent={setSelectedComponent}/>
      case 'Login':
        return <UserLogin setIsAuthenticated = {setIsAuthenticated} setSelectedComponent={setSelectedComponent}/>
      default:
        return <Intro setSelectedComponent={setSelectedComponent} />;
    }
  };

  const isIntroOrRegister = selectedComponent === '' || selectedComponent === 'Register' || selectedComponent === 'Login'

  return (
    <div className="App">
      {!isIntroOrRegister && isAuthenticated && <Header />}

      <div className="App-container">

         {/* Right Column: Interal Navigation Options */}
         {!isIntroOrRegister && isAuthenticated && (  // Checking State Of Authentication Param (Variables)
        <Sidebar setSelectedComponent={setSelectedComponent}/>
        )}
        {/* Center Panel: Render Selected Component */}
        <div className="App-main">
          {renderComponent()}
        </div>

        

        {/* App Main Components -- Presenting Render Component For Main App Options */}
        
      </div>
    </div>
  );
}

export default App;
