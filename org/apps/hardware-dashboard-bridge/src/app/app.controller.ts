import {Body, Controller, Post} from '@nestjs/common';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import {HardwareDashboardCommand} from "./contract/commands/hardware-dashboard-comand";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "./contract/events/digital-pin-hardware-dashboard-received-event";
import {CommandBus} from "@nestjs/cqrs";
import {SetDigitalPinHardwareDashboardHandler} from "./command-handlers/set-digital-pin-hardware-dashboard.handler";
import {SetDigitalPinHardwareDashboardCommand} from "./contract/commands/set-digital-pin-hardware-dashboard-command";
import {SetAnalogPinHardwareDashboardCommand} from "./contract/commands/set-analog-pin-hardware-dashboard-command";

@Controller('/hardware-dashboard-bridge')
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService,
              private readonly commandBus: CommandBus,
              private readonly eventEmitter: EventEmitter2) {
  }

  @Post('send-ws-message')
  async data(): Promise<boolean> {
    return this.eventEmitter.emit('hardware-dashboard.received.digital-pin', new DigitalPinHardwareDashboardReceivedEvent("1", {
      value: 0
    }))
  }

  @Post('connect')
  async connect(): Promise<object> {
    await this.service.connect()

    return {
      "message": "Successfully Connected!"
    }
  }

  @Post('command/set-digital-pin')
  async setDigitalPin(@Body() value: SetDigitalPinHardwareDashboardCommand): Promise<object> {
    await this.commandBus.execute(value)

    return {
      "message": "Successfully Set Digital Pin!"
    }
  }

  @Post('command/set-analog-pin')
  async setAnalogPin(@Body() value: SetAnalogPinHardwareDashboardCommand): Promise<object> {
    await this.commandBus.execute(value)

    return {
      "message": "Successfully Set Analog Pin!"
    }
  }
}
