import {Body, Controller, Post} from '@nestjs/common';
import {
  ArduinoSerialPortConnectionService
} from "@elense/nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "@elense/nestjs-serial-port/src/lib/hardware/app-message";

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

  @Post('disconnect')
  async disconnect(): Promise<object> {
    await this.service.disconnect()

    return {
      "message": "Successfully disconnected!"
    }
  }

  @Post('command/set-digital-pin')
  async setDigitalPin(@Body() value: any): Promise<object> {
    await this.service.write(new DefaultAppMessage([0, value.value]))

    return {
      "message": "Successfully Set Digital Pin!"
    }
  }
}
