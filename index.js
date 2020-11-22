#!/usr/bin/env node

"use strict";
const util = require("util");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const exec = util.promisify(require("child_process").exec);
const log = console.log;

let projectName = process.argv[2];
if (typeof projectName === "undefined") {
  projectName = "hydro-starter";
}

start().then(() => log(chalk.blue("Happy coding 😊")));

async function start() {
  log(`Creating a new hydro app in ${chalk.green(path.resolve(projectName))}.`);
  await exec(
    `git clone https://github.com/Krutsch/hydro-starter ${projectName}`
  );
  await installPackages();
}

async function installPackages() {
  log(`Installing packages. This might take a while.`);
  await exec(`cd ${projectName} && npm i`);
  await initGit();
}

async function initGit() {
  await fs.rm(
    `${projectName}/.git/`,
    { recursive: true, force: true, maxRetries: 2 },
    async (err) => {
      if (err) {
        log(err);
        process.exit(1);
      }
    }
  );
  await exec(`cd ${projectName} && git init`);
}
