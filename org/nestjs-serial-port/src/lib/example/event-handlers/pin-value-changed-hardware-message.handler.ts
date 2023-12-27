import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {PinValueChangedHardwareMessage} from "../events/pin-value-changed-hardware.message";

@Injectable()
export class PinValueChangedHardwareMessageHandler {

  constructor() {
  }

  @OnEvent(PinValueChangedHardwareMessage.appEventName, { async: true })
    async handle(event: PinValueChangedHardwareMessage) {
        console.log(`Received event about hardware pin value changed: ${event}`)
    }
}
