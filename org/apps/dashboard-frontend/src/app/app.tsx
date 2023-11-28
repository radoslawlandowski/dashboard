// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {useEffect, useState} from "react";
import {
  HardwareDashboardModuleTypes
} from "../../../hardware-dashboard-bridge/src/app/contract/hardware-dashboard-event";

export interface HardwareDashboardEvent<T> {
  moduleType: HardwareDashboardModuleTypes
  moduleIdentifier: string
  payload: T
}

export function App() {
  const ColorSwitcher = ({isRed}: any) => {
    const color = isRed ? 'red' : 'green';

    return (
      <div style={{color}}>
        {isRed ? 'Red' : 'Green'} Text
      </div>
    );
  };

  const [isRed, setIsRed] = useState(true);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch data from your API endpoint
    fetch('http://localhost:3000/api/hardware-dashboard-bridge/data/last')
      .then(response => response.json())
      .then((data: HardwareDashboardEvent<any>) => {
        // Assuming the API response has a property 'isRed' to determine color
        console.log(data)

        setIsRed(data.payload.value === 0)
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  const getData = () => {
    fetchData();
  };

  return (
    <div>
      <button onClick={getData}>Toggle Color</button>

      <ColorSwitcher isRed={isRed}/>
    </div>
  );
}

export default App;
