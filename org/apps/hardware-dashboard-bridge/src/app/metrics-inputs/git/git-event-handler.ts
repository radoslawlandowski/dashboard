import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {WebsocketGateway} from "../../outputs/websocket-gateway";

@Injectable()
export class GitEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway) {
  }

  @OnEvent('trackables.git.stats.*', {async: true})
  async handle(event: { }) {
    this.websocketGateway.sendMessage({
      payload: {
        value: event
      }
    })
  }
}
