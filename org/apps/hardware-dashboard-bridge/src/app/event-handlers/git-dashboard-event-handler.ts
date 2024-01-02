import {OnEvent} from "@nestjs/event-emitter";
import {Inject, Injectable} from "@nestjs/common";
import {GIT_DASHBOARD_EVENT, GitDashboardEvent} from "../contract/events/git-dashboard-event";
import {GitModuleConfig} from "../metrics-inputs/git/git-module.config";
import {GitCommandLineInterface} from "../metrics-inputs/git/git.interface";
import {GitDashboardInterface} from "../git-dashboard-interface.service";
import {GitDashboardDiodes} from "./git-dashboard-diodes";

@Injectable()
export class GitDashboardEventHandler {

  constructor(@Inject("GIT_CONFIG") readonly config: GitModuleConfig,
              readonly gitCommandLineInterface: GitCommandLineInterface,
              readonly gitDashboardInterface: GitDashboardInterface
  ) {
  }

  @OnEvent(GIT_DASHBOARD_EVENT, {async: true})
  async handle(event: GitDashboardEvent) {
    try {
      if (event.value === "0") {
        return
      }

      if (event.isFetchPushed()) {
        console.log("Fetch Aqcuired!")
        const output = await this.gitCommandLineInterface.fetch()

        console.log(output)
      }

      if (event.isCheckoutDevelopPushed()) {
        console.log("Checkout develop!")
        const output = await this.gitCommandLineInterface.checkout('develop')

        console.log(output)
      }

      if (event.isCheckoutMainPushed()) {
        console.log("Checkout main!")
        const output = await this.gitCommandLineInterface.checkout('main')

        console.log(output)
      }

      if (event.isCheckoutFeaturePushed()) {
        console.log("Checkout feature branch!")
        console.log(`git checkout ${this.config.featureBranchName}`)

        const output = await this.gitCommandLineInterface.checkout(this.config.featureBranchName)

        console.log(output)
      }

      const currentBranch: string = (await this.gitCommandLineInterface.branch()).trim()

      await this.gitDashboardInterface.currentBranchDiode(currentBranch)
      await this.gitDashboardInterface.diode(GitDashboardDiodes.ERROR, "OFF")
    } catch(e) {
      await this.gitDashboardInterface.diode(GitDashboardDiodes.ERROR, "ON")
    }

  }
}

