import {OnEvent} from "@nestjs/event-emitter";
import {Inject, Injectable} from "@nestjs/common";
import {WebsocketGateway} from "../../outputs/websocket-gateway";
import {GitModuleConfig} from "./git-module.config";

@Injectable()
export class GitEventHandler {

  constructor(readonly websocketGateway: WebsocketGateway, @Inject("GIT_CONFIG") readonly config: GitModuleConfig) {
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
