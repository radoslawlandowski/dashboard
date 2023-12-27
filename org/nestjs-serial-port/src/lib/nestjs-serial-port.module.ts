import {DynamicModule, OnModuleInit} from '@nestjs/common';
import {NestjsSerialPortModuleConfiguration} from "./nestjs-serial-port-module.configuration";
import {NESTJS_SERIAL_PORT_MODULE_CONFIGURATION} from "./nestjs-serial-port-module.configuration.token";
import {ArduinoSerialPortConnectionService} from "./hardware/arduino.serial.port.connection.service";
import {SerialPortListenerService} from "./hardware/serial-port-listener.service";
import {CqrsModule} from "@nestjs/cqrs";

export class NestjsSerialPortModule {
  static register(configuration: NestjsSerialPortModuleConfiguration): DynamicModule {
    return {
      module: NestjsSerialPortModule,
      imports: [
        CqrsModule,
      ],
      providers: [
        {
          provide: NESTJS_SERIAL_PORT_MODULE_CONFIGURATION,
          useValue: configuration,
        },
        ArduinoSerialPortConnectionService,
        SerialPortListenerService,
      ],
      exports: [
        NESTJS_SERIAL_PORT_MODULE_CONFIGURATION,
        ArduinoSerialPortConnectionService
      ]
    };
  }
}

