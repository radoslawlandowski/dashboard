import {DynamicModule} from '@nestjs/common';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {GitController} from "./git.controller";
import {GitModuleConfig} from "./git-module.config";
import {GitCommandLineInterface} from "./git.interface";

export class GitInterfaceModule {
  static register(config: GitModuleConfig): DynamicModule {
    return {
      module: GitInterfaceModule,
      imports: [
        EventEmitterModule
      ],
      providers: [
        {provide: "GIT_CONFIG", useValue: config},
        GitCommandLineInterface
      ],
      controllers: [
        GitController
      ]
    }
  }
}
