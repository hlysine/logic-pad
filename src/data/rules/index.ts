import Rule from './rule';

let rules: Record<string, Rule | undefined> | undefined;

try {
  rules = import.meta.glob<Rule | undefined>(['./**/*.ts', '!./index.ts'], {
    import: 'instance',
    eager: true,
  });
} catch (_) {} // ignore errors during codegen becausee bun doesn't have import.meta.glob

const allRules = new Map<string, Rule>();

function register<T extends Rule>(prototype: T) {
  allRules.set(prototype.id, prototype);
}

if (rules)
  Object.values(rules).forEach(rule => {
    if (rule) register(rule);
  });

export { allRules };
