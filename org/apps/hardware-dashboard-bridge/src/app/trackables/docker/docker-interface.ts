import {spawn} from "child_process";
import {Writable} from "stream";
import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";

export interface DockerReadInterface {
  stats<T extends NodeJS.WritableStream>(statsWritableStream: T) : Promise<void>
}

export interface DockerWriteInterface {

}

export interface DockerInterface extends DockerReadInterface, DockerWriteInterface {
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

@Injectable()
export class DockerCommandLineInterfaceImpl implements DockerInterface {
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

@Injectable()
export class DockerDataEventEmitter implements OnApplicationBootstrap {

  constructor(readonly eventEmitter: EventEmitter2, readonly dockerInterface: DockerCommandLineInterfaceImpl) {
  }

  async emit(): Promise<void> {
    const self = this

    return await this.dockerInterface.stats(new Writable({
      write(chunk: any, encoding: BufferEncoding, callback) {

        const entries: DockerStatsEntry[] = Buffer.from(chunk).toString()
          .split('\n')
          .filter((value) => value.includes("MemPerc"))
          .map((value) => {
            try {
              const innerJSONString = value.slice(1, -1);
              return JSON.parse(innerJSONString);
            } catch (e) {
              console.error(`Error parsing JSON: ${e.message}`)
              return null;
            }
          })
          .filter((value) => value !== null)

        if(entries.length > 0) {
          self.eventEmitter.emit('trackables.docker.stats', ...entries)
        }

        callback();
      }
    }))
  }

  onApplicationBootstrap(): any {
    this.emit()
  }
}
