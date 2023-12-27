import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SetAnalogPinHardwareDashboardCommand} from "../contract/commands/set-analog-pin-hardware-dashboard-command";
import {
  ArduinoSerialPortConnectionService
} from "../../../../../nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "../../../../../nestjs-serial-port/src/lib/hardware/app-message";

@CommandHandler(SetAnalogPinHardwareDashboardCommand)
export class SetAnalogPinHardwareDashboardHandler implements ICommandHandler<SetAnalogPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetAnalogPinHardwareDashboardCommand): Promise<any> {
    return this.arduinoService.write(new DefaultAppMessage(
      [command.moduleIdentifier, command.payload.value]
    ))
  }
}
