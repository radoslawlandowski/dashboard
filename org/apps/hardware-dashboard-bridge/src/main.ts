import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import {SerialPortListenerService} from "./app/serial-port-listener.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init()

  const listener = app.get(SerialPortListenerService)

  listener.listenAndEmitOnNewline("/dev/ttyACM1", 9600, (data: string) => {
    console.log(data)
  })

  Logger.log(
    `🚀 Application is running!`
  );
}

bootstrap();
