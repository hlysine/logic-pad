import Symbol from './symbol';
import * as symbols from './symbols.gen';

const allSymbols = new Map<string, Symbol>();

function register<T extends Symbol>(prototype: T) {
  allSymbols.set(prototype.id, prototype);
}

Object.values(symbols).forEach(symbol => {
  if (symbol) register(symbol);
});

export { allSymbols };
