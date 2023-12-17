import {Module} from '@nestjs/common';

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
import {HardwareModule} from "./hardware/hardware.module";
import {WebsocketGateway} from "./outputs/websocket-gateway";
import {DistinctUntilChangedInterceptor} from "./interceptors/distinct-until-changed-interceptor.service";
import {_BootstrapHardwareDashboardEventHandler} from "./event-handlers/_bootstrap-hardware-dashboard-event.handler";
import {GitInterfaceModule} from "./metrics-inputs/git/git-interface.module";

const systemDataEventHandlers = [
  DockerStatsEventHandler
]

const hardwareEventHandlers = [
  DigitalPinHardwareDashboardEventHandler,
  AnalogPinHardwareDashboardEventHandler,
  UnrecognizedHardwareDashboardEventHandler,
  _BootstrapHardwareDashboardEventHandler
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
    HardwareModule,
    GitInterfaceModule.register({
      repoDirectory: '/Users/radoslawlandowski/Documents/repos/dashboard',
      featureBranchName: 'feature-branch'
    })
    // DockerInterfaceModule.register({
    //   containers: [
    //     {
    //       imageName: 'localstack/localstack',
    //       name: "localstack-radek",
    //     }, {
    //       imageName: 'postgres',
    //       name: 'postgres-dashboard-radek'
    //     }
    //   ]
    // })
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
export class AppModule {

  constructor() {
  }
}
