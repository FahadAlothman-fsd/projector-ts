import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Config } from "./config";
import path from "path";

export type Data = {
  projector: {
    [key: string]: {
      [key: string]: string;
    };
  };
};

const DEFAULT_DATA: Data = {
  projector: {},
};

export default class Projector {
  constructor(private config: Config, private data: Data = DEFAULT_DATA) {}

  getValueAll(): { [key: string]: string } {
    let current = this.config.pwd;
    let prev = "";
    let out = {};
    const paths = [];
    do {
      prev = current;
      paths.push(current);
      current = path.dirname(current);
    } while (current !== prev);
    return paths.reverse().reduce((acc, currPath) => {
      const value = this.data.projector[currPath];
      if (value) {
        Object.assign(acc, value);
      }

      return acc;
    }, {});
  }
  getValue(key: string): string | undefined {
    let current = this.config.pwd;
    let prev = "";
    let out: string = undefined;
    do {
      const value = this.data.projector[current]?.[key];
      if (value) {
        out = value;
        break;
      }
      prev = current;
      current = path.dirname(current);
    } while (current !== prev);
    return out;
  }
  setValue(key: string, value: string) {
    let dir = this.data.projector[this.config.pwd];
    if (!dir) {
      dir = this.data.projector[this.config.pwd] = {};
      dir[key] = value;
    }
    dir[key] = value;
  }
  removeValue(key: string): string {
    const dir = this.data.projector[this.config.pwd];
    let popped = undefined;
    if (dir) {
      const popped = dir[key];
      delete dir[key];
    }
    return popped;
  }
  save() {
    const configPath = path.dirname(this.config.config);
    if (!existsSync(configPath)) {
      mkdirSync(configPath, { recursive: true });
    }
    writeFileSync(this.config.config, JSON.stringify(this.data));
  }
  static fromConfig(config: Config): Projector {
    if (existsSync(config.config)) {
      let data: Data = undefined;
      try {
        data = JSON.parse(readFileSync(config.config).toString());
      } catch (e) {
        console.error(
          `failed to parse config file ${config.config} will return default config`
        );
        data = DEFAULT_DATA;
      }
      return new Projector(config, data);
    }
    return new Projector(config, DEFAULT_DATA);
  }
}
