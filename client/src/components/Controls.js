import axios from "axios";
import React, { useEffect, useState } from "react";

const Controls = () => {
    const [powerState, setPowerState] = useState("OFF"); // Default state
    const [operationState, setOperationState] = useState(false); // Default state
    const [buttonMessage, setButtonMessage] = useState({});
    const [deviceState, setDeviceStates] = useState({});
    const [fetchState, setFetchState] = useState(true);

    // Effect to handle power state changes
    useEffect(() => {
        const changePower = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:3002/power/changeState`,
                    {
                        state: powerState,
                        opState: operationState,
                    }
                );
                setButtonMessage({ power: response.data.message });
                console.log("Power State Changed to:", response.data);
            } catch (error) {
                console.error("Error changing power state:", error);
            }
        };
        changePower();
    }, [powerState]);

    // Effect to handle operation state changes
    useEffect(() => {
        const changeOperationState = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:3002/operation/changeState`,
                    {
                        opState: operationState,
                    }
                );

                console.log("Operation State Changed to:", response.data);
            } catch (error) {
                console.error("Error changing operation state:", error);
            }
        };
        changeOperationState();
    }, [operationState]);

    useEffect(() => {
        const fetchStates = async () => {
            const response = await axios.get(
                "http://localhost:3002/devices/status"
            );

            setDeviceStates({
                power: !response.data.power ? "OFF" : "ON",
                operation: !response.data.operation ? "OFF" : "ON",
            });
        };
        fetchStates();
        setFetchState(false);
    }, [fetchState]);

    // Toggle functions
    const togglePowerState = () => {
        setPowerState((prevState) =>
            prevState === "ON" ? "OFF" : "ON"
        );
    };

    const toggleOperationState = () => {
        setOperationState((prevState) => !prevState);
    };

    return (
        <div style={styles.container}>
            <div style={styles.statusPanel}>
                <div style={styles.statusRow}>
                    <div
                        style={{
                            ...styles.statusIndicator,
                            backgroundColor: deviceState.power === "ON" ? "green" : "red",
                        }}
                    ></div>
                    <p>Power: {deviceState.power}</p>
                </div>
                <div style={styles.statusRow}>
                    <div
                        style={{
                            ...styles.statusIndicator,
                            backgroundColor: deviceState.operation === "ON" ? "green" : "red",
                        }}
                    ></div>
                    <p>Operation: {deviceState.operation}</p>
                </div>
            </div>

            <div style={styles.controls}>
                <button
                    style={{
                        ...styles.button,
                        backgroundColor: powerState === "ON" ? "red" : "green",
                    }}
                    onClick={togglePowerState}
                >
                    {powerState === "ON" ? "Turn OFF Power" : "Turn ON Power"}
                </button>
                <button
                    style={{
                        ...styles.button,
                        backgroundColor: operationState ? "red" : "green",
                    }}
                    onClick={toggleOperationState}
                >
                    {operationState ? "Stop Operation" : "Start Operation"}
                </button>
            </div>

            <div style={styles.logPanel}>
                <p><strong>Log:</strong> {buttonMessage.power || "No updates yet"}</p>
                <button
                    style={styles.refreshButton}
                    onClick={() => setFetchState(true)}
                >
                    Refresh Status
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "400px",
        margin: "auto",
    },
    statusPanel: {
        marginBottom: "20px",
    },
    statusRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
    },
    statusIndicator: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        marginRight: "10px",
    },
    controls: {
        marginBottom: "20px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        margin: "5px",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    logPanel: {
        marginTop: "20px",
    },
    refreshButton: {
        padding: "10px 20px",
        fontSize: "14px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Controls;
