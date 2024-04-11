#!/usr/bin/env bun

import { $, ShellError } from 'bun';
import { readFileSync, writeFileSync } from 'fs';
import { createMinifier } from '@david/dts-minify';
import * as ts from 'typescript';
import dedent from 'dedent';

// remove old files
await $`rm -rf ./types/temp`.nothrow();
await $`rm ./types/logic-pad.d.ts`.nothrow();

try {
  // compile the whole project
  await $`bunx tsc --declaration --emitDeclarationOnly --noEmit false --outDir ./types/temp`;
  // bundle the data types into one file
  await $`bunx dts-bundle --name logic-pad --main ./types/temp/data/**/*.d.ts --outputAsModuleFolder --out ../../logic-pad.d.ts`;

  // wrap the bundled types in a global declaration
  const filePath = './types/logic-pad.d.ts';

  let file = readFileSync(filePath, 'utf-8');

  if (!file.startsWith('declare global'))
    file = dedent`
      declare global {
        ${file.replace(/^export default /gm, 'export ')}
      }
      export {};
    `;

  // minify the file
  const minifier = createMinifier(ts);

  writeFileSync(
    filePath,
    minifier.minify(file.replace(/\r\n/g, '\n'), { keepJsDocs: true })
  );
} catch (err) {
  if (err instanceof ShellError) {
    console.error(err.stderr);
  }
}

// remove the temporary files
await $`rm -rf ./types/temp`;
