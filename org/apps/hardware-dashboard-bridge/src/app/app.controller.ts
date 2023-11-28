import {Body, Controller, Post, Query} from '@nestjs/common';
import { verify } from 'crypto';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";

@Controller('/hardware-dashboard-bridge')
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService) {
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
