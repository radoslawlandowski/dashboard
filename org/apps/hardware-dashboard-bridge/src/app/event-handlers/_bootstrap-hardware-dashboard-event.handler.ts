import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../contract/events/digital-pin-hardware-dashboard-received-event";
import {WebsocketGateway} from "../outputs/websocket-gateway";
import {
  _BootstrapHardwareDashboardReceivedEvent
} from "../contract/events/_bootstrap-hardware-dashboard-received-event";

@Injectable()
export class _BootstrapHardwareDashboardEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway) {
  }

  @OnEvent(_BootstrapHardwareDashboardReceivedEvent.Queue, { async: true })
    async handle(event: _BootstrapHardwareDashboardReceivedEvent) {
        console.log(`Received event: ${JSON.stringify(event)}`)

        this.websocketGateway.sendMessage(event)
    }
}
