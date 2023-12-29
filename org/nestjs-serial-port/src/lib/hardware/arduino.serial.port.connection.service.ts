import {SerialPortListenerService} from "./serial-port-listener.service";
import {PortInfo} from "@serialport/bindings-interface";
import {Injectable, Logger} from "@nestjs/common";
import {ReadlineParser} from "@serialport/parser-readline";
import {SerialPort} from "serialport";
import {EventEmitter2} from "@nestjs/event-emitter";
import {SerialPortConnectionService} from "./serial-port-connection-service";
import {AppMessage} from "./app-message";
import {InjectSerialPortConfig} from "../inject-serial-port.config";
import {MessageMapper} from "./message-mapper";
import {SerialPortFormattedMessage} from "./serial-port-formatted-message";
import {NestjsSerialPortModuleConfiguration} from "../nestjs-serial-port-module.configuration";
import {
  _UnrecognizedHardwareDashboardReceivedEvent,
  UnrecognizedHardwareDashboardEventPayload
} from "../events/_unrecognized-hardware-dashboard-received-event";


@Injectable()
export class ArduinoSerialPortConnectionService implements SerialPortConnectionService {
  readline: { port: SerialPort, readlineParser: ReadlineParser }

  constructor(@InjectSerialPortConfig() readonly config: NestjsSerialPortModuleConfiguration,
              readonly listener: SerialPortListenerService,
              readonly messageMapper: MessageMapper,
              private eventEmitter: EventEmitter2) {
  }

  async write(appMessage: AppMessage): Promise<any> {
    const message = this.messageMapper.toSerialPortFormattedMessage(appMessage)

    const value = message.content

    Logger.log(`Sending to device: ${value}`, 'to-device')

    this.readline.port.write(value, function (err) {
      if (err) {
        return Logger.error('Error on write: ', err.message)
      }
      Logger.log(`Success!`, 'to-device')
    })

    return new Promise((resolve, reject) => {
      this.readline.port.drain(function (err) {
        if (err) {
          Logger.error('Error on drain: ', err.message)
          return reject(err)
        }
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
      Logger.log(`Received from device (raw data): ${value}`, 'from-device')

      let message: SerialPortFormattedMessage
      try {
        message = this.messageMapper.fromRawString(value)

        const fromHardwareMessage: any =
          this.config.hardwareMessages.find((hardwareMessage: any) => hardwareMessage.hardwareEventName! === message.appMessage.name)

        if(!fromHardwareMessage) {
          throw new Error(`No hardware message found for message: ${JSON.stringify(message)}. Please check your configuration!`)
        }

        const eventInstance: any = fromHardwareMessage["create"](message)

        this.eventEmitter.emit(`${fromHardwareMessage.appEventName}`, eventInstance)
      } catch (e) {
        Logger.error(e)
        Logger.error(JSON.stringify(message))

        this.eventEmitter.emit(_UnrecognizedHardwareDashboardReceivedEvent.appEventName,
          new _UnrecognizedHardwareDashboardReceivedEvent(new UnrecognizedHardwareDashboardEventPayload(value, e))
        )
      }
    })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
