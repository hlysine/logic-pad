import Rule from './rule.js';
import * as rules from './rules.gen.js';

const allRules = new Map<string, Rule>();

function register(prototype: Rule) {
  allRules.set(prototype.id, prototype);
}

Object.values(rules).forEach(rule => {
  if (rule) register(rule);
});

export { allRules };
