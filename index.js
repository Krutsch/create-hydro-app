#!/usr/bin/env node

"use strict";
const path = require("path");
const { rm } = require("fs/promises");
const gradient = require("gradient-string");
const awaitSpawn = require("await-spawn");

const color = gradient("#4ade80", "#38bdf8");
const projectName = process.argv[2] || "hydro-starter";
start();

async function start() {
  log(
    `⚙️  Hydro CLI. Setting up a new hydro app in ${path.resolve(projectName)}.`
  );
  const out = await awaitSpawn("git", [
    "clone",
    "https://github.com/Krutsch/hydro-starter",
    projectName,
  ]);
  console.log(out.toString());
  await installPackages();
}

async function installPackages() {
  log(`📦 Installing packages now. This might take a while.`);
  const out = await awaitSpawn("cd", [projectName, "&& npm i"], {
    shell: true,
  });
  console.log(out.toString());
  await initGit();
}

async function initGit() {
  await rm(`${projectName}/.git/`, { recursive: true, force: true });
  await awaitSpawn(
    "cd",
    [
      projectName,
      '&& git init && git add . && git commit -am "Intial hydro-js repo"',
    ],
    {
      shell: true,
    }
  );
  log("💙 Thank you for coding with hydro-js ⚛️");
}

function log(msg) {
  console.log(color(msg));
}
