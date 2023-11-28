import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import {SerialPortListenerService} from "./serial-port-listener.service";
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEventHandler} from "./event-handlers/digital-pin-hardware-dashboard-event.handler";
import {WebsocketGateway} from "./websocket-gateway";

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [
    WebsocketGateway,
    SerialPortListenerService,
    ArduinoSerialPortConnectionService,
    DigitalPinHardwareDashboardEventHandler
  ],
})
export class AppModule {}
