import Rule from './rule';
import * as rules from './rules.gen';

const allRules = new Map<string, Rule>();

function register<T extends Rule>(prototype: T) {
  allRules.set(prototype.id, prototype);
}

Object.values(rules).forEach(rule => {
  if (rule) register(rule);
});

export { allRules };
