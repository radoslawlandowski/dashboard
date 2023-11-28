import { Test } from '@nestjs/testing';

import { SerialPortListenerService } from './serial-port-listener.service';

describe('AppService', () => {
  let service: SerialPortListenerService;

  beforeAll(async () => {

  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      service = new SerialPortListenerService("/dev/ttyACM1", 9600)
      expect(service.devicePath).toEqual("/dev/ttyACM1");
    });
  });
});
