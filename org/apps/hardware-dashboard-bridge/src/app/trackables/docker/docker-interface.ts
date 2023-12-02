import {spawn} from "child_process";
import {Writable} from "stream";
import {Inject, Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";
import {DockerContainerConfig, DockerModuleConfig} from "./docker-module.config";
import {Comparable} from "../../comparable";

export interface DockerReadInterface {
  stats<T extends NodeJS.WritableStream>(statsWritableStream: T) : Promise<void>
}

export interface DockerWriteInterface {
  restartContainer(containerName: string): Promise<void>
}

export interface DockerInterface extends DockerReadInterface, DockerWriteInterface {

}

export interface DockerTrackableEvent {
  containerName: string
}

export interface DockerStatsEvent extends DockerTrackableEvent, Comparable {
  payload: DockerStatsEntry
}

export class DockerStatsEventImpl implements DockerStatsEvent {
  containerName: string;
  payload: DockerStatsEntry;


  constructor(containerName: string, payload: DockerStatsEntry) {
    this.containerName = containerName;
    this.payload = payload;
  }

  isSame(other: DockerStatsEvent): boolean {
    return this.payload.Name === other.payload.Name
    && this.payload.ID === other.payload.ID
    && this.payload.MemPerc === other.payload.MemPerc
    && this.payload.CPUPerc === other.payload.CPUPerc
    && this.payload.NetIO === other.payload.CPUPerc
  }
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

  private containersToTrack: string[]
  private containersToTrackJoinedBySpace: string

  constructor(@Inject("DOCKER_CONFIG") readonly dockerConfig: DockerModuleConfig) {
    this.containersToTrack = this.dockerConfig.containers.map((value: DockerContainerConfig) => value.name)
    this.containersToTrackJoinedBySpace = this.containersToTrack.join(' ').trim()
  }

  async stats<T extends NodeJS.WritableStream>(statsWritableStream: T): Promise<void> {
    const command = 'docker';
    const args = ['stats', '--format', '"{{ json . }}"', this.containersToTrackJoinedBySpace];

    const childProcess = spawn(command, args);

    childProcess.stdout.pipe(statsWritableStream);

    childProcess.on('error', (err) => {
      console.error(`Error: ${err.message}`);
    });

    childProcess.on('exit', (code, signal) => {
      if (code !== null) {
        throw new Error(`Process exit code: ${code}`);
      } else if (signal !== null) {
        console.log(`Process killed by signal: ${signal}`);
      }
    });
  }

  restartContainer(containerName: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
export class DockerDataEventEmitter implements OnApplicationBootstrap {

  constructor(readonly eventEmitter: EventEmitter2,
              readonly dockerInterface: DockerCommandLineInterfaceImpl) {
  }

  async emitStats(): Promise<void> {
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
          entries.map((entry: DockerStatsEntry) => {
            const dockerStatsEvent: DockerStatsEvent = new DockerStatsEventImpl(
              entry.Name, entry
            )

            self.eventEmitter.emit(`trackables.docker.stats.${entry.Name}`, dockerStatsEvent)
          })
        }

        callback();
      }
    }))
  }

  onApplicationBootstrap(): any {
    this.emitStats()
  }
}
