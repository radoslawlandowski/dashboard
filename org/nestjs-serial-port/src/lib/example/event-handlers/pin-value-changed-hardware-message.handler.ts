import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, Logger} from "@nestjs/common";
import {PinValueChangedHardwareMessage} from "../events/pin-value-changed-hardware.message";

@Injectable()
export class PinValueChangedHardwareMessageHandler {

  constructor() {
  }

  @OnEvent(PinValueChangedHardwareMessage.appEventName, { async: true })
    async handle(event: PinValueChangedHardwareMessage) {
        Logger.log(`Received event about hardware pin value changed: ${JSON.stringify(event)}`, 'from-device')
    }
}
