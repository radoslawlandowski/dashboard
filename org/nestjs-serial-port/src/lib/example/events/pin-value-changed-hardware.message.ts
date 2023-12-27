import {FromHardwareMessage} from "../../hardware/from-hardware-message";
import {SerialPortFormattedMessage} from "../../hardware/serial-port-formatted-message";

export class PinValueChangedHardwareMessage implements FromHardwareMessage<PinValueChangedHardwareMessage> {
  static appEventName = 'from-device.pin-value-changed'
  static hardwareEventName = 'dp'

  static create(hardwareMessage: SerialPortFormattedMessage): PinValueChangedHardwareMessage {
    return new PinValueChangedHardwareMessage(
      hardwareMessage.appMessage.data[1], hardwareMessage.appMessage.data[2]
    )
  }

  readonly hardwareEventName = PinValueChangedHardwareMessage.hardwareEventName
  readonly appEventName = PinValueChangedHardwareMessage.appEventName

  constructor(readonly pin: number, readonly value: number) {
  }

  /**
    Pin 10 has value 1
   */
  readonly exampleMessage: string = "<10,1>"
}
