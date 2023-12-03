import {useState} from "react";

const AnalogCommandInputComponent = () => {
  const [commandName, setCommandName] = useState('SetAnalogPinHardwareDashboardCommand');
  const [inputValue, setInputValue] = useState(0);
  const [moduleIdentifier, setModuleIdentifier] = useState('3');

  const handleCommandNameChange = (event: any) => {
    setCommandName(event.target.value);
  };
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const handleModuleIdentifierChange = (event: any) => {
    setModuleIdentifier(event.target.value);
  };
  const handleButtonClick = () => {
    // Make a POST API request using fetch
    fetch('http://localhost:3000/api/hardware-dashboard-bridge/command/set-analog-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "timestamp": new Date(),
        "moduleIdentifier": moduleIdentifier,
        "payload": {
          "value": Number(inputValue)
        }
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the API response data
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const divStyle = {
    border: '2px solid #4CAF50', // You can adjust the border style as needed
    padding: '10px',
  };

  return (
    <div style={divStyle}>
      <label htmlFor="command-name">Analog Command  </label>
      <input
        type="text"
        id="command-name"
        value={commandName}
        onChange={handleCommandNameChange}
      />
      <p></p>

      <label htmlFor="module-identifier">Module Identifier  </label>
      <input
        type="text"
        id="module-identifier"
        value={moduleIdentifier}
        onChange={handleModuleIdentifierChange}
      />
      <p></p>

      <label htmlFor="input-value">Input Value  </label>
      <input
        type="number"
        id="input-value"
        value={inputValue}
        onChange={handleInputChange}
      />
      <p></p>

      <button onClick={handleButtonClick}>Send</button>

    </div>
  );
};

export default AnalogCommandInputComponent;
