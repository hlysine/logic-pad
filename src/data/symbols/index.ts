import Symbol from './symbol';

let symbols: Record<string, Symbol | undefined> | undefined;

try {
  symbols = import.meta.glob<Symbol | undefined>(['./**/*.ts', '!./index.ts'], {
    import: 'instance',
    eager: true,
  });
} catch (_) {} // ignore errors during codegen becausee bun doesn't have import.meta.glob

const allSymbols = new Map<string, Symbol>();

function register<T extends Symbol>(prototype: T) {
  allSymbols.set(prototype.id, prototype);
}

if (symbols)
  Object.values(symbols).forEach(symbol => {
    if (symbol) register(symbol);
  });

export { allSymbols };
