import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ArduinoSerialPortConnectionService} from "../arduino.serial.port.connection.service";
import {SetAnalogPinHardwareDashboardCommand} from "../contract/commands/set-analog-pin-hardware-dashboard-command";
import {AnalogPinHardwareDashboardReceivedEvent} from "../contract/events/analog-pin-hardware-dashboard-received-event";

@CommandHandler(SetAnalogPinHardwareDashboardCommand)
export class SetAnalogPinHardwareDashboardHandler implements ICommandHandler<SetAnalogPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetAnalogPinHardwareDashboardCommand): Promise<any> {
    const object = new AnalogPinHardwareDashboardReceivedEvent(
      command.moduleIdentifier,
      command.payload
    )
    return this.arduinoService.write(object.toArduino())
  }
}
