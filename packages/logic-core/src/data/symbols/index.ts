import Symbol from './symbol.js';
import * as symbols from './symbols.gen.js';

const allSymbols = new Map<string, Symbol>();

function register(prototype: Symbol) {
  allSymbols.set(prototype.id, prototype);
}

Object.values(symbols).forEach(symbol => {
  if (symbol) register(symbol);
});

export { allSymbols };
