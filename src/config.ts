import path from "path";
import { Opts } from "./opts";
export enum Operations {
  Print,
  Add,
  Remove,
}

export type Config = {
  args: string[];
  operation: Operations;
  config: string;
  pwd: string;
};

function getOperation(opts: Opts): Operations {
  if (!opts.args || opts.args.length === 0) {
    return Operations.Print;
  }
  switch (opts.args[0]) {
    case "add": {
      return Operations.Add;
    }
    case "rmv": {
      return Operations.Remove;
    }
    default: {
      return Operations.Print;
    }
  }
}

function getArgs(opts: Opts): string[] {
  if (!opts.args || opts.args.length === 0) {
    return [];
  }
  const operations = getOperation(opts);
  switch (operations) {
    case Operations.Print: {
      if (opts.args.length > 1) {
        throw new Error(
          `expected 0 or 1 arguments but got ${opts.args.length - 1}`
        );
      }
      return opts.args;
    }
    case Operations.Add: {
      if (opts.args.length !== 3) {
        throw new Error(`expected 2 arguments but got ${opts.args.length - 1}`);
      }
      return opts.args.slice(1);
    }
    case Operations.Remove: {
      if (opts.args.length !== 2) {
        throw new Error(`expected 1 arguments but got ${opts.args.length - 1}`);
      }
      return opts.args.slice(1);
    }
  }
}

function getConfig(opts: Opts): string {
  if (opts.config) {
    return opts.config;
  }
  const home = process.env["HOME"];
  if (!home) {
    throw new Error("HOME environment variable not set");
  }
  return path.join(home, "projector", "projector.json");
}
function getPwd(opts: Opts): string {
  if (opts.pwd) {
    return opts.pwd;
  }
  return process.cwd();
}

export default function projector(opts: Opts): Config {
  return {
    args: getArgs(opts),
    operation: getOperation(opts),
    config: getConfig(opts),
    pwd: getPwd(opts),
  };
}
