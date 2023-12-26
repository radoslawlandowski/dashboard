import {OnEvent} from "@nestjs/event-emitter";
import {Inject, Injectable} from "@nestjs/common";
import {WebsocketGateway} from "../../outputs/websocket-gateway";
import {GitModuleConfig} from "./git-module.config";
import {
  DigitalPinHardwareDashboardPayload,
  DigitalPinHardwareDashboardReceivedEvent
} from "../../contract/events/digital-pin-hardware-dashboard-received-event";
import {HardwareDashboardEvent} from "../../contract/events/hardware-dashboard-event";
import {GitCommandLineInterface} from "./git.interface";
import {CommandBus} from "@nestjs/cqrs";
import {
  SetDigitalPinHardwareDashboardCommand
} from "../../contract/commands/set-digital-pin-hardware-dashboard-command";

@Injectable()
export class GitArduinoEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway,
              @Inject("GIT_CONFIG") readonly config: GitModuleConfig,
              readonly gitCommandLineInterface: GitCommandLineInterface,
              private readonly commandBus: CommandBus
              ) {
  }

  @OnEvent(DigitalPinHardwareDashboardReceivedEvent.Queue, {async: true})
  async handle(event: HardwareDashboardEvent<DigitalPinHardwareDashboardPayload>) {
    if(event.moduleIdentifier === this.config.modulesConfig.inputs.fetch && event.payload.value === 1) {
      console.log("Fetch Aqcuired!")
      const output = await this.gitCommandLineInterface.fetch()

      console.log(output)
    }

    if(event.moduleIdentifier === this.config.modulesConfig.inputs.checkoutDevelop && event.payload.value === 1) {
      console.log("Checkout develop!")
      const output = await this.gitCommandLineInterface.checkout('develop')

      console.log(output)
    }

    if(event.moduleIdentifier === this.config.modulesConfig.inputs.checkoutMain && event.payload.value === 1) {
      console.log("Checkout main!")
      const output = await this.gitCommandLineInterface.checkout('main')

      console.log(output)
    }

    if(event.moduleIdentifier === this.config.modulesConfig.inputs.checkoutFeature && event.payload.value === 1) {
      console.log("Checkout feature branch!")
      console.log(`git checkout ${this.config.featureBranchName}`)

      const output = await this.gitCommandLineInterface.checkout(this.config.featureBranchName)

      console.log(output)
    }

    const currentBranch: string = (await this.gitCommandLineInterface.branch()).trim()

    if (currentBranch === 'develop') {
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeDevelop, {value: 0}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeMaster, {value: 1}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeFeature, {value: 1}))
    } else if(currentBranch === 'main') {
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeDevelop, {value: 1}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeMaster, {value: 0}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeFeature, {value: 1}))
    } else if(currentBranch === this.config.featureBranchName) {
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeDevelop, {value: 1}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeMaster, {value: 1}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeFeature, {value: 0}))
    } else {
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeDevelop, {value: 1}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeMaster, {value: 1}))
      await this.commandBus.execute(new SetDigitalPinHardwareDashboardCommand(this.config.modulesConfig.outputs.diodeFeature, {value: 1}))
    }
  }
}
