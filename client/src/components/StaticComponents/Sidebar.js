import React from "react";

const Sidebar = ({setSelectedComponent}) =>{
    
    return (
        <div className="sidebar-component">
        <div className="App-sidebar">
        <h3>Modules</h3>
        <ul>
            <li onClick={() => setSelectedComponent('Devices')}>Devices</li>
            <li onClick={() => setSelectedComponent('Add Device')}>Add Device</li>
        </ul>
        </div>
        </div>
    )
}

export default Sidebar;