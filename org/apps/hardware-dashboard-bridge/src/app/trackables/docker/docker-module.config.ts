export interface DockerContainerConfig {
  name: string
  imageName: string
}

export interface DockerModuleConfig {
  containers: DockerContainerConfig[]
}
