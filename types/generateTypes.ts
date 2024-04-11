#!/usr/bin/env bun

import { $, ShellError } from 'bun';
import dts from 'dts-bundle';

// remove old files
console.log('Removing old files...');
await $`rm -rf ./types/temp`.nothrow();
await $`rm ./types/logic-pad.d.ts`.nothrow();

try {
  // compile the whole project
  console.log('Generating types...');
  await $`bunx --bun tsc --declaration --emitDeclarationOnly --noEmit false --outDir ./types/temp`;

  // bundle the data types into one file
  console.log('Bundling types...');
  dts.bundle({
    name: 'logic-pad',
    main: './types/temp/data/**/*.d.ts',
    outputAsModuleFolder: true,
    out: '../../logic-pad.d.ts',
  });

  // wrap the bundled types in a global declaration
  const filePath = './types/logic-pad.d.ts';

  let file = await Bun.file(filePath).text();

  file = file
    .replace(/^export default +(?=class|abstract|function)/gm, 'export ')
    .replace(/^export default +(?!class|abstract|function)/gm, 'export const ');
  if (!file.startsWith('declare global'))
    file = `
      declare global {
        ${file}
      }
      export {};
    `;
  file = file.replace(/\r\n/g, '\n');

  await Bun.write(filePath, file);

  // format the file
  console.log('Formatting types...');
  await $`prettier --write ${filePath}`;
} catch (err) {
  if (err instanceof ShellError) {
    console.error(err.stderr);
  }
}

// remove the temporary files
console.log('Cleaning up...');
await $`rm -rf ./types/temp`;

console.log('Done!');
