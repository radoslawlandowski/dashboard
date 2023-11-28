import {SerialPortListenerService} from "./serial-port-listener.service";
import {PortInfo} from "@serialport/bindings-interface";
import {Injectable, Logger} from "@nestjs/common";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPort} from "serialport";
import {EventEmitter2} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEvent} from "./contract/digital-pin-hardware-dashboard-event";
import {HardwareDashboardEvent} from "./contract/hardware-dashboard-event";
import {plainToInstance} from "class-transformer";

@Injectable()
export class ArduinoSerialPortConnectionService {
  static ARDUINO_DEVICE_DATA = {vendorId: '2341', productId: '0043'};

  readonly events: HardwareDashboardEvent<any>[] = []

  readline: {port: SerialPort, readlineParser: ReadlineParser}

  constructor(readonly listener: SerialPortListenerService,
              private eventEmitter: EventEmitter2) {
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

    this.readline = this.listener.listenAndEmitOnNewline(arduino.path, 115200, (data: string) => {
      console.log(data)
    })

    this.readline.readlineParser.on('data', (value: string) => {
      try {
        const parsedValue: object = JSON.parse(value)

        if(parsedValue['moduleType'] === 'DigitalPin') {
          const eventInstance: HardwareDashboardEvent<any> = plainToInstance(DigitalPinHardwareDashboardEvent, parsedValue)

          this.events.push(eventInstance)

          this.eventEmitter.emit('hardware-dashboard.received.digital-pin', new DigitalPinHardwareDashboardEvent(
            eventInstance.moduleIdentifier, eventInstance.payload
          ))
        } else {
          console.log(value)
          console.log(parsedValue)
        }
      } catch(e) {
        console.log(e)
      }
    })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
