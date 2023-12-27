export interface AppMessage {
  readonly data: any[]
}

export class DefaultAppMessage implements AppMessage {
  constructor(readonly data: any[]) {
  }
}
