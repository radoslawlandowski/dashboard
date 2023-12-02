import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {SerialPortListenerService} from "./serial-port-listener.service";
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEventHandler} from "./event-handlers/digital-pin-hardware-dashboard-event.handler";
import {WebsocketGateway} from "./websocket-gateway";
import {AnalogPinHardwareDashboardEventHandler} from "./event-handlers/analog-pin-hardware-dashboard-event.handler";
import {
  UnrecognizedHardwareDashboardEventHandler
} from "./event-handlers/unrecognized-hardware-dashboard-event.handler";
import {SetAnalogPinHardwareDashboardHandler} from "./command-handlers/set-analog-pin-hardware-dashboard.handler";
import {SetDigitalPinHardwareDashboardHandler} from "./command-handlers/set-digital-pin-hardware-dashboard.handler";
import {CqrsModule} from "@nestjs/cqrs";
import {ConsoleLogSerialPortConnectionService} from "./serial-port-connection-service";
import {DockerStatsEventHandler} from "./trackables/docker/docker-stats-event-handler";
import {DockerInterfaceModule} from "./trackables/docker/docker-interface.module";
import {DistinctUntilChangedInterceptor} from "./distinct-until-changed-interceptor.service";

const systemDataEventHandlers = [
  DockerStatsEventHandler
]

const hardwareEventHandlers = [
  DigitalPinHardwareDashboardEventHandler,
  AnalogPinHardwareDashboardEventHandler,
  UnrecognizedHardwareDashboardEventHandler
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
    SerialPortListenerService,
    // {provide: ArduinoSerialPortConnectionService, useClass: ArduinoSerialPortConnectionService},
    {provide: ArduinoSerialPortConnectionService, useClass: ConsoleLogSerialPortConnectionService},
    ...hardwareEventHandlers,
    ...hardwareCommandHandlers,
    ...systemDataEventHandlers
  ],
})
export class AppModule {

  constructor() {
  }
}
