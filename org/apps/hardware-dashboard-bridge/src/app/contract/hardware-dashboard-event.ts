export interface HardwareDashboardEvent<T> {
  moduleType: HardwareDashboardModuleTypes
  moduleIdentifier: string
  payload: T
}

export enum HardwareDashboardModuleTypes {
  DigitalPin = "DigitalPin",
  AnalogPin = "AnalogPin",
}

export interface HardwareDashboardEventHandler {
  handle(event: HardwareDashboardEvent<any>): Promise<void>
}
