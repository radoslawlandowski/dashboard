
export interface NestjsSerialPortModuleConfiguration {
  deviceInfo: DeviceInfo
  baudRate: number
  targetDeviceSerialPortBufferSize: number
  hardwareMessages: object[]
}

export interface DeviceInfo {
  vendorId: string
  productId: string
}

