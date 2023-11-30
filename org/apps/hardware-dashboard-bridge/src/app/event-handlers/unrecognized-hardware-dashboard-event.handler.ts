import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {
  UnrecognizedHardwareDashboardReceivedEvent
} from "../contract/events/unrecognized-hardware-dashboard-received-event";

@Injectable()
export class UnrecognizedHardwareDashboardEventHandler {

  constructor() {
  }

  @OnEvent(UnrecognizedHardwareDashboardReceivedEvent.Queue, {async: true})
  async handle(event: UnrecognizedHardwareDashboardReceivedEvent) {
    console.error(`Received event: ${event.payload.value}`)
  }
}
