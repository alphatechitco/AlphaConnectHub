import React, { useEffect, useState } from "react";
import './Intro.css'
import Logo from './assets/AlphaConnectLogo.png'



const Intro = ({setSelectedComponent}) =>{

    return (

        <div className="intro-page">
            <div className="intro-header">
            <h1>A L P H A -  C O N N E C T - H U B</h1>

            <div className="login-work">
            <button onClick={() => setSelectedComponent("Login")}>Login</button>
            </div>

            <img src={Logo} alt="" className="intro-logo"/>

            <div className="process">
                <nav>
                    <button onClick={()=>setSelectedComponent("Register")} className="register-button">
                     Register For Alpha Connect
                    </button>
                    <button onClick={()=>setSelectedComponent("About")}>
                     About Alpha Connect
                    </button>
                </nav>
            </div>

            </div>

            <div className="greet">
                <h2>Want To Control The Smart Devices Around You?</h2>
                <br/>
                <p>-- Alpha Connect Allows You To Do So</p>
            </div>

           
            

        </div>
    )
}



export default Intro;


