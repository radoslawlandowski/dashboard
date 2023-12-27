import {Injectable} from "@nestjs/common";
import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPortConnectionService} from "./serial-port-connection-service";

@Injectable()
export class ConsoleLogSerialPortConnectionService implements SerialPortConnectionService {
  readline: { port: SerialPort; readlineParser: ReadlineParser };

  async connect(): Promise<void> {
    console.log("Connected!")
    return Promise.resolve(undefined);
  }

  async write(value: object): Promise<any> {
    console.log(`Written!`)
    console.log(JSON.stringify(value))
    console.log('\n')
    return Promise.resolve(undefined);
  }
}
