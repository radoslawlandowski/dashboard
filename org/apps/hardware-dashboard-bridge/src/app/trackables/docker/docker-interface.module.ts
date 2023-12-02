import {DynamicModule, Module} from '@nestjs/common';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {DockerCommandLineInterfaceImpl, DockerDataEventEmitter} from "./docker-interface";
import {DockerModuleConfig} from "./docker-module.config";
import { DockerController } from './docker.controller';

@Module({
  imports: [
    EventEmitterModule
  ],
  providers: [
    DockerCommandLineInterfaceImpl,
    DockerDataEventEmitter,
  ],
  controllers: [DockerController]
})
export class DockerInterfaceModule {
  static register(config: DockerModuleConfig): DynamicModule {
    return {
      module: DockerInterfaceModule,
      imports: [
        EventEmitterModule
      ],
      providers: [
        {provide: "DOCKER_CONFIG", useValue: config},
        DockerCommandLineInterfaceImpl,
        DockerDataEventEmitter,
      ]
    }
  }
}
