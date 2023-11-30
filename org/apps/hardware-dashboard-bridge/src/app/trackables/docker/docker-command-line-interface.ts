import {exec, spawn} from "child_process";
import {Transform} from "stream";

export interface DockerCommandLineInterface {
  stats<T extends NodeJS.WritableStream>(statsWritableStream: T) : Promise<void>
}

export interface DockerStatsEntry {
  BlockIO: string,
  CPUPerc: string,
  Container: string,
  ID: string,
  MemPerc: string
  MemUsage: string,
  Name: string
  NetIO: string
  PIDs: string
}

export class DockerCommandLineInterfaceImpl implements DockerCommandLineInterface {
  async stats<T extends NodeJS.WritableStream>(statsWritableStream: T): Promise<void> {
    const command = 'docker';
    const args = ['stats', '--format', '"{{ json . }}"'];

    const childProcess = spawn(command, args);

    childProcess.stdout.pipe(statsWritableStream);

    childProcess.on('error', (err) => {
      console.error(`Error: ${err.message}`);
    });

    childProcess.on('exit', (code, signal) => {
      if (code !== null) {
        console.log(`Process exit code: ${code}`);
      } else if (signal !== null) {
        console.log(`Process killed by signal: ${signal}`);
      }
    });
  }
}
