import {Test, TestingModule} from '@nestjs/testing'
import {MockBinding} from '@serialport/binding-mock'
import {Module} from "@nestjs/common";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {NestjsSerialPortModule} from "@org/nestjs-serial-port";
import {PinValueChangedHardwareMessage} from "./events/pin-value-changed-hardware.message";
import {SerialPortListenerService} from "../hardware/serial-port-listener.service";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "../hardware/app-message";

const devicePath = '/dev/example'

@Module({
  imports: [
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

    MockBinding.reset()
    MockBinding.createPort(devicePath, {echo: true, record: true})

    arduinoSerialPortConnectionService = moduleFixture.get(ArduinoSerialPortConnectionService)
  })

  beforeEach(async () => {
  })

  describe('Ok ', function () {
    it('should work', async function () {
      await arduinoSerialPortConnectionService.connect()

      await arduinoSerialPortConnectionService.write(new DefaultAppMessage(["dp", "1", "1"]))
      //
      // arduinoSerialPortConnectionService.readline.port.on('data', function (data) {
      //   console.log('Data:', data.toString())
      // })

      expect(true).toBeTruthy()
    })
  })
})
