import React, { useEffect, useState } from "react";
import './Intro.css'
import {motion} from 'framer-motion'
import Logo from './assets/AlphaConnectLogo.png'

import { FaCamera, FaLightbulb, FaThermometerHalf, FaWifi, FaPlug } from 'react-icons/fa'

const devices = [
    {id:1, name:"Smart Light", icon:<FaLightbulb size={40} color="#FFD700"/>},
    {id:2, name:"Thermostat",icon:<FaThermometerHalf size={40} color="#FF5733"/>},
    {id:3, name:"Security Camera", icon:<FaCamera size={40} color="#1E90FF"/>},
    {id:4, name: "WiFi Router", icon: <FaWifi size={40} color="#00FF7F" /> },
    {id: 5, name: "Smart Plug", icon: <FaPlug size={40} color="#FF4500" /> },

]
const Intro = ({setSelectedComponent}) =>{
    const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDeviceIndex((prevIndex) => (prevIndex+1)%devices.length);
        }, 2500);
        return () => clearInterval(interval)
    }, []);

    return (

        <div className="intro-page">
             <div className="greet">
                <h2>Want To Control The Smart Devices Around You?</h2>
                <div className="device-showcase">
                <motion.div
                key={devices[currentDeviceIndex].id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="device-box"
                >
                    {devices[currentDeviceIndex].icon}
                    <p>{devices[currentDeviceIndex].name}</p>
                </motion.div>
            </div>
            <p>-- Alpha Connect Allows You To Do So</p>
            </div>

            
            <div className="intro-header">
            <img src={Logo} alt="" className="intro-logo"/>
            <h1>A L P H A -  C O N N E C T - H U B</h1>

            <div className="login-work">
                <p>Resume Your IoT Process</p>
            <button onClick={() => setSelectedComponent("Login")}>Login</button>
            </div>


            <div className="process">
            <p>New To Alpha Connect Hub?</p>
                <nav>
                    <button onClick={()=>setSelectedComponent("Register")}>
                     Register For Alpha Connect
                    </button>
    
                </nav>
            </div>

            </div>

           

           
            

        </div>
    )
}



export default Intro;


