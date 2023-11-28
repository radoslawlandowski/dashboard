import { Module } from '@nestjs/common';

import { SerialPortListenerService } from './serial-port-listener.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SerialPortListenerService],
})
export class AppModule {}
