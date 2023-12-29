import {SerialPortFormattedMessage} from "./serial-port-formatted-message";

export const APP_EVENT_NAME_PROP = 'appEventName'
export const HARDWARE_EVENT_NAME_PROP = 'hardwareEventName'
export const CREATE_EVENT_FUNC = 'create'

type ConstructorType<T> = new (...args: any[]) => T;

function DEFAULT_EVENT_FACTORY<T>(ctor: ConstructorType<T>, values: any[]): T {
  return new ctor(...values);
}

export function HardwareMessage(hardwareEventName: string, appEventName: string = hardwareEventName, exampleHardwareMessage?: string, mapper?: (hardwareMessage: SerialPortFormattedMessage) => object) {
  return function (constructor: ConstructorType<any>) {
    constructor[HARDWARE_EVENT_NAME_PROP] = hardwareEventName
    constructor[APP_EVENT_NAME_PROP] = appEventName
    if (!mapper) {
      constructor[CREATE_EVENT_FUNC] = (hardwareMessage: SerialPortFormattedMessage) => {
        return DEFAULT_EVENT_FACTORY(constructor, hardwareMessage.appMessage.data)
      }
    } else {
      constructor[CREATE_EVENT_FUNC] = mapper
    }
  }
}
