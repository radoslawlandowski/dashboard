import {HardwareDashboardCommand} from "./hardware-dashboard-comand";
import {AnalogPinHardwareDashboardPayload} from "../events/analog-pin-hardware-dashboard-received-event";
import {HardwareDashboardModuleTypes} from "../events/hardware-dashboard-event";
import {IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class SetAnalogPinHardwareDashboardCommand implements HardwareDashboardCommand<AnalogPinHardwareDashboardPayload> {
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.AnalogPin

  @IsNotEmpty()
  moduleIdentifier: string

  @ValidateNested()
  @Type(() => AnalogPinHardwareDashboardPayload)
  payload: AnalogPinHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: AnalogPinHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }
}
