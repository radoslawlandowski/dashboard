import {useState} from "react";

const DockerRestartContainerComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    // Make a POST API request using fetch
    fetch(`http://localhost:3000/api/docker/restart?containerName=${inputValue}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
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

      <label htmlFor="input-value">Container Name</label>
      <input
        type="text"
        id="input-value"
        value={inputValue}
        onChange={handleInputChange}
      />
      <p></p>

      <button onClick={handleButtonClick}>Restart</button>

    </div>
  );
};

export default DockerRestartContainerComponent;
