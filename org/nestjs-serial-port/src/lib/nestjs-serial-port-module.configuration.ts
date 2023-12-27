import {OnEventType} from "@nestjs/event-emitter/dist/decorators/on-event.decorator";
import {SerialPortFormattedMessage} from "./hardware/serial-port-formatted-message";

export interface NestjsSerialPortModuleConfiguration {
  deviceInfo: DeviceInfo
  baudRate: number
  targetDeviceSerialPortBufferSize: number
  eventsFromDevice: {
    [shortDeviceEventName: string]: FromDeviceEvent<any>
  }
}

export interface DeviceInfo {
  vendorId: string
  productId: string
}

export interface FromDeviceEvent<T> {
  eventName: OnEventType
  eventMapper: (eventFromDevice: SerialPortFormattedMessage) => T
}
