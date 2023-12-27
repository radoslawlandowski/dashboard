import {Module, OnApplicationBootstrap} from '@nestjs/common';
import {NestjsSerialPortModule} from "@org/nestjs-serial-port";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {
  PinValueChangedHardwareMessage
} from "../../../../nestjs-serial-port/src/lib/example/events/pin-value-changed-hardware.message";
import {CqrsModule} from "@nestjs/cqrs";
import {
  ArduinoSerialPortConnectionService
} from "../../../../nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {
  PinValueChangedHardwareMessageHandler
} from "../../../../nestjs-serial-port/src/lib/example/event-handlers/pin-value-changed-hardware-message.handler";

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    NestjsSerialPortModule.register({
      baudRate: 250000,
      deviceInfo: {vendorId: '1a86', productId: '7523'}, // Original Arduino: {vendorId: '2341', productId: '0043'};
      targetDeviceSerialPortBufferSize: 64,
      hardwareMessages: [
        PinValueChangedHardwareMessage
      ]
    })
  ],
  providers: [
    PinValueChangedHardwareMessageHandler
  ]
})
export class AppModule implements OnApplicationBootstrap {

  constructor(readonly service: ArduinoSerialPortConnectionService) {
  }

  async onApplicationBootstrap(): Promise<any> {
    await this.service.connect()
  }
}
