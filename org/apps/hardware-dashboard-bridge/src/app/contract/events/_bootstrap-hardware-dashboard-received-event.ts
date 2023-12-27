import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";
import {IsIn, IsNumber, ValidateNested} from "class-validator";
import {FromHardwareMessage} from "../../../../../../nestjs-serial-port/src/lib/hardware/from-hardware-message";
import {
  SerialPortFormattedMessage
} from "../../../../../../nestjs-serial-port/src/lib/hardware/serial-port-formatted-message";

export class _BootstrapHardwareDashboardPayload {
  @IsIn([0, 1])
  @IsNumber()
  value: 0 | 1
}

export class _BootstrapHardwareDashboardReceivedEvent implements HardwareDashboardEvent<_BootstrapHardwareDashboardPayload>, FromHardwareMessage<_BootstrapHardwareDashboardReceivedEvent> {
  static appEventName = 'from-device._bootstrap'
  static hardwareEventName = '_bootstrap'

  static create(hardwareMessage: SerialPortFormattedMessage): _BootstrapHardwareDashboardReceivedEvent {
    return new _BootstrapHardwareDashboardReceivedEvent(
      hardwareMessage.appMessage.data[1],
      hardwareMessage.appMessage.data[2]
    )
  }

  queue = _BootstrapHardwareDashboardReceivedEvent.appEventName
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.DigitalPin
  moduleIdentifier: string

  @ValidateNested()
  payload: _BootstrapHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: _BootstrapHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }

  readonly appEventName: string = _BootstrapHardwareDashboardReceivedEvent.appEventName
  readonly exampleMessage: string = "<_bootstrap,button-checkout-master,1>"
  readonly hardwareEventName: string = _BootstrapHardwareDashboardReceivedEvent.hardwareEventName;
}
