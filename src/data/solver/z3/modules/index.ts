import Z3Module from './z3Module';

let modules: Record<string, Z3Module | undefined> | undefined;

try {
  modules = import.meta.glob<Z3Module | undefined>(
    ['./**/*.ts', '!./index.ts'],
    {
      import: 'instance',
      eager: true,
    }
  );
} catch (_) {} // ignore errors during codegen becausee bun doesn't have import.meta.glob

const allZ3Modules = new Map<string, Z3Module>();

function register<T extends Z3Module>(prototype: T) {
  allZ3Modules.set(prototype.id, prototype);
}

if (modules)
  Object.values(modules).forEach(module => {
    if (module) register(module);
  });

export { allZ3Modules };
