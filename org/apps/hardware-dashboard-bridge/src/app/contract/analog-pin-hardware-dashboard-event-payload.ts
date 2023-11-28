import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";

export class AnalogPinHardwareDashboardEventPayload {
  value: number
}

export class AnalogPinHardwareDashboardEvent implements HardwareDashboardEvent<AnalogPinHardwareDashboardEventPayload> {
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.AnalogPin
  moduleIdentifier: string
  payload: AnalogPinHardwareDashboardEventPayload
  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: AnalogPinHardwareDashboardEventPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }
}
