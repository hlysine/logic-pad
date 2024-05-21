#!/usr/bin/env bun

import { $, ShellError } from 'bun';
import dts from 'dts-bundle';

const dataPath = 'src/data';
const generatedPath = 'src/client/editor/logic-pad.gen.d.ts';

// remove old files
console.log('Removing old files...');
await $`rm -rf ./scripts/temp`.nothrow();
await $`rm ${generatedPath}`.nothrow();

try {
  // compile the whole project
  console.log('Generating types...');
  await $`bunx --bun tsc --declaration --emitDeclarationOnly --noEmit false --outDir ./scripts/temp`;

  // bundle the data types into one file
  console.log('Bundling types...');
  dts.bundle({
    name: 'logic-pad',
    main:
      './scripts/temp/' + dataPath.split('/').slice(1).join('/') + '/**/*.d.ts',
    outputAsModuleFolder: true,
    out: '../'.repeat((dataPath.match(/\//g) ?? []).length + 2) + generatedPath,
  });

  // wrap the bundled types in a global declaration
  let file = await Bun.file(generatedPath).text();

  file = file
    .replace(/export default +(?=class|abstract|function)/gm, 'export ')
    .replace(/export default +(?!class|abstract|function)/gm, 'export const ')
    .replace(/export const instance.+;/gm, '');
  if (!file.startsWith('declare global'))
    file = `
      /* prettier-ignore-start */

      /* eslint-disable */

      // @ts-nocheck

      // noinspection JSUnusedGlobalSymbols
      declare global {
        ${file}
        export { Symbol as _Symbol };
      }
      export {};

      /* prettier-ignore-end */
    `;
  file = file.replace(/\r\n/g, '\n');

  await Bun.write(generatedPath, file);

  // format the file
  console.log('Formatting types...');
  await $`bunx prettier --write ${generatedPath}`;
} catch (err) {
  console.error(err);
  if (err instanceof ShellError) {
    console.error(err.stderr);
  }
}

// remove the temporary files
console.log('Cleaning up...');
await $`rm -rf ./scripts/temp`;

console.log('Done!');

process.exit(0);
