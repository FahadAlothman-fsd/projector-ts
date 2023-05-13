import projector, { Operations } from "../config";

test("print all", function () {
  const config = projector({});
  expect(config.operation).toEqual(Operations.Print);
  expect(config.args).toEqual([]);
});

test("print key", function () {
  const config = projector({
    args: ["baba"],
  });
  expect(config.operation).toEqual(Operations.Print);
  expect(config.args).toEqual(["baba"]);
});

test("add key", function () {
  const config = projector({
    args: ["add", "baba", "baz"],
  });
  expect(config.operation).toEqual(Operations.Add);
  expect(config.args).toEqual(["baba", "baz"]);
});

test("remove key", function () {
  const config = projector({
    args: ["rmv", "baba"],
  });
  expect(config.operation).toEqual(Operations.Remove);
  expect(config.args).toEqual(["baba"]);
});
