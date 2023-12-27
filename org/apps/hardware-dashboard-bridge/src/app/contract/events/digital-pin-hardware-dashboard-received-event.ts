import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";
import {IsIn, IsNumber, ValidateNested} from "class-validator";

export class DigitalPinHardwareDashboardPayload {
  @IsIn([0, 1])
  @IsNumber()
  value: 0 | 1
}

export class DigitalPinHardwareDashboardReceivedEvent implements HardwareDashboardEvent<DigitalPinHardwareDashboardPayload> {
  static Queue = 'hardware-dashboard.received.digital-pin'

  queue = DigitalPinHardwareDashboardReceivedEvent.Queue
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.DigitalPin
  moduleIdentifier: string

  @ValidateNested()
  payload: DigitalPinHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: DigitalPinHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }
}
