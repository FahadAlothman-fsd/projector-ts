import { Operations } from "../config";
import Projector from "../projector";

function createData() {
  return {
    projector: {
      "/": {
        baba: "baz1",
        femto: "is_supreme_soy",
      },
      "/baba": {
        baba: "baz2",
      },
      "/baba/baz": {
        baba: "baz3",
      },
    },
  };
}

function getProjector(pwd: string, data = createData()) {
  return new Projector(
    {
      args: [],
      operation: Operations.Print,
      pwd,
      config: "hello",
    },
    data
  );
}

test("getValueall", () => {
  const proj = getProjector("/baba/baz");
  expect(proj.getValueAll()).toEqual({
    femto: "is_supreme_soy",
    baba: "baz3",
  });
});

test("getValue", () => {
  let proj = getProjector("/baba/baz");
  expect(proj.getValue("baba")).toEqual("baz3");
  proj = getProjector("/baba");
  expect(proj.getValue("baba")).toEqual("baz2");
  proj = getProjector("/");
  expect(proj.getValue("femto")).toEqual("is_supreme_soy");
});

test("setValue", () => {
  let data = createData();
  let proj = getProjector("/baba/baz", data);
  proj.setValue("baba", "bar");
  expect(proj.getValue("baba")).toEqual("bar");
  proj.setValue("femto", "is_not_soy");
  expect(proj.getValue("femto")).toEqual("is_not_soy");
  proj = getProjector("/", data);
  expect(proj.getValue("femto")).toEqual("is_supreme_soy");
});

test("removeValue", function () {
  const proj = getProjector("/baba/baz");
  proj.removeValue("femto");
  expect(proj.getValue("femto")).toEqual("is_supreme_soy");
  proj.removeValue("baba");
  expect(proj.getValue("baba")).toEqual("baz2");
});
