import Z3Module from './z3Module';
import * as modules from './modules.gen';

const allZ3Modules = new Map<string, Z3Module>();

function register<T extends Z3Module>(prototype: T) {
  allZ3Modules.set(prototype.id, prototype);
}

Object.values(modules).forEach(module => {
  if (module) register(module);
});

export { allZ3Modules };
