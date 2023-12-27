import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";
import {AppMessage} from "./app-message";

export interface SerialPortConnectionService {
  connect(): Promise<void>
  disconnect(): Promise<void>
  write(appMessage: AppMessage): Promise<any>
  readline: {port: SerialPort, readlineParser: ReadlineParser}
}

