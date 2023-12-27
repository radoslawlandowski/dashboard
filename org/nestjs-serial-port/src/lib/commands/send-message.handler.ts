import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SendMessageCommand} from "./send-message.command";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SendMessageCommand): Promise<any> {
    return this.arduinoService.write(command.message)
  }
}
