import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../contract/events/digital-pin-hardware-dashboard-received-event";
import {WebsocketGateway} from "../outputs/websocket-gateway";

@Injectable()
export class DigitalPinHardwareDashboardEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway) {
  }

  @OnEvent(DigitalPinHardwareDashboardReceivedEvent.appEventName, { async: true })
    async handle(event: DigitalPinHardwareDashboardReceivedEvent) {
        console.log(`Received event: ${JSON.stringify(event)}`)

        this.websocketGateway.sendMessage(event)
    }
}
