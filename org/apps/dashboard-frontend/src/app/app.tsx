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
      setMessages( // Replace the state
        [ // with a new array
          ...messages, // that contains all the old items
          data// and one new item at the end
        ]
      );
      console.log(data)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <ColorSwitcher isRed={isRed}/>
      <div>
        {messages.map((message: HardwareDashboardEvent<any>, index: number) => (
          <p key={index}>{message.moduleIdentifier}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
