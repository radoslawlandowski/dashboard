import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {AnalogPinHardwareDashboardReceivedEvent} from "../contract/events/analog-pin-hardware-dashboard-received-event";
import {WebsocketGateway} from "../outputs/websocket-gateway";

@Injectable()
export class AnalogPinHardwareDashboardEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway) {
  }

  @OnEvent(AnalogPinHardwareDashboardReceivedEvent.Queue, { async: true })
    async handle(event: AnalogPinHardwareDashboardReceivedEvent) {
        console.log(`Received event: ${JSON.stringify(event)}`)

        this.websocketGateway.sendMessage(event)
    }
}
