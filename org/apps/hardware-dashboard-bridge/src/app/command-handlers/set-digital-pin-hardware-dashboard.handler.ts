import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SetDigitalPinHardwareDashboardCommand} from "../contract/commands/set-digital-pin-hardware-dashboard-command";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../contract/events/digital-pin-hardware-dashboard-received-event";
import {
  ArduinoSerialPortConnectionService
} from "../../../../../nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";

@CommandHandler(SetDigitalPinHardwareDashboardCommand)
export class SetDigitalPinHardwareDashboardHandler implements ICommandHandler<SetDigitalPinHardwareDashboardCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SetDigitalPinHardwareDashboardCommand): Promise<any> {
    const object = new DigitalPinHardwareDashboardReceivedEvent(
      command.moduleIdentifier,
      command.payload
    )

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    await this.arduinoService.write(object.toArduino())

    await sleep(5)
  }
}
