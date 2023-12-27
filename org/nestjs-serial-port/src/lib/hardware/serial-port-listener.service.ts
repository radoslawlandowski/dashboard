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

  async findDevice(findBy: {vendorId: string, productId: string}): Promise<PortInfo | undefined> {
    return (await this.listDevices()).find((device: PortInfo) => device.vendorId === findBy.vendorId && device.productId === findBy.productId)
  }

  listenAndEmitOnNewline(
    devicePath: string,
    baudRate: number = 9600,
    onData: (data: string) => void,
  ): {port: SerialPort, readlineParser: ReadlineParser} {

    const port = new SerialPort({ path: devicePath, baudRate: baudRate })

    port.on('readable', function () {
      port.read();
    });

    const readlineParser = port.pipe(new ReadlineParser())

    readlineParser.on('data', onData)

    return {port: port, readlineParser: readlineParser}
  }
}
