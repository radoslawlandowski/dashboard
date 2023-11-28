import {OnEvent} from "@nestjs/event-emitter";
import {DigitalPinHardwareDashboardEvent} from "../contract/digital-pin-hardware-dashboard-event";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DigitalPinHardwareDashboardEventHandler {

    @OnEvent('hardware-dashboard.received.digital-pin', { async: true })
    async handle(event: DigitalPinHardwareDashboardEvent) {
        console.log(`Received event: ${JSON.stringify(event)}`)
    }
}
