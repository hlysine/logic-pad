import { Plugin } from 'vite';
import path from 'path';
import fg from 'fast-glob';
import { extractName } from './scriptHelper';

export interface Config {
  dataPath: string;
  generatedPath: string;
}

interface Module {
  path: string;
  module: Record<string, unknown>;
  defaultExport: string | undefined;
  namedExports: string[];
}

async function generateEnclosure(dataPath: string, generatedPath: string) {
  console.log('♻️  Generating enclosure...');
  const now = performance.now();

  const modules: Module[] = [];
  const files = await fg(['**/*.ts', '!**/*.gen.ts'], { cwd: dataPath });
  files.sort();
  for (const file of files) {
    const module = (await import(
      path.resolve(process.cwd(), dataPath, file)
    )) as Record<string, unknown>;

    if (typeof module !== 'object' || module === null || module === undefined)
      continue;

    const result: Module = {
      path: path
        .join(
          '../../../',
          dataPath,
          file.replaceAll('.ts', '').replaceAll('\\', '/')
        )
        .replaceAll('\\', '/'),
      module,
      defaultExport: undefined,
      namedExports: [],
    };

    if ('default' in module) {
      const value = module.default;
      if (
        (typeof value === 'object' || typeof value === 'function') &&
        value !== null &&
        value !== undefined
      ) {
        const key = extractName(value);
        if (key) result.defaultExport = key;
        else console.warn('Could not determine name for', value);
      }
    }
    Object.entries(module).forEach(([key, value]) => {
      if (key === 'instance' || key === 'default') return;
      if (
        (typeof value !== 'object' && typeof value !== 'function') ||
        value === null ||
        value === undefined
      )
        return;
      result.namedExports.push(key);
    });
    modules.push(result);
  }

  const source = `/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

${modules
  .map(module => {
    if (module.defaultExport && module.namedExports.length > 0)
      return `import ${module.defaultExport}, { ${module.namedExports.join(
        ', '
      )} } from '${module.path}';`;
    else if (module.defaultExport)
      return `import ${module.defaultExport} from '${module.path}';`;
    else if (module.namedExports.length > 0)
      return `import { ${module.namedExports.join(', ')} } from '${module.path}';`;
    return '';
  })
  .filter(s => s.length > 0)
  .join('\n')}

export const enclosure: { name: string; value: unknown }[] = [
${modules
  .map(
    module =>
      (module.defaultExport
        ? `  { name: '${module.defaultExport ?? ''}', value: ${
            module.defaultExport ?? 'undefined'
          } },\n`
        : '') +
      module.namedExports
        .map(
          namedExport =>
            `  { name: '${namedExport}', value: ${namedExport} },\n`
        )
        .join('')
  )
  .join('')}];
`;

  await Bun.write(generatedPath, source);

  console.log(
    '✅ Enclosure generated in',
    Math.round(performance.now() - now),
    'ms'
  );
}

let lock = false;

export function EnclosurePlugin(config: Config): Plugin {
  const ROOT: string = process.cwd();

  const generate = async () => {
    if (lock) {
      return;
    }
    lock = true;
    try {
      await generateEnclosure(config.dataPath, config.generatedPath);
    } catch (err) {
      console.error(err);
      console.info();
    }
    lock = false;
  };

  const handleFile = async (
    file: string,
    event: 'create' | 'update' | 'delete'
  ) => {
    const filePath = path.normalize(file);

    if (
      event === 'update' &&
      (filePath === path.resolve(config.generatedPath) ||
        filePath.endsWith('.gen.ts'))
    ) {
      // skip generating routes if the generated file is updated
      return;
    }

    const sourcePath = path.join(ROOT, config.dataPath);
    const scriptsPath = path.join(ROOT, 'scripts');

    if (filePath.startsWith(sourcePath) || filePath.startsWith(scriptsPath)) {
      await generate();
    }
  };

  return {
    name: 'vite-plugin-logic-pad-enclosure-generator',
    configResolved: async () => {
      await generate();
    },
    watchChange: async (file, context) => {
      if (['create', 'update', 'delete'].includes(context.event)) {
        await handleFile(file, context.event);
      }
    },
  };
}
