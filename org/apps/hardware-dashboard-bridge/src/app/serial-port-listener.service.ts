import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";
import {PortInfo} from "@serialport/bindings-interface"
import {Injectable} from "@nestjs/common";

@Injectable()
export class SerialPortListenerService {
  static identifier = 'SerialPortListenerService'

  async listDevices(): Promise<PortInfo[]> {
    return SerialPort.list()
  }

  listenAndEmitOnNewline(
    devicePath: string,
    baudRate: number = 9600,
    onData: (data: string) => void,
  ) {

    const port = new SerialPort({ path: devicePath, baudRate: baudRate })

    port.write(`Initialized Serial Connection as: ${SerialPortListenerService.identifier}`)

    port.on('readable', function () {
      port.read();
    });

    port.on('data', function (data) {

    });

    const readlineParser = port.pipe(new ReadlineParser())

    readlineParser.on('data', onData)
  }
}
