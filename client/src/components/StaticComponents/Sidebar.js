import React from "react";

const Sidebar = ({setSelectedComponent, setLogoutFlag}) =>{
    
    return (
        <div className="sidebar-component">
        <div className="App-sidebar">
        <h3>Dashboard</h3>
        <ul>
            <li onClick={() => setSelectedComponent('Devices')}>Devices</li>
            <li onClick={() => setSelectedComponent('Add Device')}>Add Device</li>
            <li onClick={() => setLogoutFlag(true)}>Log out</li>
        </ul>
        </div>
        </div>
    )
}

export default Sidebar;