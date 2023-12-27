export interface NestjsSerialPortModuleConfiguration {
  deviceInfo: DeviceInfo
  baudRate: number
  targetDeviceSerialPortBufferSize: number
}

export interface DeviceInfo {
  vendorId: string
  productId: string
}
