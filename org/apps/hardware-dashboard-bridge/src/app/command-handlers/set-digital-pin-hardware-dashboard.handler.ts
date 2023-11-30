import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SetDigitalPinHardwareDashboardCommand} from "../contract/commands/set-digital-pin-hardware-dashboard-command";
import {ArduinoSerialPortConnectionService} from "../arduino.serial.port.connection.service";

@CommandHandler(SetDigitalPinHardwareDashboardCommand)
export class SetDigitalPinHardwareDashboardHandler implements ICommandHandler<SetDigitalPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetDigitalPinHardwareDashboardCommand): Promise<any> {
    return this.arduinoService.write(command)
  }
}
