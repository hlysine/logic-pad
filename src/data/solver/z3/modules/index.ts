import Z3Module from './z3Module';

let modules: Record<string, Z3Module | undefined> = {};

if (!('process' in globalThis))
  modules = import.meta.glob<Z3Module | undefined>(
    ['./**/*.ts', '!./index.ts'],
    {
      import: 'instance',
      eager: true,
    }
  );

const allZ3Modules = new Map<string, Z3Module>();

function register<T extends Z3Module>(prototype: T) {
  allZ3Modules.set(prototype.id, prototype);
}

Object.values(modules).forEach(module => {
  if (module) register(module);
});

export { allZ3Modules };
