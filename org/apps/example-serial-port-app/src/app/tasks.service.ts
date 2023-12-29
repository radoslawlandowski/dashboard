import {Injectable} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {Cron} from "@nestjs/schedule";
import {SendMessageCommand} from "../../../../nestjs-serial-port/src/lib/commands/send-message.command";
import {DefaultAppMessage} from "../../../../nestjs-serial-port/src/lib/hardware/app-message";

@Injectable()
export class TasksService {

  constructor(
    readonly commandBus: CommandBus,
  ) {
  }

  @Cron('*/5 * * * * *')
  async handleCron() {
    const randomPin = Math.floor(Math.random() * 11);

    await this.commandBus.execute(new SendMessageCommand(new DefaultAppMessage(["get-pin-value", randomPin])));
  }
}
