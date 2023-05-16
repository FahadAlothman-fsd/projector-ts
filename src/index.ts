import getOpts from "./opts";
import projector, { Operations } from "./config";
import Projector from "./projector";

const opts = getOpts();
const config = projector(opts);
const proj = Projector.fromConfig(config);
if (config.operation === Operations.Print) {
  if (config.args.length === 0) {
    console.log(JSON.stringify(proj.getValueAll()));
  } else {
    const value = proj.getValue(config.args[0]);
    if (value) {
      console.log(`${config.args[0]}: ${value}`);
    }
  }
}

if (config.operation === Operations.Add) {
  proj.setValue(config.args[0], config.args[1]);
  proj.save();
}

if (config.operation === Operations.Remove) {
  proj.removeValue(config.args[0]);
  proj.save();
}

if (config.operation === Operations.ConfigFile) {
  console.log(config);
}
