import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, Logger} from "@nestjs/common";
import {APP_EVENT_NAME_PROP, PinValueChangedHardwareMessage} from "../events/pin-value-changed-hardware.message";

@Injectable()
export class PinValueChangedHardwareMessageHandler {

  constructor() {
  }

  @OnEvent(PinValueChangedHardwareMessage[APP_EVENT_NAME_PROP], { async: true })
    async handle(event: PinValueChangedHardwareMessage) {
        Logger.log(`Received event about hardware pin value changed: ${JSON.stringify(event)}`, 'from-device')
    }
}
