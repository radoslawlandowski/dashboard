import {Module, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';

import { AppController } from './app.controller';
import {SerialPortListenerService} from "./serial-port-listener.service";
import {ArduinoSerialPortConnectionService} from "./arduino.serial.port.connection.service";
import {EventEmitter2, EventEmitterModule} from "@nestjs/event-emitter";
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
import {DockerCommandLineInterfaceImpl, DockerStatsEntry} from "./trackables/docker/docker-command-line-interface";
import {Writable} from "stream";
import {DockerStatsEventHandler} from "./trackables/docker/docker-stats-event-handler";

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
  imports: [EventEmitterModule.forRoot(), CqrsModule],
  controllers: [AppController],
  providers: [
    WebsocketGateway,
    SerialPortListenerService,
    // ArduinoSerialPortConnectionService,
    {provide: ArduinoSerialPortConnectionService, useClass: ConsoleLogSerialPortConnectionService},
    ...hardwareEventHandlers,
    ...hardwareCommandHandlers,
    ...systemDataEventHandlers
  ],
})
export class AppModule implements OnApplicationBootstrap {

  constructor(readonly eventEmitter: EventEmitter2) {
  }

  async onApplicationBootstrap(): Promise<any> {
    const dockerInterface = new DockerCommandLineInterfaceImpl()

    const self = this

    await dockerInterface.stats(new Writable({
      write(chunk: any, encoding: BufferEncoding, callback) {
        // const object = JSON.parse(chunk.toString())
        // const entries = chunk.split('\n')


        const entries: DockerStatsEntry[] = Buffer.from(chunk).toString()
          .split('\n')
          .filter((value) => value.includes("MemPerc"))
          .map((value) => {
            try {
              const innerJSONString = value.slice(1, -1);
              return JSON.parse(innerJSONString);
            } catch (e) {
              console.error(`Error parsing JSON: ${e.message}`)
              return null;
            }
          }).filter((value) => value !== null)

        if(entries.length > 0) {
          self.eventEmitter.emit('trackables.docker.stats', ...entries)
        }

        callback();
      }
    }))
  }
}
