import Rule from './rule';

let rules: Record<string, Rule | undefined> = {};

if (!('process' in globalThis))
  rules = import.meta.glob<Rule | undefined>(['./**/*.ts', '!./index.ts'], {
    import: 'instance',
    eager: true,
  });

const allRules = new Map<string, Rule>();

function register<T extends Rule>(prototype: T) {
  allRules.set(prototype.id, prototype);
}

Object.values(rules).forEach(rule => {
  if (rule) register(rule);
});

export { allRules };
