import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";

export class DigitalPinHardwareDashboardEventPayload {
  value: 0 | 1
}

export class DigitalPinHardwareDashboardEvent implements HardwareDashboardEvent<DigitalPinHardwareDashboardEventPayload> {
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.DigitalPin
  moduleIdentifier: string
  payload: DigitalPinHardwareDashboardEventPayload

  constructor(moduleIdentifier: string, payload: DigitalPinHardwareDashboardEventPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }
}
