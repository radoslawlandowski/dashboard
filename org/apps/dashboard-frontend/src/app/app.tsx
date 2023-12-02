// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {
  HardwareDashboardModuleTypes
} from "../../../hardware-dashboard-bridge/src/app/contract/events/hardware-dashboard-event";
import CommandInputComponent from "./command-input.component";
import StyledGauge from "./styled-gauge";
import DockerRestartContainerComponent from "./docker-restart-container.component";
import ConnectToDashboardComponent from "./connect-to-dashboard.component";

export interface HardwareDashboardEvent<T> {
  moduleType: HardwareDashboardModuleTypes
  moduleIdentifier: string
  payload: T
  timestamp: string
}

export interface DigitalPinData {
  pin: number
  value: number
}

export function App() {
  const DigitalRead = ({isRed, pin}: any) => {
    const style = {
      backgroundColor: isRed ? "red" : "green",
      width: '100px',
      height: '100px',
      borderRadius: '50%'
    }

    return (
      <div>
        <div>
          <p>Pin: {pin}</p>
        </div>
        <div style={style}></div>
      </div>
    );
  };

  const [isRed, setIsRed] = useState(true);
  const [messages, setMessages] = useState<HardwareDashboardEvent<any>[]>([]);
  const [digitalPinData, setDigitalPinData] = useState< {[p:number]: DigitalPinData}>({2: {pin: 2, value: 0}});
  const [analogPinData, setAnalogPinData] = useState< {[p:number]: DigitalPinData}>({0: {pin: 0, value: 0}});

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Replace with your server URL

    socket.on('message', (data: HardwareDashboardEvent<any>) => {
      setIsRed(data.payload.value === 0)

      setMessages((prevState: HardwareDashboardEvent<any>[]) => [data, ...prevState].slice(0, 10));

      switch(data.moduleType) {
        case HardwareDashboardModuleTypes.DigitalPin: {
          const digitalPinModuleData =  {
              pin: Number(data.moduleIdentifier),
              value: Number(data.payload.value),
          };

          setDigitalPinData((prevState: { [p:number]: DigitalPinData }) => {
            const newState = {...prevState}

            newState[Number(data.moduleIdentifier)] = digitalPinModuleData

            return newState
          })
        }
        case HardwareDashboardModuleTypes.AnalogPin: {
          const digitalPinModuleData =  {
              pin: Number(data.moduleIdentifier),
              value: Number(data.payload.value),
          };

          setAnalogPinData((prevState: { [p:number]: DigitalPinData }) => {
            const newState = {...prevState}

            newState[Number(data.moduleIdentifier)] = digitalPinModuleData
            console.log(newState)

            return newState
          })
        }
      }

    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const divStyle = {
    border: '2px solid #4CAF50', // You can adjust the border style as needed
    padding: '10px',
  };

  return (
    <div>
      <div style={divStyle}>
        <ConnectToDashboardComponent/>
      </div>
      <div style={divStyle}>
        <DockerRestartContainerComponent/>
      </div>
      <div style={divStyle}>
        <CommandInputComponent/>
      </div>
      <div style={divStyle}>
        <div>
          {Object.values(digitalPinData).map((data: DigitalPinData, index: number) => (
            <DigitalRead isRed={data.value === 0} pin={data.pin} />
          ))}
        </div>
      </div>

      <div style={divStyle}>
        <div>
          {Object.values(analogPinData).map((data: DigitalPinData, index: number) => (
            <p>Pin: {data.pin}, Value: {data.value}</p>
          ))}
        </div>
      </div>



      <div>
        {messages.map((message: HardwareDashboardEvent<any>, index: number) => (
          <p key={index}>Date: '{message.timestamp}': Module Type: '{message.moduleType}' - Module Identifier: '{message.moduleIdentifier}' - Payload: {JSON.stringify(message.payload)} </p>
        ))}
      </div>
    </div>
  );
}

export default App;
