import {Controller, Get, Post, Query} from '@nestjs/common';
import {GitCommandLineInterface, GitInterface} from "./git.interface";

@Controller('git')
export class GitController {

  constructor(readonly git: GitCommandLineInterface) {
  }

  @Get('read/status')
  async status(): Promise<object> {
    const status = await this.git.status()

    return {
      "message": status
    }
  }

  @Get('read/fetch')
  async fetch(): Promise<object> {
    const fetch = await this.git.fetch()

    return {
      "message": fetch
    }
  }

  @Post('write/checkout')
  async checkout(@Query('branch') branch: string): Promise<object> {
    const checkedOut = await this.git.checkout(branch)

    return {
      "message": checkedOut
    }
  }
}

