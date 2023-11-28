import {Controller, Post, Query} from '@nestjs/common';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEvent} from "./contract/digital-pin-hardware-dashboard-event";

@Controller('/hardware-dashboard-bridge')
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService,
              private readonly eventEmitter: EventEmitter2) {
  }

  @Post('send-ws-message')
  async data(): Promise<boolean> {
    return this.eventEmitter.emit('hardware-dashboard.received.digital-pin', new DigitalPinHardwareDashboardEvent("1", {
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


  @Post('write')
  async write(@Query("value") value: string): Promise<object> {
    await this.service.write(value)

    return {
      "message": "Successfully Wrote!"
    }
  }
}
