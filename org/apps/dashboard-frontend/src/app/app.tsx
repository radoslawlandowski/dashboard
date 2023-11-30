// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {
  HardwareDashboardModuleTypes
} from "../../../hardware-dashboard-bridge/src/app/contract/events/hardware-dashboard-event";
import CommandInputComponent from "./command-input.component";

export interface HardwareDashboardEvent<T> {
  moduleType: HardwareDashboardModuleTypes
  moduleIdentifier: string
  payload: T
  timestamp: string
}

export function App() {
  const ColorSwitcher = ({isRed}: any) => {
    const style = {
      backgroundColor: isRed ? "red" : "green",
      width: '100px',
      height: '100px',
      borderRadius: '50%'
    }

    return (
      <div style={style}>

      </div>
    );
  };

  const [isRed, setIsRed] = useState(true);
  const [messages, setMessages] = useState<HardwareDashboardEvent<any>[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Replace with your server URL

    socket.on('message', (data: HardwareDashboardEvent<any>) => {
      console.log(data)

      console.log(messages)

      setIsRed(data.payload.value === 0)

      setMessages((prevState: HardwareDashboardEvent<any>[]) => [data, ...prevState].slice(0, 10));

      console.log(messages)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div>
        <CommandInputComponent/>
      </div>

      <ColorSwitcher isRed={isRed}/>
      <div>
        {messages.map((message: HardwareDashboardEvent<any>, index: number) => (
          <p key={index}>Date: '{message.timestamp}': Module Type: '{message.moduleType}' - Module Identifier: '{message.moduleIdentifier}' - Payload: {JSON.stringify(message.payload)} </p>
        ))}
      </div>
    </div>
  );
}

export default App;
