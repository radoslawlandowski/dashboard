import {Module, OnApplicationBootstrap} from '@nestjs/common';

import {AppController} from './app.controller';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {CqrsModule} from "@nestjs/cqrs";
import {DockerStatsEventHandler} from "./metrics-inputs/docker/docker-stats-event-handler";
import {WebsocketGateway} from "./outputs/websocket-gateway";
import {DistinctUntilChangedInterceptor} from "./interceptors/distinct-until-changed-interceptor.service";
import {GitInterfaceModule} from "./metrics-inputs/git/git-interface.module";
import {NestjsSerialPortModule} from "@elense/nestjs-serial-port";
import {
  ArduinoSerialPortConnectionService
} from "@elense/nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {GitDashboardInterface} from "./git-dashboard-interface.service";
import {GitDashboardEventHandler} from "./event-handlers/git-dashboard-event-handler";
import {GitDashboardEvent} from "./contract/events/git-dashboard-event";

const systemDataEventHandlers = [
  DockerStatsEventHandler
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
        GitDashboardEvent
      ],
    }),
    GitInterfaceModule.register({
      repoDirectory: '/Users/radoslawlandowski/Documents/repos/test',
      featureBranchName: 'some-feature-branch',
    })
  ],
  controllers: [AppController],
  providers: [
    GitDashboardInterface,
    GitDashboardEventHandler,
    WebsocketGateway,
    DistinctUntilChangedInterceptor,
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
