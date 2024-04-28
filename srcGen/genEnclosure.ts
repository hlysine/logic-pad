import { Project, VariableDeclarationKind } from 'ts-morph';
import { $, Glob } from 'bun';

interface Module {
  path: string;
  module: Record<string, unknown>;
  defaultExport: string | undefined;
  namedExports: string[];
}

console.log('Scanning data directory...');

const glob = new Glob('**/*.ts');
const modules: Module[] = [];
for await (const file of glob.scan('src/data')) {
  const module = (await import('../src/data/' + file)) as Record<
    string,
    unknown
  >;

  if (typeof module !== 'object' || module === null || module === undefined)
    continue;

  const result: Module = {
    path: '../data/' + file.replaceAll('.ts', '').replaceAll('\\', '/'),
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
      let key: string | undefined;
      if ('name' in value) key = value.name as string;
      else if ('constructor' in value && 'name' in value.constructor)
        key = value.constructor.name;
      else console.warn('Could not determine name for', value);
      if (key) result.defaultExport = key;
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

console.log('Composing code...');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});
const sourceFile = project.createSourceFile(`../src/generated/enclosure.ts`);

sourceFile.addImportDeclarations(
  modules.map(module => ({
    moduleSpecifier: module.path,
    namedImports: module.namedExports,
    defaultImport: module.defaultExport ?? undefined,
  }))
);

sourceFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  declarations: [
    {
      name: 'enclosure',
      type: '{ name: string; value: unknown }[]',
      initializer: `[
        ${modules
          .map(
            module =>
              (module.defaultExport
                ? `{ name: '${module.defaultExport ?? ''}', value: ${
                    module.defaultExport ?? 'undefined'
                  } },\n`
                : '') +
              module.namedExports
                .map(
                  namedExport =>
                    `{ name: '${namedExport}', value: ${namedExport} },\n`
                )
                .join('')
          )
          .join('')}
      ]`,
    },
  ],
});

sourceFile.addExportDeclaration({
  namedExports: ['enclosure'],
});

console.log('Writing...');
await Bun.write('./src/generated/enclosure.ts', sourceFile.getText());

console.log('Formatting...');
await $`bunx prettier --write ./src/generated/enclosure.ts`;

console.log('Done!');
