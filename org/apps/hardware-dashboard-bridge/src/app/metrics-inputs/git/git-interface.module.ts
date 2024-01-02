import {DynamicModule} from '@nestjs/common';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {GitController} from "./git.controller";
import {GitModuleConfig} from "./git-module.config";
import {GitCommandLineInterface} from "./git.interface";
import {WebsocketGateway} from "../../outputs/websocket-gateway";
import {CqrsModule} from "@nestjs/cqrs";

export class GitInterfaceModule {
  static register(config: GitModuleConfig): DynamicModule {
    return {
      module: GitInterfaceModule,
      imports: [
        EventEmitterModule,
        CqrsModule
      ],
      providers: [
        WebsocketGateway,
        {provide: "GIT_CONFIG", useValue: config},
        GitCommandLineInterface
      ],
      exports: [
        GitCommandLineInterface,
        {provide: "GIT_CONFIG", useValue: config}
      ],
      controllers: [
        GitController
      ]
    }
  }
}
