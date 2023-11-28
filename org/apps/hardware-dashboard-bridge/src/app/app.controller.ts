import {Controller, Get, Post, Query} from '@nestjs/common';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import {HardwareDashboardEvent} from "./contract/hardware-dashboard-event";
import {DigitalPinHardwareDashboardEvent} from "./contract/digital-pin-hardware-dashboard-event";

@Controller('/hardware-dashboard-bridge')
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService, private readonly eventEmitter: EventEmitter2) {
  }

  @Post('data')
  async data(): Promise<HardwareDashboardEvent<any>[]> {
    return this.service.events
  }

  @Get('data/last')
  async dataLast(): Promise<HardwareDashboardEvent<any>> {
    // return this.service.events[this.service.events.length - 1]

    return new DigitalPinHardwareDashboardEvent("1", {
      value: 0
    })
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
