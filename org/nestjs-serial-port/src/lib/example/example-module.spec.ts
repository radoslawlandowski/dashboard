import {Test, TestingModule} from '@nestjs/testing'
import {MockBinding, MockPortBinding} from '@serialport/binding-mock'
import {Module} from "@nestjs/common";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {NestjsSerialPortModule} from "@org/nestjs-serial-port";
import {PinValueChangedHardwareMessage} from "./events/pin-value-changed-hardware.message";
import {SerialPortListenerService} from "../hardware/serial-port-listener.service";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "../hardware/app-message";
import {PinValueChangedHardwareMessageHandler} from "./event-handlers/pin-value-changed-hardware-message.handler";
import {TasksService} from "../../../../apps/example-serial-port-app/src/app/tasks.service";
import {CqrsModule} from "@nestjs/cqrs";

process.env["NODE_SERIAL_PORT_TEST"] = 'true'

const devicePath = '/dev/example'

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    NestjsSerialPortModule.register({
      baudRate: 250000,
      deviceInfo: {devicePath: devicePath}, // Original Arduino: {vendorId: '2341', productId: '0043'};
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
export class ExampleTestModule {
}

describe('Test', function () {

  let arduinoSerialPortConnectionService: ArduinoSerialPortConnectionService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ExampleTestModule,
      ],
    }).compile()

    await moduleFixture.init()

    arduinoSerialPortConnectionService = moduleFixture.get(ArduinoSerialPortConnectionService)

    MockBinding.reset()
    MockBinding.createPort(devicePath, {echo: true, record: true})
  })

  beforeEach(async () => {
  })

  describe('Ok ', function () {
    it('should work', async function () {
      await arduinoSerialPortConnectionService.connect()

      await arduinoSerialPortConnectionService.write(new DefaultAppMessage(["dp", "1", "1"]))
      await arduinoSerialPortConnectionService.write(new DefaultAppMessage(["dp", "2", "1"]))

      const port: MockPortBinding = arduinoSerialPortConnectionService.readline.port.port as unknown as MockPortBinding

      const messages = port.recording.toString()

      expect(messages).toEqual('<dp,1,1><dp,2,1>')
    })
  })
})

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
