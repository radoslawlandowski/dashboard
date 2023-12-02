import {Module} from '@nestjs/common';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {DockerCommandLineInterfaceImpl, DockerDataEventEmitter, DockerInterface} from "./docker-interface";

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
}
