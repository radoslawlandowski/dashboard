import {HardwareMessage} from "@elense/nestjs-serial-port/src/lib/hardware/hardware-message-decorators";
import {GitDashboardButtons} from "../../event-handlers/git-dashboard-buttons";

export const GIT_DASHBOARD_EVENT = 'git-dashboard-event'

@HardwareMessage('dp', GIT_DASHBOARD_EVENT, "<dp,10,1>")
export class GitDashboardEvent {
  constructor(readonly hardwareEventName: string, readonly pin: string, readonly value: string) {
  }

  isFetchPushed(): boolean {
    return this.isPushed(GitDashboardButtons.FETCH)
  }

  isCheckoutDevelopPushed(): boolean {
    return this.isPushed(GitDashboardButtons.CHECKOUT_DEVELOP)
  }

  isCheckoutMainPushed(): boolean {
    return this.isPushed(GitDashboardButtons.CHECKOUT_MAIN)
  }

  isCheckoutFeaturePushed(): boolean {
    return this.isPushed(GitDashboardButtons.CHECKOUT_FEATURE)
  }

  isPushPushed(): boolean {
    return this.isPushed(GitDashboardButtons.PUSH)
  }

  isPushForcePushed(): boolean {
    return this.isPushed(GitDashboardButtons.PUSH_FORCE)
  }

  isPullPushed(): boolean {
    return this.isPushed(GitDashboardButtons.PULL)
  }

  isResetPushed(): boolean {
    return this.isPushed(GitDashboardButtons.RESET)
  }

  isRebaseOntoMasterPushed(): boolean {
    return this.isPushed(GitDashboardButtons.REBASE_ONTO_MASTER)
  }

  private isPushed(button: GitDashboardButtons): boolean {
    return this.pin === button && this.value === '1'
  }
}
