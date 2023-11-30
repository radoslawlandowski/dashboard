import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";

export interface SerialPortConnectionService {
  connect(): Promise<void>
  write(value: object): Promise<void>
  readline: {port: SerialPort, readlineParser: ReadlineParser}

}

export class ConsoleLogSerialPortConnectionService implements SerialPortConnectionService {
  readline: { port: SerialPort; readlineParser: ReadlineParser };

  async connect(): Promise<void> {
    console.log("Connected!")
    return Promise.resolve(undefined);
  }

  async write(value: object): Promise<void> {
    console.log(`Written!`)
    console.log(JSON.stringify(value))
    console.log('\n')
    return Promise.resolve(undefined);
  }
}
