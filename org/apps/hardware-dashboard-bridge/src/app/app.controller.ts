import {Body, Controller, Post, Query} from '@nestjs/common';
import { verify } from 'crypto';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEvent} from "./contract/digital-pin-hardware-dashboard-event";

@Controller('/hardware-dashboard-bridge')
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService, private readonly eventEmitter: EventEmitter2) {
  }

  @Post('test')
  async test(): Promise<object> {
    this.eventEmitter.emit('hardware-dashboard.received.digital-pin', new DigitalPinHardwareDashboardEvent(
      "1", {value: 1}
    ))

    return {
      "message": "Successfully Connected!"
    }
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
