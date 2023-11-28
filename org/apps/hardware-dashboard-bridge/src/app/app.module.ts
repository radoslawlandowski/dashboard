import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import {SerialPortListenerService} from "./serial-port-listener.service";
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SerialPortListenerService, ArduinoSerialPortConnectionService],
})
export class AppModule {}
