import {AppMessage} from "./app-message";

export class SerialPortFormattedMessage {
  static startMessageDelimiter = '<'
  static endMessageDelimiter = '>'

  readonly content: string

  constructor(readonly appMessage: AppMessage) {
    const content = this.appMessage.data.join(',')
    this.content = `${SerialPortFormattedMessage.startMessageDelimiter}${content}${SerialPortFormattedMessage.endMessageDelimiter}`
  }

  sizeInBytes(): number {
    return Buffer.byteLength(this.content, 'utf-8')
  }
}
