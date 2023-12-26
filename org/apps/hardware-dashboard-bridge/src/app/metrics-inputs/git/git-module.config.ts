export interface GitModuleConfig {
  repoDirectory: string
  featureBranchName: string
  modulesConfig: ModulesConfig
}

export interface ModulesConfig {
  inputs: {
    'fetch': string
    'checkoutMain': string
    'checkoutDevelop': string
    'checkoutFeature': string
  }
  outputs: {
    'diodeChanges': string
    'diodeError': string
    'diodeDevelop': string
    'diodeMaster': string
    'diodeFeature': string
  }
}

export interface HardwareInput {
  moduleIdentifier: string
}
