import {DynamicModule, Inject} from '@nestjs/common';
import {NestjsSerialPortModuleConfiguration} from "./nestjs-serial-port-module.configuration";
import {NESTJS_SERIAL_PORT_MODULE_CONFIGURATION} from "./nestjs-serial-port-module.configuration.token";
import {ArduinoSerialPortConnectionService} from "./hardware/arduino.serial.port.connection.service";
import {SerialPortListenerService} from "./hardware/serial-port-listener.service";

export class NestjsSerialPortModule {
  static register(configuration: NestjsSerialPortModuleConfiguration): DynamicModule {
    return {
      module: NestjsSerialPortModule,
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

export const InjectSerialPortConfig = () => Inject(NESTJS_SERIAL_PORT_MODULE_CONFIGURATION) // {vendorId: '1a86', productId: '7523'}
