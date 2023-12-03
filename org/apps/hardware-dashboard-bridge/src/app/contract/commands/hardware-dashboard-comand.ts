import {HardwareDashboardModuleTypes} from "../events/hardware-dashboard-event";

export interface HardwareDashboardCommand<T> {
  moduleType: HardwareDashboardModuleTypes
  moduleIdentifier: string
  payload: T
  timestamp: Date
}
