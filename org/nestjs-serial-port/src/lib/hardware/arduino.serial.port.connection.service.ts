import {SerialPortListenerService} from "./serial-port-listener.service";
import {PortInfo} from "@serialport/bindings-interface";
import {Injectable, Logger} from "@nestjs/common";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPort} from "serialport";
import {EventEmitter2} from "@nestjs/event-emitter";
import {plainToInstance} from "class-transformer";
import {SerialPortConnectionService} from "./serial-port-connection-service";
import {
  HardwareDashboardEvent,
  HardwareDashboardModuleTypes
} from "../../../../apps/hardware-dashboard-bridge/src/app/contract/events/hardware-dashboard-event";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../../../../apps/hardware-dashboard-bridge/src/app/contract/events/digital-pin-hardware-dashboard-received-event";
import {
  AnalogPinHardwareDashboardReceivedEvent
} from "../../../../apps/hardware-dashboard-bridge/src/app/contract/events/analog-pin-hardware-dashboard-received-event";
import {
  UnrecognizedHardwareDashboardEventPayload,
  UnrecognizedHardwareDashboardReceivedEvent
} from "../../../../apps/hardware-dashboard-bridge/src/app/contract/events/unrecognized-hardware-dashboard-received-event";
import {AppMessage} from "./app-message";
import { NestjsSerialPortModuleConfiguration} from "../nestjs-serial-port-module.configuration";
import {InjectSerialPortConfig } from "../inject-serial-port.config";
import {MessageMapper} from "./message-mapper";

type AConstructorTypeOf<T> = new (...args: any[]) => T;

@Injectable()
export class ArduinoSerialPortConnectionService implements SerialPortConnectionService {
  readonly eventMap: Map<HardwareDashboardModuleTypes, AConstructorTypeOf<HardwareDashboardEvent<any>>> = new Map([
      [HardwareDashboardModuleTypes.DigitalPin, DigitalPinHardwareDashboardReceivedEvent],
      [HardwareDashboardModuleTypes.AnalogPin, AnalogPinHardwareDashboardReceivedEvent]
    ]
  )

  readline: { port: SerialPort, readlineParser: ReadlineParser }

  constructor(@InjectSerialPortConfig() readonly config: NestjsSerialPortModuleConfiguration,
              readonly listener: SerialPortListenerService,
              readonly messageMapper: MessageMapper,
              private eventEmitter: EventEmitter2) {
  }

  async write(appMessage: AppMessage): Promise<any> {
    const message = this.messageMapper.toSerialPortFormattedMessage(appMessage)

    const value = message.content

    this.readline.port.write(value, function (err) {
      if (err) {
        return Logger.error('Error on write: ', err.message)
      }
      Logger.log(`Message written: ${value}`)
    })

    return new Promise((resolve, reject) => {
      this.readline.port.drain(function (err) {
        if (err) {
          Logger.error('Error on drain: ', err.message)
          return reject(err)
        }
        Logger.verbose(`Message drained: ${value}`)
        return resolve("OK")
      })
    });
  }

  async disconnect(): Promise<void> {
    Logger.log(`Disconnecting...`)

    if (this.readline.port.isOpen) {
      this.readline.port.close()
      Logger.log(`Disconnected!`)
    } else {
      Logger.warn(`No connection!`)
    }
  }

  async connect(): Promise<void> {
    let arduino: PortInfo | undefined

    do {
      Logger.log(`Looking for device with vendorId: ${this.config.deviceInfo.vendorId} and productId: ${this.config.deviceInfo.productId}...`)

      arduino = await this.listener.findDevice(this.config.deviceInfo)

      if (!arduino) {
        Logger.error("Device not found!")

        const devices = await this.listener.listDevices()
        Logger.log("Available devices: ")
        for (const device of devices) {
          Logger.log(`Device: ${JSON.stringify(device, null, 2)}`)
        }

        Logger.error("Awaiting 3 seconds before next connection attempt...")
        await this.sleep(3000)
      }
    } while (!arduino)

    Logger.log(`Successfully connected to device with vendorId: ${this.config.deviceInfo.vendorId} and productId: ${this.config.deviceInfo.productId}!`)

    this.readline = this.listener.listen(arduino.path, this.config.baudRate)

    this.readline.port.on('error', (err: Error) => {
      Logger.error(err)
      Logger.log(`Reconnecting...`)

      this.connect()
    })

    this.setupReadlineParser();

    Logger.log(`Success!`)
  }

  private setupReadlineParser() {
    this.readline.readlineParser.on('data', (value: string) => {
      try {
        const parsedValue: object = JSON.parse(value)

        const eventType: AConstructorTypeOf<HardwareDashboardEvent<any>> | undefined = this.eventMap.get(parsedValue['moduleType'])

        const eventInstance: HardwareDashboardEvent<any> = plainToInstance(eventType as any, parsedValue as any) as any

        this.eventEmitter.emit(`hardware-dashboard.received.${eventInstance.moduleType}`, eventInstance)
      } catch (e) {
        Logger.error(e)

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
