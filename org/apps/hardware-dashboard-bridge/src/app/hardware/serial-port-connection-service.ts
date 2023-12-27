import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";

export interface SerialPortConnectionService {
  connect(): Promise<void>
  write(value: object): Promise<any>
  readline: {port: SerialPort, readlineParser: ReadlineParser}
}

