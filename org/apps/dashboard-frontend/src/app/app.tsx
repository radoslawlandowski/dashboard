// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {useEffect, useState} from "react";
import {
  HardwareDashboardModuleTypes
} from "../../../hardware-dashboard-bridge/src/app/contract/hardware-dashboard-event";
import {io} from "socket.io-client";

export interface HardwareDashboardEvent<T> {
  moduleType: HardwareDashboardModuleTypes
  moduleIdentifier: string
  payload: T
  timestamp: string
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
  const [messages, setMessages] = useState<HardwareDashboardEvent<any>[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Replace with your server URL

    socket.on('message', (data: HardwareDashboardEvent<any>) => {
      console.log(data)

      console.log(messages)

      setMessages((prevState: HardwareDashboardEvent<any>[]) => [...prevState, data].slice(-10));

      console.log(messages)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <ColorSwitcher isRed={isRed}/>
      <div>
        {messages.reverse().map((message: HardwareDashboardEvent<any>, index: number) => (
          <p key={index}>Date: '{message.timestamp}': Module Type: '{message.moduleType}' - Module Identifier: '{message.moduleIdentifier}' - Payload: {JSON.stringify(message.payload)} </p>
        ))}
      </div>
    </div>
  );
}

export default App;
