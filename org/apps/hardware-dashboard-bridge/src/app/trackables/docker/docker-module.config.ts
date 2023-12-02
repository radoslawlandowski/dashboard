export interface DockerContainerConfig {
  name: string
}

export interface DockerModuleConfig {
  containers: DockerContainerConfig[]
}
