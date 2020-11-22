"use strict";
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const log = console.log;

let projectName = process.argv[2];
if (typeof projectName === "undefined") {
  projectName = "hydro-starter";
}
const root = path.resolve(projectName);

log(`Creating a new hydro app in ${chalk.green(root)}.`);
exec(`git clone https://github.com/Krutsch/hydro-starter ${projectName} `);

log(`Installing packages. This might take a while.`);
exec(`cd ${projectName} && npm i`);

fs.rm(`${projectName}/.git/`, { recursive: true, force: true }, (err) => {
  if (err) {
    log(err);
    process.exit(1);
  }
  exec(`cd ${projectName} && git init`);
});

log(chalk.blue("Happy coding 😊"));
