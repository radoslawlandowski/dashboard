import {Controller, Post} from '@nestjs/common';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";

@Controller('/hardware-dashboard-bridge')
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService) {
  }

  @Post('connect')
  async connect(): Promise<void> {
    return this.service.run()
  }
}
