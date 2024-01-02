import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {GitCommandLineInterface} from "./metrics-inputs/git/git.interface";
import {EventEmitter2} from "@nestjs/event-emitter";
import {GitStatusEvent} from "./git-status-event";

@Injectable()
export class GitStatusCron {

  constructor(
    readonly gitCommandLineInterface: GitCommandLineInterface,
    readonly eventEmitter: EventEmitter2
  ) {
  }

  @Cron('*/5 * * * * *')
  async handleCron(): Promise<void> {
    const status = await this.gitCommandLineInterface.status()

    this.eventEmitter.emit(GitStatusEvent, {
      value: status.trim() ? true : false
    })
  }
}

