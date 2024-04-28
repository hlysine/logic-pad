#!/usr/bin/env bun

import { $, ShellError } from 'bun';
import dts from 'dts-bundle';

// remove old files
console.log('Removing old files...');
await $`rm -rf ./srcGen/temp`.nothrow();
await $`rm ./src/generated/logic-pad.d.ts`.nothrow();

try {
  // compile the whole project
  console.log('Generating types...');
  await $`bunx --bun tsc --declaration --emitDeclarationOnly --noEmit false --outDir ./srcGen/temp`;

  // bundle the data types into one file
  console.log('Bundling types...');
  dts.bundle({
    name: 'logic-pad',
    main: './srcGen/temp/data/**/*.d.ts',
    outputAsModuleFolder: true,
    out: '../../../src/generated/logic-pad.d.ts',
  });

  // wrap the bundled types in a global declaration
  const filePath = './src/generated/logic-pad.d.ts';

  let file = await Bun.file(filePath).text();

  file = file
    .replace(/export default +(?=class|abstract|function)/gm, 'export ')
    .replace(/export default +(?!class|abstract|function)/gm, 'export const ')
    .replace(/export const instance.+;/gm, '');
  if (!file.startsWith('declare global'))
    file = `
      declare global {
        ${file}
        export { Symbol as _Symbol };
      }
      export {};
    `;
  file = file.replace(/\r\n/g, '\n');

  await Bun.write(filePath, file);

  // format the file
  console.log('Formatting types...');
  await $`bunx prettier --write ${filePath}`;
} catch (err) {
  if (err instanceof ShellError) {
    console.error(err.stderr);
  }
}

// remove the temporary files
console.log('Cleaning up...');
await $`rm -rf ./srcGen/temp`;

console.log('Done!');
