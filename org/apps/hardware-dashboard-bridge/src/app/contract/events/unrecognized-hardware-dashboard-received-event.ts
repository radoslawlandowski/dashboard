import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";

export class UnrecognizedHardwareDashboardEventPayload {

  constructor(
    readonly error: unknown,
    readonly value: unknown
  ) {
  }
}

export class UnrecognizedHardwareDashboardReceivedEvent implements HardwareDashboardEvent<UnrecognizedHardwareDashboardEventPayload> {
  static Queue = 'hardware-dashboard.received.unrecognized'

  queue: string = UnrecognizedHardwareDashboardReceivedEvent.Queue
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.DigitalPin
  moduleIdentifier: string
  payload: UnrecognizedHardwareDashboardEventPayload
  timestamp: Date = new Date()

  constructor(payload: UnrecognizedHardwareDashboardEventPayload) {
    this.moduleIdentifier = "Unrecognized"
    this.payload = payload
  }

}
