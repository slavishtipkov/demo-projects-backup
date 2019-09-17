# @dtn/ts-config

Shared TypeScript configuration.

## Install

```sh
npm install --dev @dtn/ts-config typescript
```

## Usage

Add a `tsconfig.json` file to the root of your project.

```json
{
  "extends": "./node_modules/@dtn/ts-config/tsconfig.json",

  "compilerOptions": {
    "outDir": "dist/"
  },
  "include": ["src/"]
}
```
