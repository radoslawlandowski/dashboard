import {Controller, Post, Query} from '@nestjs/common';
import {GitCommandLineInterface, GitInterface} from "./git.interface";

@Controller('git/read')
export class GitController {

  constructor(readonly git: GitCommandLineInterface) {
  }

  @Post('status')
  async status(): Promise<object> {
    const status = await this.git.status()

    return {
      "message": status
    }
  }
}

