import {DynamicModule, Module} from '@nestjs/common';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {DockerCommandLineInterfaceImpl, DockerDataEventEmitter, DockerInterface} from "./docker-interface";
import {DockerModuleConfig} from "./docker-module.config";

@Module({
  imports: [
    EventEmitterModule
  ],
  providers: [
    DockerCommandLineInterfaceImpl,
    DockerDataEventEmitter,
  ]
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
