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

@Injectable()
export class GitArduinoEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway,
              @Inject("GIT_CONFIG") readonly config: GitModuleConfig,
              readonly gitCommandLineInterface: GitCommandLineInterface
              ) {
  }

  @OnEvent(DigitalPinHardwareDashboardReceivedEvent.Queue, {async: true})
  async handle(event: HardwareDashboardEvent<DigitalPinHardwareDashboardPayload>) {
    if(Number(event.moduleIdentifier) === this.config.pinConfig.pins.fetch && event.payload.value === 1) {
      console.log("Fetch Aqcuired!")
      const output = await this.gitCommandLineInterface.fetch()

      console.log(output)
    }

    if(Number(event.moduleIdentifier) === this.config.pinConfig.pins.checkoutDevelop && event.payload.value === 1) {
      console.log("Checkout develop!")
      const output = await this.gitCommandLineInterface.checkout('develop')

      console.log(output)
    }

    if(Number(event.moduleIdentifier) === this.config.pinConfig.pins.checkoutMain && event.payload.value === 1) {
      console.log("Checkout main!")
      const output = await this.gitCommandLineInterface.checkout('main')

      console.log(output)
    }

    if(Number(event.moduleIdentifier) === this.config.pinConfig.pins.checkoutFeature && event.payload.value === 1) {
      console.log("Checkout develop!")
      const output = await this.gitCommandLineInterface.checkout('some-feature-branch')

      console.log(output)
    }
  }
}
