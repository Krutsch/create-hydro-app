"use strict";

const assert = require("assert");
const { spawnSync } = require("child_process");
const {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require("fs");
const os = require("os");
const path = require("path");

const cliPath = path.join(__dirname, "..", "index.js");
const tempRoot = mkdtempSync(path.join(os.tmpdir(), "create-hydro-app-"));

function runCli(projectName, env = process.env) {
  return spawnSync(process.execPath, [cliPath, projectName], {
    cwd: tempRoot,
    encoding: "utf8",
    env,
  });
}

try {
  const invalidName = runCli("unsafe;touch-marker");
  assert.notStrictEqual(invalidName.status, 0);
  assert.ok(
    invalidName.stderr.includes("Project name must be a simple directory name"),
  );
  assert.strictEqual(invalidName.stdout, "");

  const existingDirectory = path.join(tempRoot, "existing");
  const marker = path.join(existingDirectory, "keep.txt");
  mkdirSync(existingDirectory);
  writeFileSync(marker, "keep");

  const existingName = runCli("existing");
  assert.notStrictEqual(existingName.status, 0);
  assert.ok(existingName.stderr.includes("already exists and is not an empty"));
  assert.strictEqual(readFileSync(marker, "utf8"), "keep");

  const noPath = { ...process.env, PATH: "" };
  const missingTools = runCli("missing-tools", noPath);
  assert.notStrictEqual(missingTools.status, 0);
  assert.ok(missingTools.stderr.includes("git failed"));
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

console.log("CLI tests passed.");
