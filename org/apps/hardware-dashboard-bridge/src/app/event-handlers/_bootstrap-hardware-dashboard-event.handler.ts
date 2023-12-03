import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {
  DigitalPinHardwareDashboardReceivedEvent
} from "../contract/events/digital-pin-hardware-dashboard-received-event";
import {WebsocketGateway} from "../outputs/websocket-gateway";
import {
  _BootstrapHardwareDashboardReceivedEvent
} from "../contract/events/_bootstrap-hardware-dashboard-received-event";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";

@Injectable()
export class _BootstrapHardwareDashboardEventHandler {

  constructor(readonly arduinoSerialPortConnectionService: ArduinoSerialPortConnectionService){
  }

  @OnEvent(_BootstrapHardwareDashboardReceivedEvent.Queue, { async: true })
    async handle(event: _BootstrapHardwareDashboardReceivedEvent) {
        console.log(`Received event: ${JSON.stringify(event)}`)

        await this.arduinoSerialPortConnectionService.write({})
    }
}
