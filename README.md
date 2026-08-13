# create-hydro-app

Create a hydro app from the official starter repository.

## Requirements

- Node.js 14.14 or newer
- Git and npm available on your `PATH`
- Network access to GitHub and the npm registry

## Usage

```sh
npm init hydro-app@latest <project>
```

or

```sh
npx create-hydro-app@latest <project>
```

The command clones the starter, installs its dependencies, removes the template
Git history, and creates a new initial Git commit.

## Project names

`<project>` must be a simple directory name that starts with a letter or number
and contains only letters, numbers, dots, hyphens, and underscores.

The destination may be new or an existing empty directory. Existing non-empty
directories are rejected to avoid overwriting files.
