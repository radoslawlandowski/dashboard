import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";
import {Max, Min} from "class-validator";

export class AnalogPinHardwareDashboardPayload {
  @Min(0)
  @Max(255)
  value: number
}

export class AnalogPinHardwareDashboardReceivedEvent implements HardwareDashboardEvent<AnalogPinHardwareDashboardPayload> {
  static Queue = 'hardware-dashboard.received.analog-pin'

  queue: string = AnalogPinHardwareDashboardReceivedEvent.Queue
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.AnalogPin
  moduleIdentifier: string
  payload: AnalogPinHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: AnalogPinHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }

  toArduino(): string {
    return `<${this.moduleIdentifier},${this.payload.value}>`
  }
}
