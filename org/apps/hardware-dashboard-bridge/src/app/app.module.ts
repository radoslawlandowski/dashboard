import {Module, OnApplicationBootstrap} from '@nestjs/common';

import {AppController} from './app.controller';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEventHandler} from "./event-handlers/digital-pin-hardware-dashboard-event.handler";
import {AnalogPinHardwareDashboardEventHandler} from "./event-handlers/analog-pin-hardware-dashboard-event.handler";
import {
  UnrecognizedHardwareDashboardEventHandler
} from "./event-handlers/unrecognized-hardware-dashboard-event.handler";
import {SetAnalogPinHardwareDashboardHandler} from "./command-handlers/set-analog-pin-hardware-dashboard.handler";
import {SetDigitalPinHardwareDashboardHandler} from "./command-handlers/set-digital-pin-hardware-dashboard.handler";
import {CqrsModule} from "@nestjs/cqrs";
import {DockerStatsEventHandler} from "./metrics-inputs/docker/docker-stats-event-handler";
import {WebsocketGateway} from "./outputs/websocket-gateway";
import {DistinctUntilChangedInterceptor} from "./interceptors/distinct-until-changed-interceptor.service";
import {GitInterfaceModule} from "./metrics-inputs/git/git-interface.module";
import {NestjsSerialPortModule} from "@org/nestjs-serial-port";
import {
  ArduinoSerialPortConnectionService
} from "../../../../nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "./contract/events/digital-pin-hardware-dashboard-received-event";

const systemDataEventHandlers = [
  DockerStatsEventHandler
]

const hardwareEventHandlers = [
  DigitalPinHardwareDashboardEventHandler,
  AnalogPinHardwareDashboardEventHandler,
  UnrecognizedHardwareDashboardEventHandler,
]

const hardwareCommandHandlers = [
  SetAnalogPinHardwareDashboardHandler,
  SetDigitalPinHardwareDashboardHandler
]

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CqrsModule,
    NestjsSerialPortModule.register({
      baudRate: 250000,
      deviceInfo: {vendorId: '1a86', productId: '7523'}, // Original Arduino: {vendorId: '2341', productId: '0043'};
      targetDeviceSerialPortBufferSize: 64,
      hardwareMessages: [
        DigitalPinHardwareDashboardReceivedEvent
      ],
    }),
    GitInterfaceModule.register({
      repoDirectory: '/Users/radoslawlandowski/Documents/repos/test',
      featureBranchName: 'some-feature-branch',
      modulesConfig:
        {
          inputs: {
            'fetch': 'button-fetch',
            'checkoutMain': 'button-checkout-master',
            'checkoutDevelop': 'button-checkout-develop',
            'checkoutFeature': 'button-checkout-feature'
          },
          outputs: {
            'diodeChanges': 'd-changes',
            'diodeError': 'd-error',
            'diodeDevelop': 'd-develop',
            'diodeMaster': 'd-master',
            'diodeFeature': 'd-feature'
          }
        }
    })
  ],
  controllers: [AppController],
  providers: [
    WebsocketGateway,
    DistinctUntilChangedInterceptor,
    ...hardwareEventHandlers,
    ...hardwareCommandHandlers,
    ...systemDataEventHandlers
  ],
})
export class AppModule implements OnApplicationBootstrap {

  constructor(readonly service: ArduinoSerialPortConnectionService) {
  }

  async onApplicationBootstrap(): Promise<any> {
    await this.service.connect()
  }
}
