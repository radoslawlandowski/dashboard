import {FromHardwareMessage} from "../../hardware/from-hardware-message";
import {HardwareMessage} from "../../hardware/hardware-message-decorators";

@HardwareMessage('dp', 'from-device.pin-value-changed', "<dp,10,1>")
export class PinValueChangedHardwareMessage implements FromHardwareMessage<PinValueChangedHardwareMessage> {
  constructor(readonly hardwareEventName: string, readonly pin: number, readonly value: number) {
  }
}
