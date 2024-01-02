import {OnEvent} from "@nestjs/event-emitter";
import {Inject, Injectable} from "@nestjs/common";
import {GitModuleConfig} from "../metrics-inputs/git/git-module.config";
import {GitDashboardInterface} from "../git-dashboard-interface.service";
import {GitDashboardDiodes} from "./git-dashboard-diodes";
import {GitStatusEvent} from "../git-status-event";

@Injectable()
export class GitStatusEventHandler {

  constructor(@Inject("GIT_CONFIG") readonly config: GitModuleConfig,
              readonly gitDashboardInterface: GitDashboardInterface
  ) {
  }

  @OnEvent(GitStatusEvent, {async: true})
  async handle(event: { value: boolean }) {
    try {
      if (event.value === true) {
        await this.gitDashboardInterface.diode(GitDashboardDiodes.CHANGES, "ON")
      } else {
        await this.gitDashboardInterface.diode(GitDashboardDiodes.CHANGES, "OFF")
      }
    } catch (e) {
      await this.gitDashboardInterface.diode(GitDashboardDiodes.ERROR, "ON")
    }
  }
}

