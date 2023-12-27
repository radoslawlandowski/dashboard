import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";
import {IsIn, IsNumber, ValidateNested} from "class-validator";
import {FromHardwareMessage} from "../../../../../../nestjs-serial-port/src/lib/hardware/from-hardware-message";
import {
  SerialPortFormattedMessage
} from "../../../../../../nestjs-serial-port/src/lib/hardware/serial-port-formatted-message";

export class DigitalPinHardwareDashboardPayload {
  @IsIn([0, 1])
  @IsNumber()
  value: 0 | 1
}

export class DigitalPinHardwareDashboardReceivedEvent implements HardwareDashboardEvent<DigitalPinHardwareDashboardPayload>, FromHardwareMessage<DigitalPinHardwareDashboardReceivedEvent> {
  static appEventName = 'from-device.digital-pin'
  static hardwareEventName = 'dp'

  static create(hardwareMessage: SerialPortFormattedMessage): DigitalPinHardwareDashboardReceivedEvent {
    return new DigitalPinHardwareDashboardReceivedEvent(
      hardwareMessage.appMessage.data[1],
      {
        value: Number(hardwareMessage.appMessage.data[2]) as (0 | 1)
      }
    )
  }

  queue = DigitalPinHardwareDashboardReceivedEvent.appEventName
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.DigitalPin
  moduleIdentifier: string

  @ValidateNested()
  payload: DigitalPinHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: DigitalPinHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }

  readonly appEventName: string = DigitalPinHardwareDashboardReceivedEvent.appEventName
  readonly hardwareEventName: string = DigitalPinHardwareDashboardReceivedEvent.hardwareEventName

  readonly exampleMessage: string = "<dp,button-checkout-master,1>"
}
