import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SetDigitalPinHardwareDashboardCommand} from "../contract/commands/set-digital-pin-hardware-dashboard-command";
import {ArduinoSerialPortConnectionService} from "../arduino.serial.port.connection.service";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../contract/events/digital-pin-hardware-dashboard-received-event";

@CommandHandler(SetDigitalPinHardwareDashboardCommand)
export class SetDigitalPinHardwareDashboardHandler implements ICommandHandler<SetDigitalPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetDigitalPinHardwareDashboardCommand): Promise<any> {
    const object = new DigitalPinHardwareDashboardReceivedEvent(
      command.moduleIdentifier,
      command.payload
    )

    return this.arduinoService.write(object.toArduino())
  }
}
