import {useState} from "react";

const ConnectToDashboardComponent = () => {
  const handleButtonClick = () => {
    // Make a POST API request using fetch
    fetch(`http://localhost:3000/api/hardware-dashboard-bridge/connect`, {
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
      <button onClick={handleButtonClick}>Connect To Dashboard</button>
    </div>
  );
};

export default ConnectToDashboardComponent;
