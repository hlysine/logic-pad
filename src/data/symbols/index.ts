import Symbol from './symbol';

let symbols: Record<string, Symbol | undefined> = {};

if (!('process' in globalThis))
  symbols = import.meta.glob<Symbol | undefined>(['./**/*.ts', '!./index.ts'], {
    import: 'instance',
    eager: true,
  });

const allSymbols = new Map<string, Symbol>();

function register<T extends Symbol>(prototype: T) {
  allSymbols.set(prototype.id, prototype);
}

Object.values(symbols).forEach(symbol => {
  if (symbol) register(symbol);
});

export { allSymbols };
