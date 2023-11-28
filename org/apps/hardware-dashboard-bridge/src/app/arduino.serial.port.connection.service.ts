import {SerialPortListenerService} from "./serial-port-listener.service";
import {PortInfo} from "@serialport/bindings-interface";
import {Injectable, Logger} from "@nestjs/common";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPort} from "serialport";

@Injectable()
export class ArduinoSerialPortConnectionService {
  static ARDUINO_DEVICE_DATA = {vendorId: '2341', productId: '0043'};

  readline: {port: SerialPort, readlineParser: ReadlineParser}

  constructor(readonly listener: SerialPortListenerService) {
  }

  async write(value: string): Promise<void> {
    this.readline.port.write(value)
  }

  async connect(): Promise<void> {
    let arduino: PortInfo | undefined

    do {
      arduino = await this.listener.findDevice(ArduinoSerialPortConnectionService.ARDUINO_DEVICE_DATA)

      if (!arduino) {
        Logger.error("Device not connected! Awaiting 3 seconds before next attempt...")

        await this.sleep(3000)
      }
    } while (!arduino)

    this.readline = this.listener.listenAndEmitOnNewline(arduino.path, 9600, (data: string) => {
      console.log(data)
    })

    this.readline.readlineParser.on('data', (value) => console.log("Rade" + value))
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
