import {OnEvent} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {DockerStatsEvent} from "./docker-interface";
import {WebsocketGateway} from "../../outputs/websocket-gateway";

@Injectable()
export class DockerStatsEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway) {
  }

  @OnEvent('trackables.docker.stats.*', {async: true})
  async handle(event: DockerStatsEvent) {
    this.websocketGateway.sendMessage({
      payload: {
        value: event.payload
      }
    })
  }
}
