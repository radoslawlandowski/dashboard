import {HardwareDashboardCommand} from "./hardware-dashboard-comand";
import {HardwareDashboardModuleTypes} from "../events/hardware-dashboard-event";
import {DigitalPinHardwareDashboardPayload} from "../events/digital-pin-hardware-dashboard-received-event";
import {IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class SetDigitalPinHardwareDashboardCommand implements HardwareDashboardCommand<DigitalPinHardwareDashboardPayload> {
  moduleType: HardwareDashboardModuleTypes = HardwareDashboardModuleTypes.AnalogPin

  @IsNotEmpty()
  moduleIdentifier: string

  @ValidateNested()
  @Type(() => DigitalPinHardwareDashboardPayload)
  payload: DigitalPinHardwareDashboardPayload

  timestamp: Date = new Date()

  constructor(moduleIdentifier: string, payload: DigitalPinHardwareDashboardPayload) {
    this.moduleIdentifier = moduleIdentifier
    this.payload = payload
  }
}

