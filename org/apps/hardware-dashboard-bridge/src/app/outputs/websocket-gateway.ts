import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway({cors: true})
export class WebsocketGateway {

  @WebSocketServer()
  server: Server;

  constructor() {
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendMessage(message: any) {
    this.server.emit('message', message);
  }
}

