import {SerialPortListenerService} from "./serial-port-listener.service";
import {PortInfo} from "@serialport/bindings-interface";
import {Injectable, Logger} from "@nestjs/common";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPort} from "serialport";
import {EventEmitter2} from "@nestjs/event-emitter";
import {plainToInstance} from "class-transformer";
import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./contract/events/hardware-dashboard-event";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "./contract/events/digital-pin-hardware-dashboard-received-event";
import {AnalogPinHardwareDashboardReceivedEvent} from "./contract/events/analog-pin-hardware-dashboard-received-event";
import {
  UnrecognizedHardwareDashboardEventPayload,
  UnrecognizedHardwareDashboardReceivedEvent
} from "./contract/events/unrecognized-hardware-dashboard-received-event";
import {SerialPortConnectionService} from "./serial-port-connection-service";

type AConstructorTypeOf<T> = new (...args: any[]) => T;

@Injectable()
export class ArduinoSerialPortConnectionService implements SerialPortConnectionService {
  static ARDUINO_DEVICE_DATA = {vendorId: '2341', productId: '0043'};

  readonly eventMap: Map<HardwareDashboardModuleTypes, AConstructorTypeOf<HardwareDashboardEvent<any>>> = new Map([
      [HardwareDashboardModuleTypes.DigitalPin, DigitalPinHardwareDashboardReceivedEvent],
      [HardwareDashboardModuleTypes.AnalogPin, AnalogPinHardwareDashboardReceivedEvent]
    ]
  )

  readonly events: HardwareDashboardEvent<any>[] = []

  readline: {port: SerialPort, readlineParser: ReadlineParser}

  constructor(readonly listener: SerialPortListenerService,
              private eventEmitter: EventEmitter2) {
  }

  async write(value: object): Promise<void> {
    this.readline.port.write(JSON.stringify(value), function(err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('message written')
    })
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

    this.readline.port.on('error', (err: Error) => {
      console.error(err)
      console.error(`Reconnecting...`)

      this.connect()
    })

    await this.sleep(5000)

    this.readline.port.write('A')

    this.readline.readlineParser.on('data', (value: string) => {
      try {
        const parsedValue: object = JSON.parse(value)

        const eventType: AConstructorTypeOf<HardwareDashboardEvent<any>> | undefined = this.eventMap.get(parsedValue['moduleType'])

        const eventInstance: HardwareDashboardEvent<any> = plainToInstance(eventType, parsedValue)

        this.events.push(eventInstance)

        this.eventEmitter.emit(`hardware-dashboard.received.${eventInstance.moduleType}`, eventInstance)
      } catch(e) {
        console.error(e)

        this.eventEmitter.emit(`hardware-dashboard.received.${HardwareDashboardModuleTypes.Unrecognized}`,
          new UnrecognizedHardwareDashboardReceivedEvent(new UnrecognizedHardwareDashboardEventPayload(value, e))
        )
      }
    })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
