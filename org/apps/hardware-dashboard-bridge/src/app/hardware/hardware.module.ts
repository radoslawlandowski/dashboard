import { Module } from '@nestjs/common';
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {SerialPortListenerService} from "./serial-port-listener.service";
import {ConsoleLogSerialPortConnectionService} from "./console-log-serial-port-connection.service";

@Module({
  imports: [],
  providers: [
    ArduinoSerialPortConnectionService,
    SerialPortListenerService,
    ConsoleLogSerialPortConnectionService,
  ],
  exports: [
    // ArduinoSerialPortConnectionService,
    {provide: ArduinoSerialPortConnectionService, useClass: ConsoleLogSerialPortConnectionService},
    ConsoleLogSerialPortConnectionService,
  ]
})
export class HardwareModule {}
