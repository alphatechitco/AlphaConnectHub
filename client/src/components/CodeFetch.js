const { default: axios } = require("axios");
const { useState } = require("react");



const CodeFetch = ({selectedDevice, authentication}) => {

    const [codeTemplate, setCodeTemplate] = useState('');

    const fetchCode = async (device_type) => {
        try {
            const response = await axios.get(`http://localhost:3001/code/FetchCode?device_type=${device_type}`);
            setCodeTemplate(response.data);

            
        } catch (error) {
            console.error("Error While Fetching Code, ", error);
        }
    }

    const downloadCode = async (selectedDevice, authentication) => {
        const code = await fetchCode(selectedDevice.device_type);
        let activeCode = code.repa
        const blob = new Blob([code], { type: "text/cpp" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${device.device_name}_config.cpp`;
        link.click();
      };



    return (
        <div>

        </div>
    )
}

export default CodeFetch;
