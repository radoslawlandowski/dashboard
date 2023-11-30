export interface HardwareDashboardEvent<T> {
  moduleType: HardwareDashboardModuleTypes
  queue: string
  moduleIdentifier: string
  payload: T
  timestamp: Date
}

export enum HardwareDashboardModuleTypes {
  DigitalPin = "digital-pin",
  AnalogPin = "analog-pin",
  Unrecognized = "unrecognized"
}

export interface HardwareDashboardEventHandler {
  handle(event: HardwareDashboardEvent<any>): Promise<void>
}
