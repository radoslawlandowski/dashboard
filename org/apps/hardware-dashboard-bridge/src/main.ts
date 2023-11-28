import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {PortInfo} from "@serialport/bindings-interface"

import { AppModule } from './app/app.module';
import {SerialPortListenerService} from "./app/serial-port-listener.service";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init()

  const listener = app.get(SerialPortListenerService)

  let arduino: PortInfo | undefined
  do {
    arduino = await listener.findDevice({vendorId: '2341', productId: '0043'})

    if(!arduino) {
      Logger.error("Device not connected! Awaiting 3 seconds before next attempt...")
  
      await sleep(3000)
    }
  } while (!arduino)


  listener.listenAndEmitOnNewline(arduino.path, 9600, (data: string) => {
    console.log(data)
  })

  Logger.log(
    `🚀 Application is running!`
  );
}

bootstrap();
