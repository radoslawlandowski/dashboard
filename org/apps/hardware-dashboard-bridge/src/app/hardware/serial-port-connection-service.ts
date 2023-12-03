import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";

export interface SerialPortConnectionService {
  connect(): Promise<void>
  write(value: object): Promise<void>
  readline: {port: SerialPort, readlineParser: ReadlineParser}
}

