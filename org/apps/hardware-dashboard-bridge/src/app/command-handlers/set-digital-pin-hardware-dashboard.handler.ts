import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SetDigitalPinHardwareDashboardCommand} from "../contract/commands/set-digital-pin-hardware-dashboard-command";
import {
  ArduinoSerialPortConnectionService
} from "../../../../../nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "../../../../../nestjs-serial-port/src/lib/hardware/app-message";

@CommandHandler(SetDigitalPinHardwareDashboardCommand)
export class SetDigitalPinHardwareDashboardHandler implements ICommandHandler<SetDigitalPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetDigitalPinHardwareDashboardCommand): Promise<any> {
    return this.arduinoService.write(new DefaultAppMessage(
      [command.moduleIdentifier, command.payload.value]
    ))
  }
}
