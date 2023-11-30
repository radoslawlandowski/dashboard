import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ArduinoSerialPortConnectionService} from "../arduino.serial.port.connection.service";
import {SetAnalogPinHardwareDashboardCommand} from "../contract/commands/set-analog-pin-hardware-dashboard-command";

@CommandHandler(SetAnalogPinHardwareDashboardCommand)
export class SetAnalogPinHardwareDashboardHandler implements ICommandHandler<SetAnalogPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetAnalogPinHardwareDashboardCommand): Promise<any> {
    return this.arduinoService.write(command)
  }
}
