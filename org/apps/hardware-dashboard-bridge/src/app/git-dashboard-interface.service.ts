import {Inject, Injectable} from "@nestjs/common";
import {
  ArduinoSerialPortConnectionService
} from "@elense/nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "@elense/nestjs-serial-port/src/lib/hardware/app-message";
import {GitModuleConfig} from "./metrics-inputs/git/git-module.config";
import {GitDashboardDiodes} from "./event-handlers/git-dashboard-diodes";

@Injectable()
export class GitDashboardInterface {

  constructor(readonly arduino: ArduinoSerialPortConnectionService,
              @Inject("GIT_CONFIG") readonly config: GitModuleConfig) {
  }

  async currentBranchDiode(branch: string): Promise<void> {
    await this.diode(GitDashboardDiodes.DEVELOP, "OFF")
    await this.diode(GitDashboardDiodes.MASTER, "OFF")
    await this.diode(GitDashboardDiodes.FEATURE, "OFF")

    if (branch === 'develop') {
      await this.diode(GitDashboardDiodes.DEVELOP, "ON")
    } else if (branch === 'main') {
      await this.diode(GitDashboardDiodes.MASTER, "ON")
    } else if (branch === this.config.featureBranchName) {
      await this.diode(GitDashboardDiodes.FEATURE, "ON")
    }
  }

  async diode(identifier: GitDashboardDiodes, status: "ON" | "OFF"): Promise<void> {
    const message = new DefaultAppMessage([identifier, status === "ON" ? 0 : 1])

    await this.arduino.write(message)
  }
}
