import {Controller, Post, Query} from '@nestjs/common';
import {DockerCommandLineInterfaceImpl} from "./docker-interface";

@Controller('docker')
export class DockerController {

  constructor(readonly docker: DockerCommandLineInterfaceImpl) {
  }

  @Post('restart')
  async connect(@Query('containerName') containerName: string): Promise<object> {
    await this.docker.restartContainer(containerName)

    return {
      "message": "Successfully restarted!"
    }
  }
}

