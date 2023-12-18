export interface GitModuleConfig {
  repoDirectory: string
  featureBranchName: string
  pinConfig: PinConfig
}

export interface PinConfig {
  pins: {
    'fetch': number
    'checkoutMain': number
    'checkoutDevelop': number
    'isDevelop': number
    'isMaster': number
    'isFeatureBranch': number
  }
}
