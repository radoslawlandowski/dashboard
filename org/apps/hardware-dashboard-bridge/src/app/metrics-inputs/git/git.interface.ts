import {execSync} from "child_process";
import {Inject, Injectable} from "@nestjs/common";
import {GitModuleConfig} from "./git-module.config";

export interface GitReadInterface {
  status(): Promise<string>
}

export interface GitWriteInterface {
  fetch(): Promise<string>

  pull(): Promise<string>

  checkout(branchName: string): Promise<string>
}

export interface GitInterface extends GitReadInterface, GitWriteInterface {

}

@Injectable()
export class GitCommandLineInterface implements GitInterface {

  constructor(@Inject("GIT_CONFIG") readonly config: GitModuleConfig) {
  }

  async checkout(branchName: string): Promise<string> {
    return this.runCommand('git', ['checkout', branchName]);
  }

  async fetch(): Promise<string> {
    return this.runCommand('git', ['fetch']);
  }

  async pull(): Promise<string> {
    return Promise.resolve(undefined);
  }

  async status(): Promise<string> {
    return await this.runCommand('git', ['status', '--porcelain']);
  }

  private async runCommand(command: string, args: string[]): Promise<string> {
    console.log(`Running command: ${command} ${args.join(' ')}`);

    const childProcess = execSync(`${command} ${args.join(' ')}`, {
      cwd: this.config.repoDirectory
    });

    return childProcess.toString();
  }
}
