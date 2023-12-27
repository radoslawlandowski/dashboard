import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";

export interface SerialPortConnectionService {
  connect(): Promise<void>
  disconnect(): Promise<void>
  write(value: string): Promise<any>
  readline: {port: SerialPort, readlineParser: ReadlineParser}
}

export interface SerialPortMessage {
  data: any[]
}

