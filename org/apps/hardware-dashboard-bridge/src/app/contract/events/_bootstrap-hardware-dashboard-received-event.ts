import {HardwareDashboardEvent, HardwareDashboardModuleTypes} from "./hardware-dashboard-event";
import {IsIn, IsNumber, ValidateNested} from "class-validator";

export class _BootstrapHardwareDashboardPayload {
  @IsIn([0, 1])
  @IsNumber()
  value: 0 | 1
}

export class _BootstrapHardwareDashboardReceivedEvent implements HardwareDashboardEvent<_BootstrapHardwareDashboardPayload> {
  static Queue = 'hardware-dashboard.received._bootstrap'

  queue = _BootstrapHardwareDashboardReceivedEvent.Queue
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.DigitalPin
  moduleIdentifier: string

  @ValidateNested()
  payload: _BootstrapHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: _BootstrapHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }
}
