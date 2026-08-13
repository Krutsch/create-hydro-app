#!/usr/bin/env node

"use strict";
const path = require("path");
const { readdir, rm } = require("fs/promises");
const gradientModule = require("gradient-string");
const awaitSpawn = require("await-spawn");

const gradient = gradientModule.default || gradientModule;
const color = gradient("#4ade80", "#38bdf8");
const projectName = process.argv[2] || "hydro-starter";
start().catch((error) => {
  const details = error.stderr?.toString().trim();
  console.error(details || error.message || "Failed to create hydro app.");
  process.exitCode = 1;
});

async function start() {
  validateProjectName();
  log(
    `⚙️  Hydro CLI. Setting up a new hydro app in ${path.resolve(projectName)}.`,
  );
  await checkDestination();
  await checkPrerequisites();
  const out = await runCommand("git", [
    "clone",
    "https://github.com/Krutsch/hydro-starter",
    projectName,
  ]);
  console.log(out.toString());
  await installPackages();
}

function validateProjectName() {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(projectName)) {
    throw new Error(
      "Project name must be a simple directory name using letters, numbers, dots, hyphens, and underscores.",
    );
  }
}

async function checkDestination() {
  try {
    const entries = await readdir(projectName);
    if (entries.length > 0) {
      throw new Error(
        `Destination path '${projectName}' already exists and is not an empty directory. Choose a different project name.`,
      );
    }
  } catch (error) {
    if (error.code === "ENOENT") return;
    if (error.code === "ENOTDIR") {
      throw new Error(`Destination path '${projectName}' is not a directory.`);
    }
    throw error;
  }
}

async function checkPrerequisites() {
  await runCommand("git", ["--version"]);
  await runCommand(npmCommand(), ["--version"]);
}

async function installPackages() {
  log(`📦 Installing packages now. This might take a while.`);
  const out = await runCommand(npmCommand(), ["install"], {
    cwd: projectName,
  });
  console.log(out.toString());
  await initGit();
}

async function initGit() {
  await rm(path.join(projectName, ".git"), { recursive: true, force: true });
  await runCommand("git", ["init"], { cwd: projectName });
  await runCommand("git", ["add", "."], { cwd: projectName });
  await runCommand("git", ["commit", "-m", "Initial hydro-js repo"], {
    cwd: projectName,
  });
  log("💙 Thank you for coding with hydro-js ⚛️");
}

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function runCommand(command, args, options) {
  return awaitSpawn(command, args, options).catch((error) => {
    const details = error.stderr?.toString().trim();
    throw new Error(`${command} failed: ${details || error.message}`);
  });
}

function log(msg) {
  console.log(color(msg));
}
