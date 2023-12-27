import {SerialPortListenerService} from "./serial-port-listener.service";
import {PortInfo} from "@serialport/bindings-interface";
import {Injectable, Logger} from "@nestjs/common";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPort} from "serialport";
import {EventEmitter2} from "@nestjs/event-emitter";
import {plainToInstance} from "class-transformer";
import {SerialPortConnectionService} from "./serial-port-connection-service";
import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "../contract/events/hardware-dashboard-event";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../contract/events/digital-pin-hardware-dashboard-received-event";
import {AnalogPinHardwareDashboardReceivedEvent} from "../contract/events/analog-pin-hardware-dashboard-received-event";
import {
  UnrecognizedHardwareDashboardEventPayload,
  UnrecognizedHardwareDashboardReceivedEvent
} from "../contract/events/unrecognized-hardware-dashboard-received-event";

type AConstructorTypeOf<T> = new (...args: any[]) => T;

@Injectable()
export class ArduinoSerialPortConnectionService implements SerialPortConnectionService {
  // static ARDUINO_DEVICE_DATA = {vendorId: '2341', productId: '0043'};
  static ARDUINO_DEVICE_DATA = {vendorId: '1a86', productId: '7523'}; // move to config

  readonly eventMap: Map<HardwareDashboardModuleTypes, AConstructorTypeOf<HardwareDashboardEvent<any>>> = new Map([
      [HardwareDashboardModuleTypes.DigitalPin, DigitalPinHardwareDashboardReceivedEvent],
      [HardwareDashboardModuleTypes.AnalogPin, AnalogPinHardwareDashboardReceivedEvent]
    ]
  )

  readline: {port: SerialPort, readlineParser: ReadlineParser}

  constructor(readonly listener: SerialPortListenerService,
              private eventEmitter: EventEmitter2) {
  }

  async write(value: string): Promise<any> {
    this.readline.port.write(value, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log(`message written: ${value}`)
    })

    return new Promise((resolve, reject) => {
      this.readline.port.drain(function(err) {
        if (err) {
          console.log('Error on drain: ', err.message)
          return reject(err)
        }
        console.log(`message drained: ${value}`)
        return resolve("OK")
      })
    });
  }

  async disconnect(): Promise<void> {
    if (this.readline.port.isOpen) {
      this.readline.port.close()
    }
  }

  async connect(): Promise<void> {
    let arduino: PortInfo | undefined

    do {
      arduino = await this.listener.findDevice(ArduinoSerialPortConnectionService.ARDUINO_DEVICE_DATA)

      if (!arduino) {
        Logger.error("Device not connected! Awaiting 3 seconds before next attempt...")

        Logger.log(`Devices: ${JSON.stringify(await this.listener.listDevices())}`)

        await this.sleep(3000)
      }
    } while (!arduino)

    this.readline = this.listener.listenAndEmitOnNewline(arduino.path, 250000, (data: string) => {
      console.log(data)
    })

    this.readline.port.on('error', (err: Error) => {
      console.error(err)
      console.error(`Reconnecting...`)

      this.connect()
    })

    await this.sleep(1000)

    this.readline.port.write('A')

    this.readline.readlineParser.on('data', (value: string) => {
      try {
        const parsedValue: object = JSON.parse(value)

        const eventType: AConstructorTypeOf<HardwareDashboardEvent<any>> | undefined = this.eventMap.get(parsedValue['moduleType'])

        const eventInstance: HardwareDashboardEvent<any> = plainToInstance(eventType, parsedValue)

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
