import { Glob } from 'bun';
import path from 'path';

export const importGlob =
  (cwd: string) =>
  async <T>(
    glob: string | string[],
    options: { import?: string }
  ): Promise<Record<string, T>> => {
    glob = Array.isArray(glob) ? glob : [glob];
    const positiveGlobs = glob
      .filter(g => !g.startsWith('!'))
      .map(g => new Glob(g));
    const negativeGlobs = glob
      .filter(g => g.startsWith('!'))
      .map(g => new Glob(g.slice(1)));
    const allFiles = new Glob('**/*.*');
    const result: Record<string, T> = {};
    for await (const file of allFiles.scan(cwd)) {
      const globPath = `./${file}`;
      if (negativeGlobs.some(g => g.match(globPath))) continue;
      if (!positiveGlobs.some(g => g.match(globPath))) continue;
      const filePath = path.join(
        path.relative(path.dirname(import.meta.path), cwd),
        file
      );
      const module = (await import(filePath)) as Record<string, unknown>;
      if (options.import) {
        result[globPath] = module[options.import] as T;
      } else {
        result[globPath] = module as T;
      }
    }
    return result;
  };
