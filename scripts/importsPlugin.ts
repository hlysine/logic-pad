import { Plugin } from 'vite';
import path from 'path';
import fg from 'fast-glob';
import { extractName } from './scriptHelper';

export interface Config {
  entries: {
    cwd: string;
    glob: string[];
    generated: string;
    import: string;
  }[];
}

interface Module {
  path: string;
  name: string;
}

async function generateImports(config: Config) {
  console.log('♻️  Generating imports...');
  const now = performance.now();

  for (const entry of config.entries) {
    const modules: Module[] = [];
    const files = await fg([...entry.glob, `!${entry.generated}`], {
      cwd: entry.cwd,
    });
    files.sort();
    for (const file of files) {
      const module = (await import(
        path.resolve(process.cwd(), entry.cwd, file)
      )) as Record<string, unknown>;

      const name = extractName(module[entry.import]);

      if (name === undefined) {
        if (module[entry.import])
          console.warn('Could not determine name for', module[entry.import]);
        continue;
      }

      modules.push({ path: file, name });
    }

    const source = `/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

${
  entry.import === 'default'
    ? modules
        .map(
          m =>
            `export ${m.name} from './${m.path.split('.').slice(0, -1).join('.')}';`
        )
        .join('\n')
    : modules
        .map(
          m =>
            `export { ${entry.import} as ${m.name} } from './${m.path.split('.').slice(0, -1).join('.')}';`
        )
        .join('\n')
}`;

    await Bun.write(
      path.resolve(process.cwd(), entry.cwd, entry.generated),
      source
    );
  }

  console.log(
    '✅ Imports generated in',
    Math.round(performance.now() - now),
    'ms'
  );
}

let lock = false;

export function ImportsPlugin(config: Config): Plugin {
  const ROOT: string = process.cwd();

  const generate = async () => {
    if (lock) {
      return;
    }
    lock = true;
    try {
      await generateImports(config);
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
      config.entries
        .map(e => path.resolve(e.cwd, e.generated))
        .includes(filePath)
    ) {
      // skip generating routes if the generated file is updated
      return;
    }

    const sourcePaths = config.entries.map(e => path.join(ROOT, e.cwd));
    const scriptsPath = path.join(ROOT, 'scripts');

    if (
      sourcePaths.some(p => filePath.startsWith(p)) ||
      filePath.startsWith(scriptsPath)
    ) {
      await generate();
    }
  };

  return {
    name: 'vite-plugin-logic-pad-imports-generator',
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
